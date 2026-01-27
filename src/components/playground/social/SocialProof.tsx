"use client";

import { motion } from "framer-motion";
import { Star, Users, Award, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "User Rating",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Award,
    value: "15+",
    label: "Industry Awards",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime SLA",
    gradient: "from-green-500 to-emerald-500",
  },
];

export const SocialProof = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="text-center space-y-3"
        >
          <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} items-center justify-center`}>
            <stat.icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-3xl font-black text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
