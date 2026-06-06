import { NextResponse } from "next/server";
import { rateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { addToWaitlist, isOnWaitlist } from "@/db/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = rateLimit({
    key: `waitlist:${ip}`,
    limit: 5,
    windowMs: 60_000,
  });
  if (!limit.allowed) return rateLimitResponse(limit);

  let body: Record<string, unknown> = {};
  try {
    const parsed = await req.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      body = parsed as Record<string, unknown>;
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const email = asString(body.email).trim().toLowerCase();
  const name = asString(body.name).trim();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email." },
      { status: 400 },
    );
  }
  if (name.length > 255) {
    return NextResponse.json(
      { error: "Name is too long." },
      { status: 400 },
    );
  }

  try {
    const already = await isOnWaitlist(email);
    if (already) {
      return NextResponse.json({ status: "already" });
    }

    const referrer = req.headers.get("referer");
    const userAgent = req.headers.get("user-agent");

    await addToWaitlist({
      email,
      name: name || null,
      referrer,
      userAgent,
    });

    return NextResponse.json({ status: "joined" });
  } catch (err) {
    logger.error("Failed to add email to waitlist", err, { email });
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
