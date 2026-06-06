import { type Stripe as StripeJS, loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

let stripePromise: Promise<StripeJS | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

let _stripe: Stripe | null = null;

// Lazy-initialize the server-side Stripe client so the build doesn't
// require STRIPE_SECRET_KEY to be set. Routes that actually need it
// will throw a clear error at request time.
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!_stripe) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error(
          "STRIPE_SECRET_KEY is not set. Add it to .env.local and restart the dev server."
        );
      }
      _stripe = new Stripe(key, {
        apiVersion: "2025-02-24.acacia",
      });
    }
    const value = (_stripe as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(_stripe) : value;
  },
});
