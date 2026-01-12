# Blog Content

This directory contains all blog posts in Markdown format.

## Creating a New Blog Post

1. Create a new `.md` file in this directory
2. Add frontmatter at the top:

```markdown
---
title: "Your Post Title"
excerpt: "A brief description of your post (used in previews and SEO)"
date: "2026-01-08"
author: "Your Name"
tags: ["tag1", "tag2", "tag3"]
image: "/blog/your-image.jpg"
---

# Your Post Title

Your content here...
```

## Frontmatter Fields

- **title** (required): The title of your blog post
- **excerpt** (required): Short description (150-160 characters recommended)
- **date** (required): Publication date in YYYY-MM-DD format
- **author** (required): Author name
- **tags** (required): Array of tags for categorization
- **image** (optional): Featured image path (relative to /public)

## Writing Tips

1. **Use descriptive titles** - Good for SEO and readers
2. **Write compelling excerpts** - This appears in search results
3. **Add relevant tags** - Helps with categorization and SEO
4. **Include images** - Makes posts more engaging
5. **Use headings** - Structure your content with H2, H3, etc.
6. **Internal links** - Link to other pages on your site
7. **External links** - Link to authoritative sources

## Markdown Support

The blog supports standard Markdown:

- **Bold text**: `**bold**`
- *Italic text*: `*italic*`
- [Links](url): `[text](url)`
- `Code`: `` `code` ``
- Code blocks: ` ```language ... ``` `
- Lists, quotes, and more

## SEO Optimization

Each blog post automatically generates:
- Meta tags (title, description)
- OpenGraph tags (for social sharing)
- Twitter Card tags
- Structured data (BlogPosting schema)
- Automatic sitemap inclusion

## Example Posts

Check out the existing posts in this directory for examples:
- `getting-started.md` - Tutorial style
- `seo-best-practices.md` - Educational content
- `stripe-integration.md` - Technical guide

## Publishing

Posts are automatically published when you:
1. Add the `.md` file to this directory
2. Deploy your application

No additional configuration needed!
