import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/blogs/store";

export default async function BlogPostPage(
  props: PageProps<"/blogs/[slug]">
) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/blogs"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Blog
        </Link>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="mt-8 whitespace-pre-wrap text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {post.content}
        </div>
      </div>
    </article>
  );
}
