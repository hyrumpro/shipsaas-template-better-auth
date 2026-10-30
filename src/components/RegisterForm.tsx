"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { validateForm, CommonRules, hasErrors } from "@/lib/validation";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationErrors = validateForm(
      { email, password },
      {
        email: CommonRules.email,
        password: CommonRules.password,
      }
    );

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (name.trim().length < 2) {
      validationErrors.name = "Please enter your name";
    }

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      logger.info("Registration attempt", { email });

      // Better Auth sends the verification email automatically
      // (emailVerification.sendOnSignUp in src/lib/auth.ts). The user is
      // signed in after they click the verification link.
      const { error } = await authClient.signUp.email(
        {
          email,
          password,
          name: name.trim(),
          callbackURL: "/dashboard",
        },
        {
          onSuccess: (ctx) => {
            logger.auth("register", ctx.data?.user?.id, true);
          },
        }
      );

      if (error) {
        logger.error("Registration failed", error, { email });

        if (/already (registered|exists)/i.test(error.message ?? "")) {
          setErrorMessage(
            "This email is already registered. Please sign in instead."
          );
        } else if (/weak password/i.test(error.message ?? "")) {
          setErrors({
            password: "Password is too weak. Please choose a stronger one.",
          });
        } else {
          setErrorMessage(
            error.message || "Registration failed. Please try again."
          );
        }
        return;
      }

      setSuccessMessage(
        "Account created! Check your inbox — click the verification link to activate your account."
      );
    } catch (err) {
      logger.error("Unexpected registration error", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to start. No credit card required."
      footer={
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Sign in
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

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: "" }));
              }
            }}
            disabled={isLoading}
            className={cn(errors.name && "border-destructive")}
            required
            minLength={2}
            maxLength={100}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            autoComplete="name"
            placeholder="Ada Lovelace"
          />
          {errors.name && (
            <p id="name-error" className="text-destructive text-xs">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
            disabled={isLoading}
            className={cn(errors.email && "border-destructive")}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-destructive text-xs"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            disabled={isLoading}
            className={cn(errors.password && "border-destructive")}
            required
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            autoComplete="new-password"
          />
          {errors.password && (
            <p
              id="password-error"
              className="text-destructive text-xs"
            >
              {errors.password}
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            At least 8 characters with uppercase, lowercase, and a number.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }
            }}
            disabled={isLoading}
            className={cn(errors.confirmPassword && "border-destructive")}
            required
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirm-password-error" : undefined
            }
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p
              id="confirm-password-error"
              className="text-destructive text-xs"
            >
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
