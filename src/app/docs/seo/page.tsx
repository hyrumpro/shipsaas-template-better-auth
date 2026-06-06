import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO",
  description:
    "Sitemap, robots, structured data, and metadata best practices baked into ShipSaaS.",
};

export default function SeoDocsPage() {
  return (
    <article>
      <h1>SEO (Sitemap, robots, JSON-LD)</h1>
      <p>
        ShipSaaS is built on the Next.js Metadata API as the single
        source of truth for <code>&lt;title&gt;</code>,{" "}
        <code>&lt;meta&gt;</code>, Open Graph, and Twitter Card tags.
        Combined with auto-generated <code>sitemap.xml</code> and{" "}
        <code>robots.txt</code>, every page is indexable from the moment
        you deploy.
      </p>

      <h2>Page metadata</h2>
      <p>
        Every route exports a <code>metadata</code> object or a{" "}
        <code>generateMetadata</code> function. Example:
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`// src/app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}`}
      </pre>
      <p>
        Never use <code>&lt;title&gt;</code> or <code>&lt;meta&gt;</code>{" "}
        tags inside a <code>&quot;use client&quot;</code> component &mdash;
        they will be silently dropped. Move the metadata to a server
        component or to the page that owns the route.
      </p>

      <h2>Sitemap</h2>
      <p>
        The sitemap lives at <code>src/app/sitemap.ts</code> and is
        auto-served at <code>/sitemap.xml</code>. It includes the
        static marketing pages plus every blog post pulled from the
        filesystem.
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`// src/app/sitemap.ts
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const posts = await getAllPosts();
  return [
    { url: baseUrl, lastModified: new Date() },
    ...posts.map(p => ({
      url: \`\${baseUrl}/blog/\${p.slug}\`,
      lastModified: new Date(p.date),
    })),
  ];
}`}
      </pre>
      <p>
        Submit <code>https://yourdomain.com/sitemap.xml</code> in
        Google Search Console after you deploy.
      </p>

      <h2>robots.txt</h2>
      <p>
        <code>src/app/robots.ts</code> controls{" "}
        <code>/robots.txt</code>. By default, ShipSaaS disallows{" "}
        <code>/dashboard/</code>, <code>/auth/</code>, and{" "}
        <code>/api/</code> from crawlers.
      </p>

      <h2>Structured data (JSON-LD)</h2>
      <p>
        Use the <code>StructuredData</code> component to inject
        schema.org JSON-LD into any page. The blog detail page ships
        with <code>BlogPosting</code> markup so Google can render rich
        results.
      </p>
      <pre className="not-prose bg-secondary p-4 rounded-md text-sm overflow-x-auto">
{`import { StructuredData } from "@/components/StructuredData";

<StructuredData data={{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  datePublished: post.date,
  author: { "@type": "Person", name: post.author },
}} />`}
      </pre>
      <p>
        <strong>Do not</strong> add <code>aggregateRating</code> or{" "}
        <code>offers</code> schema unless you have real reviews or a
        real product to sell. Google penalizes sites that publish fake
        ratings.
      </p>

      <h2>Open Graph images</h2>
      <p>
        ShipSaaS expects an <code>og-image.png</code> in the{" "}
        <code>public/</code> directory (1200&times;630). Replace the
        placeholder with your own branded image. The Metadata API will
        reference it automatically.
      </p>

      <h2>Canonical URLs</h2>
      <p>
        <code>metadataBase</code> is set in the root layout, so all
        relative Open Graph and canonical URLs are resolved against{" "}
        <code>NEXT_PUBLIC_SITE_URL</code>. Set that env var in every
        environment to avoid canonical mismatch warnings in Search
        Console.
      </p>
    </article>
  );
}
