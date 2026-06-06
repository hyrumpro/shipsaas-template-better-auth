import * as React from "react";
import { Activity, RefreshCw, User, Receipt } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  getUserPayments,
  getUserSubscriptions,
} from "@/db/queries";
import { PageHeader, Section } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMoney, formatRelativeTime, paymentStatusLabel, subscriptionStatusLabel, type PaymentStatus, type SubscriptionStatus } from "@/lib/format";

type ActivityItem = {
  id: string;
  kind: "payment" | "subscription" | "signin";
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
  currency?: string;
  status?: string;
  statusTone?: "positive" | "negative" | "warning" | "info" | "neutral" | "muted" | "brand";
};

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

function paymentTitle(reason: string | null | undefined) {
  if (!reason) return "Payment";
  return reason
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function ActivityPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [payments, subscriptions] = await Promise.all([
    getUserPayments(user.id),
    getUserSubscriptions(user.id),
  ]);

  const items: ActivityItem[] = [
    ...payments.map<ActivityItem>((p) => ({
      id: `pay-${p.id}`,
      kind: "payment",
      title: paymentTitle(p.billingReason),
      description: `${p.provider === "stripe" ? "Stripe" : "LemonSqueezy"} payment`,
      timestamp: p.createdAt,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      statusTone: paymentTone(p.status),
    })),
    ...subscriptions.map<ActivityItem>((s) => ({
      id: `sub-${s.id}`,
      kind: "subscription",
      title: s.planName,
      description: `Subscription ${s.status === "active" ? "activated" : s.status}`,
      timestamp: s.createdAt,
      status: s.status,
      statusTone: subscriptionTone(s.status as SubscriptionStatus),
    })),
  ];

  if (user.last_sign_in_at) {
    items.push({
      id: `signin-${user.id}`,
      kind: "signin",
      title: "Signed in",
      description: "Latest authentication event from Supabase",
      timestamp: new Date(user.last_sign_in_at),
    });
  }

  if (user.created_at) {
    items.push({
      id: `created-${user.id}`,
      kind: "signin",
      title: "Account created",
      description: "Your ShipSaaS account was created",
      timestamp: new Date(user.created_at),
    });
  }

  items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-8">
      <PageHeader
        title="Activity"
        description="A timeline of payments, subscriptions, and sign-in events."
      />

      <Section
        title="Recent activity"
        description={`${items.length} event${items.length === 1 ? "" : "s"} on record`}
      >
        {items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <Activity className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">No activity yet</p>
                <p className="max-w-sm text-xs text-muted-foreground">
                  Activity from payments, subscriptions, and sign-ins will
                  appear here as you use the app.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <ol className="relative">
              <span
                aria-hidden
                className="absolute left-[2.05rem] top-3 bottom-3 w-px bg-border"
              />
              {items.map((item) => (
                <li
                  key={item.id}
                  className="relative flex items-start gap-4 px-5 py-3.5"
                >
                  <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                    <ActivityIcon kind={item.kind} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.status && (
                        <StatusBadge
                          tone={item.statusTone || "neutral"}
                          label={humanizeStatus(item.kind, item.status)}
                        />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.description} · {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                  {item.amount !== undefined && (
                    <span className="shrink-0 text-sm font-medium tabular-nums">
                      {formatMoney(item.amount, item.currency)}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Card>
        )}
      </Section>
    </div>
  );
}

function ActivityIcon({ kind }: { kind: ActivityItem["kind"] }) {
  switch (kind) {
    case "payment":
      return <Receipt className="h-4 w-4 text-muted-foreground" />;
    case "subscription":
      return <RefreshCw className="h-4 w-4 text-muted-foreground" />;
    case "signin":
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
}

function humanizeStatus(
  kind: ActivityItem["kind"],
  status: string
): string {
  if (kind === "payment") return paymentStatusLabel(status as PaymentStatus);
  if (kind === "subscription")
    return subscriptionStatusLabel(status as SubscriptionStatus);
  return status;
}
