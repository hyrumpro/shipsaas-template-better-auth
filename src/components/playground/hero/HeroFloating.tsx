"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Rocket, Star } from "lucide-react";

const floatingIcons = [
  { icon: Zap, x: "10%", y: "20%", color: "text-amber-400" },
  { icon: Shield, x: "85%", y: "15%", color: "text-green-400" },
  { icon: Rocket, x: "8%", y: "70%", color: "text-blue-400" },
  { icon: Star, x: "90%", y: "65%", color: "text-purple-400" },
];

export const HeroFloating = () => {
  return (
    <section className="relative py-24 md:py-40 overflow-hidden">
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
          className="absolute hidden md:block"
          style={{ left: item.x, top: item.y }}
        >
          <div className="w-14 h-14 rounded-2xl bg-card/80 border border-border/50 flex items-center justify-center">
            <item.icon className={`w-7 h-7 ${item.color}`} />
          </div>
        </motion.div>
      ))}

      <div className="container text-center">
        <h1 className="text-5xl md:text-8xl font-black mb-6">
          Ship faster with <span className="text-gradient">LaunchKit</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Stop reinventing the wheel. Get everything working in minutes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button variant="hero" size="xl">
            Start Building <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" size="xl">View Components</Button>
        </div>
      </div>
    </section>
  );
};
