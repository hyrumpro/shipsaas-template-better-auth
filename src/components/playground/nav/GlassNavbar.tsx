"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function GlassNavbar() {
  return (
  <motion.nav className="px-6 py-4 rounded-2xl bg-background/30 backdrop-blur-2xl border border-border/30 relative overflow-hidden">
    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <span className="text-primary-foreground font-black text-lg">S</span>
        </div>
        <span className="font-bold text-xl">ShipSaaS</span>
      </div>

      <div className="hidden md:flex items-center gap-1">
        {["Products", "Solutions", "Pricing", "Docs"].map((item) => (
          <Button key={item} variant="ghost" className="hover:bg-white/5 rounded-xl">
            {item}
          </Button>
        ))}
      </div>

      <Button className="rounded-xl bg-gradient-to-r from-primary to-primary/80">
        Get Started
      </Button>
    </div>
  </motion.nav>
  );
}
