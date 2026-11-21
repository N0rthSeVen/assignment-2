export type ApplicationStatus =
  | "Wishlist"
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Wishlist",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
];

export type ApplicationData = {
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string;
};

export type ApplicationInput = {
  company: string;
  role: string;
  status: string;
  appliedDate: string;
  notes: string;
};

export type ApplicationFieldErrors = {
  company?: string;
  role?: string;
  status?: string;
  appliedDate?: string;
  notes?: string;
};

export type ApplicationValidationResult =
  | { ok: true; data: ApplicationData }
  | { ok: false; errors: ApplicationFieldErrors };

const MAX_SHORT_LENGTH = 200;
const MAX_NOTES_LENGTH = 2000;
const APPLIED_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function validateApplication(
  input: ApplicationInput
): ApplicationValidationResult {
  const errors: ApplicationFieldErrors = {};
  const company = input.company.trim();
  const role = input.role.trim();
  const status = input.status.trim();
  const appliedDate = input.appliedDate.trim();
  const notes = input.notes.trim();

  if (company.length === 0) {
    errors.company = "Company is required.";
  } else if (company.length > MAX_SHORT_LENGTH) {
    errors.company = `Company must be at most ${MAX_SHORT_LENGTH} characters.`;
  }

  if (role.length === 0) {
    errors.role = "Role is required.";
  } else if (role.length > MAX_SHORT_LENGTH) {
    errors.role = `Role must be at most ${MAX_SHORT_LENGTH} characters.`;
  }

  if (status.length === 0) {
    errors.status = `Status is required. Allowed values: ${APPLICATION_STATUSES.join(", ")}.`;
  } else if (!APPLICATION_STATUSES.includes(status as ApplicationStatus)) {
    errors.status = `Status must be one of: ${APPLICATION_STATUSES.join(", ")}.`;
  }

  if (appliedDate.length === 0) {
    errors.appliedDate = "Applied date is required.";
  } else if (
    !APPLIED_DATE_PATTERN.test(appliedDate) ||
    Number.isNaN(Date.parse(appliedDate))
  ) {
    errors.appliedDate = "Applied date must be a valid date in YYYY-MM-DD format.";
  }

  if (notes.length > MAX_NOTES_LENGTH) {
    errors.notes = `Notes must be at most ${MAX_NOTES_LENGTH} characters.`;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      company,
      role,
      status: status as ApplicationStatus,
      appliedDate,
      notes,
    },
  };
}
