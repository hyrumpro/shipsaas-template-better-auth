"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ["5 Projects", "Basic Analytics", "Community Support"],
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: ["Unlimited Projects", "Advanced Analytics", "Priority Support", "Custom Domain"],
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: ["Everything in Pro", "SSO", "Dedicated Manager", "SLA Guarantee"],
    popular: false,
  },
];

export function PricingCards() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className="text-sm">Monthly</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className="text-sm">Yearly</span>
        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Save 20%</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`p-6 rounded-2xl ${plan.popular ? "border-2 border-primary shadow-glow" : "glass"}`}>
            {plan.popular && (
              <Badge className="bg-gradient-primary text-primary-foreground mb-4">
                <Star className="w-3 h-3 mr-1" /> Most Popular
              </Badge>
            )}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={isYearly ? "yearly" : "monthly"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-4xl font-black my-4"
              >
                ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                <span className="text-sm text-muted-foreground">/{isYearly ? "year" : "month"}</span>
              </motion.div>
            </AnimatePresence>
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
