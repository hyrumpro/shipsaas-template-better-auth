"use client";

import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";

const milestones = [
  {
    title: "Project Kickoff",
    description: "Initial setup and configuration complete",
    date: "Day 1",
    status: "completed",
  },
  {
    title: "Authentication Setup",
    description: "Better Auth integrated with protected routes",
    date: "Day 2",
    status: "completed",
  },
  {
    title: "Payment Integration",
    description: "Stripe and LemonSqueezy webhooks configured",
    date: "Day 3",
    status: "completed",
  },
  {
    title: "UI Components",
    description: "Building beautiful, themeable components",
    date: "Day 4",
    status: "in-progress",
  },
  {
    title: "Testing & QA",
    description: "Comprehensive testing across all features",
    date: "Day 5",
    status: "upcoming",
  },
  {
    title: "Launch",
    description: "Deploy to production and go live",
    date: "Day 6",
    status: "upcoming",
  },
];

export function Timeline() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-6"
            >
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    milestone.status === "completed"
                      ? "bg-primary border-primary"
                      : milestone.status === "in-progress"
                      ? "bg-accent border-accent animate-pulse"
                      : "bg-muted border-border"
                  }`}
                >
                  {milestone.status === "completed" ? (
                    <Check className="w-6 h-6 text-primary-foreground" />
                  ) : (
                    <Circle
                      className={`w-6 h-6 ${
                        milestone.status === "in-progress"
                          ? "text-accent-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{milestone.title}</h3>
                    <span className="text-sm text-muted-foreground font-medium">
                      {milestone.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
