"use client";

import ProjectCreateForm from "@/components/ProjectCreateForm";
import AdminProjectList from "@/components/AdminProjectList";
import { useProjects } from "@/lib/projects/useProjects";

export default function AdminProjectsPage() {
  const { projects, loadFailed, addProject, updateProject, removeProject } =
    useProjects();

  return (
    <div className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Projects
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Create new projects, update the basics, or remove ones you no longer
          want listed.
        </p>

        <div className="mt-10 rounded-xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
          <ProjectCreateForm onCreated={addProject} />
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Existing Projects
          </h2>
          <AdminProjectList
            projects={projects}
            loadFailed={loadFailed}
            onUpdated={updateProject}
            onDeleted={removeProject}
          />
        </section>
      </div>
    </div>
  );
}
