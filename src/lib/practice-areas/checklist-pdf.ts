import { jsPDF } from "jspdf";

import {
  FIRM_EMAIL,
  FIRM_SITE,
  FIRM_WHATSAPP_DISPLAY,
  FIRM_WHATSAPP_E164,
  visaChecklistMailto,
  visaChecklistWhatsappHref,
} from "@/lib/practice-areas/checklist-contact";
import type { ImmigrationLocale } from "@/lib/practice-areas/paths";

const FOREST = { r: 28, g: 31, b: 36 };
const GOLD = { r: 228, g: 187, b: 0 };
const INK = { r: 25, g: 27, b: 30 };
const MUTED = { r: 92, g: 101, b: 112 };
const WHITE = { r: 255, g: 255, b: 255 };
const ROW = { r: 248, g: 249, b: 250 };

const PAGE_W = 210;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = 274;

export type ChecklistPdfInput = {
  locale: ImmigrationLocale;
  title: string;
  category: string;
  articleNum: number;
  slug: string;
  items: string[];
  groups?: { heading?: string; items: string[] }[];
  checked: boolean[];
  pageUrl?: string;
};

function fill(doc: jsPDF, c: { r: number; g: number; b: number }) {
  doc.setFillColor(c.r, c.g, c.b);
}

function stroke(doc: jsPDF, c: { r: number; g: number; b: number }) {
  doc.setDrawColor(c.r, c.g, c.b);
}

function textColor(doc: jsPDF, c: { r: number; g: number; b: number }) {
  doc.setTextColor(c.r, c.g, c.b);
}

function drawWordmark(doc: jsPDF, x: number, y: number, size = 16) {
  doc.setFont("times", "bold");
  doc.setFontSize(size);
  textColor(doc, WHITE);
  doc.text("Luque", x, y);
  const luqueW = doc.getTextWidth("Luque");
  const gap = size * 0.28;
  const dotR = size * 0.09;
  const dotX = x + luqueW + gap + dotR;
  const dotY = y - size * 0.28;
  fill(doc, GOLD);
  doc.circle(dotX, dotY, dotR, "F");
  doc.text("Law", dotX + dotR + gap, y);
}

