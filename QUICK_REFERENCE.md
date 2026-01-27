# 🚀 Quick Reference Guide

## Component Import Cheat Sheet

### Hero (5 components)
```tsx
import { 
  HeroGradient,      // Animated gradient mesh
  HeroFloating,      // 3D floating icons
  HeroSplit,         // Split layout
  HeroMinimal,       // Typography-focused
  Hero3D             // Interactive 3D sphere
} from "@/components/playground/hero";
```

### Navigation (4 components)
```tsx
import { 
  GlassNavbar,       // Frosted glass
  MinimalNavbar,     // Animated underlines
  StickyNavbar,      // Scroll effects ⭐
  AnimatedNavbar     // Tab indicators ⭐
} from "@/components/playground/nav";
```

### Features (4 components)
```tsx
import { 
  FeatureGrid,       // Icon grid
  FeatureCards,      // Gradient hover ⭐
  FeatureComparison, // Comparison table ⭐
  FeatureTabs        // Tabbed interface ⭐
} from "@/components/playground/features";
```

### Pricing (4 components)
```tsx
import { 
  PricingCards,      // Monthly/yearly toggle
  PricingComparison, // Feature comparison
  PricingToggle,     // Enhanced cards ⭐
  PricingSlider      // Usage-based ⭐
} from "@/components/playground/pricing";
```

### CTA (4 components)
```tsx
import { 
  CTAGradient,       // Gradient background
  CTAMinimal,        // Clean design
  CTANewsletter,     // Email subscription ⭐
  CTASplit           // Split layout ⭐
} from "@/components/playground/cta";
```

### Testimonials (4 components)
```tsx
import { 
  TestimonialCards,   // Star ratings
  TestimonialMarquee, // Auto-scroll
  TestimonialGrid,    // Grid layout ⭐
  TestimonialSlider   // Carousel ⭐
} from "@/components/playground/testimonials";
```

### FAQ (4 components)
```tsx
import { 
  FAQAccordion,      // Basic accordion
  FAQSearch,         // Searchable ⭐
  FAQTabs,           // Category tabs ⭐
  FAQCollapsible     // Plus/minus icons ⭐
} from "@/components/playground/faq";
```

### Stats (4 components)
```tsx
import { 
  StatCounter,       // Animated counters
  StatsProgress,     // Progress bars ⭐
  StatsGrid,         // Metric cards ⭐
  StatsComparison    // Period comparison ⭐
} from "@/components/playground/stats";
```

### Social (4 components)
```tsx
import { 
  LogoCloud,         // Brand logos
  TrustBadges,       // Security badges ⭐
  BrandLogos,        // Grayscale hover ⭐
  SocialProof        // Stats with icons ⭐
} from "@/components/playground/social";
```

### Timeline (4 components)
```tsx
import { 
  Timeline,          // Basic timeline
  TimelineVertical,  // Status icons ⭐
  TimelineHorizontal,// Horizontal roadmap ⭐
  TimelineRoadmap    // Quarterly roadmap ⭐
} from "@/components/playground/timeline";
```

### Forms (4 components)
```tsx
import { 
  ContactForm,       // Contact form
  NewsletterForm,    // Email subscription
  WaitlistForm,      // Waitlist signup ⭐
  FeedbackForm       // Rating & feedback ⭐
} from "@/components/playground/forms";
```

### Dashboard (4 components)
```tsx
import { 
  StatsCards,        // Metric cards
  ActivityFeed,      // Activity timeline
  QuickActions,      // Action buttons ⭐
  RecentActivity     // Activity feed ⭐
} from "@/components/playground/dashboard";
```

### Premium (4 components)
```tsx
import { 
  AnimatedBorder,    // Gradient borders
  GlassCard,         // Glow effects
  ParallaxCard,      // 3D parallax ⭐
  HolographicCard    // Holographic effect ⭐
} from "@/components/playground/premium";
```

---

## 🎨 Color Gradients

