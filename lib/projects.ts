import { mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { enqueueWrite, readJsonArray, writeJsonArray } from "./jsonFile";
import { slugify } from "./blogs/slug";
import type { ProjectData } from "./projects/validation";

export type Project = {
  slug: string;
  title: string;
  context: string;
  summary: string;
  description: string[];
  highlights: string[];
  tags: string[];
  githubUrl?: string;
  featured: boolean;
};

export type CreateProjectResult =
  | { ok: true; project: Project }
  | { ok: false; error: "slug-exists" };

export type UpdateProjectResult =
  | { ok: true; project: Project }
  | { ok: false; error: "not-found" | "slug-exists" };

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "projects.json");

function backupCorruptedFile(): Promise<void> {
  const backupFile = path.join(
    dataDir,
    `projects.corrupt-${Date.now()}.json`
  );
  return rename(dataFile, backupFile).catch(() => undefined);
}

export async function getAllProjects(): Promise<Project[]> {
  const { items } = await readJsonArray(dataFile);
  return items as Project[];
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const { items } = await readJsonArray(dataFile);
  return (items as Project[]).find((project) => project.slug === slug);
}

export function createProject(data: ProjectData): Promise<CreateProjectResult> {
  return enqueueWrite(dataFile, async () => {
    await mkdir(dataDir, { recursive: true });
    const { items, corrupted } = await readJsonArray(dataFile);
    if (corrupted) {
      await backupCorruptedFile();
    }
    const projects = items as Project[];
    const slug = data.slug ?? slugify(data.title) ?? "";
    const effectiveSlug = slug || "project";
    if (projects.some((project) => project.slug === effectiveSlug)) {
      return { ok: false as const, error: "slug-exists" as const };
    }
    const project: Project = {
      slug: effectiveSlug,
      title: data.title,
      context: data.context,
      summary: data.summary,
      description: data.description,
      highlights: data.highlights,
      tags: data.tags,
      githubUrl: data.githubUrl,
      featured: data.featured,
    };
    await writeJsonArray(dataFile, [...projects, project]);
    return { ok: true as const, project };
  });
}

export function updateProject(
  slug: string,
  data: ProjectData
): Promise<UpdateProjectResult> {
  return enqueueWrite(dataFile, async () => {
    const { items, corrupted } = await readJsonArray(dataFile);
    if (corrupted) {
      await backupCorruptedFile();
    }
    const projects = items as Project[];
    const index = projects.findIndex((project) => project.slug === slug);
    if (index === -1) {
      return { ok: false as const, error: "not-found" as const };
    }
    const nextSlug = data.slug ?? slug;
    if (
      nextSlug !== slug &&
      projects.some((project) => project.slug === nextSlug)
    ) {
      return { ok: false as const, error: "slug-exists" as const };
    }
    const updated: Project = {
      ...projects[index],
      slug: nextSlug,
      title: data.title,
      context: data.context,
      summary: data.summary,
      description: data.description,
      highlights: data.highlights,
      tags: data.tags,
      githubUrl: data.githubUrl,
      featured: data.featured,
    };
    projects[index] = updated;
    await writeJsonArray(dataFile, projects);
    return { ok: true as const, project: updated };
  });
}

export function deleteProject(slug: string): Promise<boolean> {
  return enqueueWrite(dataFile, async () => {
    const { items, corrupted } = await readJsonArray(dataFile);
    if (corrupted) {
      await backupCorruptedFile();
    }
    const projects = items as Project[];
    const next = projects.filter((project) => project.slug !== slug);
    if (next.length === projects.length) {
      return false;
    }
    await writeJsonArray(dataFile, next);
    return true;
  });
}
