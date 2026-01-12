"use client";

/**
 * Hero with 3D Sphere
 *
 * NOTE: This component requires additional dependencies:
 * npm install three @react-three/fiber @react-three/drei
 *
 * If you don't need 3D effects, use one of the other hero variants.
 */

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero3D = () => {
  return (
    <section className="relative py-20 min-h-[600px]">
      {/* Placeholder for 3D canvas - requires @react-three/fiber installation */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-background">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/20 blur-3xl animate-pulse-glow" />
        </div>
      </div>

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-7xl font-black mb-6">
            Next-gen <span className="text-gradient">SaaS Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Experience the future of web applications
          </p>
          <Button variant="hero" size="xl">
            Get Started <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
