"use client";

import { useState, type FormEvent } from "react";
import type { Application } from "@/lib/applications/store";
import { APPLICATION_STATUSES } from "@/lib/applications/validation";
import {
  errorClasses,
  failureClasses,
  inputClasses,
  labelClasses,
} from "./formStyles";

type ApplicationApiResponse = {
  ok?: boolean;
  application?: Application;
  errors?: Record<string, string>;
};

export default function ApplicationEditForm({
  application,
  onUpdated,
  onCancel,
}: {
  application: Application;
  onUpdated: (application: Application) => void;
  onCancel: () => void;
}) {
  const [company, setCompany] = useState(application.company);
  const [role, setRole] = useState(application.role);
  const [status, setStatus] = useState(application.status);
  const [appliedDate, setAppliedDate] = useState(application.appliedDate);
  const [notes, setNotes] = useState(application.notes);
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
      response = await fetch(`/api/applications/${application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, status, appliedDate, notes }),
      });
    } catch {
      setRequestFailed(true);
      setSaving(false);
      return;
    }

    let body: ApplicationApiResponse | null = null;
    try {
      body = (await response.json()) as ApplicationApiResponse;
    } catch {
      body = null;
    }

    if (response.status === 200 && body?.ok === true && body.application) {
      onUpdated(body.application);
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
            htmlFor={`application-company-${application.id}`}
            className={labelClasses}
          >
            Company
          </label>
          <input
            id={`application-company-${application.id}`}
            name="company"
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={inputClasses}
          />
          {errors?.company && (
            <p className={errorClasses}>{errors.company}</p>
          )}
        </div>

        <div>
          <label
            htmlFor={`application-role-${application.id}`}
            className={labelClasses}
          >
            Role
          </label>
          <input
            id={`application-role-${application.id}`}
            name="role"
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className={inputClasses}
          />
          {errors?.role && <p className={errorClasses}>{errors.role}</p>}
        </div>

        <div>
          <label
            htmlFor={`application-status-${application.id}`}
            className={labelClasses}
          >
            Status
          </label>
          <select
            id={`application-status-${application.id}`}
            name="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as typeof status)
            }
            className={inputClasses}
          >
            {APPLICATION_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          {errors?.status && <p className={errorClasses}>{errors.status}</p>}
        </div>

        <div>
          <label
            htmlFor={`application-date-${application.id}`}
            className={labelClasses}
          >
            Applied date
          </label>
          <input
            id={`application-date-${application.id}`}
            name="appliedDate"
            type="date"
            value={appliedDate}
            onChange={(event) => setAppliedDate(event.target.value)}
            className={inputClasses}
          />
          {errors?.appliedDate && (
            <p className={errorClasses}>{errors.appliedDate}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor={`application-notes-${application.id}`}
          className={labelClasses}
        >
          Notes (optional)
        </label>
        <textarea
          id={`application-notes-${application.id}`}
          name="notes"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className={inputClasses}
        />
        {errors?.notes && <p className={errorClasses}>{errors.notes}</p>}
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
