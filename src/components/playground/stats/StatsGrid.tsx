"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Total Revenue",
    value: "$2.4M",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    label: "Active Users",
    value: "12,543",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    label: "Conversion Rate",
    value: "3.24%",
    change: "+0.4%",
    trend: "up",
    icon: TrendingUp,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    label: "Avg. Session",
    value: "4m 32s",
    change: "+1.2%",
    trend: "up",
    icon: Activity,
    gradient: "from-orange-500 to-red-500",
  },
];

export const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
            
            <CardContent className="p-6 space-y-4">
              {/* Icon */}
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-sm font-semibold ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.change}
                </div>
              </div>

              {/* Value */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
