"use client";

import { useState } from "react";
import type { Application } from "@/lib/applications/store";
import ApplicationEditForm from "./ApplicationEditForm";
import { failureClasses } from "./formStyles";

const statusBadgeClasses: Record<Application["status"], string> = {
  Wishlist:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  Applied: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Interviewing:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Offer: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export default function ApplicationCard({
  application,
  onUpdated,
  onDeleted,
}: {
  application: Application;
  onUpdated: (application: Application) => void;
  onDeleted: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    setDeleteFailed(false);

    let response: Response;
    try {
      response = await fetch(`/api/applications/${application.id}`, {
        method: "DELETE",
      });
    } catch {
      setDeleteFailed(true);
      setDeleting(false);
      return;
    }

    if (response.status === 200) {
      onDeleted(application.id);
      return;
    }

    setDeleteFailed(true);
    setDeleting(false);
  }

  if (editing) {
    return (
      <article className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <ApplicationEditForm
          application={application}
          onUpdated={(updated) => {
            setEditing(false);
            onUpdated(updated);
          }}
          onCancel={() => setEditing(false)}
        />
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">
          {application.company}
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClasses[application.status]}`}
        >
          {application.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {application.role}
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Applied on{" "}
        {new Date(`${application.appliedDate}T00:00:00`).toLocaleDateString()}
      </p>
      {application.notes && (
        <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
          {application.notes}
        </p>
      )}
      {deleteFailed && (
        <p role="alert" className={`${failureClasses} mt-3`}>
          Could not delete this application. Please try again.
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-full border border-red-600 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}
