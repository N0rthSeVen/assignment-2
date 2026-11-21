import { randomUUID } from "node:crypto";
import { mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { enqueueWrite, readJsonArray, writeJsonArray } from "../jsonFile";
import type { ApplicationData, ApplicationStatus } from "./validation";

export type Application = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "applications.json");

function backupCorruptedFile(): Promise<void> {
  const backupFile = path.join(
    dataDir,
    `applications.corrupt-${Date.now()}.json`
  );
  return rename(dataFile, backupFile).catch(() => undefined);
}

export function createApplication(data: ApplicationData): Promise<Application> {
  return enqueueWrite(dataFile, async () => {
    await mkdir(dataDir, { recursive: true });
    const { items, corrupted } = await readJsonArray(dataFile);
    if (corrupted) {
      await backupCorruptedFile();
    }
    const applications = items as Application[];
    const application: Application = {
      id: randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    await writeJsonArray(dataFile, [...applications, application]);
    return application;
  });
}

export async function getAllApplications(): Promise<Application[]> {
  const { items } = await readJsonArray(dataFile);
  return (items as Application[]).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getApplicationById(
  id: string
): Promise<Application | undefined> {
  const { items } = await readJsonArray(dataFile);
  return (items as Application[]).find((application) => application.id === id);
}

export function updateApplication(
  id: string,
  data: ApplicationData
): Promise<Application | undefined> {
  return enqueueWrite(dataFile, async () => {
    const { items, corrupted } = await readJsonArray(dataFile);
    if (corrupted) {
      await backupCorruptedFile();
    }
    const applications = items as Application[];
    const index = applications.findIndex(
      (application) => application.id === id
    );
    if (index === -1) {
      return undefined;
    }
    const updated: Application = { ...applications[index], ...data };
    applications[index] = updated;
    await writeJsonArray(dataFile, applications);
    return updated;
  });
}

export function deleteApplication(id: string): Promise<boolean> {
  return enqueueWrite(dataFile, async () => {
    const { items, corrupted } = await readJsonArray(dataFile);
    if (corrupted) {
      await backupCorruptedFile();
    }
    const applications = items as Application[];
    const next = applications.filter((application) => application.id !== id);
    if (next.length === applications.length) {
      return false;
    }
    await writeJsonArray(dataFile, next);
    return true;
  });
}
