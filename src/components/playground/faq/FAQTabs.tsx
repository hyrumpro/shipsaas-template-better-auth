"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, CreditCard, Code, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categories = [
  {
    id: "general",
    icon: Rocket,
    label: "General",
    faqs: [
      {
        q: "What makes your platform different?",
        a: "We combine ease of use with powerful features, backed by world-class support and a thriving community.",
      },
      {
        q: "How quickly can I get started?",
        a: "Most users are up and running within 5 minutes. Our onboarding process is designed to be quick and intuitive.",
      },
    ],
  },
  {
    id: "billing",
    icon: CreditCard,
    label: "Billing",
    faqs: [
      {
        q: "What's your refund policy?",
        a: "We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment, no questions asked.",
      },
      {
        q: "Can I change plans later?",
        a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
      },
    ],
  },
  {
    id: "technical",
    icon: Code,
    label: "Technical",
    faqs: [
      {
        q: "Do you provide API documentation?",
        a: "Yes, comprehensive API documentation is available for all Pro and Enterprise users in the developer portal.",
      },
      {
        q: "What's your uptime guarantee?",
        a: "We guarantee 99.9% uptime with our Enterprise plan, backed by SLA and automatic failover systems.",
      },
    ],
  },
  {
    id: "security",
    icon: Shield,
    label: "Security",
    faqs: [
      {
        q: "How do you protect my data?",
        a: "We use AES-256 encryption, regular security audits, and are SOC 2 Type II certified.",
      },
      {
        q: "Do you support SSO?",
        a: "Yes, Single Sign-On (SSO) via SAML is available on Enterprise plans.",
      },
    ],
  },
];

export const FAQTabs = () => {
  const [activeTab, setActiveTab] = useState(categories[0].id);
  const activeCategory = categories.find((c) => c.id === activeTab)!;

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeTab === category.id ? "default" : "outline"}
            onClick={() => setActiveTab(category.id)}
            className="gap-2"
          >
            <category.icon className="w-4 h-4" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* FAQ Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {activeCategory.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="border-0 rounded-xl bg-card border border-border/50 overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 text-left">
                  <span className="font-medium text-foreground">{faq.q}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
};
