import { NextResponse } from "next/server";
import { appendContactSubmission } from "@/lib/contact/store";
import { validateContactForm } from "@/lib/contact/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  const fields = body as Record<string, unknown>;
  const result = validateContactForm({
    name: typeof fields.name === "string" ? fields.name : "",
    email: typeof fields.email === "string" ? fields.email : "",
    message: typeof fields.message === "string" ? fields.message : "",
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
