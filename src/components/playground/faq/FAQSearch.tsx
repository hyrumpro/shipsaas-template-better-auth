"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, HelpCircle, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button in the top right corner and follow the registration process. You'll need to verify your email address.",
      },
      {
        q: "Is there a free trial available?",
        a: "Yes! We offer a 14-day free trial with full access to all Pro features. No credit card required.",
      },
    ],
  },
  {
    category: "Billing & Pricing",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for monthly subscriptions.",
      },
      {
        q: "Can I cancel my subscription anytime?",
        a: "Absolutely! You can cancel your subscription at any time from your account settings. No questions asked.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        q: "What are the system requirements?",
        a: "Our platform works on any modern web browser (Chrome, Firefox, Safari, Edge). No installation required.",
      },
      {
        q: "Do you offer API access?",
        a: "Yes, API access is available on Pro and Enterprise plans. Full documentation is provided in your dashboard.",
      },
    ],
  },
];

export const FAQSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10"
        >
          <HelpCircle className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about our platform
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-14 pl-12 text-lg bg-card border-border/50"
        />
      </div>

      {/* FAQ Accordion */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-6">
          {filteredFaqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4 text-primary">
                {category.category}
              </h3>
              <Accordion type="single" collapsible className="space-y-3">
                {category.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${categoryIndex}-${index}`}
                    className="border-0 rounded-xl bg-card border border-border/50 overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 text-left">
                      <span className="font-medium">{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No results found for &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
};
