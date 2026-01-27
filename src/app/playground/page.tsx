"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSwitcher } from "@/components/playground/ui/ThemeSwitcher";
import Link from "next/link";
import {
  HeroGradient,
  HeroFloating,
  HeroSplit,
  HeroMinimal,
  Hero3D,
} from "@/components/playground/hero";
import { 
  GlassNavbar, 
  MinimalNavbar, 
  StickyNavbar, 
  AnimatedNavbar 
} from "@/components/playground/nav";
import { 
  PricingCards, 
  PricingComparison, 
  PricingToggle, 
  PricingSlider 
} from "@/components/playground/pricing";
import { 
  TestimonialCards, 
  TestimonialMarquee, 
  TestimonialGrid, 
  TestimonialSlider 
} from "@/components/playground/testimonials";
import { 
  ContactForm, 
  NewsletterForm, 
  WaitlistForm, 
  FeedbackForm 
} from "@/components/playground/forms";
import { 
  StatsCards, 
  ActivityFeed, 
  QuickActions, 
  RecentActivity 
} from "@/components/playground/dashboard";
import { 
  AnimatedBorder, 
  GlassCard, 
  ParallaxCard, 
  HolographicCard 
} from "@/components/playground/premium";
import { 
  FeatureGrid, 
  FeatureCards, 
  FeatureComparison, 
  FeatureTabs 
} from "@/components/playground/features";
import { 
  CTAGradient, 
  CTAMinimal, 
  CTANewsletter, 
  CTASplit 
} from "@/components/playground/cta";
import { 
  FAQAccordion, 
  FAQSearch, 
  FAQTabs, 
  FAQCollapsible 
} from "@/components/playground/faq";
import { 
  LogoCloud, 
  TrustBadges, 
  BrandLogos, 
  SocialProof 
} from "@/components/playground/social";
import { 
  StatCounter, 
  StatsProgress, 
  StatsGrid, 
  StatsComparison 
} from "@/components/playground/stats";
import { 
  Timeline, 
  TimelineVertical, 
  TimelineHorizontal, 
  TimelineRoadmap 
} from "@/components/playground/timeline";
import { Sparkles, Code2, Palette, Zap, Layout, ArrowRight } from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Component Playground</h1>
                <p className="text-xs text-muted-foreground">56+ Production-Ready Components</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Home
              </Link>
            </Button>
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
            Copy, paste, and customize 56+ premium components. All themeable with a single color change.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50">
              <Layout className="w-5 h-5 text-primary" />
              <span className="font-medium">56+ Components</span>
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
            <div className="overflow-x-auto pb-4">
              <TabsList className="inline-flex w-auto min-w-full justify-start gap-2 mb-12 flex-wrap">
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="cta">CTA</TabsTrigger>
                <TabsTrigger value="testimonials">Reviews</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="forms">Forms</TabsTrigger>
                <TabsTrigger value="nav">Nav</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
              </TabsList>
            </div>

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

              <ComponentPreview title="Sticky Navbar" description="Sticky header with scroll effects and mobile menu">
                <div className="max-w-4xl mx-auto">
                  <StickyNavbar />
                </div>
              </ComponentPreview>

              <ComponentPreview title="Animated Navbar" description="Animated tab indicator with smooth transitions">
                <div className="max-w-4xl mx-auto">
                  <AnimatedNavbar />
                </div>
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="features" className="space-y-12">
              <ComponentPreview title="Feature Grid" description="Animated feature showcase with icons and hover effects">
                <FeatureGrid />
              </ComponentPreview>

              <ComponentPreview title="Feature Cards" description="Hover effects with gradient accents">
                <FeatureCards />
              </ComponentPreview>

              <ComponentPreview title="Feature Comparison" description="Side-by-side plan comparison table">
                <FeatureComparison />
              </ComponentPreview>

              <ComponentPreview title="Feature Tabs" description="Tabbed interface with images and benefits">
                <FeatureTabs />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-12">
              <ComponentPreview title="Pricing Cards" description="Monthly/yearly toggle with animated prices">
                <PricingCards />
              </ComponentPreview>

              <ComponentPreview title="Pricing Comparison" description="Feature comparison table with checkmarks">
                <PricingComparison />
              </ComponentPreview>

              <ComponentPreview title="Pricing Toggle" description="Enhanced pricing cards with icons and gradients">
                <PricingToggle />
              </ComponentPreview>

              <ComponentPreview title="Pricing Slider" description="Usage-based pricing with interactive slider">
                <PricingSlider />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="cta" className="space-y-12">
              <ComponentPreview title="Gradient CTA" description="Eye-catching gradient background with animated elements">
                <CTAGradient />
              </ComponentPreview>

              <ComponentPreview title="Minimal CTA" description="Clean, conversion-focused call-to-action">
                <CTAMinimal />
              </ComponentPreview>

              <ComponentPreview title="Newsletter CTA" description="Email subscription with animated background">
                <CTANewsletter />
              </ComponentPreview>

              <ComponentPreview title="Split CTA" description="Split layout with benefits and visual">
                <CTASplit />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="faq" className="space-y-12">
              <ComponentPreview title="FAQ Accordion" description="Expandable questions with smooth animations">
                <FAQAccordion />
              </ComponentPreview>

              <ComponentPreview title="FAQ Search" description="Searchable FAQ with categories">
                <FAQSearch />
              </ComponentPreview>

              <ComponentPreview title="FAQ Tabs" description="Tabbed FAQ by category">
                <FAQTabs />
              </ComponentPreview>

              <ComponentPreview title="FAQ Collapsible" description="Simple collapsible with plus/minus icons">
                <FAQCollapsible />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="stats" className="space-y-12">
              <ComponentPreview title="Animated Counters" description="Number counters with smooth animations">
                <StatCounter />
              </ComponentPreview>

              <ComponentPreview title="Stats Progress" description="Progress bars with goals and percentages">
                <StatsProgress />
              </ComponentPreview>

              <ComponentPreview title="Stats Grid" description="Metric cards with icons and trend indicators">
                <StatsGrid />
              </ComponentPreview>

              <ComponentPreview title="Stats Comparison" description="Current vs previous period comparison">
                <StatsComparison />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="social" className="space-y-12">
              <ComponentPreview title="Logo Cloud" description="Animated customer/partner logos with marquee">
                <LogoCloud />
              </ComponentPreview>

              <ComponentPreview title="Trust Badges" description="Security and compliance badges">
                <TrustBadges />
              </ComponentPreview>

              <ComponentPreview title="Brand Logos" description="Grayscale logos with hover color effect">
                <BrandLogos />
              </ComponentPreview>

              <ComponentPreview title="Social Proof" description="Stats with icons (users, ratings, awards)">
                <SocialProof />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-12">
              <ComponentPreview title="Basic Timeline" description="Simple timeline component">
                <Timeline />
              </ComponentPreview>

              <ComponentPreview title="Vertical Timeline" description="Vertical timeline with status icons and cards">
                <TimelineVertical />
              </ComponentPreview>

              <ComponentPreview title="Horizontal Timeline" description="Horizontal roadmap with quarterly milestones">
                <TimelineHorizontal />
              </ComponentPreview>

              <ComponentPreview title="Roadmap Timeline" description="Detailed roadmap with completed/planned items">
                <TimelineRoadmap />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-12">
              <ComponentPreview title="Testimonial Cards" description="Customer reviews with star ratings">
                <TestimonialCards />
              </ComponentPreview>

              <ComponentPreview title="Testimonial Marquee" description="Auto-scrolling testimonials">
                <TestimonialMarquee />
              </ComponentPreview>

              <ComponentPreview title="Testimonial Grid" description="Grid layout with quote cards">
                <TestimonialGrid />
              </ComponentPreview>

              <ComponentPreview title="Testimonial Slider" description="Carousel with navigation dots and arrows">
                <TestimonialSlider />
              </ComponentPreview>
            </TabsContent>

            <TabsContent value="forms" className="space-y-12">
              <ComponentPreview title="Contact Form" description="Animated form with validation">
                <ContactForm />
              </ComponentPreview>

              <ComponentPreview title="Newsletter Form" description="Email subscription with success state">
                <NewsletterForm />
              </ComponentPreview>

              <ComponentPreview title="Waitlist Form" description="Waitlist signup with success state and counter">
                <WaitlistForm />
              </ComponentPreview>

              <ComponentPreview title="Feedback Form" description="Rating and feedback collection with emoji ratings">
                <FeedbackForm />
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

              <ComponentPreview title="Quick Actions" description="Grid of quick action buttons with icons">
                <QuickActions />
              </ComponentPreview>

              <ComponentPreview title="Recent Activity" description="Activity feed with avatars and timestamps">
                <div className="max-w-2xl mx-auto">
                  <RecentActivity />
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

              <ComponentPreview title="Parallax Card" description="3D parallax hover effect with mouse tracking">
                <ParallaxCard />
              </ComponentPreview>

              <ComponentPreview title="Holographic Card" description="Holographic credit card with shine effect">
                <HolographicCard />
              </ComponentPreview>
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
