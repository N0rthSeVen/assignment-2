import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function ProjectPage(
  props: PageProps<"/projects/[slug]">
) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/projects"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Projects
        </Link>
        <p className="mt-8 text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
          {project.context}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {project.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {project.summary}
        </p>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            View on GitHub
          </a>
        )}
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tag}
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          Overview
        </h2>
        <div className="mt-4 space-y-4 leading-7 text-zinc-600 dark:text-zinc-400">
          {project.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
          Highlights
        </h2>
        <ul className="mt-4 space-y-2">
          {project.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex gap-2 text-zinc-600 dark:text-zinc-400"
            >
              <span aria-hidden className="text-blue-600 dark:text-blue-400">
                ▸
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
