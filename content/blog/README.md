# Blog Content

This directory contains all blog posts in Markdown format.

## 📝 Creating a New Blog Post

1. Create a new `.md` file in this directory (e.g., `my-new-post.md`)
2. Add frontmatter and content:

```markdown
---
title: "Your Post Title"
excerpt: "Brief description (150-160 characters for SEO)"
date: "2026-01-15"
author: "Your Name"
tags: ["tutorial", "nextjs", "saas"]
image: "/images/your-image.png"
---

# Your Post Title

Your content here using Markdown...
```

3. Add featured image to `public/images/`
4. Deploy - your post appears automatically!

## 🖼️ Adding Images

1. Add images to `public/images/`
2. Reference in frontmatter: `image: "/images/your-image.png"`
3. Use descriptive filenames (good for SEO)

## ✅ Frontmatter Fields

- **title** (required): Post title
- **excerpt** (required): Short description for previews and SEO
- **date** (required): Publication date (YYYY-MM-DD format)
- **author** (required): Author name
- **tags** (required): Array of tags for categorization
- **image** (optional): Featured image path

## 📖 Markdown Support

- **Bold**: `**text**`
- *Italic*: `*text*`
- [Links](url): `[text](url)`
- `Code`: `` `code` ``
- Code blocks: ` ```language ... ``` `
- Headings: `## H2`, `### H3`
- Lists, quotes, tables, and more

## 🚀 SEO Features

Each post automatically gets:
- Meta tags (title, description)
- OpenGraph tags (social sharing)
- Twitter Card tags
- Structured data (BlogPosting schema)
- Sitemap inclusion
- Reading time calculation

## 📚 Example Posts

Check existing posts for reference:
- `getting-started.md` - Tutorial style
- `seo-best-practices.md` - Educational content
- `stripe-integration.md` - Technical guide

That's it! No build configuration needed - just write and deploy.
