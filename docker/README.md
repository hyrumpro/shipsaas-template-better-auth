# Docker deployment

The supported container path uses Node 20, npm, the committed
package-lock.json, and Next.js standalone output.

## Local development

    cp .env.docker.example .env.docker
    npm run docker:dev

For a local Postgres instead of a hosted provider:

    npm run docker:dev:postgres

The app is available at http://localhost:3000. The compose files do not
expose Portainer or the Docker socket by default. Add operations tooling
separately if you need it.

## Production container

    cp .env.example .env.production
    # Fill in production values, then:
    npm run docker:prod:build

The production image is multi-stage, runs as a non-root user, and starts the
standalone server on 0.0.0.0:3000. Put TLS and a domain in front of it with
your reverse proxy or hosting provider. The container health check calls
/api/health.

The default production compose file expects an external Postgres-compatible
database such as Supabase or Neon. The Postgres compose variant is useful for
local evaluation, not a recommendation for production data durability.

## Vercel

Vercel uses the same npm run build path. Import the repository, add the
variables from .env.example, apply the migrations/ SQL files, and configure the
selected payment and email webhook URLs. NEXT_PUBLIC_SITE_URL must match the
deployed origin.

## Database migrations

Apply migrations 001 through 003 before enabling webhooks. The initial
migration includes the shared webhook processing claims used by Stripe,
Lemon Squeezy, and Mailgun.
