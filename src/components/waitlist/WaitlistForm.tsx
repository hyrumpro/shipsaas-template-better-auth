"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { waitlistConfig } from "@/config/waitlist";

interface WaitlistFormProps {
  initialCount: number | null;
}

export function WaitlistForm({ initialCount }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState<"joined" | "already" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        return;
      }

      const data = (await res.json()) as { status: "joined" | "already" };
      setSuccess(data.status);
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            aria-label="Home"
            className="hover:opacity-80 transition-opacity"
          >
            <Logo />
          </Link>
          <Link
            href={waitlistConfig.homeLinkLabel.startsWith("Back") ? "/" : "/"}
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            {waitlistConfig.homeLinkLabel}
          </Link>
        </div>
      </header>

      <main>
        <section className="border-border border-b">
          <div className="mx-auto w-full max-w-3xl px-6 pt-24 pb-12 md:pt-32 md:pb-16">
            <p className="eyebrow">{waitlistConfig.eyebrow}</p>
            <h1 className="text-display-xl text-balance text-foreground mt-4">
              {waitlistConfig.title}
            </h1>
            <p className="text-foreground/70 mt-6 max-w-xl text-lg leading-relaxed md:text-xl">
              {waitlistConfig.subtitle}
            </p>

            {initialCount !== null && (
              <p className="text-muted-foreground mt-6 text-sm">
                {initialCount === 0
                  ? waitlistConfig.counterEmpty
                  : `${waitlistConfig.counterPrefix} ${initialCount} ${waitlistConfig.counterSuffix}`}
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="mx-auto w-full max-w-md px-6 py-12 md:py-16">
            {success ? (
              <div className="border-border bg-card rounded-lg border p-6">
                <p className="eyebrow">Confirmed</p>
                <p className="text-foreground mt-3 text-base">
                  {success === "already"
                    ? waitlistConfig.alreadyOnListMessage
                    : waitlistConfig.successMessage}
                </p>
                <Button asChild variant="outline" className="mt-6 w-full">
                  <Link href="/">{waitlistConfig.homeLinkLabel}</Link>
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="border-border bg-card rounded-lg border p-6"
              >
                {errorMessage && (
                  <div className="border-destructive/20 bg-destructive/5 text-destructive mb-4 rounded-md border p-3 text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">{waitlistConfig.emailLabel}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      autoComplete="email"
                      placeholder={waitlistConfig.emailPlaceholder}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="name">{waitlistConfig.nameLabel}</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      autoComplete="name"
                      placeholder={waitlistConfig.namePlaceholder}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                      ? waitlistConfig.submittingLabel
                      : waitlistConfig.submitLabel}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
