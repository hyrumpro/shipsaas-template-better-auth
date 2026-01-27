// app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks/useAuth";

interface CheckoutPageProps {
  variantId?: string;
}

export default function CheckoutPage({ variantId }: CheckoutPageProps) {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  
  // ✅ Use React Query hook for cached user data
  const { data: user, isLoading: isAuthLoading, error: authError } = useAuth();

  // Get variant ID from environment or props
  const productVariantId = variantId || process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID;

  // Check authentication status
  useEffect(() => {
    if (!isAuthLoading && !user) {
      logger.warn("User not authenticated for checkout");
      setError("Please sign in to continue with checkout.");
    }
  }, [isAuthLoading, user]);

  useEffect(() => {
    const initiateCheckout = async () => {
      if (!productVariantId) {
        setError("Product variant ID is not configured. Please contact support.");
        logger.error("LemonSqueezy variant ID not configured");
        return;
      }

      if (isAuthLoading || !user) {
        // Wait for auth to complete
        return;
      }

      try {
        setIsCheckoutLoading(true);
        
        // Use the unified checkout API
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: productVariantId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create checkout");
        }

        const data = await response.json();
        
        if (data.url) {
          setCheckoutUrl(data.url);
        } else {
          throw new Error("Checkout URL not returned from API");
        }
      } catch (err) {
        logger.error("Failed to initiate checkout", err);
        setError("Failed to load checkout. Please try again later.");
      } finally {
        setIsCheckoutLoading(false);
      }
    };

    initiateCheckout();
  }, [productVariantId, isAuthLoading, user]);

  if (isAuthLoading || isCheckoutLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <div className="mt-4 space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
            {error.includes("sign in") && (
              <a
                href="/auth/login"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!checkoutUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Unable to load checkout</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to checkout</h2>
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Proceed to Checkout
        </a>
      </div>
    </div>
  );
}
