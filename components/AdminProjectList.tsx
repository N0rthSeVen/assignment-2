"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects";
import ProjectEditForm from "./ProjectEditForm";
import { failureClasses } from "./formStyles";

export default function AdminProjectList({
  projects,
  loadFailed,
  onUpdated,
  onDeleted,
}: {
  projects: Project[] | null;
  loadFailed: boolean;
  onUpdated: (project: Project) => void;
  onDeleted: (slug: string) => void;
}) {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [deleteFailed, setDeleteFailed] = useState(false);

  async function handleDelete(slug: string) {
    setDeletingSlug(slug);
    setDeleteFailed(false);

    let response: Response;
    try {
      response = await fetch(`/api/projects/${slug}`, { method: "DELETE" });
    } catch {
      setDeleteFailed(true);
      setDeletingSlug(null);
      return;
    }

    if (response.status === 200) {
      setDeletingSlug(null);
      onDeleted(slug);
      return;
    }

    setDeleteFailed(true);
    setDeletingSlug(null);
  }

  return (
    <>
      {loadFailed && (
        <p role="alert" className={`${failureClasses} mt-4`}>
          Could not load the projects. Please refresh the page.
        </p>
      )}
      {!loadFailed && projects === null && (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Loading projects...
        </p>
      )}
      {projects !== null && projects.length === 0 && (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          No projects yet. Create your first one using the form above.
        </p>
      )}
      {projects !== null && projects.length > 0 && (
        <div className="mt-4 space-y-3">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              {editingSlug === project.slug ? (
                <ProjectEditForm
                  project={project}
                  onUpdated={(updated) => {
                    setEditingSlug(null);
                    onUpdated(updated);
                  }}
                  onCancel={() => setEditingSlug(null)}
                />
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">
                      {project.title}
                    </h2>
                    {project.featured && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {project.slug}
                  </p>
                  {project.summary && (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {project.summary}
                    </p>
                  )}
                  {project.tags.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                  {deleteFailed && deletingSlug === null && (
                    <p role="alert" className={`${failureClasses} mt-3`}>
                      Could not delete this project. Please try again.
                    </p>
                  )}
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingSlug(project.slug)}
                      className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.slug)}
                      disabled={deletingSlug !== null}
                      className="rounded-full border border-red-600 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      {deletingSlug === project.slug ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
