"use client";

import { useState } from "react";
import type { ContactSubmission } from "@/lib/contact/store";
import ContactSubmissionEditForm from "./ContactSubmissionEditForm";
import { failureClasses } from "./formStyles";

export default function ContactSubmissionList({
  submissions,
  loadFailed,
  onUpdated,
  onDeleted,
}: {
  submissions: ContactSubmission[] | null;
  loadFailed: boolean;
  onUpdated: (submission: ContactSubmission) => void;
  onDeleted: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteFailed, setDeleteFailed] = useState(false);

  async function handleDelete(id: string) {
    setDeletingId(id);
    setDeleteFailed(false);

    let response: Response;
    try {
      response = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    } catch {
      setDeleteFailed(true);
      setDeletingId(null);
      return;
    }

    if (response.status === 200) {
      setDeletingId(null);
      onDeleted(id);
      return;
    }

    setDeleteFailed(true);
    setDeletingId(null);
  }

  return (
    <>
      {loadFailed && (
        <p role="alert" className={`${failureClasses} mt-4`}>
          Could not load the contact submissions. Please refresh the page.
        </p>
      )}
      {!loadFailed && submissions === null && (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Loading submissions...
        </p>
      )}
      {submissions !== null && submissions.length === 0 && (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          No contact submissions yet.
        </p>
      )}
      {submissions !== null && submissions.length > 0 && (
        <div className="mt-4 space-y-3">
          {submissions.map((submission) => (
            <article
              key={submission.id}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              {editingId === submission.id ? (
                <ContactSubmissionEditForm
                  submission={submission}
                  onUpdated={(updated) => {
                    setEditingId(null);
                    onUpdated(updated);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">
                      {submission.name}
                    </h2>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {submission.source}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {submission.email}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                    {submission.message}
                  </p>
                  {deleteFailed && deletingId === null && (
                    <p role="alert" className={`${failureClasses} mt-3`}>
                      Could not delete this submission. Please try again.
                    </p>
                  )}
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(submission.id)}
                      className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(submission.id)}
                      disabled={deletingId !== null}
                      className="rounded-full border border-red-600 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      {deletingId === submission.id ? "Deleting..." : "Delete"}
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
