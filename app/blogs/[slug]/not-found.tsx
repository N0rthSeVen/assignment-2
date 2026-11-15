import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Post not found
      </h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        Sorry, the post you&apos;re looking for doesn&apos;t exist or may have
        been removed.
      </p>
      <Link
        href="/blogs"
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        Back to Blog
      </Link>
    </section>
  );
}
