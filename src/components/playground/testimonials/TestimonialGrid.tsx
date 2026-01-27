"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "This platform transformed how we build products. The speed and reliability are unmatched.",
    author: "Sarah Chen",
    role: "CTO",
    company: "TechCorp",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    rating: 5,
  },
  {
    quote: "Best investment we've made. ROI was visible within the first month.",
    author: "Michael Rodriguez",
    role: "CEO",
    company: "StartupXYZ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    rating: 5,
  },
  {
    quote: "The support team is incredible. They helped us migrate seamlessly.",
    author: "Emily Watson",
    role: "Product Manager",
    company: "InnovateLabs",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    rating: 5,
  },
  {
    quote: "Game-changing features that actually solve real problems. Highly recommended!",
    author: "David Kim",
    role: "Engineering Lead",
    company: "DevStudio",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    rating: 5,
  },
];

export const TestimonialGrid = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.author}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="h-full border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                    {testimonial.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
