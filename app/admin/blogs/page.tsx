"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlogPostForm from "@/components/BlogPostForm";
import { failureClasses } from "@/components/formStyles";
import type { BlogPost } from "@/lib/blogs/store";

type BlogsApiResponse = {
  ok?: boolean;
  posts?: BlogPost[];
};

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadPosts() {
      try {
        const response = await fetch("/api/blogs");
        const body = (await response.json()) as BlogsApiResponse;
        if (cancelled) {
          return;
        }
        if (response.status === 200 && body.ok && body.posts) {
          setPosts(body.posts);
          setLoadFailed(false);
        } else {
          setLoadFailed(true);
        }
      } catch {
        if (!cancelled) {
          setLoadFailed(true);
        }
      }
    }
    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

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
          <BlogPostForm onCreated={() => setReloadKey((key) => key + 1)} />
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Existing Posts
          </h2>
          {loadFailed && (
            <p role="alert" className={`${failureClasses} mt-4`}>
              Could not load the posts. Please refresh the page.
            </p>
          )}
          {!loadFailed && posts === null && (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Loading posts...
            </p>
          )}
          {posts !== null && posts.length === 0 && (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              No posts yet.
            </p>
          )}
          {posts !== null && posts.length > 0 && (
            <ul className="mt-4 space-y-3">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="font-semibold text-zinc-950 hover:underline dark:text-zinc-50"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
