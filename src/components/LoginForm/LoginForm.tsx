"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

type LoginMode = "password" | "magic-link";

/**
 * Uses useSearchParams (to honor ?redirectTo=), so this component must be
 * rendered inside a <Suspense> boundary — /auth/login does this.
 */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setNeedsVerification(false);

    try {
      const { error } = await authClient.signIn.email(
        { email, password },
        {
          onSuccess: () => {
            logger.auth("login_password", email, true);
            setSuccessMessage("Login successful! Redirecting...");
            router.push(redirectTo);
            router.refresh();
          },
        }
      );

      if (error) {
        logger.error("Password login failed", error);
        if (
          error.code === "USER_EMAIL_NOT_VERIFIED" ||
          /not verified|verify your email/i.test(error.message ?? "")
        ) {
          setNeedsVerification(true);
          setErrorMessage(
            "Your email hasn't been verified yet. Check your inbox for the verification link, or resend it below."
          );
        } else {
          setErrorMessage(
            error.message ||
              "Failed to login. Please check your credentials."
          );
        }
        setIsLoading(false);
      }
    } catch (error) {
      logger.error("Unexpected login error", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: redirectTo,
      });
      if (error) {
        setErrorMessage(error.message || "Failed to resend the email.");
      } else {
        setSuccessMessage("Verification email sent! Check your inbox.");
        setErrorMessage("");
      }
    } catch (error) {
      logger.error("Failed to resend verification email", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await authClient.signIn.magicLink(
        { email, callbackURL: redirectTo },
        {
          onSuccess: () => {
            logger.auth("login_magic_link", email, true);
          },
        }
      );

      if (error) {
        logger.error("Magic link login failed", error);
        setErrorMessage(
          error.message || "Failed to send magic link. Please try again."
        );
      } else {
        setSuccessMessage(
          "Magic link sent! Check your email to complete the login."
        );
      }
    } catch (error) {
      logger.error("Unexpected magic link error", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });

      if (error) {
        logger.error("Google login failed", error);
        setErrorMessage(error.message || "Failed to login with Google.");
        setIsLoading(false);
      }
      // On success the browser is redirected to Google, so nothing to do.
    } catch (error) {
      logger.error("Unexpected Google login error", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your email and password, or get a magic link sent to your inbox."
      footer={
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Create one
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
          {needsVerification && (
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isLoading}
              className="text-foreground mt-2 block font-medium underline-offset-4 hover:underline disabled:opacity-50"
            >
              Resend verification email
            </button>
          )}
        </div>
      )}

      <div className="border-border bg-card rounded-md border p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setLoginMode("password")}
            disabled={isLoading}
            className={cn(
              "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
              loginMode === "password"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setLoginMode("magic-link")}
            disabled={isLoading}
            className={cn(
              "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
              loginMode === "magic-link"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Magic link
          </button>
        </div>
      </div>

      {loginMode === "password" ? (
        <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
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
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleMagicLinkLogin} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email-magic">Email</Label>
            <Input
              id="email-magic"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
            />
            <p className="text-muted-foreground text-xs">
              We&apos;ll email you a one-time sign-in link.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send magic link"}
          </Button>
        </form>
      )}

      <div className="mt-4 text-center">
        <Link
          href="/auth/forgot-password"
          className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background text-muted-foreground px-2 uppercase tracking-wider">
            Or
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg
          className="mr-2 h-4 w-4"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>
    </AuthShell>
  );
}
