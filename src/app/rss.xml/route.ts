import { getAllPosts } from "@/lib/blog";

/**
 * RSS 2.0 feed for the blog.
 *
 * Returns application/rss+xml at /rss.xml. Most feed readers pick this
 * up automatically; pair it with the <link rel="alternate"> tag in
 * `src/app/layout.tsx` (already wired).
 */

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteName = "ShipSaaS";
  const siteDescription =
    "Premium Next.js 16 SaaS template — guides, updates, and engineering notes from the team.";

  const posts = await getAllPosts();
  const latestDate =
    posts[0]?.date ?? new Date().toISOString();

  const items = posts
    .slice(0, 50)
    .map((post) => {
      const link = `${baseUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const description = post.excerpt || stripHtml(post.content).slice(0, 280);
      const categories = post.tags
        .map((t) => `      <category>${escapeXml(t)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@shipsaas.com (${escapeXml(post.author)})</author>
      <description><![CDATA[${description}]]></description>
${categories}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} Blog</title>
    <link>${escapeXml(baseUrl)}</link>
    <atom:link href="${escapeXml(baseUrl)}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>
    <generator>ShipSaaS RSS</generator>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
