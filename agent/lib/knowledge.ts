import { embed } from "ai";
import { gateway } from "@ai-sdk/gateway";

import { createAgentServiceClient, isAgentServiceConfigured } from "./supabase";

export type TornySearchHit = {
  kind: "norm" | "guide";
  title: string;
  slug_key: string;
  excerpt: string;
  locale: string;
  similarity?: number;
};

const IMMIGRATION_GUIDE_SLUGS = [
  "investor-visa-colombia",
  "visas-ground-rules",
  "last-legal-day-colombia",
  "migrant-visa-type-m-investor",
  "migrant-visa-type-m-worker",
  "tax-residency-in-colombia",
] as const;

const EMBEDDING_MODEL =
  process.env.LUCY_EMBEDDING_MODEL?.trim() || "openai/text-embedding-3-small";

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-záéíóúñü0-9]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3)
    .slice(0, 8);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Semantic + keyword search over immigration norms/guides (service role). */
export async function searchTornyKnowledge(
  query: string,
  locale: "en" | "es" = "en",
  limit = 6,
  kind?: "norm" | "guide",
): Promise<TornySearchHit[]> {
  if (!isAgentServiceConfigured() || !query.trim()) return [];

  try {
    const semantic = await searchSemantic(query, locale, limit, kind);
    if (semantic.length) return semantic;
  } catch (err) {
    console.warn("[torny/knowledge] semantic search failed, keyword fallback", err);
  }

  const keyword = await searchKeyword(query, locale, limit);
  return kind ? keyword.filter((h) => h.kind === kind) : keyword;
}

async function searchSemantic(
  query: string,
  locale: "en" | "es",
  limit: number,
  kind?: "norm" | "guide",
): Promise<TornySearchHit[]> {
  const { embedding } = await embed({
    model: gateway.textEmbeddingModel(EMBEDDING_MODEL),
    value: query,
  });

  const supabase = createAgentServiceClient();
  const { data, error } = await supabase.rpc("match_lucy_knowledge", {
    query_embedding: embedding,
    match_count: Math.max(limit * 2, 8),
    filter_locale: locale,
    filter_kind: kind ?? null,
  });
  if (error) throw error;

  const hits: TornySearchHit[] = [];
  const seen = new Set<string>();
  for (const row of data ?? []) {
    if ((row.similarity ?? 0) < 0.2) continue;
    const key = `${row.source_kind}:${row.slug_key}:${row.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    hits.push({
      kind: row.source_kind,
      title: row.title,
      slug_key: row.slug_key,
      excerpt: String(row.content ?? "").slice(0, 400),
      locale: row.locale,
      similarity: row.similarity,
    });
    if (hits.length >= limit) break;
  }
  return hits;
}

async function searchKeyword(
  query: string,
  locale: "en" | "es",
  limit: number,
): Promise<TornySearchHit[]> {
  const supabase = createAgentServiceClient();
  const tokens = tokenize(query);
  const primary = tokens[0] ?? query.trim().slice(0, 40);
  const pattern = `%${primary}%`;
  const hits: TornySearchHit[] = [];

  const { data: sections } = await supabase
    .from("norm_sections")
    .select(
      "id, title, html, number_label, norms!inner(slug_key, title, locale, status, category)",
    )
    .ilike("title", pattern)
    .eq("norms.category", "immigration")
    .eq("norms.status", "published")
    .limit(limit);

  for (const row of sections ?? []) {
    const norm = row.norms as
      | { slug_key: string; title: string; locale: string }
      | { slug_key: string; title: string; locale: string }[]
      | null;
    const n = Array.isArray(norm) ? norm[0] : norm;
    if (!n) continue;
    hits.push({
      kind: "norm",
      title: `${n.title}: ${row.number_label ? `${row.number_label} ` : ""}${row.title}`,
      slug_key: n.slug_key,
      excerpt: stripHtml(String(row.html ?? "")).slice(0, 400) || String(row.title ?? ""),
      locale: n.locale,
    });
  }

  const { data: guides } = await supabase
    .from("clkr_articles")
    .select("slug_key, title, description, locale")
    .eq("status", "published")
    .eq("locale", locale)
    .in("slug_key", [...IMMIGRATION_GUIDE_SLUGS])
    .or(`title.ilike.${pattern},description.ilike.${pattern}`)
    .limit(limit);

  for (const g of guides ?? []) {
    hits.push({
      kind: "guide",
      title: g.title,
      slug_key: g.slug_key,
      excerpt: String(g.description ?? "").slice(0, 400),
      locale: g.locale,
    });
  }

  const seen = new Set<string>();
  const unique: TornySearchHit[] = [];
  for (const h of hits) {
    const key = `${h.kind}:${h.slug_key}:${h.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(h);
  }
  return unique.slice(0, limit);
}
