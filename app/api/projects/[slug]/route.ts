import { NextResponse } from "next/server";
import {
  deleteProject,
  getProjectBySlug,
  updateProject,
} from "@/lib/projects";
import { validateProjectInput } from "@/lib/projects/validation";
import { readJsonObject } from "@/lib/http";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  console.log("[api] GET /api/projects/[slug]");
  const { slug } = await params;

  try {
    const project = await getProjectBySlug(slug);
    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, project }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to load the project." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  console.log("[api] PUT /api/projects/[slug]");
  const { slug } = await params;

  const parsed = await readJsonObject(request);
  if (!parsed.ok) {
    return parsed.response;
  }

  const result = validateProjectInput(parsed.fields);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 }
    );
  }

  try {
    const updated = await updateProject(slug, result.data);
    if (!updated.ok) {
      if (updated.error === "not-found") {
        return NextResponse.json(
          { ok: false, error: "Project not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          ok: false,
          errors: { slug: "A project with this slug already exists." },
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { ok: true, project: updated.project },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to update the project." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  console.log("[api] DELETE /api/projects/[slug]");
  const { slug } = await params;

  try {
    const deleted = await deleteProject(slug);
    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Project not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to delete the project." },
      { status: 500 }
    );
  }
}
