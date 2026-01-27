"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Check, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const tiers = [
  { requests: 1000, price: 0, name: "Starter", color: "from-slate-500 to-slate-600" },
  { requests: 10000, price: 19, name: "Growth", color: "from-blue-500 to-cyan-500" },
  { requests: 50000, price: 49, name: "Pro", color: "from-purple-500 to-pink-500" },
  { requests: 100000, price: 99, name: "Business", color: "from-orange-500 to-red-500" },
  { requests: 500000, price: 249, name: "Enterprise", color: "from-green-500 to-emerald-500" },
];

const features = [
  "Unlimited team members",
  "Advanced analytics",
  "Priority support",
  "Custom integrations",
];

export const PricingSlider = () => {
  const [sliderValue, setSliderValue] = useState([2]);
  const currentTier = tiers[sliderValue[0]];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="overflow-hidden border-2">
        <div className={`h-2 bg-gradient-to-r ${currentTier.color}`} />
        
        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">Pay as you grow</h3>
            <p className="text-muted-foreground">
              Flexible pricing that scales with your business
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={tiers.length - 1}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {tiers.map((tier) => (
                <span key={tier.name}>{tier.name}</span>
              ))}
            </div>
          </div>

          {/* Current Tier Display */}
          <motion.div
            key={currentTier.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${currentTier.color} text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="font-bold text-lg">{currentTier.name}</span>
              </div>
              <TrendingUp className="w-5 h-5" />
            </div>
            
            <div className="mb-2">
              <span className="text-5xl font-black">${currentTier.price}</span>
              <span className="text-xl opacity-90">/month</span>
            </div>
            
            <p className="opacity-90">
              Up to {currentTier.requests.toLocaleString()} API requests
            </p>
          </motion.div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className={`w-full bg-gradient-to-r ${currentTier.color} text-white shadow-lg hover:shadow-xl`}
          >
            Get Started with {currentTier.name}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
