# 🔧 Developer Guide

Complete technical documentation for ShipFree SaaS boilerplate.

**Last Updated**: January 12, 2026 | **Version**: 5.0

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Theme System](#theme-system)
4. [Component Library](#component-library)
5. [Payment Integrations](#payment-integrations)
6. [Authentication](#authentication)
7. [Database](#database)
8. [API Routes](#api-routes)
9. [Email System](#email-system)
10. [Blog System](#blog-system)
11. [Development Workflow](#development-workflow)
12. [Testing](#testing)
13. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account (free tier works)
- Stripe or LemonSqueezy account (optional for payments)
- Mailgun account (optional for emails)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/shipfree.git
cd shipfree

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Configure Supabase (see GETTING_STARTED.md)
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

Visit http://localhost:3000

**📖 For detailed setup**: See [GETTING_STARTED.md](GETTING_STARTED.md)

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | React framework with SSR |
| **Language** | TypeScript | Type safety |
| **Database** | PostgreSQL (Supabase) | Relational database |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **Auth** | Supabase Auth | Authentication & sessions |
| **Payments** | Stripe & LemonSqueezy | Payment processing |
| **Email** | Mailgun | Transactional emails |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **UI Components** | Radix UI + shadcn/ui | Accessible components |
| **Deployment** | Vercel / Railway / Docker | Hosting options |

### Project Structure

```
shipfree/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Auth webhooks
│   │   │   ├── checkout/      # Unified checkout
│   │   │   ├── stripe/        # Stripe endpoints
│   │   │   ├── lemonsqueezy/  # LemonSqueezy endpoints
│   │   │   └── mailgun/       # Email endpoints
│   │   ├── blog/              # Blog pages
│   │   ├── dashboard/         # Protected dashboard
│   │   ├── playground/        # Component showcase
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── landing/           # Landing page components
│   │   ├── playground/        # Reusable components
│   │   │   ├── hero/          # Hero sections (5 variants)
│   │   │   ├── nav/           # Navigation (2 variants)
│   │   │   ├── pricing/       # Pricing (2 variants)
│   │   │   ├── testimonials/  # Testimonials (2 variants)
│   │   │   ├── forms/         # Forms (2 variants)
│   │   │   ├── dashboard/     # Dashboard (2 variants)
│   │   │   └── premium/       # Premium effects
│   │   ├── seo/               # SEO components
│   │   └── ui/                # shadcn/ui components
│   ├── config/
│   │   ├── payments.ts        # Payment provider config
│   │   └── theme.ts           # Theme system config
│   ├── db/
│   │   ├── schema.ts          # Database schema
│   │   ├── queries.ts         # Database queries
│   │   └── index.ts           # Database client
│   ├── lib/
│   │   ├── supabase/          # Supabase clients
│   │   ├── webhooks/          # Webhook handlers
│   │   ├── checkout.ts        # Unified checkout service
│   │   ├── mailgun.ts         # Email service
│   │   ├── logger.ts          # Logging utility
│   │   ├── error-handler.ts   # Error handling
│   │   └── validation.ts      # Form validation
│   └── utils/
│       ├── stripe.ts          # Stripe client
│       └── lemon.ts           # LemonSqueezy client
├── supabase/
│   └── migrations/            # Database migrations
├── content/
│   └── blog/                  # Markdown blog posts
├── docker/                    # Docker configurations
├── scripts/                   # Utility scripts
└── public/                    # Static assets
```

### Key Design Patterns

**1. Unified Payment Architecture**
- Single API endpoint (`/api/checkout`) for all providers
- Provider selection via environment variable
- Automatic routing to Stripe or LemonSqueezy
- No code changes needed to switch

**2. Server-Side Rendering (SSR)**
- All pages use React Server Components by default
- Client components marked with `"use client"`
- Supabase clients for server and client contexts

**3. Type Safety**
- TypeScript throughout
- Drizzle ORM for type-safe database queries
- Zod for runtime validation (where needed)

**4. Error Handling**
- Centralized error handler (`src/lib/error-handler.ts`)
- User-friendly error messages
- Detailed logging for debugging

---

## 🎨 Theme System

### Overview

The theme system uses CSS variables for instant color changes across all components. Change one variable, update 20+ components automatically.

### Quick Theme Change

**Method 1: Edit CSS (Production)**

```css
/* src/app/globals.css */
:root {
  --primary: 220 100% 55%;  /* ← Change this HSL value */
  --accent: 220 100% 55%;
  --ring: 220 100% 55%;
}
```

**Method 2: Live Preview (Development)**

Visit `/playground` → Click palette icon (🎨) → Choose from 8 presets

**Method 3: Programmatic (Advanced)**

```typescript
import { applyTheme, THEME_PRESETS } from '@/config/theme';

// Use preset
applyTheme(THEME_PRESETS.blue);

// Custom theme
applyTheme({
  name: "My Brand",
  primary: { h: 280, s: 100, l: 60 },
  accent: { h: 290, s: 100, l: 65 },
});
```

### Available Themes

| Theme | HSL Value | Best For |
|-------|-----------|----------|
| 🟠 Amber | `35 100% 55%` | Energy, Trust, SaaS |
| 🔵 Blue | `220 100% 55%` | Tech, Finance, B2B |
| 🟣 Purple | `270 100% 60%` | Creative, Design |
| 🟢 Green | `142 76% 36%` | Health, Eco |
| 🔴 Red | `0 84% 60%` | Bold, Action |
| 🔷 Cyan | `190 95% 50%` | Modern, Tech |
| 🌸 Pink | `330 100% 60%` | Fashion, Lifestyle |
| 🍊 Orange | `25 100% 50%` | Fitness, Commerce |

### Theme Utilities

```tsx
// Gradient text
<h1 className="text-gradient">Gradient Title</h1>

// Glass effect
<div className="glass">Frosted glass card</div>

// Glow effect
<Button className="shadow-glow">Glowing button</Button>

// Gradient background
<div className="bg-gradient-primary">Gradient background</div>
```

### Customization

**Add Custom Theme**:

```typescript
// src/config/theme.ts
export const THEME_PRESETS = {
  // ... existing themes
  myBrand: {
    name: "My Brand",
    primary: { h: 280, s: 100, l: 60 },
    accent: { h: 290, s: 100, l: 65 },
  },
};
```

**Persist Theme**:

```typescript
// Theme is automatically saved to localStorage
// Loads on page refresh
```

---

## 📦 Component Library

### Available Components

**Hero Sections** (5 variants)
- `HeroGradient` - Gradient background with floating elements
- `HeroFloating` - Animated floating icons
- `HeroSplit` - Split layout with image
- `HeroMinimal` - Clean minimal design
- `Hero3D` - 3D card effect

**Navigation** (2 variants)
- `GlassNavbar` - Frosted glass effect
- `MinimalNavbar` - Clean minimal design

**Pricing** (1 variant)
- `PricingCards` - Traditional pricing cards with monthly/yearly toggle

**Testimonials** (2 variants)
- `TestimonialCards` - Grid of testimonial cards
- `TestimonialMarquee` - Infinite scrolling marquee

**Forms** (2 variants)
- `ContactForm` - Contact form with validation
- `NewsletterForm` - Newsletter signup

**Dashboard** (2 variants)
- `StatsCards` - Metric cards with icons
- `ActivityFeed` - Recent activity list

**Premium Effects**
- `AnimatedBorder` - Animated gradient border
- `GlassCard` - Frosted glass card

**Layout**
- `EnhancedFooter` - Footer with links
- `ThemeSwitcher` - Theme selector UI

### Usage Example

```tsx
import { HeroGradient } from '@/components/playground/hero';
import { PricingCards } from '@/components/playground/pricing';

export default function Page() {
  return (
    <>
      <HeroGradient />
      <PricingCards />
    </>
  );
}
```

### Component Playground

Visit `/playground` to:
- See all components in action
- Try different themes live
- Copy component code
- Test responsiveness

---

## 💳 Payment Integrations

### Provider Switching

**Switch providers with ONE environment variable:**

```env
# Use Stripe
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe

# Use LemonSqueezy
NEXT_PUBLIC_PAYMENT_PROVIDER=lemonsqueezy

# Use both
NEXT_PUBLIC_PAYMENT_PROVIDER=both
```

**No code changes needed!**

### Stripe Setup

**1. Get API Keys**
- Go to Stripe Dashboard → Developers → API Keys
- Copy Publishable Key and Secret Key

**2. Create Products**
- Go to Products → Add Product
- Add prices (e.g., $29/month)
- Copy Price IDs

**3. Configure Environment**

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
```

**4. Set Up Webhook**
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`

### LemonSqueezy Setup

**1. Get API Keys**
- Go to LemonSqueezy Dashboard → Settings → API
- Create API key

**2. Create Products**
- Go to Products → Add Product
- Add variants (e.g., Monthly subscription)
- Copy Variant IDs

**3. Configure Environment**

```env
LEMONSQUEEZY_API_KEY=xxx
LEMONSQUEEZY_STORE_ID=xxx
LEMONSQUEEZY_WEBHOOK_SECRET=xxx
NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID=xxx
```

**4. Set Up Webhook**
- URL: `https://yourdomain.com/api/lemonsqueezy/webhook`
- Select all subscription and order events

### Pricing Plans Configuration

```typescript
// src/config/payments.ts
export const pricingPlans: PricingPlan[] = [
  {
    id: "pro-monthly",
    name: "Pro",
    price: 2900, // $29.00 in cents
    interval: "month",
    stripePriceId: "price_xxx",           // Stripe Price ID
    lemonSqueezyVariantId: "123456",     // LemonSqueezy Variant ID
    features: [
      "All features",
      "Unlimited usage",
      "Priority support",
    ],
  },
];
```

### Checkout Flow

```typescript
// Client-side
const handleCheckout = async () => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId: 'pro-monthly' }),
  });
  
  const { url } = await response.json();
  window.location.href = url; // Redirect to checkout
};
```

### Provider Comparison

| Feature | Stripe | LemonSqueezy |
|---------|--------|--------------|
| **Fees** | 2.9% + $0.30 | ~8% total |
| **Setup** | Complex | Easy |
| **Best For** | Established businesses | Indie hackers |
| **Tax Handling** | Manual | Automatic (MoR) |
| **Payment Methods** | Many | Fewer |
| **Features** | Advanced | Basic |

---

## 🔐 Authentication

### Supabase Auth Setup

**1. Create Supabase Project**
- Go to supabase.com
- Create new project
- Copy URL and anon key

**2. Configure Environment**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

**3. Enable Auth Providers**
- Go to Authentication → Providers
- Enable Email
- Optionally enable OAuth (Google, GitHub, etc.)

### Protected Routes

Routes are protected by middleware in `proxy.ts`:

```typescript
// Public routes (no auth required)
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/pricing",
  "/blog",
];

// All other routes require authentication
```

### Usage in Components

**Server Component**:

```typescript
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  
  return <div>Hello {user?.email}</div>;
}
```

**Client Component**:

```typescript
'use client';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function Component() {
  const [user, setUser] = useState(null);
  const supabase = createClient();
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);
  
  return <div>Hello {user?.email}</div>;
}
```

### Auth Webhook

Supabase sends webhooks when users sign up/update:

```
User signs up → Supabase Auth → Webhook → /api/auth/webhook → Database
```

This automatically:
- Creates user record in database
- Sends welcome email
- Syncs profile updates

---

## 🗄️ Database

### Schema Overview

**Tables**:
- `users` - User profiles (extends Supabase auth.users)
- `subscriptions` - Recurring subscriptions
- `orders` - One-time payments
- `payments` - Payment history
- `webhook_events` - Audit trail

### Running Migrations

```bash
# Push schema to database
pnpm db:push

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate
```

### Database Queries

```typescript
import { getUserById, createSubscription } from '@/db/queries';

// Get user
const user = await getUserById(userId);

// Create subscription
await createSubscription({
  userId,
  provider: 'stripe',
  providerSubscriptionId: 'sub_xxx',
  status: 'active',
  planName: 'Pro Monthly',
  amount: 2900,
  currency: 'usd',
  interval: 'month',
  currentPeriodStart: new Date(),
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
});
```

### Row Level Security (RLS)

All tables have RLS policies:

```sql
-- Users can only read their own data
CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);
```

---

## 🔌 API Routes

### Available Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/checkout` | POST | Unified checkout (Stripe or LemonSqueezy) |
| `/api/stripe/checkout` | POST | Stripe-specific checkout |
| `/api/stripe/webhook` | POST | Stripe webhook handler |
| `/api/lemonsqueezy/webhook` | POST | LemonSqueezy webhook handler |
| `/api/auth/webhook` | POST | Supabase auth webhook |
| `/api/mailgun` | POST | Email reply forwarding |
| `/api/mailgun/webhook` | POST | Incoming email webhook |
| `/api/health` | GET | Health check |

### Creating Custom API Routes

```typescript
// src/app/api/my-endpoint/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Your logic here
    const body = await req.json();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 📧 Email System

### Mailgun Setup

**1. Get API Key**
- Go to Mailgun Dashboard → API Keys
- Copy API key

**2. Add Domain**
- Go to Sending → Domains
- Add and verify your domain

**3. Configure Environment**

```env
MAILGUN_API_KEY=xxx
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_NOREPLY=noreply@mg.yourdomain.com
MAILGUN_FROM_ADMIN=support@mg.yourdomain.com
MAILGUN_FORWARD_TO=your-email@example.com
```

### Available Email Templates

- Welcome email
- Email verification
- Password reset
- Payment success
- Subscription cancelled
- Generic notification

### Sending Emails

```typescript
import { sendWelcomeEmail, sendPaymentSuccessEmail } from '@/lib/mailgun';

// Send welcome email
await sendWelcomeEmail(user.email, user.name);

// Send payment success
await sendPaymentSuccessEmail(
  user.email,
  user.name,
  '$29.00',
  'Pro Monthly',
  invoiceUrl
);
```

### Development Mode

Emails are skipped in development by default:

```env
SKIP_EMAILS=true  # Emails logged to console instead
```

---

## 📝 Blog System

### Adding Blog Posts

Create markdown files in `content/blog/`:

```markdown
---
title: "My Blog Post"
description: "Post description"
date: "2026-01-12"
author: "Your Name"
image: "/blog/post-image.jpg"
tags: ["nextjs", "saas"]
---

Your content here...
```

### Blog Routes

- `/blog` - Blog listing page
- `/blog/[slug]` - Individual blog post

### SEO Features

- Automatic sitemap generation
- OpenGraph tags
- Twitter cards
- Structured data (JSON-LD)

---

## 🛠️ Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript check

# Database
pnpm db:push          # Push schema to database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio

# Docker
pnpm docker:dev       # Dev with Supabase
pnpm docker:dev:postgres  # Dev with local PostgreSQL
pnpm docker:prod:build    # Build production image
pnpm docker:logs      # View logs
pnpm docker:down      # Stop containers
```

### Environment Variables

See `.env.example` for all available variables.

**Required**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (if not using Supabase)

**Optional**:
- Payment provider keys
- Mailgun keys
- Feature flags

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication**:
- [ ] Sign up with email
- [ ] Login with email
- [ ] Password reset
- [ ] Protected route access

**Payments**:
- [ ] Create checkout session
- [ ] Complete payment
- [ ] Verify subscription in database
- [ ] Test webhook handling

**Email**:
- [ ] Welcome email sent
- [ ] Payment confirmation sent
- [ ] Email forwarding works

### Testing Webhooks Locally

**Stripe**:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

**LemonSqueezy**:
Use ngrok to expose localhost:
```bash
ngrok http 3000
# Use ngrok URL in LemonSqueezy webhook settings
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Supabase client not initialized"**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Restart dev server
pnpm dev
```

**Issue: "Database connection failed"**
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
pnpm db:push
```

**Issue: "Webhook signature verification failed"**
```bash
# Check webhook secrets
echo $STRIPE_WEBHOOK_SECRET
echo $LEMONSQUEEZY_WEBHOOK_SECRET

# Verify webhook endpoint is accessible
curl https://yourdomain.com/api/stripe/webhook
```

**Issue: "Payment provider not configured"**
```typescript
import { validatePaymentConfig } from '@/config/payments';
const { valid, errors } = validatePaymentConfig();
console.log(errors);
```

### Debug Mode

Enable detailed logging:

```env
NODE_ENV=development
LOG_LEVEL=debug
```

### Getting Help

1. Check [GETTING_STARTED.md](GETTING_STARTED.md)
2. Check [DEPLOYMENT.md](DEPLOYMENT.md)
3. Search GitHub Issues
4. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment details

---

## 📚 Additional Resources

- **Setup Guide**: [GETTING_STARTED.md](GETTING_STARTED.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Technical Review**: [TECHNICAL_REVIEW.md](TECHNICAL_REVIEW.md)
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **LemonSqueezy Docs**: https://docs.lemonsqueezy.com

---

**Built for developers who want to ship fast.**

Last Updated: January 12, 2026 | Version: 5.0
