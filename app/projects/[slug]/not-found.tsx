import ButtonLink from "@/components/ButtonLink";

export default function ProjectNotFound() {
  return (
    <div className="py-12 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold">Project not found</h1>
      <p className="mt-3 text-stone-600">
        There&apos;s no project at this address. It may have been renamed, or the link may have a
        typo.
      </p>
      <div className="mt-8">
        <ButtonLink href="/projects">Back to all projects</ButtonLink>
      </div>
    </div>
  );
}
