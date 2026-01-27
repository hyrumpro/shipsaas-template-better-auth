"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for trying out",
    features: [
      "5 Projects",
      "Basic Analytics",
      "Community Support",
      "1GB Storage",
    ],
    popular: false,
    gradient: "from-slate-500 to-slate-600",
  },
  {
    name: "Pro",
    icon: Star,
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "For growing teams",
    features: [
      "Unlimited Projects",
      "Advanced Analytics",
      "Priority Support",
      "50GB Storage",
      "Custom Domain",
      "API Access",
    ],
    popular: true,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Enterprise",
    icon: Crown,
    monthlyPrice: 99,
    yearlyPrice: 990,
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Dedicated Manager",
      "SSO & SAML",
      "Unlimited Storage",
      "SLA Guarantee",
      "Custom Integrations",
      "Advanced Security",
    ],
    popular: false,
    gradient: "from-purple-500 to-pink-500",
  },
];

export const PricingToggle = () => {
  const [isYearly, setIsYearly] = useState(true);
  const savings = 20;

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={!isYearly ? "font-semibold" : "text-muted-foreground"}>
          Monthly
        </span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={isYearly ? "font-semibold" : "text-muted-foreground"}>
          Yearly
        </span>
        {isYearly && (
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            Save {savings}%
          </Badge>
        )}
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <Badge className={`bg-gradient-to-r ${plan.gradient} text-white border-0 shadow-lg`}>
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <Card
              className={`relative overflow-hidden ${
                plan.popular
                  ? "border-2 border-primary shadow-2xl"
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${plan.gradient}`} />
              )}

              <CardContent className="p-6 space-y-6">
                {/* Icon & Name */}
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isYearly ? "yearly" : "monthly"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black">
                          ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-muted-foreground">
                          /{isYearly ? "year" : "month"}
                        </span>
                      </div>
                      {isYearly && plan.monthlyPrice > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          ${(plan.yearlyPrice / 12).toFixed(0)}/month billed annually
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-xl`
                      : ""
                  }`}
                  size="lg"
                >
                  {plan.monthlyPrice === 0 ? "Start Free" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
