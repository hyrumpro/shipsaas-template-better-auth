"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What's included in the template?",
    answer: "Everything you need to launch: Next.js 15, Supabase auth, Stripe & LemonSqueezy payments, 27+ UI components, email system, database with RLS, Docker configs, and comprehensive documentation. It's production-ready code that saves you 100+ hours.",
  },
  {
    question: "Can I use this for client projects?",
    answer: "Absolutely! Once purchased, you have unlimited usage rights. Build unlimited projects for yourself or clients. The only restriction is you can't resell the template itself.",
  },
  {
    question: "How is this different from other templates?",
    answer: "Unique unified payment architecture (switch between Stripe/LemonSqueezy with one variable), enterprise-grade security with RLS, 27+ production-ready components, and exceptional documentation. Most templates lock you into one provider - we give you flexibility.",
  },
  {
    question: "Do I get updates?",
    answer: "Yes! All purchases include lifetime updates. As we add new features, components, and improvements, you'll get them automatically. No subscription required.",
  },
  {
    question: "What if I need help?",
    answer: "You get priority email support for 90 days, plus access to our comprehensive documentation, video tutorials, and community Discord. We're here to help you succeed.",
  },
  {
    question: "Is the code production-ready?",
    answer: "100%. This isn't a demo or proof-of-concept. It's battle-tested code with proper error handling, security measures, and performance optimizations. Deploy to production with confidence.",
  },
  {
    question: "Can I see the components before buying?",
    answer: "Yes! Visit the /playground page to see all 27+ components in action. Try the theme switcher, explore different variants, and see the code quality for yourself.",
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied for any reason, just email us and we'll process a full refund, no questions asked.",
  },
];

export const EnhancedFAQ = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="faq">
      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20"
            >
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">FAQ</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              Got <span className="text-gradient">questions?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Here are answers to the most common questions about ShipSaaS.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass rounded-xl px-6 border-border/50 hover:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
