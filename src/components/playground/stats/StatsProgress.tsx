"use client";

import { motion } from "framer-motion";
import { Target, Users, Zap, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const goals = [
  {
    label: "Monthly Revenue Goal",
    current: 87500,
    target: 100000,
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-500",
  },
  {
    label: "User Acquisition",
    current: 8420,
    target: 10000,
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  {
    label: "Feature Completion",
    current: 23,
    target: 30,
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
  },
  {
    label: "Customer Satisfaction",
    current: 4.7,
    target: 5.0,
    icon: TrendingUp,
    color: "text-orange-500",
    bgColor: "bg-orange-500",
  },
];

export const StatsProgress = () => {
  return (
    <div className="space-y-6">
      {goals.map((goal, index) => {
        const percentage = (goal.current / goal.target) * 100;
        
        return (
          <motion.div
            key={goal.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${goal.bgColor}/10 flex items-center justify-center`}>
                  <goal.icon className={`w-5 h-5 ${goal.color}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{goal.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                  </p>
                </div>
              </div>
              <span className={`text-2xl font-bold ${goal.color}`}>
                {percentage.toFixed(0)}%
              </span>
            </div>

            <Progress value={percentage} className="h-3" />
          </motion.div>
        );
      })}
    </div>
  );
};
