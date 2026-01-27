"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Rocket, Globe, Lock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with edge computing and CDN delivery",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption with SOC 2 Type II compliance",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Rocket,
    title: "Rapid Deployment",
    description: "Deploy in seconds with one-click infrastructure setup",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Distributed across 200+ edge locations worldwide",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "GDPR compliant with zero-knowledge architecture",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Sparkles,
    title: "AI Powered",
    description: "Smart automation with machine learning insights",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <Card className="relative overflow-hidden group cursor-pointer border-border/50 hover:border-primary/50 transition-colors">
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
            
            <CardContent className="p-6 space-y-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover indicator */}
              <motion.div
                className={`h-1 rounded-full bg-gradient-to-r ${feature.gradient}`}
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
