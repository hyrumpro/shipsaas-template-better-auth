# 🚀 Getting Started with ShipFree

Complete setup, development, and deployment guide.

**Last Updated:** January 27, 2026

---

## 📋 Table of Contents

1. [Quick Start (15 Minutes)](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Development Guide](#development-guide)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- [Supabase account](https://app.supabase.com) (free tier)
- [Stripe](https://stripe.com) or [LemonSqueezy](https://lemonsqueezy.com) account
- [Mailgun account](https://mailgun.com) (optional)

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file
cp .env.example .env

# 3. Configure environment (see below)
# Edit .env with your credentials

# 4. Setup database
pnpm db:push

# 5. Run development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Setup

### Required Variables

```bash
# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# Payment Provider (Choose one or both)
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe  # or "lemonsqueezy" or "both"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# LemonSqueezy
LEMONSQUEEZY_API_KEY=your_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret

# Mailgun (Optional)
MAILGUN_API_KEY=your_api_key
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_EMAIL=noreply@mg.yourdomain.com
```

### Getting API Keys

#### Supabase
1. Go to [supabase.com](https://supabase.com) → Create project
2. Settings → API → Copy URL and anon key
3. Settings → Database → Copy connection string

#### Stripe
1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Developers → API keys → Copy keys
3. Webhooks → Add endpoint → Copy secret

#### LemonSqueezy
1. Go to [lemonsqueezy.com](https://lemonsqueezy.com)
2. Settings → API → Create key
3. Products → Copy variant IDs
4. Webhooks → Create webhook → Copy secret

#### Mailgun
1. Go to [mailgun.com](https://mailgun.com)
2. Sending → Domains → Add domain
3. API Keys → Copy key

---

## 💻 Development Guide

### Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── (site)/      # Landing page components
│   ├── api/         # API routes
│   ├── auth/        # Auth pages
│   ├── blog/        # Blog system
│   ├── dashboard/   # Protected dashboard
│   └── playground/  # Component showcase
├── components/
│   ├── landing/     # Landing components
│   ├── playground/  # 27+ reusable components
│   ├── blog/        # Blog components
│   └── ui/          # Base UI components
├── lib/             # Utilities
├── db/              # Database schema
└── config/          # Configuration
```

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:push          # Push schema to database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio

# Docker
pnpm docker:dev       # Dev with Supabase
pnpm docker:prod      # Production build
```

### Theme Customization

Edit `src/app/globals.css`:

```css
:root {
  --primary: 35 100% 55%;  /* Your brand color (HSL) */
  --accent: 35 100% 55%;
  --ring: 35 100% 55%;
}
```

Or visit `/playground` → Click palette icon (🎨) → Choose preset

### Adding Blog Posts

Create `content/blog/my-post.md`:

```markdown
---
title: "My Post Title"
excerpt: "Brief description"
date: "2026-01-27"
author: "Your Name"
tags: ["tutorial"]
image: "/images/my-image.png"
---

# Your content here...
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

**Build command:** `pnpm build`  
**Output directory:** `.next`

### Railway

1. Connect GitHub repo
2. Add environment variables
3. Deploy automatically

### Docker

```bash
# Development
docker-compose -f docker/dev/docker-compose.yml up

# Production
docker-compose -f docker/prod/docker-compose.yml up -d
```

### DNS Configuration

After deployment, configure DNS:

```dns
# Application domain
A      @              <Your-Server-IP>
CNAME  www            your-app.vercel.app

# Mailgun (for emails)
TXT    mg             "v=spf1 include:mailgun.org ~all"
TXT    k1._domainkey.mg    "k=rsa; p=..."
CNAME  email.mg       mailgun.org
```

### Production Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Webhook URLs configured
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Email sending tested
- [ ] Payment flow tested
- [ ] Error tracking setup

---

## 🐛 Troubleshooting

### Build Errors

```bash
rm -rf .next
pnpm build
```

### Database Connection Failed

1. Verify `DATABASE_URL` in `.env`
2. Check Supabase project is active
3. Test connection: `pnpm db:push`

### Webhooks Not Working

1. Verify webhook URL is publicly accessible
2. Check webhook secret matches
3. Review provider dashboard logs
4. Test locally with ngrok:
   ```bash
   ngrok http 3000
   ```

### Emails Not Sending

1. Verify Mailgun API key and domain
2. Check domain is verified in Mailgun
3. Review Mailgun logs
4. Test with Mailgun API directly

### Payment Issues

1. Verify API keys are correct
2. Check webhook configuration
3. Review provider dashboard
4. Test with test cards/credentials

---

## 📚 Next Steps

1. ✅ Customize theme colors
2. ✅ Add your branding
3. ✅ Configure payment products
4. ✅ Create your first blog post
5. ✅ Deploy to production
6. ✅ Start building your features!

---

**Need more help?** Check [README.md](./README.md) or [REFERENCE.md](./REFERENCE.md)

Happy building! 🚀
