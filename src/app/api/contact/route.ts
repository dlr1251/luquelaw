import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  matterType?: string;
  message?: string;
  _subject?: string;
};

export async function POST(request: Request) {
  const endpoint =
    process.env.CONTACT_FORM_ENDPOINT ?? process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

  if (!endpoint) {
    return NextResponse.json(
      { error: "Contact form endpoint is not configured." },
      { status: 503 },
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to submit the form." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
