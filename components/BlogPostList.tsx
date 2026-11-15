import Link from "next/link";
import { failureClasses } from "./formStyles";
import type { BlogPost } from "@/lib/blogs/store";

export default function BlogPostList({
  posts,
  loadFailed,
}: {
  posts: BlogPost[] | null;
  loadFailed: boolean;
}) {
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
    </>
  );
}
