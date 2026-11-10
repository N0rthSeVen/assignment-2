import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project ? project.title : "Project not found" };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="space-y-10">
      <Link href="/projects" className="text-sm text-stone-500 hover:text-stone-900">
        ← All projects
      </Link>

      <PageHeader eyebrow={project.context} title={project.title} description={project.summary} />

      <section>
        <h2 className="mb-3 text-xl font-semibold">The problem</h2>
        <p className="text-stone-700">{project.problem}</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Highlights</h2>
        <ul className="list-disc space-y-2 pl-5 text-stone-700">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Tech</h2>
        <ul className="flex flex-wrap gap-2">
          {project.tech.map((item) => (
            <li key={item} className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {project.link && (
        <a
          href={project.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-medium text-indigo-600 hover:underline"
        >
          {project.link.label} ↗
        </a>
      )}
    </article>
  );
}
