"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingCart, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.4%",
    trend: "down",
    icon: ShoppingCart,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Active Sessions",
    value: "573",
    change: "+12.5%",
    trend: "up",
    icon: Activity,
    color: "from-orange-500 to-red-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
