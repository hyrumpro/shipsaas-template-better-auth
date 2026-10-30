"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Sparkles,
  Rocket,
  Lock,
  Globe,
  Code2,
  Palette,
  Database,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with Next.js 15 and Turbopack",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Row-level security and webhook verification built-in",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    title: "Beautiful UI",
    description: "20+ production-ready components with theme system",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Rocket,
    title: "Deploy Anywhere",
    description: "Vercel, Railway, Docker - your choice",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Lock,
    title: "Auth Ready",
    description: "Better Auth authentication with protected routes",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Globe,
    title: "SEO Optimized",
    description: "Meta tags, sitemap, and structured data included",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Code2,
    title: "Type Safe",
    description: "Full TypeScript coverage with Drizzle ORM",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Easy Theming",
    description: "Change colors globally with CSS variables",
    color: "from-pink-500 to-purple-500",
  },
  {
    icon: Database,
    title: "Production DB",
    description: "PostgreSQL with proper indexes and RLS policies",
    color: "from-orange-500 to-red-500",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {feature.title}
            </h3>

            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-300 pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
}
