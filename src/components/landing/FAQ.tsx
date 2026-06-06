import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What does the template include?",
    a: "A Next.js 16 app with Supabase auth, Stripe and LemonSqueezy payments behind a unified switch, Mailgun email, a real dashboard, a blog, a docs site, and a 55-component playground. All wired up, all typed.",
  },
  {
    q: "Do I need to use the same providers?",
    a: "No. Supabase, Stripe, and Mailgun are the defaults because they cover the most ground with the least ceremony, but every integration is in a single module. Swap any of them without rewriting the app.",
  },
  {
    q: "Is the code production-ready?",
    a: "It runs in production. The template has lazy-initialized server clients, idempotent webhooks, rate limiting, PII redaction, and a hardened middleware. The CI runs lint, typecheck, and build with no environment variables set.",
  },
  {
    q: "What about subscriptions and the billing portal?",
    a: "Subscriptions are modeled in the database with the correct status fields. Stripe's hosted billing portal is one POST away. LemonSqueezy uses its own customer portal. Refunds and cancellations are handled.",
  },
  {
    q: "How is the codebase organized?",
    a: "App Router with server components by default, a thin client layer for the few things that need state, Drizzle for the database, and helpers in src/db/queries.ts so retries are safe. AGENTS.md documents the conventions.",
  },
  {
    q: "Can I deploy this for free?",
    a: "Yes. Vercel, Netlify, and Cloudflare Pages all work. The repo ships with Docker compose for self-hosting if you prefer.",
  },
  {
    q: "How do I add observability?",
    a: "Set NEXT_PUBLIC_POSTHOG_KEY for analytics or SENTRY_DSN for errors, then npm install the matching package. The observability shim is a no-op until both are present. See /docs/observability.",
  },
  {
    q: "What about theming?",
    a: "Every color is a CSS variable on :root. There are 24 presets and dark mode is automatic. Switch themes from the navbar — no rebuild.",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-border border-t"
    >
      <div className="section-sm">
        <div className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-heading" className="text-display mt-3 text-balance">
            Questions, answered.
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-12 w-full">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-border border-b last:border-b-0"
            >
              <AccordionTrigger className="text-foreground hover:no-underline py-5 text-left text-base font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/75 pb-5 text-sm leading-relaxed md:text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
