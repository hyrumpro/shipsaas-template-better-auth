import Link from "next/link";
import { ArrowLeft, Twitter, Linkedin } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  formattedDate: string;
  readingTime: string;
  author: string;
  tags: string[];
  image?: string;
};

export function BlogPostContent({ post }: { post: Post }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/blog/${post.slug}`;

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to blog
      </Link>

      <header className="mt-10">
        {post.tags.length > 0 && (
          <p className="eyebrow">{post.tags.join(" · ")}</p>
        )}
        <h1 className="text-display-xl mt-3 text-balance">{post.title}</h1>
        <p className="text-foreground/70 mt-4 text-lg leading-relaxed">
          {post.excerpt}
        </p>
        <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span>{post.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{post.formattedDate}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      {post.image && (
        <figure className="mt-10 overflow-hidden rounded-lg border border-border">
          <img
            src={post.image}
            alt={post.title}
            className="h-auto w-full"
          />
        </figure>
      )}

      <div
        className="prose mt-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <hr className="border-border my-12" />

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-muted-foreground text-sm">Share</span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            post.title
          )}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border bg-background text-foreground hover:bg-accent inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors"
        >
          <Twitter className="size-3.5" aria-hidden />
          Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border bg-background text-foreground hover:bg-accent inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors"
        >
          <Linkedin className="size-3.5" aria-hidden />
          LinkedIn
        </a>
      </div>
    </article>
  );
}
