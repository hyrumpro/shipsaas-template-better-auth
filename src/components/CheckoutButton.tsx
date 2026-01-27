"use client";

import { useMutation } from "@tanstack/react-query";
import { getStripe } from "@/utils/stripe";
import { logger } from "@/lib/logger";

interface CheckoutButtonProps {
  priceId: string;
}

export default function CheckoutButton({ priceId }: CheckoutButtonProps) {
  // ✅ Use React Query mutation for better error handling and state management
  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      const stripe = await getStripe();
      if (stripe && data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        throw new Error("Failed to initialize Stripe");
      }
    },
    onError: (error) => {
      logger.error("Checkout failed", error);
      // You could add toast notification here
    },
  });

  const handleCheckout = () => {
    checkoutMutation.mutate(priceId);
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={checkoutMutation.isPending}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {checkoutMutation.isPending ? "Loading..." : "Subscribe"}
    </button>
  );
}
