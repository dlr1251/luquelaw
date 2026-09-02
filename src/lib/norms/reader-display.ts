/** Display helpers for the continuous norm reader (ingest titles often dump body text). */

export function headingAfterDash(title: string, numberLabel: string | null): string | null {
  const parts = title.split(/\s+[—–-]\s+/);
  if (parts.length < 2) return null;
  const rest = parts.slice(1).join(" — ").trim();
  if (!rest) return null;
  if (numberLabel && rest === numberLabel.trim()) return null;
  return rest;
}

export function readerSectionHeading(input: {
  number_label: string | null;
  title: string;
  html: string | null;
}): { heading: string; sub: string | null } {
  const number = input.number_label?.trim() || null;
  const title = input.title.trim();
  const hasHtml = Boolean(input.html?.trim());

  if (hasHtml) {
    return { heading: number ?? title, sub: null };
  }

  const sub = headingAfterDash(title, number);
  return { heading: number ?? title, sub };
}

const STRUCTURE_LABEL =
  /^(t[ií]tulo|title|cap[ií]tulo|chapter|libro|book|parte|part)\s+[ivxlcdm0-9]+$/i;

function paragraphPlainText(block: string): string {
  return block
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeHeadingLabel(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

/** Drop gazette leftovers (TITULO II, CAPITULO 1, next-title lines) that leaked into article HTML. */
export function stripGazetteStructureBleed(html: string, structuralLabels: string[]): string {
  if (!html.trim()) return html;
  const extras = new Set(structuralLabels.map(normalizeHeadingLabel).filter(Boolean));

  return html.replace(/<p\b[^>]*>[\s\S]*?<\/p>/gi, (block) => {
    const text = paragraphPlainText(block);
    if (!text) return "";
    if (STRUCTURE_LABEL.test(text)) return "";
    if (extras.has(normalizeHeadingLabel(text))) return "";
    return block;
  });
}

export function structuralBleedLabels(
  nodes: Array<{ number_label: string | null; title: string; html: string | null }>,
): string[] {
  const labels: string[] = [];
  for (const node of nodes) {
    if (node.html?.trim()) continue;
    if (node.number_label) labels.push(node.number_label);
    labels.push(node.title);
    const after = headingAfterDash(node.title, node.number_label);
    if (after) labels.push(after);
  }
  return labels;
}
