"use server";

import type { ContactFormState } from "@/lib/contact/form-state";
import { saveSubmission } from "@/lib/contact/store";
import { validateContact } from "@/lib/contact/validation";

/**
 * Server Action behind the /contact-me-server-form page.
 * Runs only on the server: validate → save to JSON → return feedback.
 */
export async function submitContactForm(
  previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const submissionCount = previousState.submissionCount + 1;
  const result = validateContact({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!result.ok) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: result.errors,
      values: result.values,
      submissionCount,
    };
  }

  try {
    await saveSubmission(result.data, "server-form");
  } catch (error) {
    console.error("Failed to save contact submission", error);
    return {
      status: "error",
      message: "Sorry, your message couldn't be saved. Please try again in a moment.",
      fieldErrors: {},
      values: result.data,
      submissionCount,
    };
  }

  return {
    status: "success",
    message: `Thanks, ${result.data.name}! Your message was received.`,
    fieldErrors: {},
    values: { name: "", email: "", message: "" },
    submissionCount,
  };
}
