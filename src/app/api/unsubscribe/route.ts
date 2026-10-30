/**
 * One-Click Unsubscribe (RFC 8058)
 *
 * Mail clients (Gmail, Outlook, Apple Mail) send POST to this URL when the
 * user clicks "Unsubscribe" in the email header. The link in the email
 * itself is a GET that lands on a confirmation page.
 *
 * Both paths mark the user's email as unsubscribed from marketing/notification
 * sends. Transactional emails (password reset, payment-failed, receipts) are
 * NEVER affected by an unsubscribe — they always send, per RFC 8058 + Gmail
 * bulk sender guidelines.
 */

import { NextResponse, type NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { updateUser } from "@/db/queries";

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const email =
    formData?.get("email")?.toString() ??
    new URL(req.url).searchParams.get("email") ??
    "";

  if (!email) {
    return new NextResponse("Missing email", { status: 400 });
  }

  return unsubscribeByEmail(email);
}

export async function GET(req: NextRequest) {
  const email = new URL(req.url).searchParams.get("email") ?? "";

  if (!email) {
    return new NextResponse("Missing email", { status: 400 });
  }

  // For the GET (link click) path, return a simple confirmation page.
  // In a real app you'd render an HTML page; we keep it simple here.
  await unsubscribeByEmail(email);

  return new NextResponse(
    `You've been unsubscribed from marketing emails. Transactional emails (receipts, security alerts) will still be sent.`,
    {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}

async function unsubscribeByEmail(email: string) {
  const lower = email.toLowerCase().trim();
  try {
    // We don't have a direct "by email" lookup helper; do it inline.
    const { db } = await import("@/db");
    const { user } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const [row] = await db
      .select()
      .from(user)
      .where(eq(user.email, lower));

    if (row) {
      await updateUser(row.id, {
        metadata: {
          ...((row.metadata as Record<string, any>) ?? {}),
          unsubscribedFromMarketing: true,
          unsubscribedAt: new Date().toISOString(),
        },
      });
      logger.info("User unsubscribed from marketing", { userId: row.id, email: lower });
    } else {
      logger.info("Unsubscribe request for unknown email", { email: lower });
    }
  } catch (err) {
    logger.error("Unsubscribe handler failed", err, { email: lower });
  }

  return new NextResponse(null, { status: 200 });
}
