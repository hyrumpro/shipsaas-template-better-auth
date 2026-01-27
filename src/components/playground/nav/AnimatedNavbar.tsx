"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Home, Layers, Users, Settings } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "#" },
  { icon: Layers, label: "Products", href: "#" },
  { icon: Users, label: "Team", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
];

export const AnimatedNavbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <nav className="relative">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl">AnimateNav</span>
        </motion.div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-2 relative">
          {navItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => setActiveIndex(index)}
              className={`relative px-4 py-2 rounded-xl transition-colors ${
                activeIndex === index
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </div>
              {activeIndex === index && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* CTA */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl">
            Launch App
          </Button>
        </motion.div>
      </div>

      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </nav>
  );
};
