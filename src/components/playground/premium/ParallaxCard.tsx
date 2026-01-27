"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const ParallaxCard = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (e.clientY - rect.top - centerY) / 10;
    const rotateY = (centerX - (e.clientX - rect.left)) / 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-80 cursor-pointer"
      >
        <Card className="overflow-hidden shadow-2xl border-border/50">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
              alt="Premium feature"
              className="w-full h-full object-cover"
              style={{
                transform: "translateZ(20px) scale(1.1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-violet-600/80 to-transparent" />
            
            {/* Floating badge */}
            <motion.div
              style={{ transform: "translateZ(40px)" }}
              className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
            >
              <span className="text-xs font-semibold text-white">NEW</span>
            </motion.div>
          </div>

          {/* Content */}
          <CardContent className="p-6 space-y-4" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h3 className="text-xl font-bold">3D Parallax Effect</h3>
            </div>
            
            <p className="text-muted-foreground">
              Move your mouse to experience the depth and dimension of this premium card design.
            </p>

            <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              Explore Features
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
