"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Upload,
  Download,
  Share2,
  FileText,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  {
    icon: Plus,
    label: "New Project",
    description: "Create a new project",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Upload,
    label: "Upload Files",
    description: "Add documents",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    label: "Invite Team",
    description: "Add members",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: FileText,
    label: "New Document",
    description: "Create document",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Share2,
    label: "Share",
    description: "Share with others",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    icon: Download,
    label: "Export Data",
    description: "Download reports",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all text-left group"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-sm mb-1">{action.label}</p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
