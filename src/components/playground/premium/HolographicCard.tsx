"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wifi, Shield } from "lucide-react";

export const HolographicCard = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="w-96 h-56 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
          style={{
            rotateX: isHovered ? (mousePosition.y - 0.5) * 20 : 0,
            rotateY: isHovered ? (mousePosition.x - 0.5) * -20 : 0,
            transformStyle: "preserve-3d",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Card background */}
          <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Holographic overlay */}
            <motion.div
              className="absolute inset-0 opacity-60"
              style={{
                background: `linear-gradient(${mousePosition.x * 360}deg, 
                  rgba(255,0,150,0.3), 
                  rgba(0,255,255,0.3), 
                  rgba(255,255,0,0.3))`,
              }}
            />

            {/* Card content */}
            <div className="relative p-6 h-full flex flex-col justify-between text-white">
              {/* Top section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-sm tracking-wider">PREMIUM</span>
                </div>
                <div className="flex gap-2">
                  <Wifi className="w-5 h-5 opacity-80" />
                  <Shield className="w-5 h-5 opacity-80" />
                </div>
              </div>

              {/* Card number */}
              <div className="font-mono text-xl tracking-[0.3em]">
                •••• •••• •••• 4242
              </div>

              {/* Bottom section */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-70 mb-1">CARDHOLDER</p>
                  <p className="font-semibold">JOHN DOE</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70 mb-1">EXPIRES</p>
                  <p className="font-semibold">12/28</p>
                </div>
              </div>
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                transform: `translateX(${mousePosition.x * 100 - 50}%)`,
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
