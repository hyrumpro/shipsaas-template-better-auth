import * as React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  CreditCard,
  ExternalLink,
  ArrowUpRight,
  Receipt,
  Calendar,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import {
  getActiveSubscription,
  getUserSubscriptions,
  getUserPayments,
  getUserByEmail,
} from "@/db/queries";
import { getPrimaryProvider } from "@/config/payments";
import { PageHeader, Section } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { BillingPortalButton } from "@/components/dashboard/BillingPortalButton";
import {
  formatDate,
  formatMoney,
  planIntervalLabel,
  paymentStatusLabel,
  subscriptionStatusLabel,
  type SubscriptionStatus,
  type PaymentStatus,
} from "@/lib/format";

function subscriptionTone(status: SubscriptionStatus) {
  switch (status) {
    case "active":
    case "trialing":
      return "positive" as const;
    case "past_due":
    case "unpaid":
      return "warning" as const;
    case "canceled":
    case "incomplete_expired":
      return "negative" as const;
    case "paused":
    case "incomplete":
      return "muted" as const;
    default:
      return "neutral" as const;
  }
}

function paymentTone(status: string) {
  switch (status) {
    case "succeeded":
    case "paid":
      return "positive" as const;
    case "refunded":
      return "info" as const;
    case "failed":
      return "negative" as const;
    case "pending":
      return "warning" as const;
    default:
      return "neutral" as const;
  }
}

export default async function BillingPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const provider = getPrimaryProvider();
  const [dbUser, activeSubscription, allSubscriptions, payments] =
    await Promise.all([
      getUserByEmail(user.email ?? ""),
      getActiveSubscription(user.id),
      getUserSubscriptions(user.id),
      getUserPayments(user.id),
    ]);

  const hasStripeCustomer = Boolean(dbUser?.stripeCustomerId);
  const totalSpent = payments
    .filter((p) => p.status === "succeeded" || p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Your plan, payment history, and billing portal."
        actions={
          activeSubscription && provider === "stripe" ? (
            <BillingPortalButton
              disabled={!hasStripeCustomer}
              reason={!hasStripeCustomer ? "No Stripe customer yet" : undefined}
            />
          ) : null
        }
      />

      <Section
        title="Current plan"
        description={
          provider === "stripe"
            ? "Powered by Stripe. Manage cards, tax ids, and invoices in the portal."
            : "Powered by LemonSqueezy."
        }
      >
        {activeSubscription ? (
          <Card>
            <CardContent className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">
                    {activeSubscription.planName}
                  </h3>
                  <StatusBadge
                    tone={subscriptionTone(
                      activeSubscription.status as SubscriptionStatus
                    )}
                    label={subscriptionStatusLabel(
                      activeSubscription.status as SubscriptionStatus
                    )}
                    pulse={
                      activeSubscription.status === "active" ||
                      activeSubscription.status === "trialing"
                    }
                  />
                  {activeSubscription.cancelAtPeriodEnd && (
                    <StatusBadge
                      tone="warning"
                      label="Cancels at period end"
                    />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span className="font-mono text-foreground">
                    {formatMoney(
                      activeSubscription.amount,
                      activeSubscription.currency
                    )}
                    <span className="text-muted-foreground">
                      {planIntervalLabel(
                        activeSubscription.interval,
                        activeSubscription.intervalCount
                      )}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {activeSubscription.cancelAtPeriodEnd
                      ? "Ends"
                      : "Next renewal"}{" "}
                    {formatDate(activeSubscription.currentPeriodEnd)}
                  </span>
                  {activeSubscription.trialEnd && (
                    <span>
                      Trial ends {formatDate(activeSubscription.trialEnd)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Provider:{" "}
                  <span className="font-mono text-foreground">
                    {activeSubscription.provider}
                  </span>
                  {" · "}Sub ID:{" "}
                  <span className="font-mono text-foreground">
                    {activeSubscription.providerSubscriptionId}
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                {provider === "stripe" ? (
                  <Button asChild variant="outline" className="gap-2">
                    <Link href="/#pricing">
                      Change plan
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="gap-2">
                    <Link
                      href={`https://app.lemonsqueezy.com/billing?expires=...`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open LemonSqueezy
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No active subscription</p>
                <p className="max-w-sm text-xs text-muted-foreground">
                  You&apos;re on the free tier. Upgrade to unlock all features and
                  remove usage limits.
                </p>
              </div>
              <Button asChild size="sm" className="mt-1 gap-2">
                <Link href="/#pricing">
                  View plans
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </Section>

      {allSubscriptions.length > 1 && (
        <Section
          title="Subscription history"
          description="All your subscriptions, including past and canceled."
        >
          <Card>
            <ul className="divide-y divide-border">
              {allSubscriptions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {s.planName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.provider} · started {formatDate(s.createdAt)}
                    </p>
                  </div>
                  <StatusBadge
                    tone={subscriptionTone(s.status as SubscriptionStatus)}
                    label={subscriptionStatusLabel(
                      s.status as SubscriptionStatus
                    )}
                  />
                </li>
              ))}
            </ul>
          </Card>
        </Section>
      )}

      <Section
        title="Payment history"
        description={`${payments.length} payment${payments.length === 1 ? "" : "s"} totaling ${formatMoney(totalSpent)}`}
      >
        {payments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <Receipt className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No payments yet</p>
                <p className="max-w-sm text-xs text-muted-foreground">
                  When you make a purchase, your receipts will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border px-5 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:grid-cols-[1.5fr_1fr_auto_auto]">
              <span>Description</span>
              <span className="hidden sm:inline">Date</span>
              <span>Status</span>
              <span className="text-right">Amount</span>
            </div>
            <ul className="divide-y divide-border">
              {payments.map((p) => (
                <li
                  key={p.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5 text-sm sm:grid-cols-[1.5fr_1fr_auto_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {p.billingReason
                        ? p.billingReason
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")
                        : "Payment"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground sm:hidden">
                      {formatDate(p.createdAt)} · {p.provider}
                    </p>
                  </div>
                  <span className="hidden text-sm text-muted-foreground sm:inline">
                    {formatDate(p.createdAt)}
                  </span>
                  <StatusBadge
                    tone={paymentTone(p.status)}
                    label={paymentStatusLabel(p.status as PaymentStatus)}
                  />
                  <div className="flex items-center justify-end gap-3">
                    <span className="font-medium tabular-nums">
                      {formatMoney(p.amount, p.currency)}
                    </span>
                    {p.invoiceUrl && (
                      <a
                        href={p.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="View invoice"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Section>
    </div>
  );
}
