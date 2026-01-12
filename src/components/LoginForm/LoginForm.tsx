"use client";

import SEO from "@/utils/seo";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logger } from "@/lib/logger";

type LoginMode = "password" | "magic-link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error("Password login failed", error);
        setErrorMessage(error.message || "Failed to login. Please check your credentials.");
      } else {
        logger.auth("login_password", email, true);
        setSuccessMessage("Login successful! Redirecting...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      logger.error("Unexpected login error", error);
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
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        logger.error("Magic link login failed", error);
        setErrorMessage(error.message || "Failed to send magic link. Please try again.");
      } else {
        logger.auth("login_magic_link", email, true);
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/confirm`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        logger.error("Google login failed", error);
        setErrorMessage(error.message || "Failed to login with Google.");
        setIsLoading(false);
      }
      // Note: Don't set isLoading to false here as user is being redirected
    } catch (error) {
      logger.error("Unexpected Google login error", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Login | ShipFree"
        description="Sign in to your ShipFree account"
        canonicalUrl="https://yourdomain.com/auth/login"
        ogImageUrl="https://yourdomain.com/og-image.png"
        twitterHandle="yourtwitterhandle"
      />
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Login Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              variant={loginMode === "password" ? "default" : "outline"}
              onClick={() => setLoginMode("password")}
              className="flex-1"
              disabled={isLoading}
            >
              Password
            </Button>
            <Button
              type="button"
              variant={loginMode === "magic-link" ? "default" : "outline"}
              onClick={() => setLoginMode("magic-link")}
              className="flex-1"
              disabled={isLoading}
            >
              Magic Link
            </Button>
          </div>

          {/* Password Login Form */}
          {loginMode === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in with Password"}
              </Button>
            </form>
          )}

          {/* Magic Link Form */}
          {loginMode === "magic-link" && (
            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-magic">Email</Label>
                <Input
                  id="email-magic"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-gray-500">
                  We&apos;ll send you a magic link to sign in without a password
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
            {isLoading ? "Redirecting..." : "Sign in with Google"}
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm pt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-500 hover:underline font-medium"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
