"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Sparkles, CheckCircle2 } from "lucide-react";

export const WaitlistForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "" });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold">You're on the list!</h3>
        <p className="text-muted-foreground">
          We'll notify you when we launch. Check your email for confirmation.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-8 rounded-2xl bg-card border border-border/50 space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 items-center justify-center">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold">Join the Waitlist</h3>
        <p className="text-muted-foreground">
          Be the first to know when we launch
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Join Waitlist
        </Button>
      </form>

      {/* Trust indicator */}
      <p className="text-center text-sm text-muted-foreground">
        🎉 Join 5,000+ people already on the waitlist
      </p>
    </motion.div>
  );
};
