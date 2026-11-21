"use client";

import { useState, type FormEvent } from "react";
import type { Project } from "@/lib/projects";
import {
  errorClasses,
  failureClasses,
  inputClasses,
  labelClasses,
} from "./formStyles";

type ProjectApiResponse = {
  ok?: boolean;
  project?: Project;
  errors?: Record<string, string>;
};

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

export default function ProjectEditForm({
  project,
  onUpdated,
  onCancel,
}: {
  project: Project;
  onUpdated: (project: Project) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(project.title);
  const [summary, setSummary] = useState(project.summary);
  const [tags, setTags] = useState(project.tags.join(", "));
  const [githubUrl, setGithubUrl] = useState(project.githubUrl ?? "");
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [requestFailed, setRequestFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrors(null);
    setRequestFailed(false);

    let response: Response;
    try {
      response = await fetch(`/api/projects/${project.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          tags: parseTags(tags),
          githubUrl,
          context: project.context,
          description: project.description,
          highlights: project.highlights,
          featured: project.featured,
        }),
      });
    } catch {
      setRequestFailed(true);
      setSaving(false);
      return;
    }

    let body: ProjectApiResponse | null = null;
    try {
      body = (await response.json()) as ProjectApiResponse;
    } catch {
      body = null;
    }

    if (response.status === 200 && body?.ok === true && body.project) {
      onUpdated(body.project);
      return;
    }

    if (response.status === 400 && body?.errors) {
      setErrors(body.errors);
      setSaving(false);
      return;
    }

    setRequestFailed(true);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {requestFailed && (
        <p role="alert" className={failureClasses}>
          Request failed: your changes were not saved. Please try again.
        </p>
      )}

      <div>
        <label htmlFor={`project-title-${project.slug}`} className={labelClasses}>
          Title
        </label>
        <input
          id={`project-title-${project.slug}`}
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClasses}
        />
        {errors?.title && <p className={errorClasses}>{errors.title}</p>}
      </div>

      <div>
        <label
          htmlFor={`project-summary-${project.slug}`}
          className={labelClasses}
        >
          Summary
        </label>
        <textarea
          id={`project-summary-${project.slug}`}
          name="summary"
          rows={3}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className={inputClasses}
        />
        {errors?.summary && <p className={errorClasses}>{errors.summary}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`project-tags-${project.slug}`} className={labelClasses}>
            Tags (comma-separated)
          </label>
          <input
            id={`project-tags-${project.slug}`}
            name="tags"
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className={inputClasses}
          />
          {errors?.tags && <p className={errorClasses}>{errors.tags}</p>}
        </div>

        <div>
          <label
            htmlFor={`project-github-${project.slug}`}
            className={labelClasses}
          >
            GitHub URL (optional)
          </label>
          <input
            id={`project-github-${project.slug}`}
            name="githubUrl"
            type="url"
            value={githubUrl}
            onChange={(event) => setGithubUrl(event.target.value)}
            className={inputClasses}
          />
          {errors?.githubUrl && (
            <p className={errorClasses}>{errors.githubUrl}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
