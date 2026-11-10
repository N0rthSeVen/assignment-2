import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{project.context}</p>
      <h3 className="mt-2 text-lg font-semibold group-hover:text-indigo-600">{project.title}</h3>
      <p className="mt-2 text-stone-600">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <li key={item} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm font-medium text-indigo-600">Read more →</p>
    </Link>
  );
}
