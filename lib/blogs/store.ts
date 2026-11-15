import { randomUUID } from "node:crypto";
import { mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { enqueueWrite, readJsonArray, writeJsonArray } from "../jsonFile";
import { slugify } from "./slug";
import type { BlogPostData } from "./validation";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "blogs.json");

export function createBlogPost(data: BlogPostData): Promise<BlogPost> {
  return enqueueWrite(dataFile, async () => {
    await mkdir(dataDir, { recursive: true });
    const { items, corrupted } = await readJsonArray(dataFile);
    if (corrupted) {
      const backupFile = path.join(
        dataDir,
        `blogs.corrupt-${Date.now()}.json`
      );
      await rename(dataFile, backupFile).catch(() => undefined);
    }
    const posts = items as BlogPost[];
    const takenSlugs = new Set(posts.map((post) => post.slug));
    const baseSlug = slugify(data.title) || "post";
    let slug = baseSlug;
    let counter = 2;
    while (takenSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
    const post: BlogPost = {
      id: randomUUID(),
      slug,
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
    };
    await writeJsonArray(dataFile, [...posts, post]);
    return post;
  });
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { items } = await readJsonArray(dataFile);
  return (items as BlogPost[]).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const { items } = await readJsonArray(dataFile);
  return (items as BlogPost[]).find((post) => post.slug === slug);
}
