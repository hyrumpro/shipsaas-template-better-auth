/**
 * Mailgun Webhook Handler
 * Receives incoming emails and forwards them to your inbox
 *
 * Setup Instructions:
 * 1. Go to Mailgun Dashboard > Sending > Webhooks
 * 2. Add webhook for "Incoming Messages"
 * 3. Set URL to: https://yourdomain.com/api/mailgun/webhook
 * 4. Add webhook signing key to MAILGUN_WEBHOOK_SIGNING_KEY
 * 5. Configure routes in Mailgun to forward emails to this webhook
 */

import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/error-handler";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailgun";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract webhook data
    const timestamp = formData.get("timestamp") as string;
    const token = formData.get("token") as string;
    const signature = formData.get("signature") as string;

    // Email data
    const sender = formData.get("sender") as string;
    const recipient = formData.get("recipient") as string;
    const subject = formData.get("subject") as string;
    const bodyPlain = formData.get("body-plain") as string;
    const bodyHtml = formData.get("body-html") as string;

    logger.info("Mailgun webhook received", {
      sender,
      recipient,
      subject,
    });

    // Verify webhook signature
    if (process.env.MAILGUN_WEBHOOK_SIGNING_KEY) {
      const encodedToken = crypto
        .createHmac("sha256", process.env.MAILGUN_WEBHOOK_SIGNING_KEY)
        .update(timestamp + token)
        .digest("hex");

      if (encodedToken !== signature) {
        logger.warn("Mailgun webhook signature verification failed");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    } else {
      logger.warn("MAILGUN_WEBHOOK_SIGNING_KEY not configured, skipping verification");
    }

    // Forward email to the configured address
    const forwardTo = process.env.MAILGUN_FORWARD_TO;

    if (forwardTo) {
      logger.info("Forwarding email", { from: sender, to: forwardTo });

      await sendEmail({
        to: forwardTo,
        subject: `[Forwarded] ${subject}`,
        html: `
          <div style="border-left: 4px solid #0F0F0F; padding-left: 16px; margin-bottom: 24px;">
            <p><strong>From:</strong> ${sender}</p>
            <p><strong>To:</strong> ${recipient}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e5e5e5;" />
          ${bodyHtml || `<pre style="white-space: pre-wrap;">${bodyPlain}</pre>`}
        `,
        text: `
From: ${sender}
To: ${recipient}
Subject: ${subject}

---

${bodyPlain}
        `,
        replyTo: sender,
        tags: ["forwarded", "incoming"],
      });

      logger.info("Email forwarded successfully", { to: forwardTo });
    } else {
      logger.warn("MAILGUN_FORWARD_TO not configured, email not forwarded");
    }

    // Return 200 to acknowledge receipt
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

// Mailgun also sends GET requests to verify the webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Mailgun webhook endpoint is active",
  });
}
