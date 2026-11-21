import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProjects = (await getAllProjects()).filter(
    (project) => project.featured
  );

  return (
    <>
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Hi, I&apos;m Xipeng (Mars) Ma
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
          MS in Business Analytics at Santa Clara University
        </h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          I turn data into decisions. Focused on data analytics today, with
          longer-term interests in quantitative finance and AI.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            View My Projects
          </Link>
          <Link
            href="/contact-me-server-form"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:border-zinc-950 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-50"
          >
            Contact Me
          </Link>
        </div>
      </section>
      <section className="w-full px-6 pb-24">
        <h2 className="mx-auto w-full max-w-4xl text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Featured Projects
        </h2>
        <div className="mx-auto mt-6 grid w-full max-w-4xl gap-6 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
