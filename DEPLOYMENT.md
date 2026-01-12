# Deployment Guide

Deploy your SaaS to production in minutes.

---

## 🚀 Deployment Options

1. [Vercel](#vercel-easiest) - Easiest, 5 minutes
2. [Railway](#railway) - Simple, 10 minutes
3. [Docker](#docker) - Full control, self-hosted

---

## Vercel (Easiest)

### Prerequisites
- GitHub account
- Vercel account (free)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-saas.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```bash
# App
NEXT_PUBLIC_APP_NAME=YourApp
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NODE_ENV=production
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
DATABASE_URL=postgresql://...

# Stripe (use LIVE keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_xxx

# Mailgun
MAILGUN_API_KEY=your_key
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_NOREPLY=YourApp <noreply@mg.yourdomain.com>
MAILGUN_FROM_ADMIN=Support <support@mg.yourdomain.com>
MAILGUN_SIGNING_KEY=your_key
```

### Step 4: Deploy

Click "Deploy" - Vercel will build and deploy automatically.

### Step 5: Configure Webhooks

Update webhook URLs in Stripe/LemonSqueezy:
- Stripe: `https://your-domain.vercel.app/api/stripe/webhook`
- LemonSqueezy: `https://your-domain.vercel.app/api/lemonsqueezy/webhook`

### Step 6: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as shown
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

---

## Railway

### Prerequisites
- GitHub account
- Railway account (free tier available)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-saas.git
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will detect Next.js automatically

### Step 3: Add Environment Variables

In Railway dashboard, go to **Variables** and add all environment variables (same as Vercel above).

### Step 4: Configure Build

Railway auto-detects Next.js. If needed, set:
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`

### Step 5: Deploy

Railway will automatically build and deploy.

Your app will be available at: `https://your-app.up.railway.app`

### Step 6: Configure Webhooks

Update webhook URLs in Stripe/LemonSqueezy:
- Stripe: `https://your-app.up.railway.app/api/stripe/webhook`
- LemonSqueezy: `https://your-app.up.railway.app/api/lemonsqueezy/webhook`

### Step 7: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS:
   ```
   CNAME  @    your-app.up.railway.app  3600
   CNAME  www  your-app.up.railway.app  3600
   ```
4. Update `NEXT_PUBLIC_SITE_URL`

---

## Docker (Self-Hosted)

### 🎯 Choose Your Database Setup

Docker supports **3 database configurations**:

1. **Supabase/Neon** (✅ RECOMMENDED for production)
2. **Local PostgreSQL** (⚠️ Development only)
3. **Local MongoDB** (⚠️ Development/Testing only)

---

### Option 1: Docker with Supabase (✅ RECOMMENDED)

**Best for:** Production, Development, All environments

**Why Supabase?**
- ✅ Managed database (no maintenance)
- ✅ Built-in authentication
- ✅ Automatic backups
- ✅ Free tier available (500MB, 50K MAU)
- ✅ Scales automatically
- ✅ Global CDN

#### Prerequisites
- Docker & Docker Compose installed
- Supabase account ([app.supabase.com](https://app.supabase.com))
- Server with public IP (DigitalOcean, AWS, Hetzner, etc.)

#### Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Name**: Your app name
   - **Database Password**: Generate strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
4. Wait ~2 minutes for provisioning

#### Step 2: Get Supabase Credentials

Go to **Project Settings** → **API**:

```bash
# Supabase URL
https://xxxxx.supabase.co

# Anon/Public Key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (SECRET!)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Go to **Project Settings** → **Database** → **Connection String** → **URI**:

```bash
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres
```

#### Step 3: Configure Environment

On your server, create `.env.production`:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=YourApp
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
NEXT_PUBLIC_PAYMENT_PROVIDER=stripe

# Supabase (from Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database (from Step 2)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres

# Stripe (use LIVE keys for production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_xxx

# Mailgun
MAILGUN_API_KEY=your_key
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_NOREPLY=YourApp <noreply@mg.yourdomain.com>
MAILGUN_FROM_ADMIN=Support <support@mg.yourdomain.com>
MAILGUN_SIGNING_KEY=your_key

# Disable Husky in Docker
HUSKY=0
```

#### Step 4: Deploy Database Schema

```bash
# Install dependencies
pnpm install

# Deploy schema to Supabase
pnpm db:push
```

#### Step 5: Build and Run Docker

```bash
# Clone repository
git clone https://github.com/yourusername/shipfree.git
cd shipfree

# Build and start (uses docker/prod/docker-compose.yml)
pnpm docker:prod:build

# Or manually:
docker-compose -f docker/prod/docker-compose.yml up -d --build
```

**What happens:**
- ✅ Docker builds and runs your Next.js app
- ✅ App connects to Supabase (external)
- ✅ No local database container
- ✅ Supabase handles auth + database

#### Step 6: Verify Deployment

```bash
# Check containers are running
docker ps

# View logs
pnpm docker:logs

# Test health endpoint
curl http://localhost:3000/api/health
```

Visit: `http://your-server-ip:3000`

#### Step 7: Configure Nginx (Recommended)

Create `/etc/nginx/sites-available/your-saas`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/your-saas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 8: SSL Certificate

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Step 9: Configure Webhooks

Update webhook URLs in Stripe/LemonSqueezy:
- Stripe: `https://yourdomain.com/api/stripe/webhook`
- LemonSqueezy: `https://yourdomain.com/api/lemonsqueezy/webhook`

#### Docker Commands

```bash
# View logs
pnpm docker:logs

# Stop
pnpm docker:down

# Restart
docker-compose -f docker/prod/docker-compose.yml restart

# Rebuild and restart
pnpm docker:prod:build

# View container status
docker ps

# Access container shell
docker-compose -f docker/prod/docker-compose.yml exec app sh
```

---

### Option 2: Docker with Local PostgreSQL (⚠️ Development Only)

**Best for:** Local development, testing, offline work

**⚠️ WARNING:** Never use in production! No backups, no scaling, no redundancy.

#### Why Local PostgreSQL?

- ✅ Offline development (no internet required)
- ✅ Fast (no network latency)
- ✅ Free (no cloud costs)
- ✅ Full control (direct database access)
- ⚠️ NOT for production (no backups, no scaling)

#### Prerequisites
- Docker & Docker Compose installed
- Supabase account (still needed for auth)

#### Step 1: Configure Environment

Create `.env.docker`:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=YourApp
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Supabase (still needed for auth)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database (automatically set by docker-compose)
DATABASE_URL=postgresql://devuser:devpass@postgres:5432/shipfreedev

# Stripe (test mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Mailgun (or skip emails)
SKIP_EMAILS=true

# Disable Husky
HUSKY=0
```

#### Step 2: Start Docker with PostgreSQL

```bash
# Development with local PostgreSQL
pnpm docker:dev:postgres

# Or manually:
docker-compose -f docker/dev/docker-compose.postgres.yml up
```

**What happens:**
- ✅ Docker runs your Next.js app
- ✅ Docker runs PostgreSQL container
- ✅ Docker runs PgAdmin (database UI)
- ✅ App connects to local PostgreSQL

#### Step 3: Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| App | http://localhost:3000 | - |
| PgAdmin | http://localhost:5050 | admin@example.com / admin |
| Portainer | http://localhost:9000 | Set on first visit |

#### Step 4: Run Migrations

```bash
# Deploy schema to local PostgreSQL
docker-compose -f docker/dev/docker-compose.postgres.yml exec app pnpm db:push

# Open database studio
docker-compose -f docker/dev/docker-compose.postgres.yml exec app pnpm db:studio
```

#### Step 5: Backup Local Database

```bash
# Backup
docker-compose -f docker/dev/docker-compose.postgres.yml exec postgres pg_dump -U devuser shipfreedev > backup.sql

# Restore
docker-compose -f docker/dev/docker-compose.postgres.yml exec -T postgres psql -U devuser shipfreedev < backup.sql
```

#### Docker Commands

```bash
# Stop
pnpm docker:dev:down

# View logs
docker-compose -f docker/dev/docker-compose.postgres.yml logs -f

# Restart
docker-compose -f docker/dev/docker-compose.postgres.yml restart

# Remove volumes (delete data)
docker-compose -f docker/dev/docker-compose.postgres.yml down -v
```

---

### Option 3: Docker with Local MongoDB (⚠️ Development Only)

**Best for:** Testing MongoDB, learning

**⚠️ WARNING:** Never use in production! Different database type (not PostgreSQL).

#### Why Local MongoDB?

- ✅ Offline development
- ✅ Fast for testing
- ✅ Free
- ⚠️ NOT for production
- ⚠️ Different database (not PostgreSQL)

#### Prerequisites
- Docker & Docker Compose installed
- Supabase account (still needed for auth)

#### Step 1: Configure Environment

Create `.env.docker`:

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=YourApp
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Supabase (still needed for auth)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Database (automatically set by docker-compose)
MONGODB_URI=mongodb://devroot:devpass@mongodb:27017/shipfreedev?authSource=admin

# Other services...
SKIP_EMAILS=true
HUSKY=0
```

#### Step 2: Start Docker with MongoDB

```bash
# Development with local MongoDB
pnpm docker:dev:mongodb

# Or manually:
docker-compose -f docker/dev/docker-compose.mongodb.yml up
```

**What happens:**
- ✅ Docker runs your Next.js app
- ✅ Docker runs MongoDB container
- ✅ Docker runs Mongo Express (database UI)
- ✅ App connects to local MongoDB

#### Step 3: Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| App | http://localhost:3000 | - |
| Mongo Express | http://localhost:8081 | admin / securepass |
| Portainer | http://localhost:9000 | Set on first visit |

#### Docker Commands

```bash
# Stop
pnpm docker:dev:down

# View logs
docker-compose -f docker/dev/docker-compose.mongodb.yml logs -f

# Restart
docker-compose -f docker/dev/docker-compose.mongodb.yml restart
```

---

### 🎯 Quick Decision Guide

#### For Production (ALWAYS)

```
✅ Use: Supabase or Neon
   Command: pnpm docker:prod:build
   File: docker/prod/docker-compose.yml
   Database: External (managed, backed up, scalable)
```

#### For Development

```
✅ Recommended: Supabase (same as production)
   Command: pnpm docker:dev
   File: docker/dev/docker-compose.yml
   Database: External (Supabase)

✅ Alternative: Local PostgreSQL (offline work)
   Command: pnpm docker:dev:postgres
   File: docker/dev/docker-compose.postgres.yml
   Database: Docker container (local)
```

---

### 📊 Database Comparison

| Feature | Supabase | Local PostgreSQL | Local MongoDB |
|---------|----------|------------------|---------------|
| **Production Ready** | ✅ Yes | ❌ No | ❌ No |
| **Automatic Backups** | ✅ Yes | ❌ No | ❌ No |
| **Scaling** | ✅ Auto | ❌ Manual | ❌ Manual |
| **Maintenance** | ✅ Managed | ⚠️ Manual | ⚠️ Manual |
| **Cost** | ✅ Free tier | ✅ Free | ✅ Free |
| **Offline Work** | ❌ No | ✅ Yes | ✅ Yes |
| **Auth Included** | ✅ Yes | ❌ No | ❌ No |
| **Use Case** | Production & Dev | Dev only | Testing only |

---

### 🔧 Troubleshooting Docker

#### Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

#### Container Won't Start

```bash
# View logs
pnpm docker:logs

# Check container status
docker ps -a

# Remove and rebuild
pnpm docker:down
docker system prune -a
pnpm docker:prod:build
```

#### Database Connection Failed

```bash
# Check database is running (for local PostgreSQL)
docker ps | grep postgres

# Check database logs
docker-compose -f docker/dev/docker-compose.postgres.yml logs postgres

# Verify DATABASE_URL
echo $DATABASE_URL
```

#### Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose -f docker/prod/docker-compose.yml build --no-cache

# Check Dockerfile syntax
docker-compose -f docker/prod/docker-compose.yml config
```

#### Hot Reload Not Working (Dev)

```bash
# Ensure volumes are mounted correctly
docker-compose -f docker/dev/docker-compose.yml down
docker-compose -f docker/dev/docker-compose.yml up

# Check volume mounts
docker-compose -f docker/dev/docker-compose.yml config
```

---

### 📦 Docker File Structure

```
docker/
├── dev/
│   ├── Dockerfile                      # Development image
│   ├── docker-compose.yml              # With Supabase/Neon
│   ├── docker-compose.postgres.yml     # With local PostgreSQL
│   └── docker-compose.mongodb.yml      # With local MongoDB
└── prod/
    ├── Dockerfile                      # Production image (multi-stage)
    ├── docker-compose.yml              # With Supabase/Neon
    ├── docker-compose.postgres.yml     # ⚠️ Never use in production
    └── docker-compose.mongodb.yml      # ⚠️ Never use in production

Root:
├── .dockerignore                       # Optimized ignore file
├── .env.docker                         # Development environment
├── .env.docker.example                 # Environment template
└── .env.production                     # Production environment
```

---

### 🔒 Security Best Practices

#### Development
- ✅ Use dummy credentials (already configured)
- ✅ Don't expose to public internet
- ✅ Use local network only

#### Production
- ⚠️ **Change default database passwords!**
- ⚠️ **Use environment variables for secrets**
- ⚠️ **Enable firewall rules**
- ⚠️ **Use HTTPS (Nginx + Let's Encrypt)**
- ⚠️ **Regular security updates**
- ⚠️ **Never use local database in production**

**Secure database passwords:**

```bash
# Generate strong password
openssl rand -base64 32

# Use in .env.production
DATABASE_PASSWORD=your_secure_random_password_here
```

---

### 📈 Monitoring Docker

#### Health Checks

**App health:**
```bash
curl http://localhost:3000/api/health
```

**Database health (local PostgreSQL):**
```bash
docker-compose -f docker/prod/docker-compose.postgres.yml exec postgres pg_isready
```

#### Portainer (Container Management)

Access: http://localhost:9000

**Features:**
- Container management
- Resource usage monitoring
- Logs viewer
- Console access
- Volume management

#### View Logs

```bash
# All services
pnpm docker:logs

# Specific service
docker-compose -f docker/prod/docker-compose.yml logs app

# Follow logs
docker-compose -f docker/prod/docker-compose.yml logs -f app

# Last 100 lines
docker-compose -f docker/prod/docker-compose.yml logs --tail=100 app
```

---

### 🚀 Updating Your Docker Deployment

#### Update Application Code

```bash
# Pull latest code
git pull

# Rebuild and restart
pnpm docker:prod:build

# Or manually
docker-compose -f docker/prod/docker-compose.yml up -d --build
```

#### Update Docker Images

```bash
# Pull latest base images
docker-compose -f docker/prod/docker-compose.yml pull

# Rebuild
pnpm docker:prod:build
```

#### Update Database Schema

```bash
# Run migrations
docker-compose -f docker/prod/docker-compose.yml exec app pnpm db:push

# Or from host
pnpm db:push
```

---

### 💰 Cost Estimates (Docker Self-Hosted)

#### Server Costs

| Provider | Plan | Price | Specs |
|----------|------|-------|-------|
| **DigitalOcean** | Basic Droplet | $6/month | 1 vCPU, 1GB RAM |
| **DigitalOcean** | Standard | $12/month | 2 vCPU, 2GB RAM |
| **Hetzner** | CX11 | €4/month | 1 vCPU, 2GB RAM |
| **Hetzner** | CX21 | €6/month | 2 vCPU, 4GB RAM |
| **AWS** | t3.micro | ~$10/month | 2 vCPU, 1GB RAM |
| **AWS** | t3.small | ~$20/month | 2 vCPU, 2GB RAM |

#### Additional Costs

- **Domain**: $10-15/year
- **Supabase**: Free tier (500MB, 50K MAU)
- **Mailgun**: Free tier (5K emails/month)
- **Stripe/LemonSqueezy**: Transaction fees only
- **SSL Certificate**: Free (Let's Encrypt)

**Total Monthly Cost:** $6-20/month (server only)

---

## DNS Configuration

### For Vercel

```dns
A      @    76.76.21.21              3600
CNAME  www  cname.vercel-dns.com     3600
```

### For Railway

```dns
CNAME  @    your-app.up.railway.app  3600
CNAME  www  your-app.up.railway.app  3600
```

### For Self-Hosted (Docker)

```dns
A      @    YOUR_SERVER_IP           3600
A      www  YOUR_SERVER_IP           3600
```

### Email DNS (Mailgun)

```dns
# SPF
TXT    mg    "v=spf1 include:mailgun.org ~all"    3600

# DKIM (get from Mailgun dashboard)
TXT    k1._domainkey.mg    "k=rsa; p=MIGfMA0..."    3600

# Tracking
CNAME  email.mg    mailgun.org    3600

# DMARC
TXT    _dmarc    "v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com"    3600
```

---

## Production Checklist

### Before Launch

**Environment:**
- [ ] All environment variables set to PRODUCTION values
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] Stripe/LemonSqueezy using LIVE keys (not test keys)

**Database:**
- [ ] Migrations applied in Supabase
- [ ] RLS policies enabled
- [ ] Database backups configured

**Webhooks:**
- [ ] Webhook URLs updated to production domain
- [ ] Webhook secrets configured
- [ ] Test webhook delivery

**Email:**
- [ ] Mailgun DNS verified (all green)
- [ ] Test email sent successfully
- [ ] Email deliverability score 8+/10

**Security:**
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Service role key kept secret
- [ ] CORS configured correctly

**Testing:**
- [ ] User registration works
- [ ] Email verification works
- [ ] Payment flow tested
- [ ] Webhooks processing correctly
- [ ] Subscription status updating

**Legal:**
- [ ] Privacy Policy updated
- [ ] Terms of Service updated
- [ ] Cookie policy (if needed)

---

## Monitoring

### Vercel

Built-in monitoring:
- **Analytics**: Vercel dashboard
- **Logs**: Real-time logs in dashboard
- **Errors**: Automatic error tracking

### Railway

Built-in monitoring:
- **Metrics**: CPU, memory, network
- **Logs**: Real-time logs
- **Deployments**: Deployment history

### Docker

Recommended tools:
- **Uptime**: UptimeRobot, Pingdom
- **Errors**: Sentry
- **Logs**: Papertrail, Logtail
- **Metrics**: Prometheus + Grafana

---

## Scaling

### Vercel
- Automatically scales
- Serverless functions
- Edge network (CDN)
- No configuration needed

### Railway
- Vertical scaling: Increase resources
- Horizontal scaling: Add replicas
- Configure in dashboard

### Docker
- Use Docker Swarm or Kubernetes
- Load balancer (Nginx, HAProxy)
- Multiple containers
- Database read replicas

---

## Backup & Recovery

### Database Backups

**Supabase:**
- Automatic daily backups (free tier: 7 days)
- Manual backups: Project Settings → Database → Backups

**Manual Backup:**
```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Application Backups

- Code: GitHub (version control)
- Environment variables: Store securely (1Password, etc.)
- Database: Supabase automatic backups

---

## Troubleshooting

### Build Fails

**Check:**
- Node.js version (18+ or 20+)
- All dependencies in `package.json`
- TypeScript errors: `pnpm build` locally
- Environment variables set

**Fix:**
```bash
# Locally
pnpm install
pnpm build

# If successful, push to GitHub
git push
```

### Application Not Loading

**Check:**
- Deployment status in dashboard
- Environment variables configured
- DNS records correct
- HTTPS certificate valid

### Webhooks Not Working

**Check:**
- Webhook URL publicly accessible
- Webhook secret correct
- Check `webhook_events` table for errors
- Test webhook delivery in Stripe/LemonSqueezy dashboard

### Database Connection Failed

**Check:**
- `DATABASE_URL` correct
- Database not paused (free tier)
- Firewall allows connections
- Supabase project active

---

## Performance Optimization

### Vercel
- Automatic edge caching
- Image optimization built-in
- Serverless functions

### Railway
- Enable caching
- Use CDN for static assets
- Optimize database queries

### Docker
- Use Nginx for static files
- Enable gzip compression
- Configure caching headers
- Use CDN (Cloudflare)

---

## Cost Estimates

### Vercel
- **Free tier**: Hobby projects
- **Pro**: $20/month (production apps)
- **Enterprise**: Custom pricing

### Railway
- **Hobby tier**: $5 credit/month
- **Developer**: $5/month + usage
- **Team**: $20/month + usage

### Docker (Self-Hosted)
- **DigitalOcean**: $6-12/month (droplet)
- **AWS**: $10-30/month (t3.micro)
- **Hetzner**: €4-8/month (VPS)

### Additional Costs
- **Domain**: $10-15/year
- **Supabase**: Free tier sufficient for start
- **Mailgun**: Free tier (5K emails/month)
- **Stripe/LemonSqueezy**: Transaction fees only

---

## Support

- **Setup Issues**: [SETUP.md](SETUP.md)
- **Database Issues**: [DATABASE_SETUP.md](DATABASE_SETUP.md)
- **General Help**: GitHub Issues

---

**Last Updated:** January 9, 2026
