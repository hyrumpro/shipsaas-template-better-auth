# Contributing

Thanks for considering a contribution. This repo is the source of a premium template, so the bar is "would I charge someone for this?".

## Workflow

1. Fork the repo and create a branch off `main`
2. Make your change with a focused commit message
3. Run the local checks before opening a PR:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
4. Open a pull request against `main` and fill in the PR template

The CI workflow runs the same three commands plus a Postgres service. It must pass before a PR can be merged.

## Code conventions

- TypeScript strict mode, no `any` outside clearly justified spots
- Functional React with Server Components by default; `"use client"` only when you need state, effects, or browser APIs
- Drizzle queries live in `src/db/queries.ts`; raw SQL lives in `supabase/migrations/`
- Environment variables go in `.env.example` (committed) — never commit `.env.local`
- The Playbook:
  - Add tests for any new business logic
  - Add migrations for any schema change
  - Update `CHANGELOG.md` under `[Unreleased]`
  - Update `src/app/docs/` if the change affects a public API

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(checkout): add LemonSqueezy subscription pause support
fix(webhooks): realign Stripe invoice id with subscription id
docs(readme): document SUPABASE_WEBHOOK_SECRET rotation
chore(deps): bump drizzle-orm to 0.39.3
```

## Reporting issues

Use the issue templates (`.github/ISSUE_TEMPLATE/`). Bug reports need:

- The exact command or page that fails
- The full error output (redact secrets)
- Your environment (Node version, OS, package manager)
- Steps to reproduce

## Security

Do not file public issues for security vulnerabilities. Email the maintainer listed in `package.json` instead.
