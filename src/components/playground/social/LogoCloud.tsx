"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "Vercel", width: "w-24" },
  { name: "Next.js", width: "w-28" },
  { name: "Stripe", width: "w-20" },
  { name: "Supabase", width: "w-32" },
  { name: "Tailwind", width: "w-28" },
  { name: "TypeScript", width: "w-32" },
];

export function LogoCloud() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
          Trusted by developers at leading companies
        </p>
      </motion.div>

      <div className="relative overflow-hidden">
        <div className="flex gap-12 items-center justify-center flex-wrap">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="group"
            >
              <div
                className={`${logo.width} h-12 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300 border border-border/50 group-hover:border-primary/50`}
              >
                {logo.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated marquee version */}
      <div className="mt-16 relative overflow-hidden">
        <div className="flex gap-12 animate-marquee">
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className={`${logo.width} h-12 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center font-bold text-muted-foreground/70 border border-border/30 shrink-0`}
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
