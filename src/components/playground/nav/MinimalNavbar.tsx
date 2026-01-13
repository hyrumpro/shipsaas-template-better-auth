"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MinimalNavbar() {
  return (
  <nav className="flex items-center justify-between py-6">
    <div className="font-black text-xl">
      ShipSaaS<span className="text-primary">.</span>
    </div>

    <div className="hidden md:flex items-center gap-8">
      {["Work", "About", "Services", "Blog"].map(item => (
        <a key={item} href="#" className="relative group">
          <span className="text-foreground hover:text-primary transition-colors">{item}</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
        </a>
      ))}
    </div>

    <Button variant="ghost" className="gap-2 group">
      Let's Talk
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Button>
  </nav>
  );
}
