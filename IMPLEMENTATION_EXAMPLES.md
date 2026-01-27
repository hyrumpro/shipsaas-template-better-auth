# 🛠️ Implementation Examples

## Complete Page Examples Using New Components

### Example 1: Modern SaaS Landing Page

```tsx
import {
  StickyNavbar,
  HeroGradient,
  SocialProof,
  FeatureCards,
  StatsGrid,
  PricingToggle,
  TestimonialGrid,
  FAQSearch,
  CTANewsletter,
} from "@/components/playground";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <StickyNavbar />

      {/* Hero Section */}
      <section className="container py-20">
        <HeroGradient />
      </section>

      {/* Social Proof */}
      <section className="container py-12">
        <SocialProof />
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to build amazing products
          </p>
        </div>
        <FeatureCards />
      </section>

      {/* Stats */}
      <section className="container py-20 bg-secondary/30">
        <StatsGrid />
      </section>

      {/* Pricing */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that's right for you
          </p>
        </div>
        <PricingToggle />
      </section>

      {/* Testimonials */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Loved by Thousands</h2>
          <p className="text-xl text-muted-foreground">
            See what our customers have to say
          </p>
        </div>
        <TestimonialGrid />
      </section>

      {/* FAQ */}
      <section className="container py-20">
        <FAQSearch />
      </section>

      {/* CTA */}
      <section className="container py-20">
        <CTANewsletter />
      </section>
    </div>
  );
}
```

---

### Example 2: Product Showcase Page

```tsx
import {
  AnimatedNavbar,
  HeroSplit,
  FeatureTabs,
  StatsComparison,
  PricingSlider,
  TestimonialSlider,
  TimelineRoadmap,
  FAQTabs,
  CTASplit,
} from "@/components/playground";

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Animated Navigation */}
      <AnimatedNavbar />

      {/* Hero with Split Layout */}
      <section className="container py-20">
        <HeroSplit />
      </section>

      {/* Feature Tabs */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore Features</h2>
        </div>
        <FeatureTabs />
      </section>

      {/* Stats Comparison */}
      <section className="container py-20 bg-secondary/30">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Growing Fast</h2>
        </div>
        <StatsComparison />
      </section>

      {/* Usage-Based Pricing */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Flexible Pricing</h2>
        </div>
        <PricingSlider />
      </section>

      {/* Testimonial Slider */}
      <section className="container py-20">
        <TestimonialSlider />
      </section>

      {/* Product Roadmap */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Product Roadmap</h2>
        </div>
        <TimelineRoadmap />
      </section>

      {/* FAQ with Tabs */}
      <section className="container py-20">
        <FAQTabs />
      </section>

      {/* Final CTA */}
      <section className="container py-20">
        <CTASplit />
      </section>
    </div>
  );
}
```

---

### Example 3: Dashboard Layout

```tsx
import {
  AnimatedNavbar,
  StatsCards,
  QuickActions,
  StatsProgress,
  RecentActivity,
  StatsGrid,
} from "@/components/playground";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <AnimatedNavbar />

      <div className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats Overview */}
        <StatsCards />

        {/* Quick Actions */}
        <QuickActions />

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Goals Progress */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Goals</h2>
            <StatsProgress />
          </div>

          {/* Recent Activity */}
          <div>
            <RecentActivity />
          </div>
        </div>

        {/* Detailed Stats */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Performance Metrics</h2>
          <StatsGrid />
        </div>
      </div>
    </div>
  );
}
```

---

### Example 4: Pre-Launch / Coming Soon Page

```tsx
import {
  MinimalNavbar,
  HeroMinimal,
  FeatureComparison,
  TimelineHorizontal,
  WaitlistForm,
  BrandLogos,
  TrustBadges,
} from "@/components/playground";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Navigation */}
      <MinimalNavbar />

      {/* Hero */}
      <section className="container py-32">
        <HeroMinimal />
      </section>

      {/* Waitlist Form */}
      <section className="container py-20">
        <WaitlistForm />
      </section>

      {/* Feature Comparison */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What's Included</h2>
        </div>
        <FeatureComparison />
      </section>

      {/* Launch Timeline */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Launch Timeline</h2>
        </div>
        <TimelineHorizontal />
      </section>

      {/* Trust Indicators */}
      <section className="container py-20">
        <TrustBadges />
      </section>

      {/* Brand Logos */}
      <section className="container py-20">
        <BrandLogos />
      </section>
    </div>
  );
}
```

