import { NextResponse } from "next/server";

import {
  filesFromFormData,
  parseContactFormData,
  sendContactEmails,
} from "@/lib/email/send-contact";

type ContactPayload = {
  name?: string;
  email?: string;
  matterType?: string;
  message?: string;
  _subject?: string;
};

async function proxyToFormspree(body: ContactPayload, endpoint: string) {
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

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    const parsed = parseContactFormData(formData);
    if (!parsed.data) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status ?? 400 });
    }

    if (!process.env.RESEND_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "Email service is not configured. Set RESEND_API_KEY." },
        { status: 503 },
      );
    }

    parsed.data.attachments = await filesFromFormData(formData);
    const result = await sendContactEmails(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true });
  }

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

  return proxyToFormspree(body, endpoint);
}
