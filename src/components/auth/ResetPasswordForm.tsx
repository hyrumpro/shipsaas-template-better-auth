"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { logger } from "@/lib/logger";
import { useI18n } from "@/lib/i18n";

/**
 * Uses useSearchParams (for the reset token), so this component must be
 * rendered inside a <Suspense> boundary — /auth/reset-password does this.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { t } = useI18n();
  const copy = t.auth.reset;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage(copy.minLength);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(copy.mismatch);
      return;
    }
    if (!token) {
      setErrorMessage(copy.missingToken);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (error) {
        logger.error("Password update failed", error);
        setErrorMessage(error.message || copy.invalidLink);
      } else {
        logger.auth("password_reset_completed", undefined, true);
        setSuccessMessage(copy.success);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 800);
      }
    } catch (error) {
      logger.error("Unexpected password update error", error);
      setErrorMessage(copy.unexpected);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthShell
        title={copy.expiredTitle}
        subtitle={copy.expiredSubtitle}
        footer={
          <Link
            href="/auth/forgot-password"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            {copy.expiredCta}
          </Link>
        }
      >
        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/forgot-password">{copy.expiredCta}</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={copy.title}
      subtitle={copy.subtitle}
      footer={
        <Link
          href="/auth/login"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          {copy.footerLink}
        </Link>
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
          <Label htmlFor="password">{copy.newLabel}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">{copy.confirmLabel}</Label>
          <Input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? copy.submitting : copy.submit}
        </Button>
      </form>
    </AuthShell>
  );
}
