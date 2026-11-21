"use client";

import { useState, type FormEvent } from "react";
import type { Project } from "@/lib/projects";
import {
  errorClasses,
  failureClasses,
  inputClasses,
  labelClasses,
  successClasses,
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

export default function ProjectCreateForm({
  onCreated,
}: {
  onCreated?: (project: Project) => void;
}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [created, setCreated] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setErrors(null);
    setCreated(false);
    setRequestFailed(false);

    let response: Response;
    try {
      response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          tags: parseTags(tags),
          githubUrl,
        }),
      });
    } catch {
      setRequestFailed(true);
      setSending(false);
      return;
    }

    let body: ProjectApiResponse | null = null;
    try {
      body = (await response.json()) as ProjectApiResponse;
    } catch {
      body = null;
    }

    if (response.status === 201 && body?.ok === true && body.project) {
      setCreated(true);
      setTitle("");
      setSummary("");
      setTags("");
      setGithubUrl("");
      setSending(false);
      onCreated?.(body.project);
      return;
    }

    if (response.status === 400 && body?.errors) {
      setErrors(body.errors);
      setSending(false);
      return;
    }

    setRequestFailed(true);
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {created && (
        <p role="status" className={successClasses}>
          Project created.
        </p>
      )}

      {requestFailed && (
        <p role="alert" className={failureClasses}>
          Request failed: your project was not saved. Please try again.
        </p>
      )}

      <div>
        <label htmlFor="project-title" className={labelClasses}>
          Title
        </label>
        <input
          id="project-title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClasses}
        />
        {errors?.title && <p className={errorClasses}>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="project-summary" className={labelClasses}>
          Summary
        </label>
        <textarea
          id="project-summary"
          name="summary"
          rows={3}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className={inputClasses}
        />
        {errors?.summary && <p className={errorClasses}>{errors.summary}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="project-tags" className={labelClasses}>
            Tags (comma-separated)
          </label>
          <input
            id="project-tags"
            name="tags"
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Python, CLI, JSON"
            className={inputClasses}
          />
          {errors?.tags && <p className={errorClasses}>{errors.tags}</p>}
        </div>

        <div>
          <label htmlFor="project-github" className={labelClasses}>
            GitHub URL (optional)
          </label>
          <input
            id="project-github"
            name="githubUrl"
            type="url"
            value={githubUrl}
            onChange={(event) => setGithubUrl(event.target.value)}
            placeholder="https://github.com/you/repo"
            className={inputClasses}
          />
          {errors?.githubUrl && (
            <p className={errorClasses}>{errors.githubUrl}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}
