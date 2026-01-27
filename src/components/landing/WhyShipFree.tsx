"use client";

import { motion } from "framer-motion";
import { Clock, DollarSign, Code, Rocket } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Save 100+ Hours",
    description: "Skip the repetitive setup. Authentication, payments, emails, database, and 27+ UI components are already built and tested.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: DollarSign,
    title: "Lifetime Updates",
    description: "Buy once, get updates forever. New components, features, and improvements added regularly. No recurring fees.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: Code,
    title: "Production Ready",
    description: "Battle-tested code with TypeScript, enterprise security, proper error handling, and comprehensive documentation.",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
  {
    icon: Rocket,
    title: "Deploy Anywhere",
    description: "Vercel, Railway, or Docker - your choice. Complete deployment guides included. Go from purchase to production in under an hour.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
];

export const WhyShipSaaS = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              Why choose{" "}
              <span className="text-gradient">ShipSaaS?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The smartest investment for your next SaaS project. Everything you need, nothing you don&apos;t.
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`h-full p-8 rounded-2xl glass hover:bg-card/80 transition-all duration-300 border ${benefit.borderColor} hover:border-primary/30 hover:shadow-elevated`}>
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${benefit.bgColor} ${benefit.borderColor} border mb-6`}>
                    <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
