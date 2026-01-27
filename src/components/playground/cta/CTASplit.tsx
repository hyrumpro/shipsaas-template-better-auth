"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Check, Sparkles } from "lucide-react";

const benefits = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
  "24/7 support",
];

export const CTASplit = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Left side - Content */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Limited Time Offer
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black">
          Ready to transform your workflow?
        </h2>

        <p className="text-xl text-muted-foreground">
          Join thousands of teams already building better products with our platform
        </p>

        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <motion.li
              key={benefit}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-foreground">{benefit}</span>
            </motion.li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl">
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Play className="w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Trusted by 10,000+ companies worldwide
        </p>
      </motion.div>

      {/* Right side - Visual */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
            alt="Dashboard preview"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-card/90 backdrop-blur-xl border border-border/50"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-primary">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-black text-primary">10k+</div>
                <div className="text-xs text-muted-foreground">Users</div>
              </div>
              <div>
                <div className="text-2xl font-black text-primary">4.9★</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
      </motion.div>
    </div>
  );
};
