export type ProjectFieldErrors = {
  slug?: string;
  title?: string;
  context?: string;
  summary?: string;
  description?: string;
  highlights?: string;
  tags?: string;
  githubUrl?: string;
  featured?: string;
};

export type ProjectData = {
  slug?: string;
  title: string;
  context: string;
  summary: string;
  description: string[];
  highlights: string[];
  tags: string[];
  githubUrl?: string;
  featured: boolean;
};

export type ProjectValidationResult =
  | { ok: true; data: ProjectData }
  | { ok: false; errors: ProjectFieldErrors };

const MAX_TITLE_LENGTH = 200;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_PATTERN = /^https?:\/\/\S+$/;

function optionalString(
  fields: Record<string, unknown>,
  key: string,
  errors: ProjectFieldErrors
): string {
  const value = fields[key];
  if (value === undefined) {
    return "";
  }
  if (typeof value !== "string") {
    errors[key as keyof ProjectFieldErrors] = `${key} must be a string.`;
    return "";
  }
  return value.trim();
}

function stringArrayField(
  fields: Record<string, unknown>,
  key: string,
  errors: ProjectFieldErrors
): string[] {
  const value = fields[key];
  if (value === undefined) {
    return [];
  }
  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === "string")
  ) {
    errors[key as keyof ProjectFieldErrors] =
      `${key} must be an array of strings.`;
    return [];
  }
  return (value as string[]).map((item) => item.trim());
}

export function validateProjectInput(
  fields: Record<string, unknown>
): ProjectValidationResult {
  const errors: ProjectFieldErrors = {};

  const slugValue = fields.slug;
  let slug: string | undefined;
  if (slugValue !== undefined) {
    if (typeof slugValue !== "string") {
      errors.slug = "Slug must be a string.";
    } else {
      const trimmed = slugValue.trim();
      if (trimmed.length === 0) {
        errors.slug = "Slug must not be empty when provided.";
      } else if (!SLUG_PATTERN.test(trimmed)) {
        errors.slug =
          "Slug may only contain lowercase letters, numbers, and hyphens (e.g. my-project).";
      } else {
        slug = trimmed;
      }
    }
  }

  const titleValue = fields.title;
  let title = "";
  if (titleValue === undefined || (typeof titleValue === "string" && titleValue.trim().length === 0)) {
    errors.title = "Title is required.";
  } else if (typeof titleValue !== "string") {
    errors.title = "Title must be a string.";
  } else if (titleValue.trim().length > MAX_TITLE_LENGTH) {
    errors.title = `Title must be at most ${MAX_TITLE_LENGTH} characters.`;
  } else {
    title = titleValue.trim();
  }

  const context = optionalString(fields, "context", errors);
  const summary = optionalString(fields, "summary", errors);
  const description = stringArrayField(fields, "description", errors);
  const highlights = stringArrayField(fields, "highlights", errors);
  const tags = stringArrayField(fields, "tags", errors);

  const githubUrlValue = fields.githubUrl;
  let githubUrl: string | undefined;
  if (githubUrlValue !== undefined) {
    if (typeof githubUrlValue !== "string") {
      errors.githubUrl = "githubUrl must be a string.";
    } else {
      const trimmed = githubUrlValue.trim();
      if (trimmed.length > 0 && !URL_PATTERN.test(trimmed)) {
        errors.githubUrl =
          "githubUrl must be a valid URL starting with http:// or https://.";
      } else {
        githubUrl = trimmed.length > 0 ? trimmed : undefined;
      }
    }
  }

  const featuredValue = fields.featured;
  let featured = false;
  if (featuredValue !== undefined) {
    if (typeof featuredValue !== "boolean") {
      errors.featured = "featured must be a boolean.";
    } else {
      featured = featuredValue;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      slug,
      title,
      context,
      summary,
      description,
      highlights,
      tags,
      githubUrl,
      featured,
    },
  };
}
