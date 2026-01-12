# ⚡ ShipFree - Production-Ready SaaS Boilerplate

**Launch your SaaS in days, not months.**

A complete Next.js 15 SaaS boilerplate with authentication, payments (Stripe & LemonSqueezy), database, email, SEO, and theme system - all configured and ready to deploy.

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone and install
git clone https://github.com/yourusername/shipfree.git
cd shipfree
pnpm install

# 2. Set up environment
cp .env.example .env
# Add your Supabase credentials (see GETTING_STARTED.md)

# 3. Deploy database
pnpm db:push

# 4. Start development
pnpm dev
```

Visit http://localhost:3000

**📖 [Setup Guide](GETTING_STARTED.md)** - 50 minutes to production  
**🔧 [Developer Guide](DEVELOPER_GUIDE.md)** - Technical docs & API reference  
**🚀 [Deployment Guide](DEPLOYMENT.md)** - Deploy to Vercel, Railway, or Docker  
**🔍 [Technical Review](TECHNICAL_REVIEW.md)** - Architecture & security audit

---

## 🎨 Theme System & Component Library

**Change your entire app's color scheme in seconds!** 

✨ **20+ Production-Ready Components** - Hero sections, pricing tables, testimonials, forms, dashboards  
🎨 **8 Color Themes** - Amber, Blue, Purple, Green, Red, Cyan, Pink, Orange  
⚡ **Live Preview** - Visit `/playground` to see all components and try themes  
🔧 **Easy Customization** - Change one CSS variable, update everything

### Quick Theme Change

```css
/* Edit src/app/globals.css */
:root {
  --primary: 220 100% 55%;  /* Change to your brand color */
}
```

Or visit `/playground` → Click palette icon → Choose color

👉 **[Theme Documentation](DEVELOPER_GUIDE.md#theme-system)**

---

## 💳 Payment Provider Switching

**Switch between Stripe and LemonSqueezy with ONE environment variable:**

```bash
# Use Stripe
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe

# Use LemonSqueezy
NEXT_PUBLIC_PAYMENT_PROVIDER=lemonsqueezy

# Use both
NEXT_PUBLIC_PAYMENT_PROVIDER=both
```

**No code changes needed!** The unified architecture handles everything automatically.

👉 **[Payment Documentation](DEVELOPER_GUIDE.md#payment-integrations)**

---

## 🐳 Docker Deployment

```bash
# With Supabase (Recommended)
pnpm docker:dev              # Development
pnpm docker:prod:build       # Production

