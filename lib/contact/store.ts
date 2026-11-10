import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ContactInput } from "./validation";

export type ContactSubmission = ContactInput & {
  id: string;
  createdAt: string;
  source: "server-form";
};

const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "contact-submissions.json");

export async function readSubmissions(): Promise<ContactSubmission[]> {
  let text: string;
  try {
    text = await readFile(SUBMISSIONS_FILE, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const data: unknown = JSON.parse(text);
  if (!Array.isArray(data)) {
    throw new Error(`${SUBMISSIONS_FILE} must contain a JSON array`);
  }
  return data as ContactSubmission[];
}

// Requests are handled concurrently, so writes are queued one after another.
// Otherwise two submissions could read the same file and one would be lost.
let writeQueue: Promise<unknown> = Promise.resolve();

export function saveSubmission(
  input: ContactInput,
  source: ContactSubmission["source"],
): Promise<ContactSubmission> {
  const task = writeQueue.then(async () => {
    const submissions = await readSubmissions();
    const submission: ContactSubmission = {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
      source,
    };
    submissions.push(submission);

    // Write to a temp file, then rename, so a crash never leaves half-written JSON.
    await mkdir(DATA_DIR, { recursive: true });
    const tempFile = `${SUBMISSIONS_FILE}.${process.pid}.tmp`;
    await writeFile(tempFile, `${JSON.stringify(submissions, null, 2)}\n`, "utf8");
    await rename(tempFile, SUBMISSIONS_FILE);
    return submission;
  });

  writeQueue = task.catch(() => undefined);
  return task;
}
