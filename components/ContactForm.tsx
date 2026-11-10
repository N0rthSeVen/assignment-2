"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/app/contact-me-server-form/actions";
import { initialContactFormState } from "@/lib/contact/form-state";
import type { ContactInput } from "@/lib/contact/validation";

const inputClass =
  "mt-1 block w-full rounded-md border bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

function FieldError({ field, error }: { field: keyof ContactInput; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${field}-error`} className="mt-1 text-sm text-red-600">
      {error}
    </p>
  );
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialContactFormState);

  function fieldProps(field: keyof ContactInput) {
    const error = state.fieldErrors[field];
    return {
      id: field,
      name: field,
      defaultValue: state.values[field],
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${field}-error` : undefined,
      className: `${inputClass} ${error ? "border-red-500" : "border-stone-300"}`,
    };
  }

  return (
    <div className="space-y-6">
      {state.status === "success" && (
        <div role="status" className="rounded-md border border-green-300 bg-green-50 p-4 text-green-800">
          ✓ {state.message}
        </div>
      )}
      {state.status === "error" && (
        <div role="alert" className="rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
          {state.message}
        </div>
      )}

      {/* noValidate: the server is the source of truth for validation. */}
      <form key={state.submissionCount} action={formAction} noValidate className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input type="text" autoComplete="name" {...fieldProps("name")} />
          <FieldError field="name" error={state.fieldErrors.name} />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input type="email" autoComplete="email" {...fieldProps("email")} />
          <FieldError field="email" error={state.fieldErrors.email} />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <textarea rows={6} {...fieldProps("message")} />
          <FieldError field="message" error={state.fieldErrors.message} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