# With local PostgreSQL (Dev only)
pnpm docker:dev:postgres
```

👉 **[Deployment Documentation](DEVELOPER_GUIDE.md#deployment)**

---

## ✨ What's Included

### 🔐 Authentication
- ✅ Email/password authentication (Supabase)
- ✅ Email verification flow
- ✅ Protected routes with middleware
- ✅ Session management
- ✅ Auth webhook syncing

### 💳 Payments (Stripe & LemonSqueezy)
- ✅ **Switch providers with one environment variable**
- ✅ Complete webhook handlers with signature verification
- ✅ Subscription and one-time payment support
- ✅ Automatic database updates
- ✅ Payment history tracking
- ✅ Refund handling
- ✅ Automatic receipt emails

### 🗄️ Production-Ready Database
- ✅ Complete PostgreSQL schema (users, subscriptions, orders, payments)
- ✅ Row Level Security (RLS) policies
- ✅ Type-safe queries with Drizzle ORM
- ✅ Automatic subscription syncing
- ✅ Webhook event audit trail
- ✅ Proper indexes for performance

### 🎨 Theme System & Components
- ✅ 20+ production-ready components
- ✅ 8 color theme presets
- ✅ Live theme switcher at `/playground`
- ✅ CSS variable-based (change once, update everywhere)
- ✅ Hero sections, pricing, testimonials, forms, dashboards

### 📧 Email System
- ✅ 6 pre-built HTML email templates
- ✅ Mailgun integration
- ✅ Welcome, verification, payment, cancellation emails
- ✅ Incoming email forwarding
- ✅ Graceful degradation in development

### 🔍 SEO & Blog
- ✅ Complete markdown blog system
- ✅ Dynamic sitemap generation
- ✅ Structured data (JSON-LD)
- ✅ OpenGraph & Twitter cards
- ✅ 3 example blog posts

### 🐳 DevOps
- ✅ Docker configuration (dev & production)
- ✅ Vercel deployment ready
- ✅ Railway deployment ready
- ✅ Environment variable templates
- ✅ Comprehensive error handling & logging

---

## 📊 Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Database:** PostgreSQL (Supabase)
- **ORM:** Drizzle ORM
- **Auth:** Supabase Auth
- **Payments:** Stripe & LemonSqueezy
- **Email:** Mailgun
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Deployment:** Vercel, Railway, or Docker

---

## 🎯 Features

### ✅ Fully Implemented
- ✅ Email/password authentication
- ✅ Complete payment system (Stripe & LemonSqueezy)
- ✅ All webhook handlers with database operations
- ✅ Production-ready database with RLS
- ✅ Blog system with 3 example posts
- ✅ SEO optimization (meta tags, sitemap, structured data)
- ✅ Email templates (6 ready to use)
- ✅ Docker configuration
- ✅ Protected routes
- ✅ Error handling & logging

### 💰 Payment Features
- ✅ Switch between Stripe and LemonSqueezy with one variable
- ✅ Subscription management
- ✅ One-time payments
- ✅ Webhook signature verification
- ✅ Automatic database updates
- ✅ Payment history tracking
- ✅ Refund handling

### 🗄️ Database Features
- ✅ Users with subscription status
- ✅ Subscriptions (recurring billing)
- ✅ Orders (one-time payments)
- ✅ Payments (transaction history)
- ✅ Webhook events (audit trail)
- ✅ Row Level Security
- ✅ Automatic timestamp updates

---

## ⏱️ Time Saved

This boilerplate saves you **100-120 hours** of development:
- Authentication setup: 10-15 hours
- Database design & implementation: 20-30 hours
- Payment integration (both providers): 30-40 hours
- Webhook handlers: 20-30 hours
- SEO & blog system: 10-15 hours
- Email templates: 5-10 hours
- Docker configuration: 5-10 hours

---

## 🚀 Deployment Options

### Vercel (Easiest - 5 minutes)
```bash
vercel deploy
```
Add environment variables in Vercel dashboard.

### Railway (10 minutes)
1. Push to GitHub
2. Connect to Railway
3. Add environment variables
4. Deploy!

### Docker (Full Control)
```bash
docker-compose -f docker/prod/docker-compose.yml up -d
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

### For Users
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Complete setup guide (50 minutes to production)

### For Developers
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Technical documentation, API reference, theme system, components

### For Deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guides for Vercel, Railway, Docker, and VPS

### For Technical Review
- **[TECHNICAL_REVIEW.md](TECHNICAL_REVIEW.md)** - Architecture review, security audit, code quality analysis

---

## ⏱️ Time Saved

This boilerplate saves you **100-120 hours** of development:
- ✅ Authentication setup: 10-15 hours
- ✅ Database design & implementation: 20-30 hours
- ✅ Payment integration (both providers): 30-40 hours
- ✅ Webhook handlers: 20-30 hours
- ✅ SEO & blog system: 10-15 hours
- ✅ Email templates: 5-10 hours
- ✅ Docker configuration: 5-10 hours

---

## 🔒 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Webhook signature verification (Stripe, LemonSqueezy, Supabase, Mailgun)
- ✅ Environment variables for all secrets
- ✅ Protected API routes with authentication
- ✅ Secure session management
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (React escaping)

---

## 📝 License

MIT License

---

## 🤝 Support

- **Documentation:** [Setup](GETTING_STARTED.md) | [Developer](DEVELOPER_GUIDE.md) | [Deployment](DEPLOYMENT.md) | [Technical Review](TECHNICAL_REVIEW.md)
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions

---

**Built for SaaS founders who want to ship fast.**

Last Updated: January 12, 2026 | Version: 5.0
