/**
 * Lightweight in-process rate limit helper.
 *
 * Intended for protecting public API routes (login, magic link, contact
 * form, checkout creation) from brute force / spam. Not a substitute for
 * an edge-layer limiter (e.g. Cloudflare, Vercel Edge Config, Upstash
 * Redis) — this is the per-instance, best-effort fallback.
 *
 * To swap in a distributed limiter, replace the `Map` lookup with an
 * Upstash Redis call and keep the same exported function signature.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

export interface RateLimitOptions {
  /** Unique key, e.g. `${ip}:${route}`. */
  key: string;
  /** Max requests per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export function rateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt,
      retryAfterSeconds: 0,
    };
  }

  existing.count += 1;
  const allowed = existing.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
    retryAfterSeconds: allowed
      ? 0
      : Math.ceil((existing.resetAt - now) / 1000),
  };
}

/**
 * Extract a stable client identifier from a request. Prefers
 * `x-forwarded-for` (first hop), then `x-real-ip`, then falls back to
 * "unknown" so a misconfigured proxy doesn't bypass the limit.
 */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/**
 * Returns a 429 NextResponse with a `Retry-After` header. Pass
 * `result.retryAfterSeconds` straight in.
 */
export function rateLimitResponse(result: RateLimitResult) {
  return new Response(
    JSON.stringify({ error: "Too many requests" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(result.retryAfterSeconds),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
      },
    }
  );
}
