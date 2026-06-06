"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { captureError } from "@/lib/observability";

/**
 * App-level error boundary. Renders a styled, on-brand fallback that
 * keeps the app shell intact and captures the error to Sentry.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void captureError(error, {
      tags: { boundary: "app" },
      extras: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <p className="eyebrow">Unexpected error</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          We hit an unexpected issue. The error has been reported. You
          can try again, or head back home.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
