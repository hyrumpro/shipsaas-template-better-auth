"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const HeroMinimal = () => {
  return (
    <section className="py-32 md:py-48">
      <div className="container text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-8xl font-black tracking-tight mb-8"
        >
          Build products
          <br />
          <span className="text-gradient">people love</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground mb-12"
        >
          A minimal, elegant approach to SaaS design.
        </motion.p>

        <Button variant="hero" size="xl" className="text-lg px-12">
          Start Building <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
};
