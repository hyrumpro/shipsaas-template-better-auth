"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Github, BookOpen } from "lucide-react";
import Link from "next/link";

export const EnhancedCTA = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-glow opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary shadow-glow mb-8"
          >
            <Rocket className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          
          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
          >
            Ready to ship{" "}
            <span className="text-gradient">faster?</span>
          </motion.h2>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Stop wasting time on boilerplate. Start building what matters. 
            Join developers who've accelerated their workflow with ShipFree.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="https://github.com/yourusername/shipfree" target="_blank">
              <Button variant="hero" size="xl">
                <Github className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="glass" size="xl">
                <BookOpen className="w-5 h-5" />
                Read Documentation
              </Button>
            </Link>
          </motion.div>
          
          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              100% Free & Open Source
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              MIT License
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              No Vendor Lock-in
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
