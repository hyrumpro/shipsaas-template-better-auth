import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogList } from "@/components/blog/BlogList";
import { BlogNavbar } from "@/components/blog/BlogNavbar";
import { BlogFooter } from "@/components/blog/BlogFooter";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest articles, tutorials, and updates from our team",
  openGraph: {
    title: "Blog | ShipSaaS",
    description: "Latest articles, tutorials, and updates",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <BlogNavbar />
      <BlogList posts={posts} />
      <BlogFooter />
    </>
  );
}
