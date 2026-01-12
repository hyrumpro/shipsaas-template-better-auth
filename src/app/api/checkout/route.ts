/**
 * Unified Checkout API Route
 * Works with both Stripe and LemonSqueezy based on configuration
 */

import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { handleApiError, Errors } from "@/lib/error-handler";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { createCheckoutSession } from "@/lib/checkout";
import { getPlanById } from "@/config/payments";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw Errors.authentication("You must be logged in to checkout");
    }

    const { planId } = await req.json();

    if (!planId) {
      throw Errors.validation("Plan ID is required");
    }

    // Validate plan exists
    const plan = getPlanById(planId);
    if (!plan) {
      throw Errors.validation("Invalid plan ID");
    }

    // Get the provider-specific price/variant ID
    const providerPlanId = plan.stripePriceId || plan.lemonSqueezyVariantId;
    if (!providerPlanId) {
      throw Errors.validation("Plan not available for current payment provider");
    }

    logger.payment("creating_checkout", {
      userId: user.id,
      planId,
      providerPlanId,
    });

    // Create checkout session with the unified service
    const result = await createCheckoutSession({
      planId: providerPlanId,
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
