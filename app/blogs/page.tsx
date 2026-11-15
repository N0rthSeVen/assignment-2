"use client";

import BlogPostList from "@/components/BlogPostList";
import { useBlogPosts } from "@/lib/blogs/useBlogPosts";

export default function BlogsPage() {
  const { posts, loadFailed } = useBlogPosts();

  return (
    <div className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Blog
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Posts and write-ups, newest first.
        </p>
        <div className="mt-10">
          <BlogPostList posts={posts} loadFailed={loadFailed} />
        </div>
      </div>
    </div>
  );
}
