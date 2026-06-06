import { Metadata } from "next";
import Link from "next/link";

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
    desc: "Configure Mailgun with DKIM, DMARC, and SPF so your transactional emails land in the inbox, not spam.",
  },
  {
    href: "/docs/payments",
    title: "Payments",
    time: "25 min",
    desc: "Wire up Stripe or Lemon Squeezy, configure webhook secrets, and test in the sandbox before going live.",
  },
  {
    href: "/docs/auth",
    title: "Authentication",
    time: "20 min",
    desc: "Set up Supabase Auth with magic links and Google OAuth, plus the webhook that syncs new users into your database.",
  },
  {
    href: "/docs/database",
    title: "Database",
    time: "30 min",
    desc: "Run the migrations, understand the row-level security policies, and use Drizzle to query the database with full type safety.",
  },
  {
    href: "/docs/seo",
    title: "SEO",
    time: "10 min",
    desc: "Every page on ShipSaaS ships with proper metadata, an auto-generated sitemap, and structured data.",
  },
  {
    href: "/docs/styling",
    title: "Styling",
    time: "5 min",
    desc: "Pick from 24 theme presets and let dark mode flip automatically based on the user's system preference.",
  },
  {
    href: "/docs/observability",
    title: "Observability",
    time: "10 min",
    desc: "Opt-in PostHog analytics and Sentry error tracking. The shim is a no-op until you install the package and set the env var.",
  },
];

export default function DocsIndex() {
  return (
    <div className="not-prose">
      <p className="eyebrow">Documentation</p>
      <h1 className="text-display mt-2">Set up your stack</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-7">
        Step-by-step guides to get your SaaS from <code>git clone</code> to
        your first paying customer.
      </p>

      <ul className="mt-10 flex flex-col">
        {guides.map((g) => (
          <li key={g.href} className="group">
            <Link
              href={g.href}
              className="hover:bg-accent/40 -mx-4 flex items-baseline justify-between gap-6 rounded-md px-4 py-5 transition-colors"
            >
              <div>
                <h2 className="text-foreground text-lg font-semibold tracking-tight">
                  {g.title}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {g.desc}
                </p>
              </div>
              <span className="text-muted-foreground hidden shrink-0 text-xs tabular-nums sm:inline">
                {g.time}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
