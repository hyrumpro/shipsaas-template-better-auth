import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTA = () => {
  return (
    <section className="border-border border-t">
      <div className="section">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display text-balance">
            Start in minutes, ship in days.
          </h2>
          <p className="text-foreground/70 mt-4 text-base leading-relaxed md:text-lg">
            Clone the repo, fill in your env, run the dev server. You&apos;ll
            have a working SaaS in front of you before the install finishes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href="/auth/register">
                Create an account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/docs">Read the docs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
