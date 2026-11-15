export type BlogPostData = {
  title: string;
  content: string;
};

export type BlogFieldErrors = {
  title?: string;
  content?: string;
};

export type BlogValidationResult =
  | { ok: true; data: BlogPostData }
  | { ok: false; errors: BlogFieldErrors };

const MAX_TITLE_LENGTH = 200;

export function validateBlogPost(input: BlogPostData): BlogValidationResult {
  const errors: BlogFieldErrors = {};
  const title = input.title.trim();
  const content = input.content.trim();

  if (title.length === 0) {
    errors.title = "Title is required.";
  } else if (title.length > MAX_TITLE_LENGTH) {
    errors.title = `Title must be at most ${MAX_TITLE_LENGTH} characters.`;
  }

  if (content.length === 0) {
    errors.content = "Content is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data: { title, content } };
}
