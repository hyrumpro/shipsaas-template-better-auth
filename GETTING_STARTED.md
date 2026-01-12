# 🚀 Getting Started with ShipFree

Ship your SaaS in 50 minutes. Complete setup guide from zero to production with theme customization.

---

## ⚡ Quick Start Checklist

- [ ] Clone repository
- [ ] Install dependencies
- [ ] Create Supabase project
- [ ] Deploy database (1 command)
- [ ] Configure payment provider
- [ ] Setup email service (optional for testing)
- [ ] **Customize theme & components**
- [ ] Test locally
- [ ] Deploy to production

**Total Time**: 50 minutes to production 🎯

---

## 📋 Prerequisites

### Required Accounts (All have free tiers)

1. **Supabase** - [app.supabase.com](https://app.supabase.com)
   - Authentication + PostgreSQL database
   - Free tier: 500MB database, 50K monthly active users

2. **Payment Provider** (choose one or both):
   - **Stripe** - [stripe.com](https://stripe.com) - Free to start, 2.9% + 30¢ per transaction
   - **LemonSqueezy** - [lemonsqueezy.com](https://lemonsqueezy.com) - 5% + payment fees

3. **Mailgun** (optional for testing) - [mailgun.com](https://mailgun.com)
   - Transactional emails
   - Free tier: 5,000 emails/month

4. **Domain** (for production) - Any registrar (~$10-15/year)

### Required Software

```bash
# Check versions
node --version  # v18+ or v20+
pnpm --version  # 8.0+
git --version   # 2.0+

# Install pnpm if needed
npm install -g pnpm
```

---

## 🏁 Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/shipfree.git
cd shipfree

# Install dependencies
pnpm install
```

---

## 🗄️ Step 2: Database Setup (5 minutes)

### 2.1 Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Name**: Your app name (e.g., "MyAwesomeSaaS")
   - **Database Password**: Generate strong password (**SAVE THIS!**)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning

### 2.2 Get Database Credentials

**Option A: Connection String (Recommended)**

1. Go to **Project Settings** → **Database**
2. Find **Connection String** section
3. Copy **URI** format:

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres
```

4. Replace `[YOUR-PASSWORD]` with your database password

**Option B: Individual Credentials**

1. Go to **Project Settings** → **API**
2. Copy these values:

```bash
# Supabase URL
https://[PROJECT-REF].supabase.co

# Anon/Public Key (safe for client-side)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (SECRET - server-side only!)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
```

**Minimal .env.local for testing:**

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=YourApp
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Supabase (from step 2.2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database (from step 2.2)
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:6543/postgres

# Payment Provider (will configure later)
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe

# Skip emails in development
SKIP_EMAILS=true
```

### 2.4 Deploy Database Schema

**One command deployment:**

```bash
pnpm db:push
```

**Expected output:**

```
✅ users table created
✅ subscriptions table created
✅ orders table created
✅ payments table created
✅ webhook_events table created
✅ All indexes created
✅ All relations created
```

### 2.5 Verify Database

**Check in Supabase Dashboard:**

1. Go to **Table Editor**
2. You should see 5 tables:
   - `users` - User profiles
   - `subscriptions` - Recurring subscriptions
   - `orders` - One-time payments
   - `payments` - Payment history
   - `webhook_events` - Audit trail

**Or test connection:**

```bash
pnpm db:studio
```

Opens Drizzle Studio at `http://localhost:4983` - visual database browser.

---

## 💳 Step 3: Payment Setup (10 minutes)

### 3.1 Choose Your Provider

Edit `.env.local`:

```bash
# Options: "stripe", "lemonsqueezy", or "both"
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe
```

**Switching is that easy!** No code changes needed. 🎉

---

### 3.2 Option A: Stripe Setup

#### Get API Keys

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Toggle "Test mode" ON** (top right)
3. Go to **Developers** → **API keys**
4. Copy to `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
```

#### Create Products

1. Go to **Products** → **Add product**
2. Create pricing plans:

   **Example: Pro Plan**
   - Name: "Pro Plan"
   - Description: "Full access to all features"
   - Pricing:
     - Monthly: $29/month
     - Yearly: $290/year (save $58!)

3. Click each price and copy the **Price ID**:

```bash
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_1234567890
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_0987654321
```

#### Test Cards (Test Mode)

```
Success:        4242 4242 4242 4242
Decline:        4000 0000 0000 0002
3D Secure:      4000 0025 0000 3155
```

Any future date, any CVC, any postal code.

#### Webhook Setup (For Production)

**Skip for local testing!** Set up when deploying:

1. **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`
3. **Events to send**: Select all subscription and payment events
4. Copy **Signing secret**:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### 3.3 Option B: LemonSqueezy Setup

#### Get API Keys

1. Go to [app.lemonsqueezy.com](https://app.lemonsqueezy.com)
2. **Settings** → **API** → **Create API key**
3. Copy to `.env.local`:

```bash
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=12345
```

#### Create Products

1. **Products** → **New Product**
2. Create variants:
   - Monthly: $29/month
   - Yearly: $290/year

3. Copy **Variant IDs**:

```bash
NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID=123456
NEXT_PUBLIC_LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID=789012
```

#### Webhook Setup (For Production)

1. **Settings** → **Webhooks** → **Create webhook**
2. **Callback URL**: `https://yourdomain.com/api/lemonsqueezy/webhook`
3. **Signing Secret**: Copy it:

```bash
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
```

---

## 📧 Step 4: Email Setup (Optional - 15 minutes)

**For Testing**: Set `SKIP_EMAILS=true` in `.env.local` and skip this section.

Emails will be logged to console: `📧 [DEV] Email would be sent to: user@example.com`

**For Production**: Follow these steps.

### 4.1 Mailgun Account

1. Create account at [mailgun.com](https://mailgun.com)
2. **Sending** → **Domains** → **Add new domain**
3. Domain: `mg.yourdomain.com` (use subdomain!)

### 4.2 DNS Configuration

Add these records to your domain DNS:

```dns
Type    Name                    Value                           TTL
----    ----                    -----                           ---
TXT     mg                      "v=spf1 include:mailgun.org ~all"   3600
TXT     k1._domainkey.mg        [Provided by Mailgun]          3600
CNAME   email.mg                mailgun.org                    3600
MX      mg                      mxa.mailgun.org (priority 10)  3600
MX      mg                      mxb.mailgun.org (priority 10)  3600
```

**DMARC (on root domain):**
```dns
TXT     _dmarc     "v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com"
```

Wait 15-30 minutes for DNS propagation.

### 4.3 Verify & Get Keys

1. Go back to Mailgun dashboard
2. Click **"Verify DNS Settings"** - should be all green ✅
3. Go to **Settings** → **API Keys**
4. Copy to `.env.local`:

```bash
MAILGUN_API_KEY=key-abc123...
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_SUBDOMAIN=mg
MAILGUN_FROM_EMAIL=noreply@mg.yourdomain.com
MAILGUN_FROM_NOREPLY=YourApp <noreply@mg.yourdomain.com>
MAILGUN_FROM_ADMIN=Support <support@mg.yourdomain.com>
MAILGUN_SUPPORT_EMAIL=support@mg.yourdomain.com
MAILGUN_FORWARD_TO=your-email@gmail.com
MAILGUN_WEBHOOK_SIGNING_KEY=your_signing_key

# For production, disable skip
SKIP_EMAILS=false
```

### 4.4 Test Email

```bash
curl -s --user 'api:YOUR_API_KEY' \
  https://api.mailgun.net/v3/mg.yourdomain.com/messages \
  -F from='test@mg.yourdomain.com' \
  -F to='your-email@gmail.com' \
  -F subject='Test from ShipFree' \
  -F text='Testing email delivery!'
```

---

## 🧪 Step 5: Test Locally

### Start Development Server

```bash
pnpm dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### Test Authentication

1. Click **"Sign Up"** or go to `/auth/register`
2. Create account with email/password
3. You should be logged in and redirected to `/dashboard`
4. Try logging out and back in

**Test Magic Link:**
1. Go to `/auth/login`
2. Select "Magic Link" tab
3. Enter your email
4. Check email for magic link (if Mailgun configured)

**Test Google OAuth:**
1. Configure Google OAuth in Supabase (see below)
2. Click "Sign in with Google"

### Test Payments

1. Go to `/pricing`
2. Click **"Subscribe"** on a plan
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Check dashboard - subscription should appear

### Verify Database

```bash
# Open database studio
pnpm db:studio
```

Check:
- `users` table has your user
- `subscriptions` table has subscription (if tested payments)
- `webhook_events` table has webhook entries

---

## 📊 Database Schema Reference

### users
```sql
id                      UUID PRIMARY KEY    # Matches Supabase auth.users.id
email                   VARCHAR(255)        # User email
full_name               VARCHAR(255)        # Display name
avatar_url              TEXT                # Profile picture
is_subscribed           BOOLEAN             # Quick subscription check
subscription_tier       VARCHAR(50)         # free, pro, enterprise
stripe_customer_id      VARCHAR(255)        # Stripe customer reference
lemonsqueezy_customer_id VARCHAR(255)       # LemonSqueezy customer reference
metadata                JSONB               # Custom data
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

### subscriptions
```sql
id                      UUID PRIMARY KEY
user_id                 UUID REFERENCES users(id)
provider                ENUM                # 'stripe' or 'lemonsqueezy'
provider_subscription_id VARCHAR(255)      # Provider's subscription ID
status                  ENUM                # active, canceled, past_due, etc.
plan_name               VARCHAR(100)        # "Pro Monthly", "Enterprise"
amount                  INTEGER             # Price in cents
currency                VARCHAR(3)          # USD, EUR, etc.
interval                ENUM                # month, year
current_period_start    TIMESTAMP
current_period_end      TIMESTAMP
cancel_at_period_end    BOOLEAN
trial_start             TIMESTAMP
trial_end               TIMESTAMP
metadata                JSONB
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

### orders (One-time payments)
```sql
id                      UUID PRIMARY KEY
user_id                 UUID REFERENCES users(id)
provider                ENUM
provider_order_id       VARCHAR(255)
status                  ENUM                # paid, refunded, failed
product_name            VARCHAR(255)
amount                  INTEGER
currency                VARCHAR(3)
receipt_url             TEXT
metadata                JSONB
created_at              TIMESTAMP
```

### payments (Payment history)
```sql
id                      UUID PRIMARY KEY
user_id                 UUID REFERENCES users(id)
subscription_id         UUID REFERENCES subscriptions(id)
provider                ENUM
provider_payment_id     VARCHAR(255)
status                  ENUM                # succeeded, failed, refunded
amount                  INTEGER
currency                VARCHAR(3)
payment_method          VARCHAR(50)         # card, paypal, etc.
paid_at                 TIMESTAMP
metadata                JSONB
created_at              TIMESTAMP
```

### webhook_events (Audit trail)
```sql
id                      UUID PRIMARY KEY
provider                ENUM
event_type              VARCHAR(100)        # customer.subscription.created
event_id                VARCHAR(255)        # Provider's event ID (unique)
processed               BOOLEAN
payload                 JSONB               # Full webhook payload
error                   TEXT
created_at              TIMESTAMP
processed_at            TIMESTAMP
```

---

## 🔧 Optional: Google OAuth Setup

### In Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable **Google+ API**
4. **APIs & Services** → **Credentials** → **Create OAuth 2.0 Client ID**
5. Configure consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
7. Copy **Client ID** and **Client Secret**

### In Supabase

1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Paste Client ID and Client Secret
4. Save

### In Your App

Add to `.env.local`:

```bash
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

Test: Click "Sign in with Google" button on `/auth/login`

---

## ⚙️ Configuration Files Reference

### src/config.ts

Update with your app details:

```typescript
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "YourApp",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
  // ... payments, mailgun config
};
```

### src/config/payments.ts

Update with your pricing:

```typescript
export const pricingPlans = [
  {
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Unlimited projects",
      "Priority support",
      "Advanced analytics",
    ],
    stripe: {
      monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
      yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
    },
    lemonsqueezy: {
      monthlyVariantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID,
      yearlyVariantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID,
    },
  },
];
```

---

## 🐛 Troubleshooting

### Database Connection Failed

```bash
Error: P1001: Can't reach database server
```

**Solutions:**
- Verify `DATABASE_URL` is correct
- Check database password (no special characters URL-encoded?)
- Ensure Supabase project is not paused (free tier sleeps after inactivity)
- Test connection in Supabase dashboard

### Build Error: "Neither apiKey nor config.authenticator provided"

This is the Mailgun error we just fixed!

**Solution:**
```bash
# Add to .env.local
SKIP_EMAILS=true
```

Or configure Mailgun properly (see Step 4).

### Webhooks Not Working

**For local testing:**

Use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Or use ngrok:
```bash
ngrok http 3000
# Use ngrok URL in webhook settings: https://abc123.ngrok.io/api/stripe/webhook
```

### Payments Not Showing in Dashboard

1. Check `webhook_events` table for errors
2. Verify webhook secret matches
3. Check Stripe/LS dashboard for webhook delivery status
4. Look at server logs: `pnpm dev` output

### Email Not Sending

1. Verify `SKIP_EMAILS` is `false` (if Mailgun configured)
2. Check Mailgun DNS (all green in dashboard)
3. Check Mailgun logs (Sending → Logs)
4. Verify API key is correct

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Database deployed and tested locally
- [ ] Payment provider tested (test mode)
- [ ] Email DNS configured and verified
- [ ] Google OAuth configured (if using)
- [ ] Landing page customized
- [ ] Pricing updated in `src/config/payments.ts`
- [ ] Email templates customized (optional)
- [ ] Terms of Service & Privacy Policy updated
- [ ] Custom domain purchased (if not using subdomain)

---

## 🎨 Step 6: Customize Theme & Components (5 minutes)

Your template includes **20+ production-ready components** and a **powerful theme system** that lets you change your entire app's color scheme in seconds!

### 6.1 Explore the Component Playground

```bash
# Start dev server (if not running)
pnpm dev

# Visit the playground
open http://localhost:3000/playground
```

**What you'll see:**
- 20+ interactive components (Hero, Pricing, Testimonials, Forms, Dashboard, etc.)
- Live theme switcher with 8 preset colors
- Visual preview of all components
- Copy-paste ready code

### 6.2 Change Your Brand Color (3 Ways)

#### Method 1: Live Preview (Easiest) ⚡

1. Visit `/playground`
2. Click the palette icon (🎨) in the header
3. Choose from 8 preset colors
4. Changes apply instantly and persist!

**Available Themes:**
- 🟠 Amber (Default)
- 🔵 Ocean Blue
- 🟣 Royal Purple
- 🟢 Emerald Green
- 🔴 Ruby Red
- 🔷 Cyan Blue
- 🌸 Hot Pink
- 🍊 Sunset Orange

#### Method 2: Edit CSS (For Production) ✏️

Open `src/app/globals.css` and change ONE line:

```css
:root {
  --primary: 220 100% 55%;  /* ← Change this to your brand color */
}
```

**Popular Colors:**
```css
--primary: 35 100% 55%;   /* 🟠 Amber (Default) */
--primary: 220 100% 55%;  /* 🔵 Blue */
--primary: 270 100% 60%;  /* 🟣 Purple */
--primary: 142 76% 36%;   /* 🟢 Green */
--primary: 0 84% 60%;     /* 🔴 Red */
--primary: 190 95% 50%;   /* 🔷 Cyan */
--primary: 330 100% 60%;  /* 🌸 Pink */
--primary: 25 100% 50%;   /* 🍊 Orange */
```

**That's it!** All 20+ components automatically update. 🎉

#### Method 3: Programmatic 💻

```typescript
import { applyTheme, THEME_PRESETS } from '@/config/theme';

// Use a preset
applyTheme(THEME_PRESETS.blue);

// Or create custom theme
applyTheme({
  name: "My Brand",
  primary: { h: 280, s: 100, l: 60 },
  accent: { h: 290, s: 100, l: 65 },
});
```

### 6.3 Use Components in Your Pages

#### Available Components

**Hero Sections (5 variants)**
- `HeroGradient` - Animated gradient background
- `HeroFloating` - Floating icons animation
- `HeroSplit` - Split layout with preview
- `HeroMinimal` - Clean, typography-focused
- `Hero3D` - 3D effect placeholder

**Navigation (2 variants)**
- `GlassNavbar` - Apple-style frosted glass
- `MinimalNavbar` - Clean with animated underlines

**Pricing (2 variants)**
- `PricingCards` - Monthly/yearly toggle
- `PricingSlider` - Usage-based slider

**Testimonials (2 variants)**
- `TestimonialCards` - Review cards with ratings
- `TestimonialMarquee` - Auto-scrolling testimonials

**Forms (2 variants)**
- `ContactForm` - Animated form with validation
- `NewsletterForm` - Email subscription

**Dashboard (2 variants)**
- `StatsCards` - Metrics with trends
- `ActivityFeed` - Activity timeline

**Premium Effects (2 variants)**
- `AnimatedBorder` - Animated gradient borders
- `GlassCard` - Frosted glass effect cards

**Layout (1 component)**
- `Footer` - Complete footer

#### Import and Use

```tsx
import {
  HeroGradient,
  GlassNavbar,
  PricingCards,
  TestimonialCards,
  ContactForm,
  Footer
} from '@/components/playground';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Sticky Navigation */}
      <div className="fixed top-4 left-4 right-4 z-50">
        <GlassNavbar />
      </div>
      
      {/* Hero Section */}
      <HeroGradient />
      
      {/* Pricing Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            Choose Your <span className="text-gradient">Plan</span>
          </h2>
          <PricingCards />
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <TestimonialCards />
        </div>
      </section>
      
      {/* Contact Form */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <ContactForm />
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
```

### 6.4 Theme Utility Classes

Use these classes in your custom components to automatically adapt to theme changes:

```tsx
<div className="glass">              {/* Frosted glass effect */}
<h1 className="text-gradient">       {/* Gradient text */}
<div className="shadow-glow">        {/* Glowing shadow */}
<Button variant="hero">              {/* Themed button */}
<div className="bg-gradient-primary">{/* Gradient background */}
```

### 6.5 Component File Structure

```
src/components/playground/
├── hero/                    # 5 hero variants
├── nav/                     # 2 navigation variants
├── pricing/                 # 2 pricing variants
├── testimonials/            # 2 testimonial variants
├── forms/                   # 2 form variants
├── dashboard/               # 2 dashboard variants
├── premium/                 # 2 premium effects
├── layout/                  # Footer component
└── ui/
    └── ThemeSwitcher.tsx    # Theme selector
```

### 6.6 Design System

**Colors** - All components use semantic tokens:
- `bg-card` - Card backgrounds
- `text-foreground` - Primary text
- `text-muted-foreground` - Secondary text
- `text-primary` - Accent text
- `bg-primary` - Accent backgrounds
- `border-border` - Borders

**Typography:**
- Font: Inter (already imported)
- Headings: Bold with tight tracking
- Body: Regular with antialiased rendering

**Utility Classes:**
- `.text-gradient` - Primary gradient text
- `.glass` - Frosted glass effect
- `.shadow-glow` - Primary color glow
- `.animate-float` - Floating animation

### 6.7 Key Features

✅ **Truly Themeable** - Change one color, update all components  
✅ **Production Ready** - Real working code, not examples  
✅ **Easy to Use** - Import and use immediately  
✅ **Fully Responsive** - Works on all devices  
✅ **Type Safe** - Full TypeScript support  
✅ **localStorage Persistence** - User preferences saved  

---

## 🚀 Next Steps

**You're ready to deploy!**

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for:
- Deploy to Vercel (5 minutes)
- Deploy to Railway (10 minutes)
- Docker deployment (self-hosted)

---

## 📚 Additional Resources

- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)
- **LemonSqueezy Docs**: [docs.lemonsqueezy.com](https://docs.lemonsqueezy.com)
- **Mailgun Docs**: [documentation.mailgun.com](https://documentation.mailgun.com)

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/shipfree/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/shipfree/discussions)

---

**Last Updated**: January 12, 2026

**Time to Production**: 50 minutes ⚡
