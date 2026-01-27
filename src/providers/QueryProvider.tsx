"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * React Query Provider
 * Provides caching, background updates, and optimistic UI for the entire app
 * 
 * Configuration:
 * - staleTime: 60s - Data is fresh for 1 minute
 * - refetchOnWindowFocus: true - Refetch when user returns to tab
 * - retry: 1 - Retry failed requests once
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Consider data fresh for 1 minute
            staleTime: 60 * 1000,
            // Refetch when user returns to the tab
            refetchOnWindowFocus: true,
            // Retry failed requests once
            retry: 1,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
