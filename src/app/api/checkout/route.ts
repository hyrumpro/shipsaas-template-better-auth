/**
 * Unified Checkout API Route
 * Works with both Stripe and LemonSqueezy based on configuration
 */

import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { handleApiError, Errors } from "@/lib/error-handler";
import { getServerSession } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/checkout";
import { getPlanById } from "@/config/payments";
import type { CheckoutProvider } from "@/config/payments";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { trackEventServer } from "@/lib/observability";

export async function POST(req: Request) {
  try {
    // Rate limit: 10 checkout attempts per user per minute. Stops script
    // kiddies from spamming the Stripe / LS API with our keys.
    const limit = rateLimit({
      key: `checkout:${getClientIp(req)}`,
      limit: 10,
      windowMs: 60_000,
    });
    if (!limit.allowed) return rateLimitResponse(limit);

    // Get authenticated user
  const session = await getServerSession();
  const user = session?.user;

    if (!user) {
      throw Errors.authentication("You must be logged in to checkout");
    }

    const body = await req.json();
    const { planId, provider } = body ?? {};

    if (typeof planId !== "string" || !planId) {
      throw Errors.validation("Plan ID is required");
    }

    // Plan IDs are user-controlled strings from the client. Reject anything
    // that doesn't match the expected slug shape (alphanumeric, dashes,
    // underscores) to keep them out of the SQL/log path.
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(planId)) {
      throw Errors.validation("Invalid plan ID format");
    }

    // Validate plan exists
    const plan = getPlanById(planId);
    if (!plan) {
      throw Errors.validation("Invalid plan ID");
    }

    if (
      provider !== undefined &&
      provider !== "stripe" &&
      provider !== "lemonsqueezy"
    ) {
      throw Errors.validation("Invalid payment provider");
    }

    logger.payment("creating_checkout", {
      userId: user.id,
      planId,
      provider,
    });

    // Create checkout session with the unified service
    const result = await createCheckoutSession({
      planId,
      provider: provider as CheckoutProvider | undefined,
      userId: user.id,
      userEmail: user.email!,
      metadata: {
        plan_name: plan.name,
      },
    });

    logger.payment("checkout_created", {
      provider: result.provider,
      sessionId: result.sessionId,
      userId: user.id,
    });
    void trackEventServer("checkout_started", {
      userId: user.id,
      planId,
      provider: result.provider,
    });

    return NextResponse.json({
      provider: result.provider,
      sessionId: result.sessionId,
      url: result.checkoutUrl,
    });
  } catch (error) {
    logger.error("Checkout error", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error },
      { status: errorResponse.statusCode }
    );
  }
}
