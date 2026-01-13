"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";

const activities = [
  {
    user: "Sarah Chen",
    action: "completed a task",
    time: "2 minutes ago",
    type: "success",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    user: "Michael Rodriguez",
    action: "reported an issue",
    time: "15 minutes ago",
    type: "error",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    user: "Emily Watson",
    action: "updated the documentation",
    time: "1 hour ago",
    type: "info",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    user: "James Wilson",
    action: "needs review",
    time: "2 hours ago",
    type: "warning",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
];

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, i) => {
          const Icon = iconMap[activity.type as keyof typeof iconMap];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={activity.avatar} />
                <AvatarFallback>{activity.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <Icon className={`w-5 h-5 ${colorMap[activity.type as keyof typeof colorMap]}`} />
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
