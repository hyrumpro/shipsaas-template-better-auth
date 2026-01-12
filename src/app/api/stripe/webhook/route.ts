import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/error-handler";
import { handleStripeWebhook } from "@/lib/webhooks/stripe-handler";

export async function POST(req: Request) {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature") as string;

    if (!sig) {
      logger.warn("Stripe webhook received without signature");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error("STRIPE_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
      logger.info("Stripe webhook signature verified", { type: event.type });
    } catch (err: any) {
      logger.error("Stripe webhook signature verification failed", err);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the webhook event with database operations
    await handleStripeWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Stripe webhook processing error", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error },
      { status: errorResponse.statusCode }
    );
  }
}
