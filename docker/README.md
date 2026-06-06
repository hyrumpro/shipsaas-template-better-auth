# 🐳 Docker Setup Guide

> **📖 For complete deployment instructions, see [DEPLOYMENT.md](../DEPLOYMENT.md#docker-self-hosted)**

This README provides quick reference commands. For detailed setup with different database options (Supabase, PostgreSQL, MongoDB), see the main deployment guide.

---

## 🚀 Quick Start

### Production (with Supabase - RECOMMENDED)

```bash
# 1. Configure .env.production with Supabase credentials
# 2. Build and start
pnpm docker:prod:build
```

### Development

```bash
# With Supabase (recommended)
pnpm docker:dev

# With local PostgreSQL (offline)
pnpm docker:dev:postgres

# With local MongoDB (testing)
pnpm docker:dev:mongodb
```

---

## 📚 Full Documentation

**See [DEPLOYMENT.md](../DEPLOYMENT.md#docker-self-hosted) for:**
- ✅ Complete setup instructions
- ✅ Database options (Supabase, PostgreSQL, MongoDB)
- ✅ Nginx configuration
- ✅ SSL setup
- ✅ Troubleshooting
- ✅ Security best practices
- ✅ Monitoring and updates

---

## 📁 File Structure

```
docker/
├── dev/
│   ├── Dockerfile                      # Development image
│   ├── docker-compose.yml              # Basic dev setup
│   ├── docker-compose.postgres.yml     # Dev with PostgreSQL
│   └── docker-compose.mongodb.yml      # Dev with MongoDB
└── prod/
    ├── Dockerfile                      # Production image (multi-stage)
    ├── docker-compose.yml              # Basic prod setup
    ├── docker-compose.postgres.yml     # Prod with PostgreSQL
    └── docker-compose.mongodb.yml      # Prod with MongoDB
```

---

## 🔧 Configuration

### 1. Copy Environment File

```bash
# For development
cp .env.docker.example .env.docker

# For production
cp .env.production.example .env.production
```

### 2. Edit Environment Variables

**Development (.env.docker):**
- Use test/dummy values for quick testing
- Or add real Supabase/Stripe credentials

**Production (.env.production):**
- **MUST** use real production credentials
- Use LIVE Stripe keys (not test keys)
- Configure production database

---

## 🗄️ Database Options

> **Important:** For production, **ALWAYS use Supabase or Neon** (external managed database).  
> Local PostgreSQL/MongoDB are for **development/testing only**.

### Option 1: Supabase (✅ RECOMMENDED)

**Best for:** Production, Development, All environments

**Why Supabase?**
- ✅ Managed database (no maintenance)
- ✅ Built-in authentication
- ✅ Automatic backups
- ✅ Free tier available
- ✅ Scales automatically

**How to use:**

```bash
# 1. Create Supabase project at app.supabase.com
# 2. Add credentials to .env.docker or .env.production:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:6543/postgres

# 3. Start Docker (uses basic docker-compose.yml)
pnpm docker:dev              # Development
pnpm docker:prod:build       # Production
```

**What happens:**
- ✅ App runs in Docker container
- ✅ Database hosted on Supabase (external)
- ✅ Auth handled by Supabase (external)
- ✅ No local database container needed

---

### Option 2: Neon (✅ Also Good)

**Best for:** Production, Serverless PostgreSQL

**Why Neon?**
- ✅ Serverless PostgreSQL
- ✅ Auto-scaling
- ✅ Database branching
- ✅ Free tier available

**How to use:**

```bash
# 1. Create Neon project at neon.tech
# 2. Add credentials to .env.docker or .env.production:
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co  # Still need for auth
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# 3. Start Docker (uses basic docker-compose.yml)
pnpm docker:dev              # Development
pnpm docker:prod:build       # Production
```

---

### Option 3: Local PostgreSQL (⚠️ Development Only)

**Best for:** Offline development, testing

**⚠️ WARNING:** Never use in production! No backups, no scaling, no redundancy.

```bash
# Development
pnpm docker:dev:postgres

# Production
pnpm docker:prod:postgres
```

**Includes:**
- PostgreSQL 15 Alpine
- PgAdmin (dev only) - http://localhost:5050
- Automatic health checks
- Data persistence

**Default credentials:**
- Dev: `devuser` / `devpass` / `shipsaasdev`
- Prod: `produser` / `prodpass` / `shipsaasprod`

### Option 3: Local MongoDB

**Best for:** Development, testing with MongoDB

```bash
# Development
pnpm docker:dev:mongodb

# Production
pnpm docker:prod:mongodb
```

**Includes:**
- MongoDB 6
- Mongo Express (dev only) - http://localhost:8081
- Automatic health checks
- Data persistence

**Default credentials:**
- Dev: `devroot` / `devpass`
- Prod: `prodroot` / `prodpass`

---

## 🌐 Access Points

### Development

| Service | URL | Credentials |
|---------|-----|-------------|
| App | http://localhost:3000 | - |
| PgAdmin | http://localhost:5050 | admin@example.com / admin |
| Mongo Express | http://localhost:8081 | admin / securepass |
| Portainer | http://localhost:9000 | Set on first visit |

### Production

| Service | URL | Notes |
|---------|-----|-------|
| App | http://localhost:3000 | Use Nginx reverse proxy |
| Portainer | http://localhost:9000 | Container management |

---

## 📝 Common Commands

### Development

```bash
# Start services
pnpm docker:dev                    # With Supabase/Neon (RECOMMENDED)
pnpm docker:dev:postgres           # With local PostgreSQL (offline dev)
pnpm docker:dev:mongodb            # With local MongoDB (testing)

# Stop services
pnpm docker:dev:down

# View logs
docker-compose -f docker/dev/docker-compose.yml logs -f

# Rebuild
docker-compose -f docker/dev/docker-compose.yml up --build
```

### Production

```bash
# Start services (ALWAYS use Supabase/Neon for production)
pnpm docker:prod:build             # With Supabase/Neon (RECOMMENDED)

# ⚠️ NEVER use these in production:
# pnpm docker:prod:postgres        # Local PostgreSQL - DEV ONLY
# pnpm docker:prod:mongodb         # Local MongoDB - DEV ONLY

# Build and start
pnpm docker:prod:build

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down

# Restart
docker-compose -f docker/prod/docker-compose.yml restart

# Update and rebuild
pnpm docker:prod:build
```

### Database Management

```bash
# Run migrations
docker-compose -f docker/dev/docker-compose.postgres.yml exec app pnpm db:push

# Open database studio
docker-compose -f docker/dev/docker-compose.postgres.yml exec app pnpm db:studio

# Backup PostgreSQL
docker-compose -f docker/prod/docker-compose.postgres.yml exec postgres pg_dump -U produser shipsaasprod > backup.sql

# Restore PostgreSQL
docker-compose -f docker/prod/docker-compose.postgres.yml exec -T postgres psql -U produser shipsaasprod < backup.sql
```

---

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Container Won't Start

```bash
# View logs
docker-compose -f docker/dev/docker-compose.yml logs app

# Check container status
docker ps -a

# Remove and rebuild
docker-compose -f docker/dev/docker-compose.yml down -v
docker-compose -f docker/dev/docker-compose.yml up --build
```

### Database Connection Failed

```bash
# Check database is running
docker-compose -f docker/dev/docker-compose.postgres.yml ps

# Check database logs
docker-compose -f docker/dev/docker-compose.postgres.yml logs postgres

# Verify DATABASE_URL in .env.docker
echo $DATABASE_URL
```

### Hot Reload Not Working (Dev)

```bash
# Ensure volumes are mounted correctly
docker-compose -f docker/dev/docker-compose.yml down
docker-compose -f docker/dev/docker-compose.yml up

# Check volume mounts
docker-compose -f docker/dev/docker-compose.yml config
```

### Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose -f docker/prod/docker-compose.yml build --no-cache

# Check Dockerfile syntax
docker-compose -f docker/prod/docker-compose.yml config
```

---

## 🔒 Security Best Practices

### Development
- ✅ Use dummy credentials (already configured)
- ✅ Don't expose to public internet
- ✅ Use local network only

### Production
- ⚠️ **Change default database passwords!**
- ⚠️ **Use environment variables for secrets**
- ⚠️ **Enable firewall rules**
- ⚠️ **Use HTTPS (Nginx + Let's Encrypt)**
- ⚠️ **Regular security updates**

**Change database passwords:**

```yaml
# docker/prod/docker-compose.postgres.yml
postgres:
  environment:
    - POSTGRES_PASSWORD=${DB_PASSWORD}  # Use env var
```

```bash
# .env.production
DB_PASSWORD=your_secure_random_password_here
```

---

## 📊 Monitoring

### Portainer

Access: http://localhost:9000

**Features:**
- Container management
- Resource usage
- Logs viewer
- Console access
- Volume management

### Health Checks

**App health:**
```bash
curl http://localhost:3000/api/health
```

**Database health:**
```bash
# PostgreSQL
docker-compose -f docker/prod/docker-compose.postgres.yml exec postgres pg_isready

# MongoDB
docker-compose -f docker/prod/docker-compose.mongodb.yml exec mongodb mongosh --eval "db.adminCommand('ping')"
```

---

## 🚀 Production Deployment

### 1. Prepare Server

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin
```

### 2. Clone Repository

```bash
git clone https://github.com/yourusername/shipsaas.git
cd shipsaas
```

### 3. Configure Environment

```bash
cp .env.production.example .env.production
nano .env.production  # Edit with production values
```

### 4. Start Services

```bash
pnpm docker:prod:build
```

### 5. Configure Nginx

See [DEPLOYMENT.md](../DEPLOYMENT.md#docker) for Nginx configuration.

### 6. Setup SSL

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## 📈 Performance Tips

### Development
- Use volume mounts for hot reload
- Limit resource usage if needed:
  ```yaml
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
  ```

### Production
- Use multi-stage builds (already configured)
- Enable production mode
- Use standalone output (already configured)
- Consider using Docker Swarm or Kubernetes for scaling

---

## 🔄 Updates

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
pnpm docker:prod:build
```

### Update Docker Images

```bash
# Pull latest base images
docker-compose -f docker/prod/docker-compose.yml pull

# Rebuild
pnpm docker:prod:build
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Main Deployment Guide](../DEPLOYMENT.md)

---

## 💬 Support

Having issues? Check:
1. This README
2. [DEPLOYMENT.md](../DEPLOYMENT.md)
3. [GitHub Issues](https://github.com/yourusername/shipsaas/issues)

---

**Happy Dockerizing! 🐳**
