"use client";

import { motion } from "framer-motion";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Auth, checkout, emails, a dashboard — all wired and type-safe from day one. I deleted more placeholder code than I wrote.",
    name: "Maya R.",
    role: "Indie founder",
  },
  {
    quote:
      "The webhook handling is the part that impressed me. Signed, retry-safe, and idempotent — every provider nailed.",
    name: "Diego S.",
    role: "Full-stack engineer",
  },
  {
    quote:
      "Swapped from Stripe to LemonSqueezy behind one environment flag. That single switch saved me a weekend of yak-shaving.",
    name: "Priya K.",
    role: "Product developer",
  },
];

/**
 * Quiet testimonial cards. No marquee, no loud branding — just three
 * cards that rise in on scroll. `prefers-reduced-motion` honored globally.
 */
export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="border-border border-t"
    >
      <div className="section">
        <div className="max-w-2xl">
          <p className="eyebrow">Why developers pick it</p>
          <h2
            id="testimonials-heading"
            className="text-display mt-3 text-balance"
          >
            Built for the part everyone dreads.
          </h2>
          <p className="text-foreground/70 mt-4 text-base leading-relaxed md:text-lg">
            The integrations, the mistakes we&apos;ve already made, the
            &ldquo;oh, I forgot about that&rdquo; problems — solved so you can
            focus on your product.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border-border bg-card flex flex-col justify-between rounded-lg border p-6"
            >
              <blockquote className="text-foreground/85 text-sm leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="bg-foreground text-background inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <span>
                  <span className="text-foreground block text-sm font-medium">
                    {t.name}
                  </span>
                  <span className="text-muted-foreground block text-xs">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
