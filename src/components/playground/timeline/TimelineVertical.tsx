"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const events = [
  {
    title: "Project Kickoff",
    description: "Initial planning and team assembly",
    date: "Jan 15, 2024",
    status: "completed",
  },
  {
    title: "Design Phase",
    description: "UI/UX design and prototyping",
    date: "Feb 1, 2024",
    status: "completed",
  },
  {
    title: "Development Sprint 1",
    description: "Core features implementation",
    date: "Feb 15, 2024",
    status: "in-progress",
  },
  {
    title: "Testing & QA",
    description: "Comprehensive testing phase",
    date: "Mar 1, 2024",
    status: "upcoming",
  },
  {
    title: "Launch",
    description: "Public release and monitoring",
    date: "Mar 15, 2024",
    status: "upcoming",
  },
];

export const TimelineVertical = () => {
  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Vertical line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-8">
        {events.map((event, index) => {
          const Icon =
            event.status === "completed"
              ? CheckCircle2
              : event.status === "in-progress"
              ? Clock
              : Circle;

          const iconColor =
            event.status === "completed"
              ? "text-green-500 bg-green-500/10"
              : event.status === "in-progress"
              ? "text-blue-500 bg-blue-500/10"
              : "text-muted-foreground bg-secondary";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-6"
            >
              {/* Icon */}
              <div className={`relative z-10 w-16 h-16 rounded-2xl ${iconColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-8 h-8" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                  </div>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
