import { BRAND } from "@/lib/email/brand";

function layout(content: string, locale: "en" | "es") {
  const footer =
    locale === "es"
      ? `${BRAND.lawyer} · ${BRAND.location}<br/>Este mensaje es confidencial y puede contener información privilegiada.`
      : `${BRAND.lawyer} · ${BRAND.location}<br/>This message is confidential and may contain privileged information.`;

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.colors.parchment};font-family:Georgia,'Times New Roman',serif;color:${BRAND.colors.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.colors.parchment};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid color-mix(in srgb, ${BRAND.colors.moss} 35%, transparent);">
          <tr>
            <td style="background:${BRAND.colors.forest};padding:28px 32px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.colors.parchment};opacity:0.85;">${BRAND.name}</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:400;color:${BRAND.colors.parchment};line-height:1.3;">${BRAND.lawyer}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;font-size:15px;line-height:1.65;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #e8e4dc;font-size:12px;line-height:1.5;color:#6b6358;">
              ${footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string) {
  const safe = escapeHtml(value).replace(/\n/g, "<br/>");
  return `<tr>
    <td style="padding:8px 0;vertical-align:top;width:120px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.04em;color:${BRAND.colors.moss};">${escapeHtml(label)}</td>
    <td style="padding:8px 0 8px 12px;font-size:15px;">${safe}</td>
  </tr>`;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type ContactEmailData = {
  name: string;
  email: string;
  matterType: string;
  message: string;
  attachmentCount: number;
  locale: "en" | "es";
};

export function internalContactEmail(data: ContactEmailData) {
  const locale = data.locale;
  const title =
    locale === "es"
      ? "Nueva consulta desde el sitio web"
      : "New inquiry from the website";
  const labels =
    locale === "es"
      ? { name: "Nombre", email: "Correo", matter: "Asunto", message: "Mensaje", files: "Adjuntos" }
      : { name: "Name", email: "Email", matter: "Matter", message: "Message", files: "Attachments" };

  const filesLabel =
    data.attachmentCount > 0
      ? `${data.attachmentCount} archivo(s) incluido(s) en este correo`
      : locale === "es"
        ? "Sin adjuntos"
        : "No attachments";

  const content = `
    <h2 style="margin:0 0 20px;font-size:20px;color:${BRAND.colors.forest};">${title}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row(labels.name, data.name)}
      ${row(labels.email, data.email)}
      ${row(labels.matter, data.matterType)}
      ${row(labels.files, filesLabel)}
    </table>
    <p style="margin:24px 0 8px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.04em;color:${BRAND.colors.moss};">${labels.message}</p>
    <div style="padding:16px;background:${BRAND.colors.parchment};border-left:3px solid ${BRAND.colors.moss};white-space:pre-wrap;">${escapeHtml(data.message)}</div>
  `;

  const subject =
    locale === "es"
      ? `[Luque Law] Consulta web — ${data.matterType} — ${data.name}`
      : `[Luque Law] Website inquiry — ${data.matterType} — ${data.name}`;

  return { subject, html: layout(content, locale) };
}

export function userConfirmationEmail(data: ContactEmailData) {
  const locale = data.locale;

  if (locale === "es") {
    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.colors.forest};">Hemos recibido tu mensaje</h2>
      <p style="margin:0 0 16px;">Hola <strong>${escapeHtml(data.name)}</strong>,</p>
      <p style="margin:0 0 16px;">Gracias por contactar a <strong>${BRAND.name}</strong>. Confirmamos que recibimos tu consulta sobre <strong>${escapeHtml(data.matterType)}</strong> y te responderemos lo antes posible.</p>
      <p style="margin:0 0 16px;">Si tu asunto es urgente, también puedes escribirnos por WhatsApp desde nuestro sitio web.</p>
      <p style="margin:24px 0 0;font-size:14px;color:#6b6358;">Resumen de tu mensaje:</p>
      <div style="margin-top:8px;padding:16px;background:${BRAND.colors.parchment};border-left:3px solid ${BRAND.colors.moss};white-space:pre-wrap;font-size:14px;">${escapeHtml(data.message)}</div>
      <p style="margin:24px 0 0;">Atentamente,<br/><strong>${BRAND.lawyer}</strong><br/>${BRAND.name}</p>
    `;
    return {
      subject: "Confirmación — hemos recibido tu mensaje | Luque Law",
      html: layout(content, locale),
    };
  }

  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.colors.forest};">We received your message</h2>
    <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(data.name)}</strong>,</p>
    <p style="margin:0 0 16px;">Thank you for contacting <strong>${BRAND.name}</strong>. We confirm that we received your inquiry regarding <strong>${escapeHtml(data.matterType)}</strong> and will respond as soon as possible.</p>
    <p style="margin:0 0 16px;">If your matter is urgent, you can also reach us via WhatsApp on our website.</p>
    <p style="margin:24px 0 0;font-size:14px;color:#6b6358;">Summary of your message:</p>
    <div style="margin-top:8px;padding:16px;background:${BRAND.colors.parchment};border-left:3px solid ${BRAND.colors.moss};white-space:pre-wrap;font-size:14px;">${escapeHtml(data.message)}</div>
    <p style="margin:24px 0 0;">Kind regards,<br/><strong>${BRAND.lawyer}</strong><br/>${BRAND.name}</p>
  `;

  return {
    subject: "Confirmation — we received your message | Luque Law",
    html: layout(content, locale),
  };
}
