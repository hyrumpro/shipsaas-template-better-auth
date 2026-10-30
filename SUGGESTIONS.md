# SUGGESTIONS.md

Things the template intentionally does **not** include, with the reasoning
for each and the recommended path forward.

The goal of this document: when you (the buyer) ship a Customer Project, you
have a checklist of what to add next, with enough context to make the call
yourself. Everything below is opt-in. The template ships none of it as a
hard dependency because every Customer Project is different.

---

## Database & performance

### 1. Redis / Upstash for rate limiting

**What the template does:** an in-memory token bucket in
`src/lib/rate-limit.ts`. Applied to `/api/checkout`, `/api/stripe/portal`,
`/api/account/delete`, and `/api/waitlist` at 5–10 req/min/IP.

**Why not by default:** on Vercel serverless, each cold start resets the
bucket. For a low-traffic solo project that's fine; for a product with
real users it's a footgun.

**Recommended:** [Upstash Redis](https://upstash.com) (~free tier is
generous, serverless-friendly, no connection pool to manage). The
`rateLimit()` signature in `src/lib/rate-limit.ts` is the only place that
needs to change — drop in a Redis-backed implementation, callers stay
identical. Better Auth's own limiter has the same serverless caveat: set
`rateLimit.storage: "secondary-storage"` in `src/lib/auth.ts` and provide
a `secondaryStorage` implementation to share limits across instances.

```ts
// Replace getRateLimitStorage() in src/lib/rate-limit.ts with:
import { Redis } from "@upstash/redis";
const redis = new Redis({ url: process.env.UPSTASH_REDIS_URL!, token: process.env.UPSTASH_REDIS_TOKEN! });
// Then: await redis.set(key, count, { ex: 60 }); await redis.incr(key);
```

### 2. Database read replicas

**What the template does:** all reads + writes go through the primary
Postgres connection.

**Why not by default:** adds an env var, doubles the connection-pool cost,
and most Customer Projects don't need it until they hit real scale.

**Recommended:** enable your provider's read replicas (Neon, Supabase,
Crunchy) — see [Supabase Read Replicas](https://supabase.com/docs/guides/database/read-replicas)
when your dashboard reports connection-pool saturation. Add a second
Drizzle client pointing at the replica URL; route `SELECT`s to it.

### 3. Postgres connection pooling in production

**What the template does:** `DATABASE_URL` connects directly. Fine on Vercel
when the DB has PgBouncer in transaction mode; bad on long-lived servers.

**Recommended:** use your provider's pooler (Neon pooler, Supavisor,
PgBouncer) in transaction mode for serverless deployments. Add a second env var
`DATABASE_POOL_URL` and read it in `src/db/index.ts` if it exists.

### 4. Backups and PITR

**What the template does:** nothing — most managed Postgres providers offer
automated backups, but the good ones are paid add-ons.

**Recommended:** enable your provider's Point-in-Time Recovery on production
projects. It restores to any second within the retention window instead of
picking a nightly snapshot.

---

## Observability

The template ships an opt-in shim at `src/lib/observability.ts`. Nothing is
sent anywhere until you install a package and set an env var. **You pick the
provider.** The shim exposes:

```ts
trackEventServer(name, props?)   // server-side analytics
trackEventClient(name, props?)   // client-side analytics
identifyUserClient(userId, props?)
resetClient()                    // on logout
captureError(err, { tags })      // error tracking
```

**Recommended (pick one of each):**

