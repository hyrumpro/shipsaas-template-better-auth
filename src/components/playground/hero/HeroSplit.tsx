"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Play } from "lucide-react";

export const HeroSplit = () => {
  const features = ["Authentication Ready", "Stripe Integrated", "Email Templates", "50+ Components"];

  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <Badge className="mb-6 bg-primary/10 text-primary">🚀 Now in v2.0</Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              The fastest way to <span className="text-gradient">launch your SaaS</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Stop wasting time on boilerplate. Get a production-ready codebase.
            </p>
            <ul className="grid grid-cols-2 gap-3 mb-8">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 flex-wrap">
              <Button variant="hero" size="lg">
                Get Started <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="glass" size="lg">
                <Play className="w-5 h-5 mr-2" /> Watch Demo
              </Button>
            </div>
          </div>

          {/* Right visual - Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-2xl bg-card border p-6"
          >
            <div className="space-y-4">
              <div className="h-8 bg-secondary rounded-lg w-3/4" />
              <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-secondary rounded-lg" />
                <div className="h-20 bg-secondary rounded-lg" />
                <div className="h-20 bg-secondary rounded-lg" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
