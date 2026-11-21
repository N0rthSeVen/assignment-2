"use client";

import { useState, type FormEvent } from "react";
import type { BlogPost } from "@/lib/blogs/store";
import {
  errorClasses,
  failureClasses,
  inputClasses,
  labelClasses,
} from "./formStyles";

type BlogApiResponse = {
  ok?: boolean;
  post?: BlogPost;
  errors?: Record<string, string>;
};

export default function BlogPostEditForm({
  post,
  onUpdated,
  onCancel,
}: {
  post: BlogPost;
  onUpdated: (oldSlug: string, post: BlogPost) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
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
      response = await fetch(`/api/blogs/${post.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    } catch {
      setRequestFailed(true);
      setSaving(false);
      return;
    }

    let body: BlogApiResponse | null = null;
    try {
      body = (await response.json()) as BlogApiResponse;
    } catch {
      body = null;
    }

    if (response.status === 200 && body?.ok === true && body.post) {
      onUpdated(post.slug, body.post);
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
        <label htmlFor={`blog-title-${post.slug}`} className={labelClasses}>
          Title
        </label>
        <input
          id={`blog-title-${post.slug}`}
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClasses}
        />
        {errors?.title && <p className={errorClasses}>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor={`blog-content-${post.slug}`} className={labelClasses}>
          Content
        </label>
        <textarea
          id={`blog-content-${post.slug}`}
          name="content"
          rows={6}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className={inputClasses}
        />
        {errors?.content && <p className={errorClasses}>{errors.content}</p>}
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
