/**
 * Unified Checkout Service
 * Works with both Stripe and LemonSqueezy
 */

import { stripe } from "@/utils/stripe";
import { paymentConfig, getPrimaryProvider } from "@/config/payments";
import { logger } from "@/lib/logger";

export interface CheckoutOptions {
  planId: string;
  userId: string;
  userEmail: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutResult {
  provider: "stripe" | "lemonsqueezy";
  checkoutUrl: string;
  sessionId?: string;
}

/**
 * Create a checkout session with the configured payment provider
 */
export async function createCheckoutSession(
  options: CheckoutOptions
): Promise<CheckoutResult> {
  const provider = getPrimaryProvider();

  if (!provider) {
    throw new Error("No payment provider configured");
  }

  logger.payment("creating_checkout_session", {
    provider,
    planId: options.planId,
    userId: options.userId,
  });

  if (provider === "stripe") {
    return createStripeCheckout(options);
  } else {
    return createLemonSqueezyCheckoutSession(options);
  }
}

/**
 * Create Stripe checkout session
 */
async function createStripeCheckout(
  options: CheckoutOptions
): Promise<CheckoutResult> {
  const { planId, userId, userEmail, successUrl, cancelUrl, metadata } = options;

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    line_items: [
      {
        price: planId, // Stripe Price ID
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl || paymentConfig.stripe.successUrl,
    cancel_url: cancelUrl || paymentConfig.stripe.cancelUrl,
    metadata: {
      user_id: userId,
      plan_id: planId,
      ...metadata,
    },
    subscription_data: {
      metadata: {
        user_id: userId,
        plan_id: planId,
        ...metadata,
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  if (!session.url) {
    throw new Error("Failed to create Stripe checkout session");
  }

  logger.payment("stripe_checkout_created", {
    sessionId: session.id,
    userId,
  });

  return {
    provider: "stripe",
    checkoutUrl: session.url,
    sessionId: session.id,
  };
}

/**
 * Create LemonSqueezy checkout session
 */
async function createLemonSqueezyCheckoutSession(
  options: CheckoutOptions
): Promise<CheckoutResult> {
  const { planId, userId, successUrl } = options;

  const redirectUrl = successUrl || paymentConfig.lemonsqueezy.successUrl;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!storeId || !apiKey) {
    throw new Error("LemonSqueezy credentials not configured");
  }

  // Dynamic import to prevent build-time initialization
  const lemonSqueezyModule = await import("@lemonsqueezy/lemonsqueezy.js");
  
  lemonSqueezyModule.lemonSqueezySetup({
    apiKey,
    onError: (error) => {
      logger.error("LemonSqueezy SDK Error", error);
      throw error;
    },
  });

  const newCheckout = {
    productOptions: {
      redirectUrl,
    },
    checkoutData: {
      custom: {
        user_id: userId,
      },
    },
  };

  logger.payment("creating_lemonsqueezy_checkout", {
    variantId: planId,
    userId,
  });

  const { data, error } = await lemonSqueezyModule.createCheckout(
    storeId,
    planId,
    newCheckout
  ) as { data?: any; error?: any };

  if (error) {
    logger.error("Failed to create LemonSqueezy checkout", error, {
      variantId: planId,
      userId,
    });
    throw new Error(`Failed to create checkout: ${error.message}`);
  }

  if (!data?.data?.attributes?.url) {
    throw new Error("Failed to create LemonSqueezy checkout - no URL returned");
  }

  logger.payment("lemonsqueezy_checkout_created", {
    checkoutId: data.data.id,
    userId,
  });

  return {
    provider: "lemonsqueezy",
    checkoutUrl: data.data.attributes.url,
    sessionId: data.data.id,
  };
}

/**
 * Create a one-time payment checkout
 */
export async function createOneTimeCheckout(
  options: Omit<CheckoutOptions, "planId"> & {
    productName: string;
    amount: number; // in cents
    currency?: string;
  }
): Promise<CheckoutResult> {
  const provider = getPrimaryProvider();

  if (!provider) {
    throw new Error("No payment provider configured");
  }

  if (provider === "stripe") {
    return createStripeOneTimeCheckout(options);
  } else {
    throw new Error("One-time payments not yet implemented for LemonSqueezy");
  }
}

/**
 * Create Stripe one-time payment checkout
 */
async function createStripeOneTimeCheckout(
  options: Omit<CheckoutOptions, "planId"> & {
    productName: string;
    amount: number;
    currency?: string;
  }
): Promise<CheckoutResult> {
  const {
    productName,
    amount,
    currency = "usd",
    userId,
    userEmail,
    successUrl,
    cancelUrl,
    metadata,
  } = options;

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: productName,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl || paymentConfig.stripe.successUrl,
    cancel_url: cancelUrl || paymentConfig.stripe.cancelUrl,
    metadata: {
      user_id: userId,
      product_name: productName,
      ...metadata,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create Stripe checkout session");
  }

  return {
    provider: "stripe",
    checkoutUrl: session.url,
    sessionId: session.id,
  };
}

/**
 * Get customer portal URL for managing subscriptions
 */
export async function getCustomerPortalUrl(
  customerId: string,
  returnUrl?: string
): Promise<string> {
  const provider = getPrimaryProvider();

  if (provider === "stripe") {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    });

    return session.url;
  } else {
    // LemonSqueezy uses their own customer portal
    // Users can manage subscriptions from their LemonSqueezy account
    return "https://app.lemonsqueezy.com/my-orders";
  }
}
