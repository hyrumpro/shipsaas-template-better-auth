"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Premium",
    monthlyPrice: 29,
    yearlyPrice: 29,
    features: ["Unlimited Projects", "Advanced Analytics", "Priority Support", "Custom Domain", "Lifetime Access"],
    popular: true,
  },
];

export function PricingCards() {
  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-12">
        <Badge className="bg-primary/20 text-primary border-primary/30">One-Time Payment</Badge>
      </div>

      <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className={`p-6 rounded-2xl ${plan.popular ? "border-2 border-primary shadow-glow" : "glass"}`}>
            {plan.popular && (
              <Badge className="bg-gradient-primary text-primary-foreground mb-4">
                <Star className="w-3 h-3 mr-1" /> Most Popular
              </Badge>
            )}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <div className="text-4xl font-black my-4">
              ${plan.monthlyPrice}
              <span className="text-sm text-muted-foreground"> one-time</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant={plan.popular ? "hero" : "outline"} className="w-full">
              Get Started
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