```tsx
// Blue to Cyan
className="bg-gradient-to-r from-blue-500 to-cyan-500"

// Purple to Pink
className="bg-gradient-to-r from-purple-500 to-pink-500"

// Green to Emerald
className="bg-gradient-to-r from-green-500 to-emerald-500"

// Orange to Red
className="bg-gradient-to-r from-orange-500 to-red-500"

// Amber to Yellow
className="bg-gradient-to-r from-amber-500 to-yellow-500"

// Indigo to Violet
className="bg-gradient-to-r from-indigo-500 to-violet-500"
```

---

## 📐 Common Layouts

### Landing Page
```tsx
<StickyNavbar />
<HeroGradient />
<SocialProof />
<FeatureCards />
<StatsGrid />
<PricingToggle />
<TestimonialGrid />
<FAQSearch />
<CTANewsletter />
```

### Product Page
```tsx
<AnimatedNavbar />
<HeroSplit />
<FeatureTabs />
<StatsComparison />
<PricingSlider />
<TestimonialSlider />
<TimelineRoadmap />
<FAQTabs />
<CTASplit />
```

### Dashboard
```tsx
<AnimatedNavbar />
<StatsCards />
<QuickActions />
<StatsProgress />
<RecentActivity />
```

---

## 🎯 Quick Tips

### Spacing
```tsx
py-8   // Small (2rem)
py-12  // Medium (3rem)
py-20  // Large (5rem)
py-32  // XLarge (8rem)
```

### Containers
```tsx
<div className="container">           // Default
<div className="container max-w-6xl"> // Constrained
```

### Backgrounds
```tsx
bg-background      // Default
bg-secondary/30    // Subtle
bg-card           // Card background
```

### Borders
```tsx
border border-border/50        // Subtle
border-2 border-primary        // Accent
rounded-xl                     // Medium
rounded-2xl                    // Large
```

---

## ⚡ Performance

### Lazy Load Heavy Components
```tsx
const HolographicCard = dynamic(() => 
  import("@/components/playground").then(m => m.HolographicCard)
);
```

### Optimize Images
```tsx
import Image from "next/image";
<Image src="..." alt="..." width={800} height={600} />
```

---

## 🎨 Customization

### Change Colors
```tsx
// Original
<div className="from-blue-500 to-cyan-500">

// Custom
<div className="from-purple-600 to-pink-600">
```

### Adjust Spacing
```tsx
// Original
<section className="py-20">

// Custom
<section className="py-12">  // Compact
<section className="py-32">  // Spacious
```

### Modify Animations
```tsx
// Original
transition={{ delay: 0.1 }}

// Custom
transition={{ delay: 0.05, duration: 0.3 }}
```

---

## 📱 Responsive

### Grid
```tsx
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

### Flex
```tsx
flex flex-col md:flex-row
```

### Visibility
```tsx
hidden md:block    // Hide on mobile
md:hidden          // Hide on desktop
```

---

## ♿ Accessibility

### ARIA Labels
```tsx
<button aria-label="Close menu">
```

### Semantic HTML
```tsx
<nav>, <main>, <section>, <article>
```

### Keyboard Navigation
```tsx
<button tabIndex={0}>
```

---

## 🔧 Troubleshooting

### Component Not Found
```tsx
// ❌ Wrong
import { Component } from "@/components/playground";

// ✅ Correct
import { Component } from "@/components/playground/category";
```

### Animation Not Working
```tsx
// Make sure framer-motion is installed
npm install framer-motion
```

### Styles Not Applying
```tsx
// Check Tailwind config includes component paths
content: ["./src/**/*.{ts,tsx}"]
```

---

## 📚 Documentation

- **PLAYGROUND_COMPONENTS_SUMMARY.md** - Full overview
- **COMPONENT_SHOWCASE.md** - Visual guide
- **IMPLEMENTATION_EXAMPLES.md** - Code examples
- **PLAYGROUND_UPDATE_COMPLETE.md** - Update log

---

## 🎉 Total Components: 56

All components are production-ready and fully customizable! 🚀
