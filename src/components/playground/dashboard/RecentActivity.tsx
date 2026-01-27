"use client";

import { motion } from "framer-motion";
import { FileText, UserPlus, DollarSign, Settings, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    icon: FileText,
    title: "New document created",
    description: "Project proposal v2.0",
    user: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    time: "2 minutes ago",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: UserPlus,
    title: "Team member added",
    description: "Michael joined the team",
    user: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    time: "15 minutes ago",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: DollarSign,
    title: "Payment received",
    description: "$2,500 from Acme Corp",
    user: "System",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system",
    time: "1 hour ago",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Settings,
    title: "Settings updated",
    description: "Security preferences changed",
    user: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    time: "3 hours ago",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback className="text-xs">
                    {activity.user[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {activity.user} • {activity.time}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};
