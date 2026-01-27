"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Smile, Meh, Frown, Send, CheckCircle2 } from "lucide-react";

const ratings = [
  { icon: Frown, label: "Poor", value: 1, color: "text-red-500" },
  { icon: Meh, label: "Okay", value: 2, color: "text-yellow-500" },
  { icon: Smile, label: "Great", value: 3, color: "text-green-500" },
];

export const FeedbackForm = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedRating(null);
      setFeedback("");
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto p-8 rounded-2xl bg-card border border-border/50 text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold">Thank you!</h3>
        <p className="text-muted-foreground">
          Your feedback helps us improve our product.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8 rounded-2xl bg-card border border-border/50 space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">How was your experience?</h3>
        <p className="text-muted-foreground">
          We'd love to hear your thoughts
        </p>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <Label>Your Rating</Label>
        <div className="flex gap-4 justify-center">
          {ratings.map((rating) => (
            <motion.button
              key={rating.value}
              type="button"
              onClick={() => setSelectedRating(rating.value)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                selectedRating === rating.value
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/50"
              }`}
            >
              <rating.icon className={`w-8 h-8 ${rating.color}`} />
              <span className="text-sm font-medium">{rating.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="space-y-2">
        <Label htmlFor="feedback">Additional Comments (Optional)</Label>
        <Textarea
          id="feedback"
          placeholder="Tell us more about your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!selectedRating}
        className="w-full"
        size="lg"
      >
        <Send className="w-5 h-5 mr-2" />
        Submit Feedback
      </Button>
    </motion.form>
  );
};
