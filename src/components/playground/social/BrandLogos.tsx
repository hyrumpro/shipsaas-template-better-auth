"use client";

import { motion } from "framer-motion";

const brands = [
  { name: "Stripe", logo: "https://cdn.brandfetch.io/stripe.com/w/400/h/400" },
  { name: "Vercel", logo: "https://cdn.brandfetch.io/vercel.com/w/400/h/400" },
  { name: "GitHub", logo: "https://cdn.brandfetch.io/github.com/w/400/h/400" },
  { name: "Notion", logo: "https://cdn.brandfetch.io/notion.so/w/400/h/400" },
  { name: "Figma", logo: "https://cdn.brandfetch.io/figma.com/w/400/h/400" },
  { name: "Slack", logo: "https://cdn.brandfetch.io/slack.com/w/400/h/400" },
];

export const BrandLogos = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-medium">
          Trusted by leading companies worldwide
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
        {brands.map((brand, index) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-16 h-16 object-contain"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
