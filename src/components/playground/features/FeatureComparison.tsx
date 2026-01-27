"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const features = [
  { name: "Custom Domain", free: true, pro: true, enterprise: true },
  { name: "SSL Certificate", free: true, pro: true, enterprise: true },
  { name: "Team Members", free: "3", pro: "10", enterprise: "Unlimited" },
  { name: "API Access", free: false, pro: true, enterprise: true },
  { name: "Advanced Analytics", free: false, pro: true, enterprise: true },
  { name: "Priority Support", free: false, pro: false, enterprise: true },
  { name: "Custom Integrations", free: false, pro: false, enterprise: true },
  { name: "SLA Guarantee", free: false, pro: false, enterprise: "99.99%" },
  { name: "Dedicated Manager", free: false, pro: false, enterprise: true },
];

const plans = [
  { name: "Free", price: "$0", popular: false },
  { name: "Pro", price: "$29", popular: true },
  { name: "Enterprise", price: "Custom", popular: false },
];

export const FeatureComparison = () => {
  const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="font-semibold text-lg">Features</div>
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center p-4 rounded-2xl ${
                plan.popular
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-card border border-border/50"
              }`}
            >
              {plan.popular && (
                <Badge className="mb-2 bg-primary text-primary-foreground">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
              <p className="text-2xl font-black text-primary mb-3">{plan.price}</p>
              <Button
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
                size="sm"
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Feature Rows */}
        <div className="space-y-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-4 gap-4 items-center p-4 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="font-medium text-foreground">{feature.name}</div>
              <div className="text-center">{renderCell(feature.free)}</div>
              <div className="text-center">{renderCell(feature.pro)}</div>
              <div className="text-center">{renderCell(feature.enterprise)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
