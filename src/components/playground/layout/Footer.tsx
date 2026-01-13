"use client";

import Link from "next/link";
import { Zap, Twitter, Github, Linkedin } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Docs"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy", "Terms", "Security"],
};

export function Footer() {
  return (
  <footer className="border-t border-border/50 py-12">
    <div className="container px-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ShipSaaS</span>
          </Link>
          <p className="text-sm text-muted-foreground mb-4">
            Ship your SaaS faster with our production-ready template.
          </p>
          <div className="flex gap-3">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-semibold mb-4">{title}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p>© 2024 ShipSaaS. All rights reserved.</p>
      </div>
    </div>
  </footer>
  );
}
