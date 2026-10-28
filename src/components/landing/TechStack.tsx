type Item = { name: string; note: string };

const groups: { category: string; items: Item[] }[] = [
  {
    category: "Frontend",
    items: [
      { name: "Next.js 16", note: "App Router, Turbopack, Server Actions" },
      { name: "React 19", note: "Server Components by default" },
      {
        name: "TypeScript",
        note: "strict mode with explicit integration boundaries",
      },
      { name: "Tailwind CSS", note: "CSS-variable tokens, no inline colors" },
      { name: "Radix UI", note: "Headless primitives, fully accessible" },
      { name: "TanStack Query", note: "Server-state cache, devtools in dev" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Supabase", note: "Auth, Postgres, RLS, and session management" },
      { name: "Drizzle ORM", note: "Schema → types → queries" },
      { name: "Next.js Route Handlers", note: "Typed, rate-limited, signed" },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        name: "Stripe",
        note: "Subscriptions, portal, signed retry-safe webhooks",
      },
      {
        name: "LemonSqueezy",
        note: "Alternative provider behind the same plan API",
      },
    ],
  },
  {
    category: "Infra",
    items: [
      {
        name: "Mailgun",
        note: "Transactional email, delivery hooks, DNS checklist",
      },
      { name: "Docker", note: "Dev + production compose files" },
      { name: "PostHog + Sentry", note: "Opt-in shim, no SDK at install" },
    ],
  },
];

export const TechStack = () => {
  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      className="border-border bg-muted/30 border-t"
    >
      <div className="section">
        <div className="max-w-2xl">
          <p className="eyebrow">Stack</p>
          <h2 id="stack-heading" className="text-display mt-3 text-balance">
            Boring, deliberate choices.
          </h2>
          <p className="text-foreground/70 mt-4 text-base leading-relaxed md:text-lg">
            Tools picked for stability and the developer experience. Nothing
            here is a fad.
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {groups.map(({ category, items }) => (
            <div key={category}>
              <dt className="text-foreground text-sm font-semibold tracking-tight">
                {category}
              </dt>
              <dd className="mt-4">
                <ul className="divide-border divide-y">
                  {items.map((item) => (
                    <li
                      key={item.name}
                      className="flex flex-col gap-0.5 py-3 first:pt-0"
                    >
                      <span className="text-foreground text-sm font-medium">
                        {item.name}
                      </span>
                      <span className="text-muted-foreground text-xs leading-relaxed">
                        {item.note}
                      </span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
