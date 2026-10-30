import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { getServerSession } from "@/lib/auth";
import { getActiveSubscription, getUserByEmail } from "@/db/queries";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DeleteAccountDialog } from "@/components/dashboard/DeleteAccountDialog";
import { formatDate, subscriptionStatusLabel, type SubscriptionStatus } from "@/lib/format";

export default async function DangerZonePage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  const [dbUser, subscription] = await Promise.all([
    getUserByEmail(user.email ?? ""),
    getActiveSubscription(user.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Danger zone"
        description="Irreversible actions. Proceed with caution."
      />

      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-destructive">Delete this account</CardTitle>
              <CardDescription>
                Permanently delete your account, profile, and all associated
                data. This action cannot be undone.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-md border border-destructive/20 bg-background/60 p-4 text-sm">
            <p className="font-medium">What will be deleted:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Your profile (name, email, preferences)</li>
              <li>Your authentication session</li>
              <li>Access to any active subscription</li>
              <li>All payment history, orders, and subscriptions</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Make sure to download anything you want to keep first. This
              action is irreversible.
            </p>
          </div>

          {subscription && (
            <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-card p-3 text-sm">
              <span className="text-muted-foreground">Active subscription:</span>
              <span className="font-medium">{subscription.planName}</span>
              <StatusBadge
                tone={
                  subscription.status === "active" ||
                  subscription.status === "trialing"
                    ? "positive"
                    : "warning"
                }
                label={subscriptionStatusLabel(
                  subscription.status as SubscriptionStatus
                )}
              />
              <span className="ml-auto text-xs text-muted-foreground">
                {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"}{" "}
                {formatDate(subscription.currentPeriodEnd)}
              </span>
            </div>
          )}

          {dbUser?.createdAt && (
            <p className="text-xs text-muted-foreground">
              Account created {formatDate(dbUser.createdAt)}.
            </p>
          )}

          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  );
}
