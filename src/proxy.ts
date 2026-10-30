/**
 * Next.js 16+ Proxy (formerly Middleware)
 * Handles authentication gating for protected routes.
 *
 * Better Auth stores the session in an httpOnly cookie. In middleware we
 * only check that the cookie is PRESENT (cheap, no DB round-trip) so
 * unauthenticated users are redirected early. Full cryptographic session
 * verification happens server-side via `getServerSession()` in layouts,
 * pages, and route handlers — keep that layer intact.
 */

import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_WEBHOOK_PATHS = new Set<string>([
  "/api/stripe/webhook",
  "/api/lemonsqueezy/webhook",
  "/api/mailgun/webhook",
  "/api/mailgun",
  "/api/waitlist",
  "/api/unsubscribe",
  "/api/health",
]);

// Better Auth owns everything under /api/auth/* and handles its own
// CSRF / origin checks. The proxy must never gate or redirect these.
const AUTH_API_PREFIX = "/api/auth";

const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/pricing",
  "/blog",
  "/about",
  "/contact",
  "/privacy-policy",
  "/tos",
  "/docs",
  "/changelog",
  "/playground",
  "/waitlist",
  "/rss.xml",
];

function isPublicRoute(pathname: string) {
  return (
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route + "/"))
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Short-circuit public webhooks. These endpoints verify their own
  // HMAC / signature and must respond quickly (Stripe / LS expect <5s).
  if (PUBLIC_WEBHOOK_PATHS.has(pathname)) {
    return NextResponse.next({ request });
  }

  if (pathname.startsWith(AUTH_API_PREFIX) || isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const hasSessionCookie = Boolean(getSessionCookie(request));

  // API routes get a machine-readable 401 instead of an HTML redirect.
  if (pathname.startsWith("/api/")) {
    if (!hasSessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Static assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
