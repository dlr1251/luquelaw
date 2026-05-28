import { Resend } from "resend";

import {
  ALLOWED_CONTACT_MIME_TYPES,
  getContactTeamEmails,
  getResendSandboxRecipient,
  isResendSandboxFrom,
  MAX_CONTACT_FILE_BYTES,
  MAX_CONTACT_FILES,
  MAX_CONTACT_TOTAL_BYTES,
} from "@/lib/contact/constants";
import {
  internalContactEmail,
  userConfirmationEmail,
  type ContactEmailData,
} from "@/lib/email/contact-templates";

export type ParsedContactSubmission = ContactEmailData & {
  attachments: { filename: string; content: Buffer }[];
};

export function parseContactFormData(formData: FormData): {
  data?: ParsedContactSubmission;
  error?: string;
  status?: number;
} {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const matterType = String(formData.get("matterType") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const locale = formData.get("locale") === "es" ? "es" : "en";
  const dataConsent = formData.get("dataConsent") === "true" || formData.get("dataConsent") === "on";

  if (!name || !email || !message) {
    return { error: "Missing required fields.", status: 400 };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Invalid email address.", status: 400 };
  }

  if (!dataConsent) {
    return {
      error:
        locale === "es"
          ? "Debes aceptar la política de tratamiento de datos personales."
          : "You must accept the personal data processing policy.",
      status: 400,
    };
  }

  const fileEntries = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  if (fileEntries.length > MAX_CONTACT_FILES) {
    return {
      error:
        locale === "es"
          ? `Máximo ${MAX_CONTACT_FILES} archivos por envío.`
          : `Maximum ${MAX_CONTACT_FILES} files per submission.`,
      status: 400,
    };
  }

  let totalBytes = 0;
  const attachments: { filename: string; content: Buffer }[] = [];

  for (const file of fileEntries) {
    if (file.size > MAX_CONTACT_FILE_BYTES) {
      return {
        error:
          locale === "es"
            ? `Cada archivo debe ser menor a ${MAX_CONTACT_FILE_BYTES / (1024 * 1024)} MB.`
            : `Each file must be under ${MAX_CONTACT_FILE_BYTES / (1024 * 1024)} MB.`,
        status: 400,
      };
    }

    const mime = file.type || "application/octet-stream";
    if (!ALLOWED_CONTACT_MIME_TYPES.has(mime)) {
      return {
        error:
          locale === "es"
            ? "Tipo de archivo no permitido."
            : "File type not allowed.",
        status: 400,
      };
    }

    totalBytes += file.size;
    if (totalBytes > MAX_CONTACT_TOTAL_BYTES) {
      return {
        error:
          locale === "es"
            ? "El tamaño total de los adjuntos supera el límite permitido."
            : "Total attachment size exceeds the allowed limit.",
        status: 400,
      };
    }
  }

  return {
    data: {
      name,
      email,
      matterType: matterType || (locale === "es" ? "Otro" : "Other"),
      message,
      locale,
      attachmentCount: fileEntries.length,
      attachments: [], // filled below async in route
    },
  };
}

export async function filesFromFormData(
  formData: FormData,
): Promise<{ filename: string; content: Buffer }[]> {
  const fileEntries = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const attachments: { filename: string; content: Buffer }[] = [];

  for (const file of fileEntries) {
    const arrayBuffer = await file.arrayBuffer();
    attachments.push({
      filename: file.name,
      content: Buffer.from(arrayBuffer),
    });
  }

  return attachments;
}

function resolveTeamRecipients(from: string): string[] {
  const teamEmails = getContactTeamEmails();

  if (!isResendSandboxFrom(from)) {
    return teamEmails;
  }

  const sandboxTo = getResendSandboxRecipient();
  console.warn(
    `[contact] Resend sandbox sender detected; team notification goes only to ${sandboxTo}. Verify luquelaw.co in Resend for production.`,
  );
  return [sandboxTo];
}

function canSendUserConfirmation(from: string, email: string): boolean {
  if (!isResendSandboxFrom(from)) {
    return true;
  }

  return email.toLowerCase() === getResendSandboxRecipient().toLowerCase();
}

function isResendTestingRecipientError(error: {
  statusCode?: number | null;
  name?: string;
  message?: string;
}) {
  return (
    error.statusCode === 403 &&
    error.name === "validation_error" &&
    /only send testing emails/i.test(error.message ?? "")
  );
}

function formatSendError(fallback: string, resendMessage?: string) {
  if (process.env.NODE_ENV === "development" && resendMessage) {
    return resendMessage;
  }

  return fallback;
}

export async function sendContactEmails(submission: ParsedContactSubmission) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return {
      ok: false as const,
      error: "Email service is not configured.",
      status: 503,
    };
  }

  const resend = new Resend(apiKey);
  const emailData: ContactEmailData = {
    name: submission.name,
    email: submission.email,
    matterType: submission.matterType,
    message: submission.message,
    attachmentCount: submission.attachments.length,
    locale: submission.locale,
  };

  const internal = internalContactEmail(emailData);
  const confirmation = userConfirmationEmail(emailData);

  const attachmentPayload = submission.attachments.map((a) => ({
    filename: a.filename,
    content: a.content,
  }));

  const teamPayload = {
    from,
    replyTo: submission.email,
    subject: internal.subject,
    html: internal.html,
    attachments: attachmentPayload.length > 0 ? attachmentPayload : undefined,
  };

  let teamRecipients = resolveTeamRecipients(from);
  let teamResult = await resend.emails.send({
    ...teamPayload,
    to: teamRecipients,
  });

  if (
    teamResult.error &&
    isResendTestingRecipientError(teamResult.error) &&
    teamRecipients.length > 1
  ) {
    teamRecipients = [getResendSandboxRecipient()];
    console.warn(
      `[contact] Resend testing mode: retrying team notification to ${teamRecipients[0]} only.`,
    );
    teamResult = await resend.emails.send({
      ...teamPayload,
      to: teamRecipients,
    });
  }

  if (teamResult.error) {
    console.error("[contact] team email failed:", teamResult.error);
    return {
      ok: false as const,
      error: formatSendError(
        "Failed to send the inquiry.",
        teamResult.error.message,
      ),
      status: 502,
    };
  }

  if (!canSendUserConfirmation(from, submission.email)) {
    console.warn(
      `[contact] Resend sandbox sender detected; skipping confirmation to ${submission.email}.`,
    );
    return { ok: true as const };
  }

  const userResult = await resend.emails.send({
    from,
    to: submission.email,
    subject: confirmation.subject,
    html: confirmation.html,
  });

  if (userResult.error) {
    console.error("[contact] confirmation email failed:", userResult.error);
    if (isResendTestingRecipientError(userResult.error)) {
      console.warn(
        `[contact] Resend testing mode: skipping confirmation to ${submission.email}.`,
      );
      return { ok: true as const };
    }

    return {
      ok: false as const,
      error: formatSendError(
        "Inquiry received but confirmation email could not be sent.",
        userResult.error.message,
      ),
      status: 502,
    };
  }

  return { ok: true as const };
}
