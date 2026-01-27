"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const metrics = [
  { label: "Revenue", current: 124500, previous: 98200, unit: "$" },
  { label: "Users", current: 8420, previous: 7100, unit: "" },
  { label: "Conversion", current: 3.24, previous: 2.98, unit: "%" },
  { label: "Retention", current: 94.5, previous: 91.2, unit: "%" },
];

export const StatsComparison = () => {
  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const change = calculateChange(metric.current, metric.previous);
        
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="space-y-4">
              {/* Label */}
              <p className="text-sm text-muted-foreground font-medium">
                {metric.label}
              </p>

              {/* Current Value */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">
                  {metric.unit === "$" && metric.unit}
                  {metric.current.toLocaleString()}
                  {metric.unit !== "$" && metric.unit}
                </span>
              </div>

              {/* Comparison */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-sm text-muted-foreground">
                  vs {metric.unit === "$" && metric.unit}
                  {metric.previous.toLocaleString()}
                  {metric.unit !== "$" && metric.unit}
                </span>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    change.isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {change.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {change.value}%
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
