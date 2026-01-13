# ⚡ Quick Start Guide

Get your ShipSaaS template running in **15 minutes**.

---

## 📋 Prerequisites

- Node.js 18+ installed
- [Supabase account](https://app.supabase.com) (free tier)
- [Stripe](https://stripe.com) or [LemonSqueezy](https://lemonsqueezy.com) account
- [Mailgun account](https://mailgun.com) (optional)

---

## 🚀 Setup Steps

### 1. Install Dependencies

```bash
cd your-project-folder
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=your-database-url

# Payment (choose one)
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Email (optional for testing)
MAILGUN_API_KEY=your-key
MAILGUN_DOMAIN=your-domain
```

### 3. Setup Database

```bash
pnpm db:push
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🎨 Customization

### Change Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 35 100% 55%;  /* Your brand color */
  --background: 220 20% 4%;
  /* ... more variables */
}
```

### Add Your Branding

1. Replace logo in `src/components/landing/EnhancedNavbar.tsx`
2. Update site name in `src/config.ts`
3. Add your images to `public/`

### Create Blog Posts

1. Create `content/blog/my-post.md`
2. Add frontmatter:

```markdown
---
title: "My Post Title"
excerpt: "Brief description"
date: "2026-01-15"
author: "Your Name"
tags: ["tutorial"]
image: "/images/my-image.png"
---

# Your content here...
```

3. Add image to `public/images/`
4. Deploy!

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Deploy
1. Go to vercel.com
2. Import your repo
3. Add environment variables
4. Deploy!
```

### Railway

```bash
1. Connect GitHub repo
2. Add environment variables
3. Deploy automatically
```

### Docker

```bash
docker build -t your-app .
docker run -p 3000:3000 your-app
```

---

## 📚 Key Features

### Authentication
- Email/password signup
- OAuth providers
- Magic links
- Password reset

**Files**: `src/app/auth/*`

### Payments
- Stripe & LemonSqueezy support
- Webhook handling
- Subscription management

**Files**: `src/lib/checkout.ts`, `src/app/api/*/webhook/`

### Database
- PostgreSQL with Drizzle ORM
- Row Level Security
- Type-safe queries

**Files**: `src/db/schema.ts`, `supabase/migrations/`

### Components
- 27+ production-ready components
- All themed with CSS variables
- View at `/playground`

**Files**: `src/components/playground/`

---

## 🆘 Common Issues

### Build Errors
```bash
rm -rf .next
pnpm build
```

### Database Connection
- Verify `DATABASE_URL` in `.env`
- Check Supabase project is active
- Ensure IP is whitelisted

### Payments Not Working
- Verify API keys are correct
- Check webhook URL is publicly accessible
- Review provider dashboard logs

### Email Not Sending
- Verify Mailgun API key
- Check domain is verified
- Review Mailgun logs

---

## 📖 Full Documentation

For complete documentation, see [README.md](./README.md)

---

## 🎯 Next Steps

1. ✅ Customize theme colors
2. ✅ Add your branding
3. ✅ Configure payment products
4. ✅ Create your first blog post
5. ✅ Deploy to production
6. ✅ Start building your unique features!

---

**Need help?** Check the [README.md](./README.md) for detailed documentation.

Happy building! 🚀
