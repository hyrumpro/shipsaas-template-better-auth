import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FAQ } from "@/components/landing/FAQ";
import { pricingPlans } from "@/config/payments";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for ShipSaaS. One plan, all features, lifetime access. Free to start, no credit card required.",
};

const formatPrice = (cents: number, currency: string) => {
  if (cents === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
};

export default function PricingPage() {
  const plans = pricingPlans;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main>
        <section className="border-border border-b">
          <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-16 md:pt-40 md:pb-20">
            <div className="max-w-3xl">
              <p className="eyebrow">Pricing</p>
              <h1 className="text-display-xl text-balance text-foreground mt-4">
                Simple pricing. No surprises.
              </h1>
              <p className="text-foreground/70 mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
                One plan with everything you need to ship a real SaaS.
                Free to start — upgrade when you outgrow the free tier.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="card-quiet flex flex-col">
                <h2 className="text-foreground text-lg font-semibold tracking-tight">
                  Free
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  Try the template and build your first project.
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-foreground text-4xl font-semibold tracking-tight">
                    $0
                  </span>
                  <span className="text-muted-foreground text-sm">
                    /forever
                  </span>
                </div>
                <ul className="mt-8 space-y-3 text-sm">
                  {[
                    "Full source code",
                    "Local development setup",
                    "Documentation and examples",
                    "Community support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/register">Get started</Link>
                  </Button>
                </div>
              </div>

              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="card-quiet relative flex flex-col"
                >
                  {plan.popular && (
                    <Badge
                      variant="default"
                      className="absolute -top-2 right-6 rounded-full"
                    >
                      Most popular
                    </Badge>
                  )}
                  <h2 className="text-foreground text-lg font-semibold tracking-tight">
                    {plan.name}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {plan.description}
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-foreground text-4xl font-semibold tracking-tight">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /{plan.interval}
                    </span>
                  </div>
                  <ul className="mt-8 space-y-3 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="text-foreground mt-0.5 size-4 shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <Button asChild className="w-full">
                      <Link href={`/auth/register?plan=${plan.id}`}>
                        Choose {plan.name}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground text-sm">
                Need a custom plan or have questions?{" "}
                <Link
                  href="mailto:hello@shipsaas.dev"
                  className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                >
                  Get in touch
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
