"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Alex Chen", role: "CEO @ StartupX", content: "Game changer for our team!", rating: 5 },
  { name: "Jordan Lee", role: "CTO @ TechCorp", content: "Incredible performance boost", rating: 5 },
  { name: "Sam Taylor", role: "Product Lead", content: "Best tool we've used", rating: 5 },
  { name: "Casey Morgan", role: "Engineering Manager", content: "Saved us months of work", rating: 5 },
  { name: "Riley Parker", role: "Founder", content: "Absolutely worth it", rating: 5 },
];

export function TestimonialMarquee() {
  return (
  <div className="relative overflow-hidden py-8">
    {/* Gradient masks */}
    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
    
    <motion.div
      className="flex gap-6"
      animate={{ x: [0, -1800] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      {[...testimonials, ...testimonials].map((t, i) => (
        <div key={i} className="flex-shrink-0 w-[350px] p-6 rounded-2xl bg-secondary/50 border border-border/50">
          <div className="flex mb-4">
            {Array.from({ length: t.rating }).map((_, idx) => (
              <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="mb-4">"{t.content}"</p>
          <p className="font-semibold">{t.name}</p>
          <p className="text-sm text-muted-foreground">{t.role}</p>
        </div>
      ))}
    </motion.div>
  </div>
  );
}
