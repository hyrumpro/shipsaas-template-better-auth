"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What payment providers are supported?",
    answer:
      "We support both Stripe and LemonSqueezy out of the box. You can switch between them with a single environment variable, or run both simultaneously. The unified architecture makes it easy to add more providers.",
  },
  {
    question: "Is the database schema production-ready?",
    answer:
      "Absolutely! The database includes proper indexes, Row Level Security policies, foreign key constraints, and automatic triggers. It's designed to handle 100K+ users with excellent performance.",
  },
  {
    question: "Can I customize the theme colors?",
    answer:
      "Yes! All components use CSS variables for theming. You can change your entire app's color scheme by modifying a single variable in globals.css, or use the built-in theme switcher with 8 preset themes.",
  },
  {
    question: "How do I deploy to production?",
    answer:
      "We provide three deployment options: Vercel (easiest, 5 minutes), Railway (balanced, 10 minutes), or Docker (full control, self-hosted). Complete deployment guides are included for each option.",
  },
  {
    question: "Is authentication included?",
    answer:
      "Yes! Supabase authentication is fully integrated with email/password, OAuth providers (Google, GitHub, etc.), protected routes, and automatic session management. All webhook handlers are configured.",
  },
  {
    question: "What about email sending?",
    answer:
      "Mailgun integration is included with 6 pre-built email templates (welcome, verification, payment success, etc.). The system gracefully degrades in development mode for easy testing.",
  },
  {
    question: "Can I add more components?",
    answer:
      "Definitely! All components follow consistent patterns and are well-documented. The modular architecture makes it easy to add your own components while maintaining the theme system.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied for any reason, just send us an email and we'll process a full refund, no questions asked.",
  },
];

export function FAQAccordion() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          Frequently Asked <span className="text-gradient">Questions</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Everything you need to know about the template
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/50 rounded-xl px-6 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-lg">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-12 text-center p-8 rounded-2xl bg-muted/30 border border-border/50"
      >
        <p className="text-muted-foreground mb-4">Still have questions?</p>
        <p className="font-medium">
          Contact us at{" "}
          <a
            href="mailto:support@yourapp.com"
            className="text-primary hover:underline"
          >
            support@yourapp.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}
