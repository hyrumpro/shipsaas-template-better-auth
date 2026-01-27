"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const roadmapItems = [
  {
    quarter: "Q1 2024",
    status: "completed",
    items: [
      { title: "Mobile App Launch", completed: true },
      { title: "Dark Mode Support", completed: true },
      { title: "API v2.0", completed: true },
    ],
  },
  {
    quarter: "Q2 2024",
    status: "in-progress",
    items: [
      { title: "Team Collaboration", completed: true },
      { title: "Advanced Analytics", completed: false },
      { title: "Webhooks Integration", completed: false },
    ],
  },
  {
    quarter: "Q3 2024",
    status: "planned",
    items: [
      { title: "AI-Powered Insights", completed: false },
      { title: "Custom Workflows", completed: false },
      { title: "Enterprise SSO", completed: false },
    ],
  },
];

export const TimelineRoadmap = () => {
  return (
    <div className="space-y-8">
      {roadmapItems.map((quarter, quarterIndex) => {
        const StatusIcon =
          quarter.status === "completed"
            ? CheckCircle2
            : quarter.status === "in-progress"
            ? Clock
            : Circle;

        const statusColor =
          quarter.status === "completed"
            ? "text-green-500"
            : quarter.status === "in-progress"
            ? "text-blue-500"
            : "text-muted-foreground";

        const badgeVariant =
          quarter.status === "completed"
            ? "default"
            : quarter.status === "in-progress"
            ? "secondary"
            : "outline";

        return (
          <motion.div
            key={quarter.quarter}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: quarterIndex * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <StatusIcon className={`w-6 h-6 ${statusColor}`} />
                <h3 className="text-2xl font-bold">{quarter.quarter}</h3>
              </div>
              <Badge variant={badgeVariant} className="capitalize">
                {quarter.status.replace("-", " ")}
              </Badge>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {quarter.items.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: quarterIndex * 0.1 + itemIndex * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span
                    className={`${
                      item.completed
                        ? "text-muted-foreground line-through"
                        : "text-foreground font-medium"
                    }`}
                  >
                    {item.title}
                  </span>
                  {!item.completed && quarter.status === "in-progress" && (
                    <Sparkles className="w-4 h-4 text-primary ml-auto" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
