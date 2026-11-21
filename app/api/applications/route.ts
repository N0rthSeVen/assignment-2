import { NextResponse } from "next/server";
import {
  createApplication,
  getAllApplications,
} from "@/lib/applications/store";
import { validateApplication } from "@/lib/applications/validation";
import { readJsonObject, stringField } from "@/lib/http";

export async function GET() {
  console.log("[api] GET /api/applications");
  try {
    const applications = await getAllApplications();
    return NextResponse.json({ ok: true, applications }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to load applications." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log("[api] POST /api/applications");
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
    const application = await createApplication(result.data);
    return NextResponse.json({ ok: true, application }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to save the application." },
      { status: 500 }
    );
  }
}
