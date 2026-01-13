# 🚀 ShipSaaS - Premium Next.js SaaS Template

Ship your SaaS in days, not months. Production-ready Next.js 16 template with authentication, payments, 27+ components, and stunning UI.

**Version**: 1.0 | **Last Updated**: January 2026

---

## ✨ What's Included

- ⚡ **Next.js 16** with App Router & Turbopack
- 🔐 **Supabase Auth** - Email, OAuth, magic links
- 💳 **Dual Payment System** - Stripe & LemonSqueezy (switch with one variable)
- 🎨 **27+ Premium Components** - All themed and customizable
- 📧 **Email System** - Mailgun integration with templates
- 🗄️ **PostgreSQL + Drizzle ORM** - Type-safe database
- 🔒 **Row Level Security** - Enterprise-grade security
- 📝 **Blog System** - Markdown-based with SEO
- 🐳 **Docker Ready** - Production & development configs
- 📱 **Fully Responsive** - Mobile-first design
- 🎭 **Theme System** - Dark/light mode with CSS variables
- 🚀 **SEO Optimized** - Meta tags, sitemaps, structured data

---

## 🎯 Quick Start (50 Minutes to Production)

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account (free tier: [app.supabase.com](https://app.supabase.com))
- Payment provider: [Stripe](https://stripe.com) or [LemonSqueezy](https://lemonsqueezy.com)
- Mailgun account (optional: [mailgun.com](https://mailgun.com))

### Installation

```bash
# 1. Extract template files
cd your-project-name

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.example .env
```

### Environment Setup

Edit `.env` with your credentials:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=YourApp
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=your-database-url

# Payment Provider (Choose one or both)
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe  # or "lemonsqueezy"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# LemonSqueezy
LEMONSQUEEZY_API_KEY=your-api-key
LEMONSQUEEZY_STORE_ID=your-store-id
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret

# Mailgun (Optional)
MAILGUN_API_KEY=your-api-key
MAILGUN_DOMAIN=your-domain
```

### Database Setup

```bash
# Initialize database with migrations
pnpm db:push

# Or run migrations manually
pnpm db:migrate
```

### Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

### Core Features

#### 🔐 Authentication

Supabase handles all authentication:
- Email/password signup and login
- OAuth providers (Google, GitHub, etc.)
- Magic link authentication
- Password reset flows
- Email verification

**Files**: `src/app/auth/*`, `src/lib/supabase/*`

#### 💳 Payment Integration

Unified payment architecture supporting both Stripe and LemonSqueezy:

```typescript
// Switch providers with one variable
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe  // or "lemonsqueezy"
```

**Features**:
- Checkout sessions
- Webhook handling
- Subscription management
- Customer portal
- Invoice generation

**Files**: `src/lib/checkout.ts`, `src/app/api/*/webhook/route.ts`

#### 🗄️ Database

PostgreSQL with Drizzle ORM and Row Level Security:

```typescript
// Type-safe queries
import { db } from "@/db";
import { users } from "@/db/schema";

const user = await db.query.users.findFirst({
  where: eq(users.id, userId)
});
```

**Migrations**: `supabase/migrations/`
**Schema**: `src/db/schema.ts`
**Queries**: `src/db/queries.ts`

#### 📧 Email System

Mailgun integration with pre-built templates:

```typescript
import { EmailTemplates } from "@/lib/email-templates";

// Send welcome email
const email = EmailTemplates.welcome(userName);
await sendEmail(userEmail, email.subject, email.html);
```

**Templates**: `src/lib/email-templates.ts`

---

## 🎨 Component Library (27+ Components)

### Navigation
- **GlassNavbar** - Frosted glass effect
- **MinimalNavbar** - Clean with animations

### Hero Sections
- **HeroGradient** - Animated gradient mesh
- **HeroFloating** - 3D floating icons
- **HeroSplit** - Text + visual split
- **HeroMinimal** - Typography-focused

### Pricing
- **PricingCards** - Monthly/yearly toggle
- **PricingComparison** - Feature comparison table

### Features
- **FeatureGrid** - 9-feature animated grid

### Call-to-Action
- **CTAGradient** - Eye-catching gradient
- **CTAMinimal** - Conversion-focused

### Social Proof
- **TestimonialCards** - Customer reviews
- **TestimonialMarquee** - Auto-scrolling
- **LogoCloud** - Partner logos with marquee

### Interactive
- **FAQAccordion** - Expandable questions
- **ContactForm** - Animated with validation
- **NewsletterForm** - Email subscription

### Data Display
- **StatCounter** - Animated numbers
- **Timeline** - Vertical timeline
- **StatsCards** - Dashboard metrics

### Premium
- **GlassCard** - Frosted glass effect
- **Footer** - Comprehensive footer

**View all components**: Visit `/playground` in your app

---

## 📝 Blog System

### Creating Blog Posts

1. Create a new `.md` file in `content/blog/`
2. Add frontmatter:

```markdown
---
title: "Your Post Title"
excerpt: "Brief description for SEO and previews (150-160 chars)"
date: "2026-01-15"
author: "Your Name"
tags: ["tutorial", "nextjs", "saas"]
image: "/images/your-image.png"
---

# Your Post Title

Your content here using Markdown...

## Subheading

- Bullet points
- **Bold text**
- *Italic text*
- [Links](https://example.com)

\`\`\`typescript
// Code blocks with syntax highlighting
const example = "Hello World";
\`\`\`
```

3. Add featured image to `public/images/`
4. Deploy - posts appear automatically!

### Blog Features

- ✅ Automatic SEO optimization
- ✅ OpenGraph tags for social sharing
- ✅ Structured data (BlogPosting schema)
- ✅ Reading time calculation
- ✅ Tag-based categorization
- ✅ Responsive image handling
- ✅ Share buttons (Twitter, LinkedIn)

**Blog files**: `content/blog/*.md`
**Blog logic**: `src/lib/blog.ts`
**Blog pages**: `src/app/blog/`

---

## 🎭 Theme Customization

### CSS Variables

Edit `src/app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 142 76% 36%;
  --primary-foreground: 0 0% 100%;
  /* ... more variables */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark mode overrides */
}
```

### Component Theming

All components use CSS variables:

```tsx
<div className="bg-background text-foreground border-border">
  <h1 className="text-primary">Themed Content</h1>
</div>
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

**Build command**: `pnpm build`
**Output directory**: `.next`

### Railway

1. Connect GitHub repo
2. Add environment variables
3. Deploy automatically

### Docker

```bash
# Build
docker build -t your-saas .

# Run
docker run -p 3000:3000 your-saas
```

**Docker files**: `docker/` directory

---

## 🔧 Development

### Project Structure

```
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   │   ├── landing/      # Landing page components
│   │   ├── playground/   # Component library
│   │   ├── blog/         # Blog components
│   │   └── ui/           # Base UI components
│   ├── lib/              # Utilities and helpers
│   ├── db/               # Database schema and queries
│   └── config/           # Configuration files
├── content/blog/         # Blog posts (Markdown)
├── supabase/migrations/  # Database migrations
├── public/               # Static assets
└── docker/               # Docker configurations
```

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm db:push      # Push database schema
pnpm db:migrate   # Run migrations
pnpm db:studio    # Open Drizzle Studio
```

### Adding New Components

1. Create component in `src/components/playground/`
2. Add to playground page: `src/app/playground/page.tsx`
3. Document in `COMPONENT_LIBRARY.md`

---

## 🔒 Security

### Row Level Security (RLS)

All database tables have RLS policies:

```sql
-- Users can only read their own data
CREATE POLICY "Users can read own data"
ON users FOR SELECT
USING (auth.uid() = id);
```

**Policies**: `supabase/migrations/002_row_level_security.sql`

### API Security

- ✅ Webhook signature verification
- ✅ CORS configuration
- ✅ Rate limiting ready
- ✅ Environment variable validation
- ✅ SQL injection prevention (parameterized queries)

---

## 📊 SEO Features

- ✅ Dynamic meta tags
- ✅ OpenGraph tags
- ✅ Twitter Cards
- ✅ Structured data (JSON-LD)
- ✅ Automatic sitemap generation
- ✅ Robots.txt configuration
- ✅ Breadcrumbs
- ✅ Canonical URLs

**SEO components**: `src/components/seo/`

---

## 🐛 Troubleshooting

### Build Errors

**Clear Next.js cache**:
```bash
rm -rf .next
pnpm build
```

### Database Connection Issues

1. Verify `DATABASE_URL` in `.env`
2. Check Supabase project is active
3. Ensure IP is whitelisted (if using connection pooling)

### Payment Webhooks Not Working

1. Verify webhook URL is publicly accessible
2. Check webhook secret matches
3. Review provider dashboard logs
4. Test with provider CLI tools

### Email Not Sending

1. Verify Mailgun API key and domain
2. Check domain is verified in Mailgun
3. Review Mailgun logs
4. Test with Mailgun API directly

---

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: shadcn/ui + Custom
- **Animations**: Framer Motion
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle
- **Auth**: Supabase Auth
- **Payments**: Stripe + LemonSqueezy
- **Email**: Mailgun
- **Deployment**: Vercel / Railway / Docker

---

## 📄 License

This is a premium template. Once purchased, you have:
- ✅ Unlimited personal and commercial projects
- ✅ Lifetime updates
- ✅ Full source code access
- ❌ Cannot resell or redistribute the template itself

---

## 🆘 Support

- 📧 **Email**: support@shipsaas.com
- 📚 **Documentation**: This README + inline code comments
- 🐛 **Issues**: Check troubleshooting section above

---

## 🎉 You're Ready!

Your ShipSaaS template is production-ready. Focus on building your unique features while we handle the boilerplate.

**Next Steps**:
1. Customize theme colors
2. Add your branding
3. Create your first blog post
4. Configure payment products
5. Deploy to production
6. Start marketing!

Happy building! 🚀