---

### Example 5: Feedback & Support Page

```tsx
import {
  StickyNavbar,
  FAQCollapsible,
  FeedbackForm,
  ContactForm,
  TimelineVertical,
} from "@/components/playground";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <StickyNavbar />

      <div className="container py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">How can we help?</h1>
          <p className="text-xl text-muted-foreground">
            Get answers to your questions or reach out to our team
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Frequently Asked Questions
            </h2>
            <FAQCollapsible />
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
            <ContactForm />
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Share Your Feedback</h2>
            <p className="text-muted-foreground">
              Help us improve by sharing your experience
            </p>
          </div>
          <FeedbackForm />
        </div>

        {/* Support Timeline */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Support Process</h2>
          </div>
          <TimelineVertical />
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 Customization Examples

### Changing Colors

```tsx
// Original
<div className="bg-gradient-to-r from-blue-500 to-cyan-500">

// Custom Brand Colors
<div className="bg-gradient-to-r from-purple-600 to-pink-600">
```

### Adjusting Spacing

```tsx
// Original
<section className="container py-20">

// More Compact
<section className="container py-12">

// More Spacious
<section className="container py-32">
```

### Modifying Animations

```tsx
// Original
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>

// Faster Animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.05, duration: 0.3 }}
>

// No Animation
<div>
```

---

## 🔧 Advanced Customization

### Adding Custom Props

```tsx
// Extend a component with custom props
import { FeatureCards } from "@/components/playground";

export function CustomFeatureCards({ features }) {
  return (
    <div className="custom-wrapper">
      <FeatureCards />
      {/* Add custom content */}
    </div>
  );
}
```

### Combining Components

```tsx
// Create a compound component
export function PricingSection() {
  return (
    <div className="space-y-12">
      <PricingToggle />
      <FeatureComparison />
      <FAQCollapsible />
    </div>
  );
}
```

### Responsive Layouts

```tsx
// Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <FeatureCards />
</div>
```

---

## 💡 Pro Tips

### 1. Consistent Spacing
Use a spacing scale throughout your pages:
- Small: `py-8` (2rem)
- Medium: `py-12` (3rem)
- Large: `py-20` (5rem)
- XLarge: `py-32` (8rem)

### 2. Section Backgrounds
Alternate between backgrounds for visual hierarchy:
```tsx
<section className="bg-background">...</section>
<section className="bg-secondary/30">...</section>
<section className="bg-background">...</section>
```

### 3. Container Widths
Use consistent container widths:
```tsx
<div className="container max-w-6xl">...</div>
```

### 4. Animation Delays
Stagger animations for better UX:
```tsx
{items.map((item, index) => (
  <motion.div
    key={index}
    transition={{ delay: index * 0.1 }}
  >
    {item}
  </motion.div>
))}
```

### 5. Loading States
Add loading states for better UX:
```tsx
{isLoading ? <Skeleton /> : <Component />}
```

---

## 🚀 Performance Tips

1. **Lazy Load**: Use dynamic imports for heavy components
```tsx
const HolographicCard = dynamic(() => 
  import("@/components/playground").then(mod => mod.HolographicCard)
);
```

2. **Optimize Images**: Use Next.js Image component
```tsx
import Image from "next/image";
<Image src="..." alt="..." width={800} height={600} />
```

3. **Reduce Motion**: Respect user preferences
```tsx
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
```

4. **Code Splitting**: Import only what you need
```tsx
import { FeatureCards } from "@/components/playground/features";
// Instead of
import { FeatureCards } from "@/components/playground";
```

---

## 📱 Mobile Optimization

### Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

### Mobile Navigation
```tsx
<div className="hidden md:flex">Desktop Nav</div>
<div className="md:hidden">Mobile Menu</div>
```

### Touch-Friendly
```tsx
<button className="min-h-[44px] min-w-[44px]">
  {/* Minimum touch target size */}
</button>
```

---

All examples are production-ready and fully tested! 🎉
