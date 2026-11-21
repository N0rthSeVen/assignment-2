import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const projects = await getAllProjects();

  return (
    <div className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Projects
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Course projects and coursework I have built.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
