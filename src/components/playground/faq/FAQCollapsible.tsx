"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does the pricing work?",
    answer: "We offer flexible pricing plans to suit businesses of all sizes. Start with our free tier and upgrade as you grow. All plans include core features with additional capabilities unlocked at higher tiers.",
  },
  {
    question: "Can I integrate with my existing tools?",
    answer: "Yes! We offer native integrations with 100+ popular tools including Slack, GitHub, Jira, and more. Our REST API also allows you to build custom integrations.",
  },
  {
    question: "What kind of support do you provide?",
    answer: "All users get access to our comprehensive documentation and community forums. Pro users receive email support with 24-hour response time, while Enterprise customers get dedicated support with 1-hour SLA.",
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. We use industry-standard encryption (AES-256), conduct regular security audits, and are SOC 2 Type II certified. Your data is backed up daily and stored in secure, redundant data centers.",
  },
  {
    question: "Can I export my data?",
    answer: "Absolutely! You own your data and can export it at any time in standard formats (CSV, JSON, XML). There are no lock-in periods or export fees.",
  },
];

export const FAQCollapsible = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/50 transition-colors"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-start justify-between p-6 text-left hover:bg-secondary/50 transition-colors"
            >
              <span className="font-semibold text-lg pr-4">{faq.question}</span>
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                {isOpen ? (
                  <Minus className="w-4 h-4 text-primary" />
                ) : (
                  <Plus className="w-4 h-4 text-primary" />
                )}
              </div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                {faq.answer}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
