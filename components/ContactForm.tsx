"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/app/contact-me-server-form/actions";
import { initialContactFormState } from "@/lib/contact/form-state";
import {
  errorClasses,
  failureClasses,
  inputClasses,
  labelClasses,
  successClasses,
} from "./formStyles";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialContactFormState
  );

  const values = state.values ?? { name: "", email: "", message: "" };

  return (
    <form
      key={state.status === "success" ? "sent" : "editing"}
      action={formAction}
      noValidate
      className="space-y-5"
    >
      {state.status === "success" && (
        <p role="status" className={successClasses}>
          {state.message}
        </p>
      )}

      {state.status === "save-error" && (
        <p role="alert" className={failureClasses}>
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="name" className={labelClasses}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={values.name}
          className={inputClasses}
        />
        {state.errors?.name && (
          <p className={errorClasses}>{state.errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={values.email}
          className={inputClasses}
        />
        {state.errors?.email && (
          <p className={errorClasses}>{state.errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={values.message}
          className={inputClasses}
        />
        {state.errors?.message && (
          <p className={errorClasses}>{state.errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
