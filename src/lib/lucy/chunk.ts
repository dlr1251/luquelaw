import { createHash } from "node:crypto";

export type LucyChunkDraft = {
  source_kind: "norm" | "guide";
  source_id: string;
  slug_key: string;
  locale: "en" | "es";
  title: string;
  chunk_index: number;
  content: string;
  content_hash: string;
  metadata: Record<string, unknown>;
};

const TARGET_CHARS = 1200;
const OVERLAP_CHARS = 150;

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 32);
}

/** Split plain text into overlapping chunks sized for embedding. */
export function splitText(text: string, target = TARGET_CHARS, overlap = OVERLAP_CHARS): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  if (cleaned.length <= target) return [cleaned];

  const chunks: string[] = [];
  let start = 0;
  while (start < cleaned.length) {
    let end = Math.min(start + target, cleaned.length);
    if (end < cleaned.length) {
      const slice = cleaned.slice(start, end);
      const lastBreak = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf(" "));
      if (lastBreak > target * 0.4) {
        end = start + lastBreak + 1;
      }
    }
    const piece = cleaned.slice(start, end).trim();
    if (piece) chunks.push(piece);
    if (end >= cleaned.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks;
}

export function buildChunkDrafts(input: {
  source_kind: "norm" | "guide";
  source_id: string;
  slug_key: string;
  locale: "en" | "es";
  title: string;
  text: string;
  metadata?: Record<string, unknown>;
}): LucyChunkDraft[] {
  const parts = splitText(input.text);
  return parts.map((content, chunk_index) => ({
    source_kind: input.source_kind,
    source_id: input.source_id,
    slug_key: input.slug_key,
    locale: input.locale,
    title: input.title,
    chunk_index,
    content,
    content_hash: hashContent(content),
    metadata: input.metadata ?? {},
  }));
}
