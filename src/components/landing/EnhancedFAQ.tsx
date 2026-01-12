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
    question: "Is ShipFree really free?",
    answer: "Yes! ShipFree is 100% free and open-source under the MIT license. You can use it for personal projects, commercial projects, client work - anything. No hidden costs, no subscriptions.",
  },
  {
    question: "What tech stack does this use?",
    answer: "ShipFree is built with Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase (PostgreSQL + Auth), Drizzle ORM, Stripe & LemonSqueezy for payments, and Mailgun for emails.",
  },
  {
    question: "Can I use this for client projects?",
    answer: "Absolutely! The MIT license allows you to use ShipFree for unlimited personal and commercial projects, including client work. You can even white-label it.",
  },
  {
    question: "How do payments work?",
    answer: "ShipFree includes both Stripe and LemonSqueezy integrations. You get pre-configured checkout sessions, webhook handling for subscription events, and customer portal integration. Just add your API keys and you're ready to accept payments.",
  },
  {
    question: "Is Supabase required?",
    answer: "Yes, Supabase powers the authentication, database, and edge functions. It's free to start and scales with your needs. We chose Supabase for its excellent developer experience and PostgreSQL foundation.",
  },
  {
    question: "Do I get the source code?",
    answer: "Yes! You get complete access to all source code. Clone it, modify it, make it yours. No obfuscation, no locked components. It's truly open-source.",
  },
  {
    question: "What about support?",
    answer: "ShipFree is community-supported. You can get help via GitHub Issues, Discussions, and our Discord community. The codebase is well-documented to help you get started quickly.",
  },
  {
    question: "How do I deploy this?",
    answer: "ShipFree includes Docker configurations for easy deployment. You can deploy to Vercel, Railway, Fly.io, or any platform that supports Next.js. Full deployment guides are included in the documentation.",
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
              Here are answers to the most common questions about ShipFree.
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
