"use client";

import { Sparkles, Zap, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnimatedBorder() {
  return (
  <div className="grid md:grid-cols-3 gap-8">
    {/* Rotating Gradient */}
    <div className="relative p-[2px] rounded-2xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-[spin_3s_linear_infinite]" />
      <div className="relative bg-background rounded-2xl p-8">
        <Sparkles className="w-6 h-6 text-primary mb-4" />
        <h3 className="text-xl font-bold mb-2">Rotating Gradient</h3>
        <p className="text-muted-foreground mb-4">Animated border effect</p>
        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500">
          Get Started
        </Button>
      </div>
    </div>

    {/* Glowing Pulse */}
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-red-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 animate-pulse" />
      <div className="relative bg-background rounded-2xl p-8 border border-amber-500/30">
        <Zap className="w-6 h-6 text-amber-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Glowing Pulse</h3>
        <p className="text-muted-foreground mb-4">Pulsing glow effect</p>
        <Button className="w-full bg-gradient-to-r from-amber-500 to-red-500">
          Explore
        </Button>
      </div>
    </div>

    {/* Neon Border */}
    <div className="rounded-2xl p-8 border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] transition-shadow">
      <Rocket className="w-6 h-6 text-cyan-400 mb-4" />
      <h3 className="text-xl font-bold text-cyan-400 mb-2">Neon Glow</h3>
      <p className="text-muted-foreground mb-4">Cyberpunk-style neon</p>
      <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
        Activate
      </Button>
    </div>
  </div>
  );
}
