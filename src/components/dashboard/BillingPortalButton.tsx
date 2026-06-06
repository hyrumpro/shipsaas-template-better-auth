"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

export function BillingPortalButton({
  disabled,
  reason,
}: {
  disabled?: boolean;
  reason?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      const { url } = (await res.json()) as { url?: string };
      if (!url) throw new Error("No portal URL returned");
      window.location.assign(url);
    } catch (err) {
      logger.error("Failed to open billing portal", err);
      setError(
        err instanceof Error ? err.message : "Failed to open billing portal"
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <Button
        onClick={openPortal}
        disabled={disabled || loading}
        className="gap-2"
      >
        {loading ? (
          "Opening…"
        ) : (
          <>
            <ExternalLink className="h-4 w-4" />
            Open billing portal
          </>
        )}
      </Button>
      {reason && !error && (
        <p className="text-xs text-muted-foreground">{reason}</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