| Category | Provider | Notes |
| --- | --- | --- |
| Product analytics | [PostHog](https://posthog.com) | Free up to 1M events/mo, EU/US hosting, session replay built in. |
| Product analytics | [Plausible](https://plausible.io) | Lightweight, no cookies, GDPR-friendly, paid (~$9/mo). |
| Product analytics | [Umami](https://umami.is) | Self-hostable, free, similar to Plausible. |
| Error tracking | [Sentry](https://sentry.io) | Best-in-class for Next.js, free tier 5K events/mo. |
| Logging | [Axiom](https://axiom.co) | Cheap log storage, queryable, plays well with Vercel. |
| Uptime | [Better Stack](https://betterstack.com) / [Cronitor](https://cronitor.io) | pings `/api/health` from outside your infra. |

**Setup:** `npm i posthog-js posthog-node` (or whatever you pick), set the
API keys, and the shim does the rest. Don't call provider SDKs directly —
go through the shim so the buyer's provider choice stays swappable.

---

## Background jobs

The template does **not** include a job queue. Webhook handlers and API
routes do their work inline. This is fine for low-volume flows.

**When you need a queue:**

- Scheduled work ("send a reminder 3 days before renewal")
- Long-running work (PDF generation, video transcoding)
- Retry-with-backoff (a webhook fails; you want to retry in 5 min)
- Offloading from webhooks (so a slow third-party API doesn't time out)

**Recommended (pick one):**

| Provider | Why |
| --- | --- |
| [Inngest](https://inngest.com) | Easiest DX, plays great with Next.js + Vercel, free tier 1M steps/mo. |
| [Trigger.dev](https://trigger.dev) | Self-hostable, code-first, generous free tier. |
| [BullMQ + Upstash Redis](https://docs.bullmq.io) | Self-hostable, the standard, more boilerplate. |
| [Vercel Cron](https://vercel.com/docs/cron-jobs) | For pure scheduling (no queue). |

**The LemonSqueezy "subscription ends in 3 days" reminder, scheduled
"abandoned cart" emails, and any "expire this trial" cron all need this
when you add them.**

---

## File storage

The template does not include file storage. Customer Projects that need
avatars, attachments, exports, or uploads have to add it.

**Recommended (pick one):**

| Provider | Why |
| --- | --- |
| [Supabase Storage](https://supabase.com/docs/guides/storage) | Managed S3-compatible storage, generous free tier. |
| [Cloudflare R2](https://cloudflare.com/products/r2) | No egress fees, S3-compatible, free tier 10GB. |
| [AWS S3](https://aws.amazon.com/s3) | The default, mature ecosystem, more setup. |
| [UploadThing](https://uploadthing.com) | Purpose-built for Next.js, file uploads in ~10 lines. |
| [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | Tight Vercel integration, paid from day 1. |

**For avatars on the profile page:** any S3-compatible store (Supabase
Storage, Cloudflare R2) + an `avatars` bucket is the path of least resistance.

---

## Search

The template uses SQL `LIKE` (no search). Fine for the docs and blog.

**When you need real search:**

- [Meilisearch](https://meilisearch.com) — self-hostable, ~fast, free
- [Typesense](https://typesense.com) — similar to Meilisearch, slight edge on UX
- [Algolia](https://algolia.com) — paid, best-in-class, generous free tier
- Postgres FTS — already in your database, surprising quality, no extra infra

**For most Customer Projects, Postgres FTS is enough.** Add a `tsvector`
column + GIN index and you have typo-tolerant search with zero new deps.

---

## Feature flags

Not in the template. The pattern is "ship to production behind a flag, then
toggle on". Recommended:

- [PostHog Feature Flags](https://posthog.com/docs/feature-flags) — if you
  already use PostHog for analytics, you get flags for free.
- [Vercel Edge Config](https://vercel.com/docs/storage/edge-config) — if
  you only need boolean flags readable from edge functions, sub-millisecond.
- [LaunchDarkly](https://launchdarkly.com) — if you need targeting rules
  and A/B testing at scale.
- [Unleash](https://unleash.run) — open-source, self-hostable.

---

## Auth enhancements

The template ships Better Auth with email/password + email verification +
magic link + Google OAuth. Common adds:

| Feature | How |
| --- | --- |
| More OAuth providers (GitHub, Apple, Microsoft) | `socialProviders` in `src/lib/auth.ts` + client ID/secret. ~5 min each. |
| 2FA / TOTP | Better Auth's `twoFactor` plugin + `twoFactorClient`; add UI in `src/app/dashboard/profile`. |
| Passkeys | Better Auth has a `passkey` plugin; add the client plugin and UI. |
| Admin features (roles, ban, impersonate) | Better Auth's `admin` plugin + `adminClient`; re-run `npx @better-auth/cli generate` for the schema, then add UI. |
| Team / org accounts | Out of scope for a solo template. Better Auth's `organization` plugin, or [Clerk Organizations](https://clerk.com/docs/organizations/overview) / [WorkOS](https://workos.com). |
| Session management | Sessions live in the `session` table; add a "sign out everywhere" button with `authClient.revokeSessions()`. |

---

## Email

The template ships Mailgun as the default. **Swapping the provider takes
~30 minutes.** See `src/app/docs/email` → "Swapping the provider". Common
alternatives:

| Provider | Why |
| --- | --- |
| [Resend](https://resend.com) | Modern API, React Email templates, generous free tier (3K/mo). Best DX. |
| [Postmark](https://postmarkapp.com) | Best deliverability reputation, paid from day 1. |
| [AWS SES](https://aws.amazon.com/ses) | Cheapest at scale, more setup, region matters. |
| [SendGrid](https://sendgrid.com) | The 800-lb gorilla, legacy. |
| [Loops](https://loops.so) | Transactional + marketing in one product, indie-friendly. |

The `email_log` table, the brand config, and every template stay
unchanged when you switch.

---

## Multi-region / edge

Not in the template. The DB is in one region; runtime is in another.

**When you need it:** your latency-sensitive endpoint is > 200 ms for some
fraction of users, or you need data-residency for compliance.

**Recommended:** [Vercel Edge Middleware](https://vercel.com/docs/functions/edge-functions)
for routing, [Neon](https://neon.tech) or [Supabase read replicas in the
target region](https://supabase.com/docs/guides/database/read-replicas#regional-read-replicas)
for the data plane. Don't try to make Postgres multi-region writes; the
operational cost is enormous and only justified for very large products.

---

## Testing

The template ships **no tests**. This was a deliberate scope cut for the
indie buyer. For your Customer Project you'll want at least:

| Layer | Tool | Why |
| --- | --- | --- |
| Unit | [Vitest](https://vitest.dev) | Fast, ESM-native, plays well with Next.js. |
| Integration | Vitest + [Testcontainers](https://testcontainers.com) | Spin up a real Postgres in CI. |
| E2E | [Playwright](https://playwright.dev) | The standard. Worth the install cost. |
| Visual | [Chromatic](https://chromatic.com) | If you reuse the design system heavily. |
| Load | [k6](https://k6.io) | Free, scripts in JS, easy CI integration. |

**Minimum bar before going to production:**

- Webhook signature rejection (Stripe, LemonSqueezy, Mailgun)
- Webhook idempotency (duplicate `event_id` returns 200)
- Rate limiter (10 in a row → 429)
- RLS policy smoke (anon can't read other users' rows)

That's ~8 test files, ~300 lines. Add Playwright for the 5 most important
user flows. Stop there.

---

## SEO / marketing

The template ships the boring SEO (sitemap, robots, OG tags, JSON-LD,
metadata API). The interesting stuff you'll want to add:

- **Programmatic SEO pages** if your product has a templated URL pattern
  (e.g. `/compare/linear`, `/integrations/stripe`). See
  [Vercel](https://vercel.com/use-cases/programmatic-seo).
- **A blog with a real content strategy.** The template ships a markdown
  blog; you'll outgrow it when you want drafts, authors, scheduling,
  analytics. See [Keystatic](https://keystatic.com), [Sanity](https://sanity.io),
  or [Contentful](https://contentful.com).
- **Affiliate / referral tracking.** Out of scope for the template —
  use [Rewardful](https://rewardful.com), [Tolt](https://tolt.io), or
  [FirstPromoter](https://firstpromoter.com). They handle postback URLs,
  fraud detection, payouts, and tax forms.

---

## Hosting

[Vercel](https://vercel.com) is the default target and what we test against.
Alternatives:

| Host | Why |
| --- | --- |
| [Vercel](https://vercel.com) | Best Next.js DX, generous free tier, edge runtime. |
| [Cloudflare Pages + Workers](https://pages.cloudflare.com) | Cheapest at scale, edge-native. |
| [Railway](https://railway.app) | If you want a long-lived Node server instead of serverless. |
| [Fly.io](https://fly.io) | Long-lived servers with multi-region. |
| [Self-hosted on a VPS](https://github.com/vercel/next.js/tree/canary/examples/with-docker) | The `Dockerfile` in the repo works. |

The template ships a `Dockerfile` and `docker-compose` for self-hosted
deployments. Tested with the Next.js `standalone` output so the runtime
image is small.

---

## What we will never add

- **Affiliate / referral system** — handled by Rewardful / Tolt / FirstPromoter.
- **Live chat / support widget** — handled by Crisp / Intercom / Plain.
- **A/B testing framework** — handled by PostHog / GrowthBook / Statsig.
- **CMS** — handled by Sanity / Contentful / Keystatic / MDX.
- **Form builder** — handled by Tally / Fillout / Formbricks.
- **Translation / i18n** — solo SaaS in one locale wins. Add when you
  cross $20K MRR and have empirical demand for a second locale.
- **Multi-tenancy / org accounts** — solo SaaS doesn't have orgs. Add
  Clerk Organizations or WorkOS when you do.

Each of these is a SaaS business of its own. Wiring them into a template
adds bloat and obscures the parts that actually need to be customised.
