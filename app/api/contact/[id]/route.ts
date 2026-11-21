import { NextResponse } from "next/server";
import {
  deleteContactSubmission,
  getContactSubmissionById,
  updateContactSubmission,
} from "@/lib/contact/store";
import { validateContactForm } from "@/lib/contact/validation";
import { readJsonObject, stringField } from "@/lib/http";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  console.log("[api] GET /api/contact/[id]");
  const { id } = await params;

  try {
    const submission = await getContactSubmissionById(id);
    if (!submission) {
      return NextResponse.json(
        { ok: false, error: "Contact submission not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, submission }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to load the contact submission." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  console.log("[api] PUT /api/contact/[id]");
  const { id } = await params;

  const parsed = await readJsonObject(request);
  if (!parsed.ok) {
    return parsed.response;
  }

  const result = validateContactForm({
    name: stringField(parsed.fields, "name"),
    email: stringField(parsed.fields, "email"),
    message: stringField(parsed.fields, "message"),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 }
    );
  }

  try {
    const submission = await updateContactSubmission(id, result.data);
    if (!submission) {
      return NextResponse.json(
        { ok: false, error: "Contact submission not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, submission }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to update the contact submission." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  console.log("[api] DELETE /api/contact/[id]");
  const { id } = await params;

  try {
    const deleted = await deleteContactSubmission(id);
    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Contact submission not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to delete the contact submission." },
      { status: 500 }
    );
  }
}
