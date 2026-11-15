import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ContactFormData } from "./validation";

export type ContactSubmissionSource = "server-form" | "api";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  source: ContactSubmissionSource;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "contact-submissions.json");

let writeQueue: Promise<unknown> = Promise.resolve();

function enqueueWrite<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  writeQueue = run.catch(() => undefined);
  return run;
}

export function appendContactSubmission(
  data: ContactFormData,
  source: ContactSubmissionSource = "server-form"
): Promise<ContactSubmission> {
  return enqueueWrite(async () => {
    const submission: ContactSubmission = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: new Date().toISOString(),
      source,
    };
    await mkdir(dataDir, { recursive: true });
    const { submissions, corrupted } = await readSubmissions();
    if (corrupted) {
      const backupFile = path.join(
        dataDir,
        `contact-submissions.corrupt-${Date.now()}.json`
      );
      await rename(dataFile, backupFile).catch(() => undefined);
    }
    await writeSubmissions([...submissions, submission]);
    return submission;
  });
}

async function readSubmissions(): Promise<{
  submissions: ContactSubmission[];
  corrupted: boolean;
}> {
  let raw: string;
  try {
    raw = await readFile(dataFile, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    return { submissions: [], corrupted: false };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { submissions: [], corrupted: true };
  }
  if (Array.isArray(parsed)) {
    return { submissions: parsed as ContactSubmission[], corrupted: false };
  }
  return { submissions: [], corrupted: true };
}

async function writeSubmissions(submissions: ContactSubmission[]): Promise<void> {
  const tempFile = path.join(
    dataDir,
    `contact-submissions.${randomUUID()}.tmp`
  );
  await writeFile(tempFile, JSON.stringify(submissions, null, 2) + "\n", "utf8");
  await rename(tempFile, dataFile);
}
