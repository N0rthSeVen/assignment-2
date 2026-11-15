export function slugify(title: string): string {
  // Keeps only ASCII letters and digits, so non-ASCII titles (e.g. Chinese) yield "" and the store falls back to "post".
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
