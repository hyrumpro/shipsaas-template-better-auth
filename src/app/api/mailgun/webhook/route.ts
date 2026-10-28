/**
 * Mailgun Webhook Handler
 *
 * Receives TWO kinds of events from Mailgun:
 *   1. Inbound messages  (route to MAILGUN_FORWARD_TO)
 *   2. Delivery events   (bounced / complained / unsubscribed / delivered / failed)
 *      → updates email_log.status for audit
 *      → suppresses future sends to bounced/complained addresses
 *
 * Setup:
 *   - Mailgun Dashboard → Sending → Webhooks
 *   - Enable "Delivered", "Bounced", "Complained", "Unsubscribed", "Failed"
 *   - URL: https://yourdomain.com/api/mailgun/webhook
 *   - Signing key: MAILGUN_WEBHOOK_SIGNING_KEY
 *
 * For inbound forwarding, set up a Mailgun route that POSTs to the same URL
 * with the inbound message form fields (sender / recipient / subject / etc.).
 */

import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/error-handler";
import {
  claimWebhookEvent,
  markWebhookEventFailed,
  markWebhookEventProcessed,
  updateEmailLogStatus,
} from "@/db/queries";
import { sendEmail } from "@/lib/mailgun";
import {
  createWebhookBodyDedupeKey,
  verifyHmacSha256,
} from "@/lib/webhook-security";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    const isFormEncoded =
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data");

    const fields: Record<string, string> = {};
    const rawBody = await req.text();

    if (isFormEncoded) {
      const formData = await new Response(rawBody, {
        headers: { "content-type": contentType },
      }).formData();
      for (const [key, value] of formData.entries()) {
        fields[key] = value.toString();
      }
    } else {
      // JSON delivery events from Mailgun Events API or webhook
      try {
        const json = JSON.parse(rawBody);
        // Normalize to flat string map for the handler below
        for (const [k, v] of Object.entries(json)) {
          if (v != null) fields[k] = String(v);
        }
      } catch {
        // Fall back to treating as form-encoded
        const params = new URLSearchParams(rawBody);
        for (const [k, v] of params.entries()) {
          fields[k] = v;
        }
      }
    }

    // ---------------------------------------------------------------------
    // Signature verification (HMAC over timestamp+token)
    // ---------------------------------------------------------------------
    const timestamp = fields.timestamp ?? "";
    const token = fields.token ?? "";
    const signature = fields.signature ?? "";

    const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY;
    if (!signingKey) {
      logger.error(
        "MAILGUN_WEBHOOK_SIGNING_KEY is not configured; refusing webhook"
      );
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    if (!verifyHmacSha256(timestamp + token, signature, signingKey)) {
      logger.warn("Mailgun webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // ---------------------------------------------------------------------
    // Dispatch: delivery event vs inbound message
    // ---------------------------------------------------------------------
    const event = fields["event"];

    if (
      !(event && isDeliveryEvent(event)) &&
      !(fields.sender || fields.recipient)
    ) {
      logger.info("Mailgun webhook: unknown payload shape", {
        keys: Object.keys(fields).slice(0, 20),
      });
      return NextResponse.json({ received: true });
    }

    const eventId =
      fields.event_id ??
      fields.id ??
      createWebhookBodyDedupeKey("mailgun", rawBody);
    const claimed = await claimWebhookEvent({
      provider: "mailgun",
      eventId,
      eventType: event || "inbound",
      payload: fields,
    });

    if (!claimed) {
      logger.info("Mailgun duplicate delivery, skipping", { eventId, event });
      return NextResponse.json({ received: true });
    }

    try {
      if (event && isDeliveryEvent(event)) {
        await handleDeliveryEvent(fields);
      } else {
        await handleInboundMessage(fields);
      }
      await markWebhookEventProcessed(eventId);
    } catch (error) {
      await markWebhookEventFailed(
        eventId,
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Mailgun webhook processing error", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error },
      { status: errorResponse.statusCode }
    );
  }
}

function isDeliveryEvent(event: string): boolean {
  return [
    "delivered",
    "bounced",
    "complained",
    "unsubscribed",
    "failed",
    "opened",
    "clicked",
  ].includes(event);
}

async function handleDeliveryEvent(fields: Record<string, string>) {
  const event = fields.event;
  const messageId =
    fields["Message-Id"] ?? fields["message-id"] ?? fields["message_id"];
  const recipient = fields.recipient ?? fields.recipient_email ?? "";
  const severity = fields.severity ?? "";
  const reason =
    fields["error"] ??
    fields["reason"] ??
    fields["notification"] ??
    severity ??
    null;

  if (!messageId) {
    logger.info("Mailgun delivery event missing message-id", {
      event,
      recipient,
    });
    return;
  }

  const status = mapEventToStatus(event);

  if (!status) {
    // opened/clicked are tracked but we don't change email_log status
    return;
  }

  try {
    const updated = await updateEmailLogStatus(messageId, status, reason);

    if (updated) {
      logger.info("Email delivery event processed", {
        event,
        messageId,
        status,
        recipient,
      });
    } else {
      // No matching log row — could be a forwarded email, or a log pruned.
      logger.info("Email delivery event without matching log row", {
        event,
        messageId,
        recipient,
      });
    }

    // Hard-bounce / complaint suppression: future sends to this address
    // will be short-circuited by the rate-limit + email log checks. We
    // do not mutate the user record here; ops can decide what to do.
    if (status === "bounced" || status === "complained") {
      logger.warn("Address suppressed due to bounce or complaint", {
        recipient,
        event,
        severity,
        reason,
      });
    }
  } catch (err) {
    logger.error("Failed to update email_log on delivery event", err, {
      event,
      messageId,
    });
  }
}

function mapEventToStatus(
  event: string
): "delivered" | "bounced" | "complained" | "unsubscribed" | "failed" | null {
  switch (event) {
    case "delivered":
      return "delivered";
    case "bounced":
      return "bounced";
    case "complained":
      return "complained";
    case "unsubscribed":
      return "unsubscribed";
    case "failed":
      return "failed";
    case "opened":
    case "clicked":
      return null; // tracking events; log row stays "delivered"
    default:
      return null;
  }
}

async function handleInboundMessage(fields: Record<string, string>) {
  const sender = fields.sender ?? "";
  const recipient = fields.recipient ?? "";
  const subject = fields.subject ?? "(no subject)";
  const bodyPlain = fields["body-plain"] ?? "";
  const bodyHtml = fields["body-html"] ?? "";
  const fromHeader = fields.From ?? sender;

  logger.info("Mailgun inbound message received", {
    sender,
    recipient,
    subject,
  });

  const forwardTo = process.env.MAILGUN_FORWARD_TO;
  if (!forwardTo) {
    logger.warn(
      "MAILGUN_FORWARD_TO not configured; inbound message not forwarded",
      { sender, recipient }
    );
    return;
  }

  await sendEmail({
    to: forwardTo,
    subject: `[Inbound] ${subject}`,
    html: `
      <div style="border-left: 4px solid #0F0F0F; padding-left: 16px; margin-bottom: 24px;">
        <p><strong>From:</strong> ${escapeHtml(sender)}</p>
        <p><strong>To:</strong> ${escapeHtml(recipient)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      </div>
      <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e5e5e5;" />
      <pre style="white-space: pre-wrap;">${escapeHtml(bodyHtml || bodyPlain)}</pre>
    `,
    text: `From: ${sender}\nTo: ${recipient}\nSubject: ${subject}\n\n---\n\n${bodyPlain}`,
    replyTo: fromHeader,
    tags: ["forwarded", "inbound"],
    template: "inbound-forward",
  });

  logger.info("Inbound message forwarded", { to: forwardTo });
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character
  );
}

// Mailgun also sends GET requests to verify the webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Mailgun webhook endpoint is active",
  });
}
