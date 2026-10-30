import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user as userTable, subscriptions } from "@/db/schema";
import { auth, getServerSession } from "@/lib/auth";
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
    const session = await getServerSession();
    const user = session?.user;

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

    // The Better Auth user row is the single source of truth: session,
    // account, subscription, order, and payment rows all cascade from it.
    try {
      await db.delete(userTable).where(eq(userTable.id, user.id));
    } catch (err) {
      logger.error("Failed to delete user row", err, { userId: user.id });
      return NextResponse.json(
        { error: "Failed to delete account data" },
        { status: 500 }
      );
    }

    // Clear the auth cookies in the same response. The session row is gone,
    // but the 5-minute cookie cache would otherwise keep serving the deleted
    // session until it expires — deletion must log the user out immediately.
    const response = NextResponse.json({ ok: true });
    const signOut = await auth.api.signOut({
      headers: request.headers,
      asResponse: true,
    });
    signOut.headers.getSetCookie().forEach((cookie) => {
      response.headers.append("set-cookie", cookie);
    });

    logger.warn("account.delete.completed", { userId: user.id });
    void trackEventServer("account_deleted", { userId: user.id });

    return response;
  } catch (err) {
    logger.error("Account deletion failed", err);
    void captureError(err, { tags: { route: "account-delete" } });
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
