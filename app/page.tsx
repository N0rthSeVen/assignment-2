import ButtonLink from "@/components/ButtonLink";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";
import { site } from "@/lib/site";

const focusAreas = [
  {
    title: "Analytics & reporting",
    text: "Turning raw data into dashboards and reports that people can act on.",
  },
  {
    title: "Optimization",
    text: "Using linear and integer programming to find the best decision under constraints.",
  },
  {
    title: "AI-assisted building",
    text: "Shipping small, tested tools quickly by working with coding agents.",
  },
];

export default function HomePage() {
  const projects = getAllProjects();

  return (
    <div className="space-y-16">
      <section>
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-indigo-600">
          {site.tagline}
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Hi, I&apos;m {site.name}.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-stone-600">
          I&apos;m a Master of Science in Business Analytics student who likes building practical
          data tools — from analytics pipelines and optimization models to small command-line
          utilities.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/projects">See my projects</ButtonLink>
          <ButtonLink href="/contact-me-server-form" variant="secondary">
            Get in touch
          </ButtonLink>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">What I work on</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {focusAreas.map((area) => (
            <div key={area.title} className="rounded-xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold">{area.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{area.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Featured projects</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
