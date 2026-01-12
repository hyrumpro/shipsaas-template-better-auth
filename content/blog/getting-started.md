---
title: "Getting Started with ShipFree"
excerpt: "Learn how to set up and deploy your SaaS application in minutes with ShipFree, the open-source alternative to expensive boilerplates."
date: "2026-01-08"
author: "ShipFree Team"
tags: ["tutorial", "getting-started", "saas"]
image: "/blog/getting-started.jpg"
---

# Getting Started with ShipFree

Welcome to ShipFree! This guide will help you get your SaaS application up and running in minutes.

## What is ShipFree?

ShipFree is a free, open-source SaaS boilerplate built with modern technologies like Next.js 16, Supabase, Stripe, and Mailgun. It provides everything you need to launch your startup quickly.

## Prerequisites

Before you begin, make sure you have:

- Node.js 18 or higher installed
- A Supabase account (free tier available)
- A Stripe account for payments
- A Mailgun account for emails

## Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/shipfree.git
cd shipfree
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

4. **Run the development server**

```bash
pnpm dev
```

Your application will be available at http://localhost:3000

## Next Steps

- Configure your Supabase database
- Set up Stripe for payments
- Configure Mailgun for emails
- Deploy to Railway or Vercel

Check out our complete guide for detailed instructions on each step.

## Need Help?

Join our community on GitHub Discussions or open an issue if you encounter any problems.

Happy building! 🚀
