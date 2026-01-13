"use client";

import { motion } from "framer-motion";
import { 
  Mail, 
  CreditCard, 
  Database, 
  Search, 
  Palette, 
  Shield, 
  Zap,
  Globe,
  Code,
  Rocket
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Authentication",
    description: "Supabase Auth with email, Google OAuth, magic links. Protected routes, session management, and user profiles.",
    time: "8 hrs saved",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
  {
    icon: CreditCard,
    title: "Dual Payment Providers",
    description: "Stripe & LemonSqueezy ready to go. Checkout flows, webhooks, subscriptions, and one-time payments configured.",
    time: "12 hrs saved",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
  {
    icon: Database,
    title: "Supabase Backend",
    description: "PostgreSQL with Drizzle ORM, file storage, edge functions, and real-time subscriptions. Fully typed and production-ready.",
    time: "10 hrs saved",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: Mail,
    title: "Email Integration",
    description: "Mailgun configured with DNS setup (DKIM, DMARC, SPF). Beautiful transactional email templates included.",
    time: "6 hrs saved",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description: "Meta tags, OpenGraph, Twitter cards, sitemap, robots.txt, and structured data. Rank higher from day one.",
    time: "4 hrs saved",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    icon: Palette,
    title: "Beautiful UI",
    description: "shadcn/ui components with Tailwind CSS. Dark mode, smooth animations, and fully responsive design out of the box.",
    time: "15 hrs saved",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  {
    icon: Globe,
    title: "Blog & Content",
    description: "MDX blog system with syntax highlighting, reading time, SEO optimization, and beautiful typography.",
    time: "5 hrs saved",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    icon: Code,
    title: "TypeScript",
    description: "100% TypeScript with strict mode. Type-safe database queries, API routes, and components throughout.",
    time: "∞ hrs saved",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: Rocket,
    title: "Docker Ready",
    description: "Production and development Docker configs included. Deploy to any platform with confidence.",
    time: "4 hrs saved",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
  },
  {
    icon: Zap,
    title: "Next.js 16",
    description: "Latest Next.js with App Router, Server Components, Server Actions, and optimized performance.",
    time: "Built-in",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
];

export const EnhancedFeatures = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="features">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Features</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Everything you need to{" "}
            <span className="text-gradient">launch fast</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every essential feature, built with best practices and ready to customize. 
            No more reinventing the wheel—just ship.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className={`h-full p-6 rounded-2xl glass hover:bg-card/80 transition-all duration-300 border ${feature.borderColor} hover:border-primary/30 hover:shadow-elevated`}>
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgColor} ${feature.borderColor} border mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Time saved badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-xs font-semibold text-primary">{feature.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
