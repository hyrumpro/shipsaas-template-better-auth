"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { TrendingUp, Users, Zap, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    label: "Active Users",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    value: 99.9,
    suffix: "%",
    label: "Uptime",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "User Rating",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: TrendingUp,
    value: 150,
    suffix: "%",
    label: "Growth Rate",
    color: "from-purple-500 to-pink-500",
  },
];

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const formatted = latest.toFixed(value % 1 !== 0 ? 1 : 0);
        (ref.current as HTMLSpanElement).textContent = formatted;
      }
    });

    return () => unsubscribe();
  }, [springValue, value]);

  return (
    <span className="inline-flex items-baseline">
      <span ref={ref} className="tabular-nums">
        0
      </span>
      <span>{suffix}</span>
    </span>
  );
}

export function StatCounter() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              <div className="text-4xl font-black mb-2 text-gradient">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>

              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
