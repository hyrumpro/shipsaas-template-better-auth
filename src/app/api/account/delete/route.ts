import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { adminAuth } from "@/lib/supabase/admin";
import { stripe } from "@/utils/stripe";
import { getPrimaryProvider } from "@/config/payments";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { captureError, trackEventServer } from "@/lib/observability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit({
    key: `account-delete:${ip}`,
    limit: 3,
    windowMs: 60 * 60_000,
  });
  if (!limit.allowed) return rateLimitResponse(limit);

  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.warn("account.delete.requested", { userId: user.id });

    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id));

    const provider = getPrimaryProvider();
    if (provider === "stripe") {
      for (const sub of userSubscriptions) {
        if (sub.provider !== "stripe" || sub.status === "canceled") continue;
        try {
          await stripe.subscriptions.cancel(sub.providerSubscriptionId, {
            invoice_now: false,
            prorate: false,
          });
        } catch (err) {
          logger.error("Failed to cancel Stripe subscription on delete", err, {
            subscriptionId: sub.id,
          });
        }
      }
    }

    try {
      await db.delete(users).where(eq(users.id, user.id));
    } catch (err) {
      logger.error("Failed to delete public user row", err, { userId: user.id });
      return NextResponse.json(
        { error: "Failed to delete account data" },
        { status: 500 }
      );
    }

    try {
      await adminAuth.deleteUser(user.id);
    } catch (err) {
      logger.error("Failed to delete auth user", err, { userId: user.id });
    }

    logger.warn("account.delete.completed", { userId: user.id });
    void trackEventServer("account_deleted", { userId: user.id });

    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error("Account deletion failed", err);
    void captureError(err, { tags: { route: "account-delete" } });
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
