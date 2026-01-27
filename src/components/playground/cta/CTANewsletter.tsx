"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, CheckCircle2, Sparkles } from "lucide-react";

export const CTANewsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent p-12">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-2xl mx-auto text-center space-y-6">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm"
        >
          <Mail className="w-8 h-8 text-white" />
        </motion.div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Stay in the loop
          </h2>
          <p className="text-xl text-white/90">
            Get the latest updates, tips, and exclusive content delivered to your inbox
          </p>
        </div>

        {/* Form */}
        {!isSubmitted ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 pl-12 bg-white/95 backdrop-blur-sm border-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-14 px-8 bg-white text-primary hover:bg-white/90 shadow-xl"
            >
              <Send className="w-5 h-5 mr-2" />
              Subscribe
            </Button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/20 backdrop-blur-sm max-w-md mx-auto"
          >
            <CheckCircle2 className="w-6 h-6 text-white" />
            <span className="text-white font-semibold">
              Thanks for subscribing!
            </span>
          </motion.div>
        )}

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>No spam, ever</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
