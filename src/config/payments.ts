/**
 * Payment Provider Configuration
 * Easy switching between Stripe and LemonSqueezy
 */

export type PaymentProvider = "stripe" | "lemonsqueezy" | "both";

// ============================================================================
// PAYMENT PROVIDER CONFIGURATION
// ============================================================================
// Change this to switch between payment providers
// Options: "stripe", "lemonsqueezy", or "both"
export const PAYMENT_PROVIDER: PaymentProvider =
  (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER as PaymentProvider) || "stripe";

// ============================================================================
// PROVIDER SETTINGS
// ============================================================================

export const paymentConfig = {
  // Active provider(s)
  provider: PAYMENT_PROVIDER,

  // Stripe configuration
  stripe: {
    enabled: PAYMENT_PROVIDER === "stripe" || PAYMENT_PROVIDER === "both",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    
    // Stripe-specific settings
    currency: "usd",
    successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?payment=canceled`,
  },

  // LemonSqueezy configuration
  lemonsqueezy: {
    enabled:
      PAYMENT_PROVIDER === "lemonsqueezy" || PAYMENT_PROVIDER === "both",
    apiKey: process.env.LEMONSQUEEZY_API_KEY,
    storeId: process.env.LEMONSQUEEZY_STORE_ID,
    webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID,
    
    // LemonSqueezy-specific settings
    successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?payment=canceled`,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if Stripe is enabled
 */
export function isStripeEnabled(): boolean {
  return paymentConfig.stripe.enabled && !!paymentConfig.stripe.publishableKey;
}

/**
 * Check if LemonSqueezy is enabled
 */
export function isLemonSqueezyEnabled(): boolean {
  return (
    paymentConfig.lemonsqueezy.enabled && !!paymentConfig.lemonsqueezy.apiKey
  );
}

/**
 * Get the primary payment provider
 * Returns the first enabled provider
 */
export function getPrimaryProvider(): "stripe" | "lemonsqueezy" | null {
  if (PAYMENT_PROVIDER === "both") {
    // If both enabled, prefer Stripe
    return isStripeEnabled() ? "stripe" : isLemonSqueezyEnabled() ? "lemonsqueezy" : null;
  }
  
  if (PAYMENT_PROVIDER === "stripe" && isStripeEnabled()) {
    return "stripe";
  }
  
  if (PAYMENT_PROVIDER === "lemonsqueezy" && isLemonSqueezyEnabled()) {
    return "lemonsqueezy";
  }
  
  return null;
}

/**
 * Get enabled providers
 */
export function getEnabledProviders(): Array<"stripe" | "lemonsqueezy"> {
  const providers: Array<"stripe" | "lemonsqueezy"> = [];
  
  if (isStripeEnabled()) {
    providers.push("stripe");
  }
  
  if (isLemonSqueezyEnabled()) {
    providers.push("lemonsqueezy");
  }
  
  return providers;
}

/**
 * Validate payment provider configuration
 */
export function validatePaymentConfig(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (PAYMENT_PROVIDER === "stripe" || PAYMENT_PROVIDER === "both") {
    if (!paymentConfig.stripe.publishableKey) {
      errors.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not configured");
    }
    if (!paymentConfig.stripe.secretKey) {
      errors.push("STRIPE_SECRET_KEY is not configured");
    }
    if (!paymentConfig.stripe.webhookSecret) {
      errors.push("STRIPE_WEBHOOK_SECRET is not configured");
    }
  }

  if (PAYMENT_PROVIDER === "lemonsqueezy" || PAYMENT_PROVIDER === "both") {
    if (!paymentConfig.lemonsqueezy.apiKey) {
      errors.push("LEMONSQUEEZY_API_KEY is not configured");
    }
    if (!paymentConfig.lemonsqueezy.storeId) {
      errors.push("LEMONSQUEEZY_STORE_ID is not configured");
    }
    if (!paymentConfig.lemonsqueezy.webhookSecret) {
      errors.push("LEMONSQUEEZY_WEBHOOK_SECRET is not configured");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// PRICING PLANS
// ============================================================================
// Define your pricing plans here
// You can have different IDs for Stripe and LemonSqueezy

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  currency: string;
  interval: "month" | "year";
  features: string[];
  stripePriceId?: string; // Stripe Price ID
  lemonSqueezyVariantId?: string; // LemonSqueezy Variant ID
  popular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "premium",
    name: "Premium",
    description: "One-time payment, lifetime access",
    price: 2900, // $29.00
    currency: "usd",
    interval: "month",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    lemonSqueezyVariantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PREMIUM_VARIANT_ID,
    features: [
      "All features",
      "Unlimited usage",
      "Priority support",
      "Advanced analytics",
      "Lifetime access",
    ],
    popular: true,
  },
];

/**
 * Get a pricing plan by ID
 */
export function getPlanById(planId: string): PricingPlan | undefined {
  return pricingPlans.find((plan) => plan.id === planId);
}

/**
 * Get available plans for the current provider
 */
export function getAvailablePlans(): PricingPlan[] {
  const provider = getPrimaryProvider();
  
  return pricingPlans.filter((plan) => {
    if (provider === "stripe") {
      return !!plan.stripePriceId;
    }
    
    if (provider === "lemonsqueezy") {
      return !!plan.lemonSqueezyVariantId;
    }
    
    return false;
  });
}
