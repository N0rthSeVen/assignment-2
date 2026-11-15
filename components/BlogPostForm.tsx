"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { BlogPost } from "@/lib/blogs/store";
import type { BlogFieldErrors } from "@/lib/blogs/validation";
import {
  errorClasses,
  failureClasses,
  inputClasses,
  labelClasses,
  successClasses,
} from "./formStyles";

type BlogApiResponse = {
  ok?: boolean;
  post?: BlogPost;
  errors?: BlogFieldErrors;
};

export default function BlogPostForm({
  onCreated,
}: {
  onCreated?: (post: BlogPost) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<BlogFieldErrors | null>(null);
  const [created, setCreated] = useState<BlogPost | null>(null);
  const [requestFailed, setRequestFailed] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setErrors(null);
    setCreated(null);
    setRequestFailed(false);

    let response: Response;
    try {
      response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    } catch {
      setRequestFailed(true);
      setSending(false);
      return;
    }

    let body: BlogApiResponse | null = null;
    try {
      body = (await response.json()) as BlogApiResponse;
    } catch {
      body = null;
    }

    if (response.status === 201 && body?.ok === true && body.post) {
      setCreated(body.post);
      setTitle("");
      setContent("");
      setSending(false);
      onCreated?.(body.post);
      return;
    }

    const fieldErrors = body?.errors;
    if (response.status === 400 && fieldErrors) {
      setErrors(fieldErrors);
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
          Post created!{" "}
          <Link
            href={`/blogs/${created.slug}`}
            className="underline underline-offset-4"
          >
            View it at /blogs/{created.slug}
          </Link>
        </p>
      )}

      {requestFailed && (
        <p role="alert" className={failureClasses}>
          Request failed: your post was not saved. Please try again.
        </p>
      )}

      <div>
        <label htmlFor="blog-title" className={labelClasses}>
          Title
        </label>
        <input
          id="blog-title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClasses}
        />
        {errors?.title && <p className={errorClasses}>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="blog-content" className={labelClasses}>
          Content
        </label>
        <textarea
          id="blog-content"
          name="content"
          rows={8}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className={inputClasses}
        />
        {errors?.content && <p className={errorClasses}>{errors.content}</p>}
      </div>

      <button
        type="submit"
        disabled={sending}
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Publishing..." : "Publish Post"}
      </button>
    </form>
  );
}
