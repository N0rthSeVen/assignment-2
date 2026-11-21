import { NextResponse } from "next/server";
import { createProject, getAllProjects } from "@/lib/projects";
import { validateProjectInput } from "@/lib/projects/validation";
import { readJsonObject } from "@/lib/http";

export async function GET() {
  console.log("[api] GET /api/projects");
  try {
    const projects = await getAllProjects();
    return NextResponse.json({ ok: true, projects }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to load projects." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log("[api] POST /api/projects");
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
    const created = await createProject(result.data);
    if (!created.ok) {
      return NextResponse.json(
        {
          ok: false,
          errors: { slug: "A project with this slug already exists." },
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { ok: true, project: created.project },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to save the project." },
      { status: 500 }
    );
  }
}
