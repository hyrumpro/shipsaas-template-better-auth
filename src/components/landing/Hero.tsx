import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Hero — Hallmark modern-minimal, Stripe/Linear school.
 * Server component. No glow, no gradient, no glass. Just type, whitespace,
 * hairline border, two CTAs.
 */
export const Hero = () => {
  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-6 rounded-full px-3 py-1">
            <span className="text-muted-foreground text-xs font-medium">
              Next.js 16 SaaS template
            </span>
          </Badge>

          <h1 className="text-display-xl text-balance text-foreground">
            A premium Next.js template for shipping your SaaS faster.
          </h1>

          <p className="text-foreground/70 mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
            Auth, payments, email, and a real dashboard. Production-ready
            code, end-to-end types, and the architecture we wish every
            template shipped with.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href="/auth/register">
                Create an account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/playground">Browse components</Link>
            </Button>
          </div>

          <p className="text-muted-foreground mt-6 text-sm">
            Free to start. No credit card required.
          </p>
        </div>
      </div>

      <div className="border-border border-t" />
    </section>
  );
};
