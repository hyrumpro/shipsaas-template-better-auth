"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

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

type BlogListProps = {
  posts: Post[];
};

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass border-primary/20">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Blog & Resources
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Learn & <span className="text-gradient">Grow</span>
          </h1>

          <p className="text-xl text-muted-foreground">
            Tutorials, best practices, and insights to help you build better
            SaaS products
          </p>
        </motion.div>
      </div>

      <div className="container px-4">
        <div className="max-w-7xl mx-auto">
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="glass-strong rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                      {post.image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={post.date}>
                              {post.formattedDate}
                            </time>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{post.readingTime}</span>
                          </div>
                        </div>

                        <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                          <span>Read article</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No posts yet</h3>
              <p className="text-muted-foreground text-lg">
                Check back soon for tutorials and insights!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
