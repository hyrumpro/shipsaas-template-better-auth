"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { logger } from "@/lib/logger";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
        window.location.origin;
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${siteUrl}/auth/reset-password`,
      });

      if (error) {
        logger.error("Password reset request failed", error);
        setErrorMessage(
          error.message || "Failed to send reset email. Please try again.",
        );
      } else {
        logger.auth("password_reset_requested", email, true);
        setSuccessMessage(
          "If an account exists for that email, a reset link is on its way. Check your inbox.",
        );
      }
    } catch (error) {
      logger.error("Unexpected password reset error", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to choose a new password."
      footer={
        <p className="text-muted-foreground">
          Remembered it?{" "}
          <Link
            href="/auth/login"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      }
    >
      {successMessage && (
        <div className="border-border bg-muted text-foreground mb-4 rounded-md border p-3 text-sm">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="border-destructive/20 bg-destructive/5 text-destructive mb-4 rounded-md border p-3 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </AuthShell>
  );
}
