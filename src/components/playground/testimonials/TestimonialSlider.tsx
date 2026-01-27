"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "The best decision we made for our business. The platform is intuitive, powerful, and the support is outstanding.",
    author: "Alexandra Martinez",
    role: "Founder & CEO",
    company: "GrowthLabs",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexandra",
    rating: 5,
  },
  {
    quote: "We've tried many solutions, but this one stands out. The features are exactly what we needed.",
    author: "James Wilson",
    role: "VP of Engineering",
    company: "TechFlow",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    rating: 5,
  },
  {
    quote: "Incredible value for money. Our team productivity increased by 40% in just two months.",
    author: "Lisa Thompson",
    role: "Operations Director",
    company: "Streamline Inc",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    rating: 5,
  },
];

export const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50">
        {/* Quote decoration */}
        <div className="absolute top-8 left-8 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Quote className="w-8 h-8 text-primary" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Rating */}
            <div className="flex gap-1 justify-center pt-8">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-xl md:text-2xl text-center text-foreground leading-relaxed">
              "{current.quote}"
            </p>

            {/* Author */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={current.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xl">
                  {current.author[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-bold text-lg text-foreground">{current.author}</p>
                <p className="text-muted-foreground">
                  {current.role} at {current.company}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
