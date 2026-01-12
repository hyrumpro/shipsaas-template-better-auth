"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play } from "lucide-react";

export const HeroGradient = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-500/10" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Launching Soon</span>
        </motion.div>

        <h1 className="text-4xl md:text-7xl font-black mb-6">
          Build your next <span className="text-gradient">unicorn startup</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          The ultimate SaaS boilerplate with everything you need to launch fast.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button variant="hero" size="xl">
            Get Started <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="glass" size="xl">
            <Play className="w-5 h-5 mr-2" /> Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
