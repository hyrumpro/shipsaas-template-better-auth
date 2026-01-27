"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Award, CheckCircle2 } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "SOC 2 Certified",
    description: "Type II Compliant",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Lock,
    title: "GDPR Ready",
    description: "EU Compliant",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Award,
    title: "ISO 27001",
    description: "Certified Security",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: CheckCircle2,
    title: "99.9% Uptime",
    description: "SLA Guaranteed",
    color: "from-orange-500 to-red-500",
  },
];

export const TrustBadges = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors text-center"
        >
          <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} items-center justify-center mb-3`}>
            <badge.icon className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
          <p className="text-xs text-muted-foreground">{badge.description}</p>
        </motion.div>
      ))}
    </div>
  );
};
