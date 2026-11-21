import { NextResponse } from "next/server";
import {
  deleteApplication,
  getApplicationById,
  updateApplication,
} from "@/lib/applications/store";
import { validateApplication } from "@/lib/applications/validation";
import { readJsonObject, stringField } from "@/lib/http";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  console.log("[api] GET /api/applications/[id]");
  const { id } = await params;

  try {
    const application = await getApplicationById(id);
    if (!application) {
      return NextResponse.json(
        { ok: false, error: "Application not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, application }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to load the application." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  console.log("[api] PUT /api/applications/[id]");
  const { id } = await params;

  const parsed = await readJsonObject(request);
  if (!parsed.ok) {
    return parsed.response;
  }

  const result = validateApplication({
    company: stringField(parsed.fields, "company"),
    role: stringField(parsed.fields, "role"),
    status: stringField(parsed.fields, "status"),
    appliedDate: stringField(parsed.fields, "appliedDate"),
    notes: stringField(parsed.fields, "notes"),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 }
    );
  }

  try {
    const application = await updateApplication(id, result.data);
    if (!application) {
      return NextResponse.json(
        { ok: false, error: "Application not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, application }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to update the application." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  console.log("[api] DELETE /api/applications/[id]");
  const { id } = await params;

  try {
    const deleted = await deleteApplication(id);
    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Application not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to delete the application." },
      { status: 500 }
    );
  }
}
