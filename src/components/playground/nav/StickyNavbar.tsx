"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";

const navItems = [
  { label: "Features", hasDropdown: true },
  { label: "Pricing", hasDropdown: false },
  { label: "Resources", hasDropdown: true },
  { label: "Company", hasDropdown: false },
];

export const StickyNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">StickyNav</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="gap-1 hover:bg-secondary/80"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
              </Button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost">Sign In</Button>
            <Button
              variant="default"
              className="bg-gradient-to-r from-primary to-primary/80 shadow-glow"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  {item.label}
                </Button>
              ))}
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
