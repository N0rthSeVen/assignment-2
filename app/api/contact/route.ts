import { NextResponse } from "next/server";
import { appendContactSubmission } from "@/lib/contact/store";
import { readJsonObject, stringField } from "@/lib/http";
import { validateContactForm } from "@/lib/contact/validation";

export async function POST(request: Request) {
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
    const submission = await appendContactSubmission(result.data, "api");
    return NextResponse.json({ ok: true, submission }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to save the submission." },
      { status: 500 }
    );
  }
}
