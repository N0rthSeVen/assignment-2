import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const writeQueues = new Map<string, Promise<unknown>>();

export function enqueueWrite<T>(
  file: string,
  task: () => Promise<T>
): Promise<T> {
  const queue = writeQueues.get(file) ?? Promise.resolve();
  const run = queue.then(task, task);
  writeQueues.set(file, run.catch(() => undefined));
  return run;
}

export async function readJsonArray(
  file: string
): Promise<{ items: unknown[]; corrupted: boolean }> {
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    return { items: [], corrupted: false };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { items: [], corrupted: true };
  }
  if (Array.isArray(parsed)) {
    return { items: parsed, corrupted: false };
  }
  return { items: [], corrupted: true };
}

export async function writeJsonArray(
  file: string,
  items: unknown[]
): Promise<void> {
  const tempFile = path.join(
    path.dirname(file),
    `${path.basename(file)}.${randomUUID()}.tmp`
  );
  await writeFile(tempFile, JSON.stringify(items, null, 2) + "\n", "utf8");
  await rename(tempFile, file);
}
