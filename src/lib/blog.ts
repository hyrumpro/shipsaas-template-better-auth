import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { cache } from "react";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  formattedDate: string;
  author: string;
  tags: string[];
  image?: string;
  readingTime: string;
}

const postsDirectory = path.join(process.cwd(), "content/blog");

async function readAllPostsUncached(): Promise<BlogPost[]> {
  try {
    await fs.mkdir(postsDirectory, { recursive: true });
    const fileNames = await fs.readdir(postsDirectory);
    const posts = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map(async (fileName) => {
          const slug = fileName.replace(/\.md$/, "");
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = await fs.readFile(fullPath, "utf8");
          const { data, content } = matter(fileContents);
          const wordCount = content.split(/\s+/).length;
          const readingTime = Math.ceil(wordCount / 200);

          return {
            slug,
            title: data.title || "Untitled",
            excerpt: data.excerpt || "",
            content,
            date: data.date || new Date().toISOString(),
            formattedDate: new Date(
              data.date || new Date()
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            author: data.author || "Anonymous",
            tags: data.tags || [],
            image: data.image,
            readingTime: `${readingTime} min read`,
          };
        })
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

// React `cache` dedupes within a single render. Combined with Next.js
// build-time static rendering of the blog pages, the filesystem is read
// once per worker boot, not once per request.
export const getAllPosts = cache(readAllPostsUncached);

async function readPostBySlugUncached(slug: string): Promise<BlogPost | null> {
  try {
    const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, "");
    if (!safeSlug || safeSlug !== slug) return null;

    const fullPath = path.join(postsDirectory, `${safeSlug}.md`);
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    const htmlContent = await marked(content);

    return {
      slug,
      title: data.title || "Untitled",
      excerpt: data.excerpt || "",
      content: htmlContent,
      date: data.date || new Date().toISOString(),
      formattedDate: new Date(
        data.date || new Date()
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      author: data.author || "Anonymous",
      tags: data.tags || [],
      image: data.image,
      readingTime: `${readingTime} min read`,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export const getPostBySlug = cache(readPostBySlugUncached);

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  const needle = tag.toLowerCase();
  return allPosts.filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(needle)
  );
}
