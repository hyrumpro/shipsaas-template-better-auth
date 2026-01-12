"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2 } from "lucide-react";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <div className="max-w-md mx-auto p-8 rounded-2xl glass">
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
        <p className="text-muted-foreground">Get the latest news and updates</p>
      </div>

      {isSubscribed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="font-semibold">Successfully subscribed!</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" variant="hero">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
};
