"use client";

import { useState, type FormEvent } from "react";
import type { Application } from "@/lib/applications/store";
import { APPLICATION_STATUSES } from "@/lib/applications/validation";
import {
  errorClasses,
  failureClasses,
  inputClasses,
  labelClasses,
  successClasses,
} from "./formStyles";

type ApplicationApiResponse = {
  ok?: boolean;
  application?: Application;
  errors?: Record<string, string>;
};

export default function ApplicationForm({
  onCreated,
}: {
  onCreated?: (application: Application) => void;
}) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(APPLICATION_STATUSES[1]);
  const [appliedDate, setAppliedDate] = useState("");
  const [notes, setNotes] = useState("");
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
      response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, status, appliedDate, notes }),
      });
    } catch {
      setRequestFailed(true);
      setSending(false);
      return;
    }

    let body: ApplicationApiResponse | null = null;
    try {
      body = (await response.json()) as ApplicationApiResponse;
    } catch {
      body = null;
    }

    if (response.status === 201 && body?.ok === true && body.application) {
      setCreated(true);
      setCompany("");
      setRole("");
      setAppliedDate("");
      setNotes("");
      setSending(false);
      onCreated?.(body.application);
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
          Application saved.
        </p>
      )}

      {requestFailed && (
        <p role="alert" className={failureClasses}>
          Request failed: your application was not saved. Please try again.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="application-company" className={labelClasses}>
            Company
          </label>
          <input
            id="application-company"
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
          <label htmlFor="application-role" className={labelClasses}>
            Role
          </label>
          <input
            id="application-role"
            name="role"
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className={inputClasses}
          />
          {errors?.role && <p className={errorClasses}>{errors.role}</p>}
        </div>

        <div>
          <label htmlFor="application-status" className={labelClasses}>
            Status
          </label>
          <select
            id="application-status"
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
          <label htmlFor="application-date" className={labelClasses}>
            Applied date
          </label>
          <input
            id="application-date"
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
        <label htmlFor="application-notes" className={labelClasses}>
          Notes (optional)
        </label>
        <textarea
          id="application-notes"
          name="notes"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className={inputClasses}
        />
        {errors?.notes && <p className={errorClasses}>{errors.notes}</p>}
      </div>

      <button
        type="submit"
        disabled={sending}
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Saving..." : "Save Application"}
      </button>
    </form>
  );
}
