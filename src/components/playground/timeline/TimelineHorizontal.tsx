"use client";

import { motion } from "framer-motion";
import { Rocket, Code, TestTube, Sparkles } from "lucide-react";

const milestones = [
  {
    icon: Rocket,
    title: "Launch",
    date: "Q1 2024",
    description: "Initial release",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Code,
    title: "API v2",
    date: "Q2 2024",
    description: "Enhanced API",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: TestTube,
    title: "Beta Features",
    date: "Q3 2024",
    description: "New capabilities",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Sparkles,
    title: "AI Integration",
    date: "Q4 2024",
    description: "Smart automation",
    gradient: "from-orange-500 to-red-500",
  },
];

export const TimelineHorizontal = () => {
  return (
    <div className="relative">
      {/* Horizontal line */}
      <div className="absolute top-12 left-0 right-0 h-0.5 bg-border hidden md:block" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative text-center"
          >
            {/* Icon */}
            <div className="relative z-10 inline-flex w-24 h-24 rounded-2xl bg-gradient-to-br ${milestone.gradient} items-center justify-center mb-4 shadow-lg">
              <milestone.icon className="w-12 h-12 text-white" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{milestone.title}</h3>
              <p className="text-sm text-primary font-semibold">{milestone.date}</p>
              <p className="text-sm text-muted-foreground">{milestone.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
