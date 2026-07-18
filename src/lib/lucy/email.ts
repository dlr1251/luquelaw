import { Resend } from "resend";

import { getContactTeamEmails } from "@/lib/contact/constants";

export type LucyEscalateEmailPayload = {
  ticketId: string;
  userEmail: string;
  subject: string;
  aiSummary: string;
  transcript: string;
  fileNames: string[];
  personality: {
    aggressiveness: number;
    technicality: number;
    flexibility: number;
  };
  projectTitle: string;
  chatTitle: string;
};

export async function sendLucyEscalateEmail(
  payload: LucyEscalateEmailPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() || "Luque Law <onboarding@resend.dev>";
  const to = getContactTeamEmails();
  const resend = new Resend(apiKey);

  const filesList =
    payload.fileNames.length > 0
      ? payload.fileNames.map((n) => `• ${n}`).join("\n")
      : "(no files)";

  const html = `
    <h2>Lucy consultation escalated</h2>
    <p><strong>Ticket:</strong> ${escapeHtml(payload.ticketId)}</p>
    <p><strong>Client:</strong> ${escapeHtml(payload.userEmail)}</p>
    <p><strong>Project:</strong> ${escapeHtml(payload.projectTitle)}</p>
    <p><strong>Chat:</strong> ${escapeHtml(payload.chatTitle)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
    <p><strong>Personality:</strong> aggressiveness ${payload.personality.aggressiveness},
      technicality ${payload.personality.technicality},
      flexibility ${payload.personality.flexibility}</p>
    <h3>AI summary</h3>
    <pre style="white-space:pre-wrap;font-family:system-ui">${escapeHtml(payload.aiSummary)}</pre>
    <h3>Files</h3>
    <pre>${escapeHtml(filesList)}</pre>
    <h3>Transcript</h3>
    <pre style="white-space:pre-wrap;font-family:system-ui;max-height:600px;overflow:auto">${escapeHtml(payload.transcript)}</pre>
    <p>Review in Admin → Tickets, then mark ready for payment so the client can unlock.</p>
  `;

  const result = await resend.emails.send({
    from,
    to,
    subject: `[Lucy] Review requested — ${payload.subject.slice(0, 80)}`,
    html,
    replyTo: payload.userEmail,
  });

  if (result.error) {
    return { ok: false, error: result.error.message };
  }
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
