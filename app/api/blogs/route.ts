import { NextResponse } from "next/server";
import { createBlogPost, getAllBlogPosts } from "@/lib/blogs/store";
import { readJsonObject, stringField } from "@/lib/http";
import { validateBlogPost } from "@/lib/blogs/validation";

export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    return NextResponse.json({ ok: true, posts }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to load blog posts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const parsed = await readJsonObject(request);
  if (!parsed.ok) {
    return parsed.response;
  }

  const result = validateBlogPost({
    title: stringField(parsed.fields, "title"),
    content: stringField(parsed.fields, "content"),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 }
    );
  }

  try {
    const post = await createBlogPost(result.data);
    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to save the blog post." },
      { status: 500 }
    );
  }
}
