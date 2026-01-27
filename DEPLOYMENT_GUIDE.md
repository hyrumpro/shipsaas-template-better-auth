# ShipFree Deployment Guide

**Last Updated:** January 8, 2026

A comprehensive guide for deploying ShipFree using Docker or Railway.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Docker Deployment](#docker-deployment)
3. [Railway Deployment](#railway-deployment)
4. [DNS Configuration](#dns-configuration)
5. [Environment Setup](#environment-setup)
6. [Production Checklist](#production-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

ShipFree is a modern SaaS boilerplate built with Next.js 16, Supabase, Stripe/LemonSqueezy, and Mailgun. You can deploy it using:

- **Docker** - Full control, self-hosted
- **Railway** - Quick deployment, managed infrastructure

**📋 Important:** After deployment, configure your DNS records following the [DNS Setup Guide](DNS_SETUP_GUIDE.md)


---

## Docker Deployment

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for detailed Docker deployment instructions.

**Quick Start:**

```bash
# Development with PostgreSQL
docker-compose -f docker/dev/docker-compose.yml -f docker/dev/docker-compose.postgres.yml up --build

# Production with PostgreSQL
docker-compose -f docker/prod/docker-compose.yml -f docker/prod/docker-compose.postgres.yml up --build -d
```

---

## Railway Deployment

See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for detailed Railway deployment instructions.

**Quick Steps:**

1. Fork this repository
2. Create Railway account at [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your forked repository
5. Add environment variables (see below)
6. Deploy!

---

## DNS Configuration

After deploying your application, you need to configure DNS records for:

1. **Your application domain** (e.g., `yourdomain.com`)
2. **Email sending via Mailgun** (e.g., `mg.yourdomain.com`)
3. **SSL/TLS certificates** (automatic with most platforms)

### Quick DNS Setup

**For detailed instructions, see [DNS_SETUP_GUIDE.md](DNS_SETUP_GUIDE.md)**

#### Application Domain (Example: Vercel/Railway)

```dns
# Root domain
A      @              <Your-Server-IP>        3600
# or
CNAME  @              your-app.vercel.app     3600

# WWW subdomain
CNAME  www            your-app.vercel.app     3600
```

#### Mailgun Email Records

```dns
# SPF (Authorization)
TXT    mg             "v=spf1 include:mailgun.org ~all"    3600

# DKIM (Signature - get from Mailgun dashboard)
TXT    k1._domainkey.mg    "k=rsa; p=MIGfMA0..."          3600

# Tracking
CNAME  email.mg       mailgun.org                          3600

# DMARC (on root domain)
TXT    _dmarc         "v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com"  3600
```

### DNS Verification

**Test DNS propagation:**
```bash
# Check your domain
nslookup yourdomain.com

# Check Mailgun DNS
dig mg.yourdomain.com TXT
```

**Online tools:**
- [dnschecker.org](https://dnschecker.org) - Global DNS propagation
- [mxtoolbox.com](https://mxtoolbox.com) - Email DNS testing

**Typical propagation time:** 15 minutes to 2 hours

---

## Environment Setup

### Required Environment Variables

Create a `.env` file in your project root:

```bash
# Application
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# LemonSqueezy
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID=your_variant_id_here

# Mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_EMAIL=noreply@mg.yourdomain.com
MAILGUN_SIGNING_KEY=your_mailgun_signing_key

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Getting Your API Keys

#### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create project → Settings → API
3. Copy `URL` and `anon public` key

#### Stripe
1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Developers → API keys
3. Copy publishable and secret keys
4. Webhooks → Add endpoint → Copy webhook secret

#### LemonSqueezy
1. Go to [lemonsqueezy.com](https://lemonsqueezy.com)
2. Settings → API → Create API key
3. Products → Copy variant ID
4. Webhooks → Create webhook → Copy secret

#### Mailgun
1. Go to [mailgun.com](https://mailgun.com)
2. Sending → Domain settings → API keys
3. Copy API key and signing key

---

## Production Checklist

### Before Going Live

#### Security
- [ ] All environment variables set to production values
- [ ] Webhook secrets configured and tested
- [ ] SSL/TLS certificate active (HTTPS)
- [ ] Database backups configured
- [ ] Row Level Security (RLS) enabled in Supabase
- [ ] API rate limiting configured

#### DNS & Email
- [ ] Domain DNS records configured
- [ ] Mailgun DNS verified (all green checkmarks)
- [ ] Test email sent and received
- [ ] Email deliverability tested (mail-tester.com score 8+/10)
- [ ] DMARC policy configured

#### Application
- [ ] Database schema migrated
- [ ] Webhook handlers tested with test payments
- [ ] User registration flow tested
- [ ] Email verification working
- [ ] Password reset working
- [ ] Payment flow tested (Stripe/LemonSqueezy)
- [ ] Subscription management tested

#### Monitoring
- [ ] Error tracking setup (Sentry recommended)
- [ ] Uptime monitoring configured
- [ ] Analytics installed
- [ ] Webhook failure alerts configured

#### Legal & Compliance
- [ ] Privacy Policy updated with your details
- [ ] Terms of Service updated
- [ ] Cookie consent banner (if needed)
- [ ] GDPR compliance reviewed (if EU users)

#### Performance
- [ ] Build completed without errors
- [ ] TypeScript errors fixed
- [ ] Lighthouse score checked (aim for 90+)
- [ ] Images optimized
- [ ] CDN configured (if applicable)

---

## Troubleshooting

### Issue: "Application Not Loading"

**Symptoms:** Domain shows error or doesn't load

**Solutions:**
1. Check DNS propagation: `nslookup yourdomain.com`
2. Verify deployment status in hosting dashboard
3. Check environment variables are set correctly
4. Review application logs for errors
5. Ensure SSL certificate is provisioned

---

### Issue: "Emails Not Sending"

**Symptoms:** No emails received, errors in logs

**Solutions:**
1. Verify Mailgun DNS records (all green in dashboard)
2. Check `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` in env
3. Test with Mailgun API directly:
   ```bash
   curl -s --user 'api:YOUR_KEY' \
     https://api.mailgun.net/v3/mg.yourdomain.com/messages \
     -F from='test@mg.yourdomain.com' \
     -F to='your-email@gmail.com' \
     -F subject='Test' \
     -F text='Testing'
   ```
4. Check email logs in Mailgun dashboard
5. Verify sender domain matches Mailgun domain

---

### Issue: "Webhook Not Receiving Events"

**Symptoms:** Payments work but no database updates

**Solutions:**
1. Verify webhook URL is publicly accessible
2. Check webhook secret matches environment variable
3. Review webhook logs in Stripe/LemonSqueezy dashboard
4. Test webhook locally with ngrok:
   ```bash
   ngrok http 3000
   # Use ngrok URL in webhook settings
   ```
5. Check application logs for webhook errors

---

### Issue: "Database Connection Failed"

**Symptoms:** Application crashes, database errors in logs

**Solutions:**
1. Verify `DATABASE_URL` format:
   ```
   postgresql://user:password@host:5432/database
   ```
2. Check database is running and accessible
3. Verify firewall allows connections
4. Test connection with psql:
   ```bash
   psql $DATABASE_URL
   ```
5. Check database credentials are correct

---

### Issue: "Build Fails in Production"

**Symptoms:** Deployment fails during build step

**Solutions:**
1. Run `pnpm build` locally to see errors
2. Fix TypeScript errors (don't use `ignoreBuildErrors`)
3. Ensure all dependencies are in `package.json`
4. Check Node.js version matches (use 18.x or 20.x)
5. Review build logs for specific errors

---

## Next Steps

After successful deployment:

1. **Test Everything**
   - User registration and login
   - Email verification
   - Password reset
   - Payment flows
   - Webhook processing

2. **Configure Monitoring**
   - Set up error tracking
   - Configure uptime monitoring
   - Enable analytics

3. **Optimize Performance**
   - Run Lighthouse audit
   - Optimize images
   - Configure caching

4. **Plan for Scale**
   - Database indexing
   - CDN setup
   - Load testing

5. **Documentation**
   - Update README with your specifics
   - Document custom features
   - Create user guides

---

## Support & Resources

### Documentation
- [DNS Setup Guide](DNS_SETUP_GUIDE.md)
- [Payment Integration Guide](PAYMENT_INTEGRATION_GUIDE.md)
- [Docker Setup](DOCKER_SETUP.md)
- [Production Readiness](PRODUCTION_READINESS.md)

### External Resources
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Mailgun Setup](https://documentation.mailgun.com)

### Community
- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share tips

---

**Last Updated:** January 8, 2026  
**Version:** 1.0  
**Maintained By:** ShipFree Team