function drawHeader(doc: jsPDF, locale: ImmigrationLocale) {
  fill(doc, GOLD);
  doc.rect(0, 0, PAGE_W, 3.2, "F");
  fill(doc, FOREST);
  doc.rect(0, 3.2, PAGE_W, 38, "F");
  drawWordmark(doc, MARGIN, 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  textColor(doc, { r: 210, g: 214, b: 220 });
  const tagline =
    locale === "es"
      ? "Medellín, Colombia  ·  Derecho colombiano para clientes internacionales"
      : "Medellín, Colombia  ·  Colombian law for international clients";
  doc.text(tagline, MARGIN, 32);
  fill(doc, GOLD);
  doc.rect(0, 41.2, PAGE_W, 1.1, "F");
}

function drawFooter(
  doc: jsPDF,
  locale: ImmigrationLocale,
  page: number,
  total: number,
) {
  fill(doc, GOLD);
  doc.rect(MARGIN, FOOTER_Y, CONTENT_W, 0.45, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  textColor(doc, FOREST);
  const contact = `${FIRM_EMAIL}   ·   ${FIRM_WHATSAPP_DISPLAY}   ·   luquelaw.co`;
  doc.text(contact, MARGIN, FOOTER_Y + 6);

  const emailW = doc.getTextWidth(FIRM_EMAIL);
  doc.link(MARGIN, FOOTER_Y + 2.5, emailW, 5, { url: `mailto:${FIRM_EMAIL}` });

  const waStart =
    MARGIN +
    doc.getTextWidth(`${FIRM_EMAIL}   ·   `);
  const waW = doc.getTextWidth(FIRM_WHATSAPP_DISPLAY);
  doc.link(waStart, FOOTER_Y + 2.5, waW, 5, {
    url: `https://wa.me/${FIRM_WHATSAPP_E164}`,
  });

  const siteStart =
    MARGIN +
    doc.getTextWidth(`${FIRM_EMAIL}   ·   ${FIRM_WHATSAPP_DISPLAY}   ·   `);
  doc.link(siteStart, FOOTER_Y + 2.5, doc.getTextWidth("luquelaw.co"), 5, {
    url: FIRM_SITE,
  });

  doc.setFontSize(7);
  textColor(doc, MUTED);
  const disclaimer =
    locale === "es"
      ? "Informativo — no constituye asesoría. Cancillería decide cada solicitud. Verifique el listado vigente antes de radicar."
      : "Informational — not legal advice. Cancillería decides each application. Confirm the current rules before filing.";
  const lines = doc.splitTextToSize(disclaimer, CONTENT_W - 28) as string[];
  doc.text(lines, MARGIN, FOOTER_Y + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  textColor(doc, MUTED);
  doc.text(`${page} / ${total}`, PAGE_W - MARGIN, FOOTER_Y + 6, { align: "right" });
}

function drawCheckbox(doc: jsPDF, x: number, y: number, checked: boolean) {
  const size = 4.2;
  stroke(doc, checked ? GOLD : FOREST);
  doc.setLineWidth(0.35);
  if (checked) {
    fill(doc, GOLD);
    doc.roundedRect(x, y, size, size, 0.5, 0.5, "FD");
    stroke(doc, FOREST);
    doc.setLineWidth(0.55);
    doc.line(x + 0.9, y + 2.3, x + 1.7, y + 3.15);
    doc.line(x + 1.7, y + 3.15, x + 3.3, y + 1.15);
  } else {
    fill(doc, WHITE);
    doc.roundedRect(x, y, size, size, 0.5, 0.5, "FD");
  }
}

function fileName(slug: string, locale: ImmigrationLocale) {
  return `luque-law-checklist-${slug}-${locale}.pdf`;
}

export function buildVisaChecklistPdf(input: ChecklistPdfInput) {
  const { locale, title, category, articleNum, slug, items, checked, pageUrl } =
    input;
  const copy =
    locale === "es"
      ? {
          kicker: "Checklist de solicitud",
          progress: (done: number, total: number) => `${done} de ${total} listos`,
          help: "Si un requisito no encaja, escríbanos.",
          email: "Correo",
          whatsapp: "WhatsApp",
        }
      : {
          kicker: "Application checklist",
          progress: (done: number, total: number) => `${done} of ${total} done`,
          help: "If a requirement does not fit, write to us.",
          email: "Email",
          whatsapp: "WhatsApp",
        };

  const done = checked.filter(Boolean).length;
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.setProperties({
    title: `${copy.kicker} — ${title}`,
    author: "Luque Law",
    subject: title,
    creator: "Luque Law",
  });

  const dated = new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    timeZone: "America/Bogota",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const bodyStart = 50;
  const bodyEnd = FOOTER_Y - 8;
  let y = bodyStart;
  let page = 1;

  const ensureSpace = (h: number) => {
    if (y + h <= bodyEnd) return;
    page += 1;
    doc.addPage();
    y = 22;
    fill(doc, FOREST);
    doc.rect(0, 0, PAGE_W, 12, "F");
    fill(doc, GOLD);
    doc.rect(0, 12, PAGE_W, 0.8, "F");
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    textColor(doc, WHITE);
    doc.text("Luque Law", MARGIN, 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    textColor(doc, { r: 210, g: 214, b: 220 });
    doc.text(title, PAGE_W - MARGIN, 8, { align: "right" });
  };

  drawHeader(doc, locale);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  textColor(doc, MUTED);
  doc.text(copy.kicker.toUpperCase(), MARGIN, y);
  y += 8;

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  textColor(doc, FOREST);
  const titleLines = doc.splitTextToSize(title, CONTENT_W) as string[];
  doc.text(titleLines, MARGIN, y);
  y += titleLines.length * 7 + 3;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  textColor(doc, MUTED);
  doc.text(
    `${category}  ·  Art. ${articleNum}  ·  ${copy.progress(done, items.length)}  ·  ${dated}`,
    MARGIN,
    y,
  );
  y += 6;

  if (pageUrl) {
    doc.setFontSize(8);
    textColor(doc, MUTED);
    const compact = pageUrl.replace(/^https?:\/\//, "");
    doc.text(compact, MARGIN, y);
    doc.link(MARGIN, y - 3, Math.min(CONTENT_W, doc.getTextWidth(compact)), 4, {
      url: pageUrl,
    });
    y += 5;
  }

  fill(doc, GOLD);
  doc.rect(MARGIN, y, 22, 0.7, "F");
  y += 8;

  const groups = input.groups?.length ? input.groups : [{ items }];
  let itemIndex = 0;

  groups.forEach((group) => {
    if (group.heading) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const headLines = doc.splitTextToSize(group.heading, CONTENT_W) as string[];
      const headH = headLines.length * 4.4 + 6;
      ensureSpace(headH);
      textColor(doc, FOREST);
      doc.text(headLines, MARGIN, y + 3);
      y += headH;
    }

    group.items.forEach((item) => {
      const index = itemIndex;
      itemIndex += 1;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const textX = MARGIN + 10;
      const textW = CONTENT_W - 12;
      const lines = doc.splitTextToSize(item, textW) as string[];
      const blockH = Math.max(10, lines.length * 4.6 + 6);

      ensureSpace(blockH);

      if (index % 2 === 0) {
        fill(doc, ROW);
        doc.rect(MARGIN - 2, y - 1, CONTENT_W + 4, blockH, "F");
      }

      fill(doc, GOLD);
      doc.rect(MARGIN - 2, y - 1, 1.1, blockH, "F");

      drawCheckbox(doc, MARGIN + 1.5, y + 1.4, Boolean(checked[index]));
      textColor(doc, INK);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(lines, textX, y + 4.6);
      y += blockH;
    });
  });

  ensureSpace(28);
  y += 6;
  fill(doc, FOREST);
  doc.roundedRect(MARGIN - 2, y, CONTENT_W + 4, 22, 1.2, 1.2, "F");
  fill(doc, GOLD);
  doc.rect(MARGIN - 2, y, 1.4, 22, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  textColor(doc, WHITE);
  const help = doc.splitTextToSize(copy.help, CONTENT_W - 8) as string[];
  doc.text(help, MARGIN + 4, y + 7);

  doc.setFontSize(8);
  textColor(doc, GOLD);
  const contactY = y + 16;
  doc.text(`${copy.email}: ${FIRM_EMAIL}`, MARGIN + 4, contactY);
  doc.link(MARGIN + 4, contactY - 3.5, doc.getTextWidth(`${copy.email}: ${FIRM_EMAIL}`), 5, {
    url: visaChecklistMailto(title),
  });
  const waLabel = `${copy.whatsapp}: ${FIRM_WHATSAPP_DISPLAY}`;
  const waX = MARGIN + 4 + doc.getTextWidth(`${copy.email}: ${FIRM_EMAIL}     `);
  doc.text(waLabel, waX, contactY);
  doc.link(waX, contactY - 3.5, doc.getTextWidth(waLabel), 5, {
    url: visaChecklistWhatsappHref(locale, title),
  });

  doc.setPage(1);
  doc.link(MARGIN, 8, 50, 20, { url: FIRM_SITE });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p += 1) {
    doc.setPage(p);
    drawFooter(doc, locale, p, total);
  }

  return doc;
}

export function downloadVisaChecklistPdf(input: ChecklistPdfInput) {
  const doc = buildVisaChecklistPdf(input);
  doc.save(fileName(input.slug, input.locale));
}
