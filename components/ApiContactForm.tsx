"use client";

import { useState, type FormEvent } from "react";
import type { FieldErrors } from "@/lib/contact/validation";
import {
  errorClasses,
  failureClasses,
  inputClasses,
  labelClasses,
  successClasses,
} from "./formStyles";

type ApiResponse = {
  ok?: boolean;
  errors?: FieldErrors;
};

export default function ApiContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [requestFailed, setRequestFailed] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setErrors(null);
    setSuccessMessage(null);
    setRequestFailed(false);

    let response: Response;
    try {
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
    } catch {
      setRequestFailed(true);
      setSending(false);
      return;
    }

    let body: ApiResponse | null = null;
    try {
      body = (await response.json()) as ApiResponse;
    } catch {
      body = null;
    }

    if (response.status === 201 && body?.ok === true) {
      setSuccessMessage("Thanks! Your message has been sent successfully.");
      setName("");
      setEmail("");
      setMessage("");
      setSending(false);
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
      {successMessage && (
        <p role="status" className={successClasses}>
          {successMessage}
        </p>
      )}

      {requestFailed && (
        <p role="alert" className={failureClasses}>
          Request failed: your message was not saved. Please try again.
        </p>
      )}

      <div>
        <label htmlFor="api-name" className={labelClasses}>
          Name
        </label>
        <input
          id="api-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClasses}
        />
        {errors?.name && <p className={errorClasses}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="api-email" className={labelClasses}>
          Email
        </label>
        <input
          id="api-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClasses}
        />
        {errors?.email && <p className={errorClasses}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="api-message" className={labelClasses}>
          Message
        </label>
        <textarea
          id="api-message"
          name="message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={inputClasses}
        />
        {errors?.message && <p className={errorClasses}>{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={sending}
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
