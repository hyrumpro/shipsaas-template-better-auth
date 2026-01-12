import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

// Ensure blog directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true });
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        // Calculate reading time (average 200 words per minute)
        const wordCount = content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);

        return {
          slug,
          title: data.title || "Untitled",
          excerpt: data.excerpt || "",
          content,
          date: data.date || new Date().toISOString(),
          formattedDate: new Date(data.date || new Date()).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          ),
          author: data.author || "Anonymous",
          tags: data.tags || [],
          image: data.image,
          readingTime: `${readingTime} min read`,
        };
      });

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Calculate reading time
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Convert markdown to HTML (basic conversion)
    // For production, use a proper markdown parser like 'marked' or 'remark'
    const htmlContent = content
      .split("\n\n")
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("\n");

    return {
      slug,
      title: data.title || "Untitled",
      excerpt: data.excerpt || "",
      content: htmlContent,
      date: data.date || new Date().toISOString(),
      formattedDate: new Date(data.date || new Date()).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ),
      author: data.author || "Anonymous",
      tags: data.tags || [],
      image: data.image,
      readingTime: `${readingTime} min read`,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}
