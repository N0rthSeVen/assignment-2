"use client";

import BlogPostForm from "@/components/BlogPostForm";
import BlogPostList from "@/components/BlogPostList";
import { useBlogPosts } from "@/lib/blogs/useBlogPosts";

export default function AdminBlogsPage() {
  const { posts, loadFailed, reload } = useBlogPosts();

  return (
    <div className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Blog Posts
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Create new posts and review the ones published so far.
        </p>

        <div className="mt-10 rounded-xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
          <BlogPostForm onCreated={reload} />
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Existing Posts
          </h2>
          <BlogPostList posts={posts} loadFailed={loadFailed} />
        </section>
      </div>
    </div>
  );
}
