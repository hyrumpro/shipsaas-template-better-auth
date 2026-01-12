"use client";

import { motion } from "framer-motion";
import { Sparkles, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const cards = [
  {
    title: "Premium",
    icon: Star,
    gradient: "from-purple-500 to-pink-500",
    features: ["Advanced features", "Priority support", "Custom branding"],
  },
  {
    title: "Enterprise",
    icon: Crown,
    gradient: "from-amber-500 to-orange-500",
    features: ["Unlimited everything", "Dedicated manager", "SLA guarantee"],
  },
];

export const GlassCard = () => (
  <div className="grid md:grid-cols-2 gap-8">
    {cards.map((card, i) => (
      <motion.div
        key={card.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="relative group"
      >
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity`} />
        <div className="relative glass-strong rounded-3xl p-8 border-2 border-border/50 group-hover:border-primary/50 transition-all">
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${card.gradient}`} />
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6`}>
            <card.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            {card.title} <Sparkles className="w-5 h-5 text-yellow-500" />
          </h3>
          <ul className="space-y-3 mb-6">
            {card.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <Button className={`w-full bg-gradient-to-r ${card.gradient} text-white`}>
            Upgrade Now
          </Button>
        </div>
      </motion.div>
    ))}
  </div>
);
