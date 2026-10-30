import {
  CreditCard,
  Database,
  Mail,
  Palette,
  Search,
  Shield,
  Code2,
  Gauge,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Shield,
    title: "Auth & sessions",
    description:
      "Better Auth with email, magic links, and Google. Server-side session handling, protected routes, and a typed user model.",
  },
  {
    icon: CreditCard,
    title: "Stripe & LemonSqueezy",
    description:
      "Unified checkout behind a single switch. Subscriptions, one-time payments, webhooks, and a billing portal that just works.",
  },
  {
    icon: Database,
    title: "Postgres + Drizzle",
    description:
      "Strict types from schema to query. RLS policies that planners hoist, migrations you can read.",
  },
  {
    icon: Mail,
    title: "Transactional email",
    description:
      "Mailgun with DKIM, DMARC, and SPF. Welcome, password reset, payment, and subscription lifecycle templates included.",
  },
  {
    icon: Search,
    title: "SEO baked in",
    description:
      "Per-page metadata, OpenGraph, Twitter cards, sitemap, robots, and JSON-LD structured data on every public route.",
  },
  {
    icon: Palette,
    title: "Theme system",
    description:
      "24 theme presets, light and dark, every value a CSS variable. Switch with a single prop — no rebuilds.",
  },
  {
    icon: Code2,
    title: "TypeScript strict",
    description:
      "strict mode on, end-to-end. No `any` in the public surface, ESLint clean, every prop documented.",
  },
  {
    icon: Lock,
    title: "Hardened by default",
    description:
      "Idempotent webhooks, signature verification, rate limiting, PII redaction, and an opt-in observability shim.",
  },
];

export const Features = () => {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="border-border border-t"
    >
      <div className="section">
        <div className="max-w-2xl">
          <p className="eyebrow">Features</p>
          <h2 id="features-heading" className="text-display mt-3 text-balance">
            The boring infrastructure, handled.
          </h2>
          <p className="text-foreground/70 mt-4 text-base leading-relaxed md:text-lg">
            Every feature ships with real implementation, not a stub. Delete
            what you don&apos;t need; keep what you do.
          </p>
        </div>

        <div
          role="list"
          className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              role="listitem"
              className="hover:bg-accent/40 bg-card group flex flex-col gap-3 p-6 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="border-border bg-background text-foreground group-hover:border-foreground/20 inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors">
                <Icon className="size-4" aria-hidden />
              </div>
              <h3 className="text-foreground text-base font-semibold">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm">
          <Gauge className="text-muted-foreground size-4" aria-hidden />
          <p className="text-muted-foreground">
            Built on Next.js 16, React 19, Tailwind 3, Radix UI, and TanStack
            Query 5.
          </p>
        </div>
      </div>
    </section>
  );
};
