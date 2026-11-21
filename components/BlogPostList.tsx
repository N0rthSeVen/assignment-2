"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogs/store";
import BlogPostEditForm from "./BlogPostEditForm";
import { failureClasses } from "./formStyles";

export default function BlogPostList({
  posts,
  loadFailed,
  onUpdated,
  onDeleted,
}: {
  posts: BlogPost[] | null;
  loadFailed: boolean;
  onUpdated?: (oldSlug: string, post: BlogPost) => void;
  onDeleted?: (slug: string) => void;
}) {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [deleteFailed, setDeleteFailed] = useState(false);

  const adminControls = Boolean(onUpdated && onDeleted);

  async function handleDelete(slug: string) {
    if (!onDeleted) {
      return;
    }
    setDeletingSlug(slug);
    setDeleteFailed(false);

    let response: Response;
    try {
      response = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
    } catch {
      setDeleteFailed(true);
      setDeletingSlug(null);
      return;
    }

    if (response.status === 200) {
      setDeletingSlug(null);
      onDeleted(slug);
      return;
    }

    setDeleteFailed(true);
    setDeletingSlug(null);
  }

  return (
    <>
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
              key={post.slug}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              {adminControls && editingSlug === post.slug ? (
                <BlogPostEditForm
                  post={post}
                  onUpdated={(oldSlug, updated) => {
                    setEditingSlug(null);
                    onUpdated?.(oldSlug, updated);
                  }}
                  onCancel={() => setEditingSlug(null)}
                />
              ) : (
                <>
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
                  {adminControls && (
                    <>
                      {deleteFailed && deletingSlug === null && (
                        <p role="alert" className={`${failureClasses} mt-3`}>
                          Could not delete this post. Please try again.
                        </p>
                      )}
                      <div className="mt-3 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingSlug(post.slug)}
                          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.slug)}
                          disabled={deletingSlug !== null}
                          className="rounded-full border border-red-600 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950"
                        >
                          {deletingSlug === post.slug
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
