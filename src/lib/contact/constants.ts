export const MAX_CONTACT_FILES = 10;
export const MAX_CONTACT_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file
export const MAX_CONTACT_TOTAL_BYTES = 25 * 1024 * 1024; // 25 MB total

export const ALLOWED_CONTACT_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "text/plain",
]);

export const CONTACT_TEAM_EMAILS = [
  "daniel@luquelaw.co",
  "asistente@luquelaw.co",
] as const;

export function getContactTeamEmails(): string[] {
  const raw = process.env.CONTACT_TEAM_EMAILS?.trim();
  if (raw) {
    const emails = raw.split(",").map((email) => email.trim()).filter(Boolean);
    if (emails.length > 0) return emails;
  }

  return [...CONTACT_TEAM_EMAILS];
}

export function isResendSandboxFrom(from: string): boolean {
  return /@resend\.dev>/i.test(from) || from.includes("@resend.dev");
}

export function getResendSandboxRecipient(): string {
  return (
    process.env.CONTACT_SANDBOX_TO?.trim() ||
    getContactTeamEmails()[0] ||
    CONTACT_TEAM_EMAILS[0]
  );
}
