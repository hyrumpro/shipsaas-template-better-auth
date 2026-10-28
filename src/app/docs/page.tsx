import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import {
  Mail,
  CreditCard,
  KeyRound,
  Database,
  Search,
  Palette,
  Activity,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Set up your ShipSaaS template: email (Mailgun), payments (Stripe / Lemon Squeezy), authentication, database, SEO, styling, and observability.",
};

const guides = [
  {
    href: "/docs/email",
    title: "Email",
    time: "15 min",
    icon: Mail,
    desc: "Configure Mailgun with DKIM, DMARC, and SPF so your transactional emails land in the inbox, not spam.",
  },
  {
    href: "/docs/payments",
    title: "Payments",
    time: "25 min",
    icon: CreditCard,
    desc: "Wire up Stripe or Lemon Squeezy, configure webhook secrets, and test in the sandbox before going live.",
  },
  {
    href: "/docs/auth",
    title: "Authentication",
    time: "20 min",
    icon: KeyRound,
    desc: "Set up Supabase Auth with magic links and Google OAuth, plus the webhook that syncs new users into your database.",
  },
  {
    href: "/docs/database",
    title: "Database",
    time: "30 min",
    icon: Database,
    desc: "Run the migrations, understand the row-level security policies, and use Drizzle to query the database with full type safety.",
  },
  {
    href: "/docs/seo",
    title: "SEO",
    time: "10 min",
    icon: Search,
    desc: "Every page on ShipSaaS ships with proper metadata, an auto-generated sitemap, and structured data.",
  },
  {
    href: "/docs/styling",
    title: "Styling",
    time: "5 min",
    icon: Palette,
    desc: "Pick from 24 theme presets and let dark mode flip automatically based on the user's system preference.",
  },
  {
    href: "/docs/observability",
    title: "Observability",
    time: "10 min",
    icon: Activity,
    desc: "Opt-in PostHog analytics and Sentry error tracking. The shim is a no-op until you install the package and set the env var.",
  },
];

export default function DocsIndex() {
  return (
    <div className="not-prose">
      <p className="eyebrow">Documentation</p>
      <h1 className="text-display mt-2">Set up your stack</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-7">
        Step-by-step guides to get your SaaS from <code>git clone</code> to your
        first paying customer.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="hover:bg-accent/40 group border-border bg-card flex flex-col gap-3 rounded-lg border p-5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="border-border bg-background text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md border">
                <g.icon className="size-4" aria-hidden />
              </span>
              <span className="text-muted-foreground flex items-center gap-1 text-xs tabular-nums">
                <Clock className="size-3.5" aria-hidden />
                {g.time}
              </span>
            </div>
            <div>
              <h2 className="text-foreground flex items-center gap-1.5 text-base font-semibold tracking-tight">
                {g.title}
                <ArrowRight className="text-muted-foreground group-hover:text-foreground size-4 transition-all group-hover:translate-x-0.5" />
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {g.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
