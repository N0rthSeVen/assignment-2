import { NextResponse } from "next/server";
import { deleteBlogPost, updateBlogPost } from "@/lib/blogs/store";
import { validateBlogPost } from "@/lib/blogs/validation";
import { readJsonObject, stringField } from "@/lib/http";

type RouteParams = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  console.log("[api] PUT /api/blogs/[slug]");
  const { slug } = await params;

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
    const post = await updateBlogPost(slug, result.data);
    if (!post) {
      return NextResponse.json(
        { ok: false, error: "Blog post not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, post }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to update the blog post." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  console.log("[api] DELETE /api/blogs/[slug]");
  const { slug } = await params;

  try {
    const deleted = await deleteBlogPost(slug);
    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Blog post not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to delete the blog post." },
      { status: 500 }
    );
  }
}
