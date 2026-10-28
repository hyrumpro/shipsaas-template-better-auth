import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/error-handler";
import { handleLemonSqueezyWebhook } from "@/lib/webhooks/lemonsqueezy-handler";
import {
  createWebhookBodyDedupeKey,
  verifyHmacSha256,
} from "@/lib/webhook-security";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");

    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      logger.error("LemonSqueezy webhook secret is not configured");
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 }
      );
    }

    // Verify webhook signature
    if (!signature) {
      logger.warn("LemonSqueezy webhook received without signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    if (!verifyHmacSha256(rawBody, signature, secret)) {
      logger.warn("LemonSqueezy webhook signature verification failed", {
        receivedSignature: signature.substring(0, 10) + "...",
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    logger.info("LemonSqueezy webhook signature verified");

    const payload = JSON.parse(rawBody);
    const dedupeKey = createWebhookBodyDedupeKey("lemonsqueezy", rawBody);

    // Handle the verified webhook with database operations
    await handleLemonSqueezyWebhook(payload, dedupeKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("LemonSqueezy webhook processing error", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error },
      { status: errorResponse.statusCode }
    );
  }
}
