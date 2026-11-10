export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

export type ValidationResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactFieldErrors; values: ContactInput };

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

/**
 * Email rules from the assignment: exactly one "@", non-blank text before it,
 * a domain that contains a dot where every dot-separated label is non-blank,
 * and no whitespace anywhere.
 */
export function isValidEmail(email: string): boolean {
  if (/\s/.test(email)) return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (local.length === 0) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;
  return labels.every((label) => label.length > 0);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Validates raw form values on the server. Name, email and message are
 * trimmed first, so input made only of spaces counts as blank.
 */
export function validateContact(raw: {
  name: unknown;
  email: unknown;
  message: unknown;
}): ValidationResult {
  const values: ContactInput = {
    name: asText(raw.name).trim(),
    email: asText(raw.email).trim(),
    message: asText(raw.message).trim(),
  };
  const errors: ContactFieldErrors = {};

  if (!values.name) {
    errors.name = "Please enter your name.";
  } else if (values.name.length > MAX_NAME_LENGTH) {
    errors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  if (!values.email) {
    errors.email = "Please enter your email address.";
  } else if (values.email.length > MAX_EMAIL_LENGTH || !isValidEmail(values.email)) {
    errors.email = "Please enter a valid email address, like name@example.com.";
  }

  if (!values.message) {
    errors.message = "Please enter a message.";
  } else if (values.message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values };
  }
  return { ok: true, data: values };
}
