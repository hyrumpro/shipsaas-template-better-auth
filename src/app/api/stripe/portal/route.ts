import { NextResponse } from "next/server";

import { stripe } from "@/utils/stripe";
import { getServerSession } from "@/lib/auth";
import { getUserById } from "@/db/queries";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { captureError } from "@/lib/observability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit({
    key: `stripe-portal:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (!limit.allowed) return rateLimitResponse(limit);

  try {
    const authSession = await getServerSession();
    const user = authSession?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getUserById(user.id);
    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer on file. Make a purchase first." },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (request.headers.get("origin") ?? "http://localhost:3000");

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${siteUrl}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    logger.error("Stripe portal session failed", err);
    void captureError(err, { tags: { route: "stripe-portal" } });
    return NextResponse.json(
      { error: "Failed to open billing portal" },
      { status: 500 }
    );
  }
}
