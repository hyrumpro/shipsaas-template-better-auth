"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out",
    features: [
      { name: "Up to 3 projects", included: true },
      { name: "Basic analytics", included: true },
      { name: "Community support", included: true },
      { name: "API access", included: false },
      { name: "Advanced features", included: false },
      { name: "Priority support", included: false },
      { name: "Custom integrations", included: false },
      { name: "Dedicated account manager", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professionals",
    features: [
      { name: "Unlimited projects", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority support", included: true },
      { name: "API access", included: true },
      { name: "Advanced features", included: true },
      { name: "Custom integrations", included: true },
      { name: "Team collaboration", included: false },
      { name: "Dedicated account manager", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For large teams",
    features: [
      { name: "Unlimited everything", included: true },
      { name: "Advanced analytics", included: true },
      { name: "24/7 support", included: true },
      { name: "API access", included: true },
      { name: "Advanced features", included: true },
      { name: "Custom integrations", included: true },
      { name: "Team collaboration", included: true },
      { name: "Dedicated account manager", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingComparison() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl border p-8 ${
              plan.popular
                ? "border-primary shadow-glow bg-card"
                : "border-border/50 bg-card/50"
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                <Sparkles className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {plan.description}
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-black text-gradient">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature.name} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                  )}
                  <span
                    className={
                      feature.included
                        ? "text-foreground"
                        : "text-muted-foreground/70"
                    }
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? "hero" : "outline"}
              className="w-full"
              size="lg"
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
