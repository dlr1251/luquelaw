import { Resend } from "resend";

import { getContactTeamEmails } from "@/lib/contact/constants";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendResend(input: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };

  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() || "Luque Law <onboarding@resend.dev>";
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    replyTo: input.replyTo,
  });
  if (result.error) return { ok: false, error: result.error.message };
  return { ok: true };
}

export async function sendCommentReplyEmail(input: {
  toEmail: string;
  replierName: string;
  excerpt: string;
  sectionUrl: string;
}): Promise<void> {
  const html = `
    <p><strong>${escapeHtml(input.replierName)}</strong> replied to your comment on Luque Law / CLKR.</p>
    <blockquote style="border-left:3px solid #45617d;padding-left:12px;color:#333">
      ${escapeHtml(input.excerpt.slice(0, 400))}
    </blockquote>
    <p><a href="${escapeHtml(input.sectionUrl)}">View the discussion</a></p>
  `;
  await sendResend({
    to: input.toEmail,
    subject: "New reply to your CLKR comment",
    html,
  });
}

export async function sendCommentReportEmail(input: {
  reporterEmail: string;
  reason: string;
  commentBody: string;
  sectionUrl: string | null;
  commentId: string;
}): Promise<void> {
  const html = `
    <h2>Comment reported</h2>
    <p><strong>Reporter:</strong> ${escapeHtml(input.reporterEmail)}</p>
    <p><strong>Comment id:</strong> ${escapeHtml(input.commentId)}</p>
    <p><strong>Reason:</strong> ${escapeHtml(input.reason)}</p>
    <h3>Comment</h3>
    <pre style="white-space:pre-wrap;font-family:system-ui">${escapeHtml(input.commentBody.slice(0, 2000))}</pre>
    ${
      input.sectionUrl
        ? `<p><a href="${escapeHtml(input.sectionUrl)}">Open section</a></p>`
        : ""
    }
    <p>Review in Admin → Comments.</p>
  `;
  await sendResend({
    to: getContactTeamEmails(),
    subject: "[CLKR] Comment reported",
    html,
    replyTo: input.reporterEmail,
  });
}
