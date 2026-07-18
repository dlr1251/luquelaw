import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { embedLucyQuery } from "@/lib/lucy/embeddings";
import { IMMIGRATION_GUIDE_SLUGS } from "@/lib/lucy/knowledge-sources";

export type LucySearchHit = {
  kind: "norm" | "guide";
  title: string;
  slug_key: string;
  excerpt: string;
  locale: string;
  similarity?: number;
};

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-záéíóúñü0-9]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3)
    .slice(0, 8);
}

type MatchRow = {
  source_kind: "norm" | "guide";
  slug_key: string;
  locale: string;
  title: string;
  content: string;
  similarity: number;
};

/** Semantic retrieval (pgvector) with keyword ILIKE fallback. */
export async function searchLucyKnowledge(
  query: string,
  locale: "en" | "es" = "en",
  limit = 6,
  kind?: "norm" | "guide",
): Promise<LucySearchHit[]> {
  if (!isSupabaseConfigured() || !query.trim()) return [];

  try {
    const semantic = await searchLucyKnowledgeSemantic(query, locale, limit, kind);
    if (semantic.length) return semantic;
  } catch (err) {
    console.warn("[lucy/rag] semantic search failed, falling back to keyword", err);
  }

  const keyword = await searchLucyKnowledgeKeyword(query, locale, limit);
  return kind ? keyword.filter((h) => h.kind === kind) : keyword;
}

async function searchLucyKnowledgeSemantic(
  query: string,
  locale: "en" | "es",
  limit: number,
  kind?: "norm" | "guide",
): Promise<LucySearchHit[]> {
  const embedding = await embedLucyQuery(query);
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("match_lucy_knowledge", {
    query_embedding: embedding,
    match_count: Math.max(limit * 2, 8),
    filter_locale: locale,
    filter_kind: kind ?? null,
  });

  if (error) throw error;

  const rows = (data ?? []) as MatchRow[];
  const hits: LucySearchHit[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
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

/** Keyword / ILIKE retrieval over immigration norms + Immigration-related CLKR guides. */
async function searchLucyKnowledgeKeyword(
  query: string,
  locale: "en" | "es" = "en",
  limit = 6,
): Promise<LucySearchHit[]> {
  const supabase = await createClient();
  const tokens = tokenize(query);
  const primary = tokens[0] ?? query.trim().slice(0, 40);
  const pattern = `%${primary}%`;
  const hits: LucySearchHit[] = [];

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
      | { slug_key: string; title: string; locale: string; status: string }
      | { slug_key: string; title: string; locale: string; status: string }[]
      | null;
    const n = Array.isArray(norm) ? norm[0] : norm;
    if (!n) continue;
    const plain = stripHtml(String(row.html ?? "")).slice(0, 400);
    hits.push({
      kind: "norm",
      title: `${n.title}: ${row.number_label ? `${row.number_label} ` : ""}${row.title}`,
      slug_key: n.slug_key,
      excerpt: plain || String(row.title ?? ""),
      locale: n.locale,
    });
  }

  if (hits.length < 3) {
    const { data: norms } = await supabase
      .from("norms")
      .select("slug_key, title, description, locale")
      .eq("status", "published")
      .eq("category", "immigration")
      .eq("locale", locale)
      .or(`title.ilike.${pattern},description.ilike.${pattern}`)
      .limit(4);

    for (const n of norms ?? []) {
      hits.push({
        kind: "norm",
        title: n.title,
        slug_key: n.slug_key,
        excerpt: String(n.description ?? "").slice(0, 400),
        locale: n.locale,
      });
    }
  }

  const { data: guides } = await supabase
    .from("clkr_articles")
    .select("slug_key, title, description, locale, status")
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

  if (!hits.some((h) => h.kind === "guide")) {
    const { data: fallback } = await supabase
      .from("clkr_articles")
      .select("slug_key, title, description, locale, status")
      .eq("status", "published")
      .eq("locale", locale)
      .in("slug_key", [...IMMIGRATION_GUIDE_SLUGS])
      .limit(3);
    for (const g of fallback ?? []) {
      hits.push({
        kind: "guide",
        title: g.title,
        slug_key: g.slug_key,
        excerpt: String(g.description ?? "").slice(0, 400),
        locale: g.locale,
      });
    }
  }

  const seen = new Set<string>();
  const unique: LucySearchHit[] = [];
  for (const h of hits) {
    const key = `${h.kind}:${h.slug_key}:${h.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(h);
  }

  return unique.slice(0, limit);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
