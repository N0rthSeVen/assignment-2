import { NextResponse } from "next/server";

export type ReadJsonObjectResult =
  | { ok: true; fields: Record<string, unknown> }
  | { ok: false; response: NextResponse };

export async function readJsonObject(
  request: Request
): Promise<ReadJsonObjectResult> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "Request body must be valid JSON." },
        { status: 400 }
      ),
    };
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "Request body must be a JSON object." },
        { status: 400 }
      ),
    };
  }

  return { ok: true, fields: body as Record<string, unknown> };
}

export function stringField(
  fields: Record<string, unknown>,
  key: string
): string {
  const value = fields[key];
  return typeof value === "string" ? value : "";
}
