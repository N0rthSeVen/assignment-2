import type { ContactFieldErrors, ContactInput } from "./validation";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: ContactFieldErrors;
  values: ContactInput;
  /** Changes on every response so the form remounts with fresh default values. */
  submissionCount: number;
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: { name: "", email: "", message: "" },
  submissionCount: 0,
};
