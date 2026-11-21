import { randomUUID } from "node:crypto";
import { mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { enqueueWrite, readJsonArray, writeJsonArray } from "../jsonFile";
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

export function appendContactSubmission(
  data: ContactFormData,
  source: ContactSubmissionSource = "server-form"
): Promise<ContactSubmission> {
  return enqueueWrite(dataFile, async () => {
    const submission: ContactSubmission = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: new Date().toISOString(),
      source,
    };
    await mkdir(dataDir, { recursive: true });
    const { items, corrupted } = await readJsonArray(dataFile);
    if (corrupted) {
      const backupFile = path.join(
        dataDir,
        `contact-submissions.corrupt-${Date.now()}.json`
      );
      await rename(dataFile, backupFile).catch(() => undefined);
    }
    await writeJsonArray(dataFile, [
      ...(items as ContactSubmission[]),
      submission,
    ]);
    return submission;
  });
}

export async function getAllContactSubmissions(): Promise<
  ContactSubmission[]
> {
  const { items } = await readJsonArray(dataFile);
  return (items as ContactSubmission[]).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getContactSubmissionById(
  id: string
): Promise<ContactSubmission | undefined> {
  const { items } = await readJsonArray(dataFile);
  return (items as ContactSubmission[]).find(
    (submission) => submission.id === id
  );
}

export function updateContactSubmission(
  id: string,
  data: ContactFormData
): Promise<ContactSubmission | undefined> {
  return enqueueWrite(dataFile, async () => {
    const { items, corrupted } = await readJsonArray(dataFile);
    if (corrupted) {
      const backupFile = path.join(
        dataDir,
        `contact-submissions.corrupt-${Date.now()}.json`
      );
      await rename(dataFile, backupFile).catch(() => undefined);
    }
    const submissions = items as ContactSubmission[];
    const index = submissions.findIndex(
      (submission) => submission.id === id
    );
    if (index === -1) {
      return undefined;
    }
    const updated: ContactSubmission = {
      ...submissions[index],
      name: data.name,
      email: data.email,
      message: data.message,
    };
    submissions[index] = updated;
    await writeJsonArray(dataFile, submissions);
    return updated;
  });
}

export function deleteContactSubmission(id: string): Promise<boolean> {
  return enqueueWrite(dataFile, async () => {
    const { items, corrupted } = await readJsonArray(dataFile);
    if (corrupted) {
      const backupFile = path.join(
        dataDir,
        `contact-submissions.corrupt-${Date.now()}.json`
      );
      await rename(dataFile, backupFile).catch(() => undefined);
    }
    const submissions = items as ContactSubmission[];
    const next = submissions.filter((submission) => submission.id !== id);
    if (next.length === submissions.length) {
      return false;
    }
    await writeJsonArray(dataFile, next);
    return true;
  });
}
