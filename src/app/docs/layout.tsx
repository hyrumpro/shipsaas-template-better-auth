import { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const guides = [
  { href: "/docs/email", title: "Email", desc: "Mailgun + DNS" },
  { href: "/docs/payments", title: "Payments", desc: "Stripe / Lemon Squeezy" },
  { href: "/docs/auth", title: "Authentication", desc: "Magic links + Google" },
  { href: "/docs/database", title: "Database", desc: "Supabase + Drizzle" },
  { href: "/docs/seo", title: "SEO", desc: "Sitemap, robots, JSON-LD" },
  { href: "/docs/styling", title: "Styling", desc: "Themes + dark mode" },
  { href: "/docs/observability", title: "Observability", desc: "PostHog + Sentry" },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-border bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" aria-label="ShipSaaS home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Back to home
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-[14rem_1fr] md:gap-12 md:py-16">
        <aside className="md:sticky md:top-24 md:self-start">
          <p className="eyebrow">Documentation</p>
          <h2 className="mt-2 text-base font-semibold tracking-tight">
            Guides
          </h2>
          <nav aria-label="Docs" className="mt-4 flex flex-col">
            {guides.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="hover:bg-accent -mx-3 flex flex-col gap-0.5 rounded-md px-3 py-2 transition-colors"
              >
                <span className="text-foreground text-sm font-medium">
                  {g.title}
                </span>
                <span className="text-muted-foreground text-xs">
                  {g.desc}
                </span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="prose max-w-none">{children}</main>
      </div>
    </div>
  );
}
