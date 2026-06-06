import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  formattedDate: string;
  readingTime: string;
  author: string;
  tags: string[];
  image?: string;
};

export function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-32 text-center">
        <BookOpen
          className="text-muted-foreground mx-auto size-8"
          aria-hidden
        />
        <h2 className="mt-4 text-xl font-semibold">No posts yet</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Check back soon for tutorials and updates.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow">Blog</p>
        <h1 className="text-display mt-3 text-balance">
          Notes on building SaaS.
        </h1>
        <p className="text-foreground/70 mt-4 text-base leading-relaxed md:text-lg">
          Tutorials, changelog entries, and engineering notes from the team.
        </p>
      </div>

      <ul className="mt-12 divide-border divide-y border-y border-border">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-1 gap-6 py-8 transition-colors hover:opacity-100 md:grid-cols-[12rem_1fr] md:gap-10"
            >
              <div className="text-muted-foreground flex flex-col gap-1 text-xs">
                <time dateTime={post.date}>{post.formattedDate}</time>
                <span>{post.readingTime}</span>
              </div>

              <div>
                <h2 className="text-foreground group-hover:text-foreground/80 text-lg font-semibold tracking-tight md:text-xl">
                  {post.title}
                </h2>
                <p className="text-foreground/70 mt-2 text-sm leading-relaxed md:text-base">
                  {post.excerpt}
                </p>
                <div className="text-muted-foreground mt-4 inline-flex items-center gap-1.5 text-sm">
                  Read article
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
