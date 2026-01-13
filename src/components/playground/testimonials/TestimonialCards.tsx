"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "This product transformed how we build software. The speed and quality improvements are remarkable.",
    author: "Sarah Chen",
    role: "CTO @ TechStartup",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    quote: "Best investment we made this year. ROI was visible within the first month.",
    author: "Michael Rodriguez",
    role: "CEO @ GrowthCo",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    quote: "The support team is incredible. They helped us migrate our entire infrastructure seamlessly.",
    author: "Emily Watson",
    role: "VP Engineering @ DataFlow",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
];

export function TestimonialCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, i) => (
        <motion.div
          key={testimonial.author}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5 }}
          className="p-6 rounded-2xl glass hover:bg-card/80 transition-all"
        >
          <div className="flex gap-1 mb-4">
            {[...Array(testimonial.rating)].map((_, j) => (
              <Star key={j} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="mb-6 text-muted-foreground">"{testimonial.quote}"</p>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={testimonial.avatar} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {testimonial.author[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{testimonial.author}</p>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
