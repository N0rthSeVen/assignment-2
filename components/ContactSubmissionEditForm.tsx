"use client";

import { useState, type FormEvent } from "react";
import type { ContactSubmission } from "@/lib/contact/store";
import {
  errorClasses,
  failureClasses,
  inputClasses,
  labelClasses,
} from "./formStyles";

type ContactApiResponse = {
  ok?: boolean;
  submission?: ContactSubmission;
  errors?: Record<string, string>;
};

export default function ContactSubmissionEditForm({
  submission,
  onUpdated,
  onCancel,
}: {
  submission: ContactSubmission;
  onUpdated: (submission: ContactSubmission) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(submission.name);
  const [email, setEmail] = useState(submission.email);
  const [message, setMessage] = useState(submission.message);
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
      response = await fetch(`/api/contact/${submission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
    } catch {
      setRequestFailed(true);
      setSaving(false);
      return;
    }

    let body: ContactApiResponse | null = null;
    try {
      body = (await response.json()) as ContactApiResponse;
    } catch {
      body = null;
    }

    if (response.status === 200 && body?.ok === true && body.submission) {
      onUpdated(body.submission);
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`contact-name-${submission.id}`}
            className={labelClasses}
          >
            Name
          </label>
          <input
            id={`contact-name-${submission.id}`}
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClasses}
          />
          {errors?.name && <p className={errorClasses}>{errors.name}</p>}
        </div>

        <div>
          <label
            htmlFor={`contact-email-${submission.id}`}
            className={labelClasses}
          >
            Email
          </label>
          <input
            id={`contact-email-${submission.id}`}
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClasses}
          />
          {errors?.email && <p className={errorClasses}>{errors.email}</p>}
        </div>
      </div>

      <div>
        <label
          htmlFor={`contact-message-${submission.id}`}
          className={labelClasses}
        >
          Message
        </label>
        <textarea
          id={`contact-message-${submission.id}`}
          name="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={inputClasses}
        />
        {errors?.message && <p className={errorClasses}>{errors.message}</p>}
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
