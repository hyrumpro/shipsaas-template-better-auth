"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSwitcher } from "@/components/playground/ui/ThemeSwitcher";
import {
  HeroGradient,
  HeroFloating,
  HeroSplit,
  HeroMinimal,
  Hero3D,
} from "@/components/playground/hero";
import { GlassNavbar, MinimalNavbar } from "@/components/playground/nav";
import { PricingCards } from "@/components/playground/pricing";
import { TestimonialCards, TestimonialMarquee } from "@/components/playground/testimonials";
import { ContactForm, NewsletterForm } from "@/components/playground/forms";
import { StatsCards, ActivityFeed } from "@/components/playground/dashboard";
import { AnimatedBorder, GlassCard } from "@/components/playground/premium";
import { Footer } from "@/components/playground/layout";
import { Sparkles, Code2, Palette, Zap, Layout, ArrowRight } from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Component Playground</h1>
              <p className="text-xs text-muted-foreground">20+ Production-Ready Components</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Button variant="hero" size="sm">
              <Code2 className="w-4 h-4 mr-2" />
              View Docs
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Ready to Use</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Build Beautiful Pages <span className="text-gradient">in Minutes</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Copy, paste, and customize 20+ premium components. All themeable with a single color change.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50">
              <Layout className="w-5 h-5 text-primary" />
              <span className="font-medium">20+ Components</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50">
              <Palette className="w-5 h-5 text-primary" />
              <span className="font-medium">8 Color Themes</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-medium">Fully Responsive</span>
            </div>
          </div>

          <Button variant="hero" size="lg" className="gap-2">
            Try Theme Switcher <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4">
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 lg:grid-cols-8 mb-12">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="nav">Nav</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="testimonials">Reviews</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-12">
              <ComponentPreview title="Gradient Hero" description="Animated gradient mesh background">
                <HeroGradient />
              </ComponentPreview>

              <ComponentPreview title="Floating Icons" description="3D floating icons animation">
                <HeroFloating />
              </ComponentPreview>

              <ComponentPreview title="Split Layout" description="Text + visual preview side by side">
                <HeroSplit />
              </ComponentPreview>

              <ComponentPreview title="Minimal" description="Clean, typography-focused design">
                <HeroMinimal />
              </ComponentPreview>

              <ComponentPreview title="3D Effect" description="Placeholder for 3D sphere (requires additional deps)">
                <Hero3D />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="nav" className="space-y-12">
              <ComponentPreview title="Glass Navbar" description="Apple-style frosted glass navigation">
                <div className="max-w-4xl mx-auto">
                  <GlassNavbar />
                </div>
              </ComponentPreview>

              <ComponentPreview title="Minimal Navbar" description="Clean navigation with animated underlines">
                <div className="max-w-4xl mx-auto">
                  <MinimalNavbar />
                </div>
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-12">
              <ComponentPreview title="Pricing Cards" description="Monthly/yearly toggle with animated prices">
                <PricingCards />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-12">
              <ComponentPreview title="Testimonial Cards" description="Customer reviews with star ratings">
                <TestimonialCards />
              </ComponentPreview>

              <ComponentPreview title="Testimonial Marquee" description="Auto-scrolling testimonials">
                <TestimonialMarquee />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="forms" className="space-y-12">
              <ComponentPreview title="Contact Form" description="Animated form with validation">
                <ContactForm />
              </ComponentPreview>

              <ComponentPreview title="Newsletter Form" description="Email subscription with success state">
                <NewsletterForm />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-12">
              <ComponentPreview title="Stats Cards" description="Dashboard metrics with trends">
                <StatsCards />
              </ComponentPreview>

              <ComponentPreview title="Activity Feed" description="Real-time activity timeline">
                <div className="max-w-2xl mx-auto">
                  <ActivityFeed />
                </div>
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="premium" className="space-y-12">
              <ComponentPreview title="Animated Borders" description="Cards with animated gradient borders">
                <AnimatedBorder />
              </ComponentPreview>

              <ComponentPreview title="Glass Cards" description="Premium frosted glass effect cards">
                <GlassCard />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="theme" className="space-y-8">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Easy Theme Customization</h2>
                <p className="text-muted-foreground mb-8">
                  All components use CSS variables for theming. Change colors globally with a single update.
                </p>

                <div className="p-8 rounded-2xl bg-card border border-border/50 text-left">
                  <h3 className="text-xl font-bold mb-4">Three Ways to Customize:</h3>

                  <div className="space-y-6">
                    <div>
                      <Badge className="mb-2">Option 1: Use Theme Switcher</Badge>
                      <p className="text-sm text-muted-foreground">
                        Click the palette icon in the header and choose from 8 predefined themes.
                      </p>
                    </div>

                    <div>
                      <Badge className="mb-2">Option 2: Modify globals.css</Badge>
                      <pre className="mt-2 p-4 rounded-lg bg-secondary text-sm overflow-x-auto">
{`:root {
  --primary: 35 100% 55%;  /* Change this */
  --accent: 35 100% 55%;
}`}
                      </pre>
                    </div>

                    <div>
                      <Badge className="mb-2">Option 3: Use Theme Config</Badge>
                      <pre className="mt-2 p-4 rounded-lg bg-secondary text-sm overflow-x-auto">
{`import { applyTheme, THEME_PRESETS } from '@/config/theme';
applyTheme(THEME_PRESETS.blue);`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Documentation Link */}
      <section className="py-20">
        <div className="container px-4 text-center">
          <div className="max-w-3xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-background to-accent/10 border border-primary/20">
            <h2 className="text-3xl font-bold mb-4">
              All Components Ready to Use
            </h2>
            <p className="text-muted-foreground mb-8">
              Hero sections, pricing tables, testimonials, forms, dashboards, and premium effects.
              All code is production-ready and fully themeable.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="hero" size="lg">
                <Code2 className="w-5 h-5 mr-2" />
                View Theme Guide
              </Button>
              <Button variant="outline" size="lg">
                Browse Components
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ComponentPreview({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/30 p-8 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
