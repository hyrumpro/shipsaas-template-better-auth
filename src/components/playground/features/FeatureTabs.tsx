"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Database, Cloud, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    id: "development",
    icon: Code,
    label: "Development",
    title: "Built for Developers",
    description: "Modern tooling and frameworks that developers love",
    benefits: [
      "TypeScript & React support",
      "Hot module replacement",
      "Built-in testing framework",
      "Comprehensive documentation",
    ],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    id: "database",
    icon: Database,
    label: "Database",
    title: "Powerful Data Layer",
    description: "Scalable database solutions with real-time sync",
    benefits: [
      "PostgreSQL & MongoDB support",
      "Real-time subscriptions",
      "Automatic migrations",
      "Built-in caching layer",
    ],
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
  },
  {
    id: "infrastructure",
    icon: Cloud,
    label: "Infrastructure",
    title: "Cloud Native",
    description: "Deploy anywhere with containerized infrastructure",
    benefits: [
      "Docker & Kubernetes ready",
      "Auto-scaling capabilities",
      "Multi-region deployment",
      "99.99% uptime SLA",
    ],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  },
  {
    id: "security",
    icon: Shield,
    label: "Security",
    title: "Enterprise Security",
    description: "Bank-grade security built into every layer",
    benefits: [
      "End-to-end encryption",
      "SOC 2 Type II certified",
      "Regular security audits",
      "DDoS protection included",
    ],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
  },
];

export const FeatureTabs = () => {
  const [activeTab, setActiveTab] = useState(features[0].id);
  const activeFeature = features.find((f) => f.id === activeTab)!;

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-3 justify-center">
        {features.map((feature) => (
          <Button
            key={feature.id}
            variant={activeTab === feature.id ? "default" : "outline"}
            onClick={() => setActiveTab(feature.id)}
            className="gap-2"
          >
            <feature.icon className="w-4 h-4" />
            {feature.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          {/* Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold mb-3">{activeFeature.title}</h3>
              <p className="text-lg text-muted-foreground">
                {activeFeature.description}
              </p>
            </div>

            <ul className="space-y-3">
              {activeFeature.benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <Button size="lg" className="mt-4">
              Learn More
            </Button>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={activeFeature.image}
              alt={activeFeature.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
