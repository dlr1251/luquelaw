import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type LucySearchHit = {
  kind: "norm" | "guide";
  title: string;
  slug_key: string;
  excerpt: string;
  locale: string;
};

const IMMIGRATION_GUIDE_SLUGS = [
  "investor-visa",
  "visas-ground-rules",
  "last-legal-day",
  "real-estate-transactions",
];

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-záéíóúñü0-9]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3)
    .slice(0, 8);
}

/** Keyword / ILIKE retrieval over immigration norms + Immigration-related CLKR guides. */
export async function searchLucyKnowledge(
  query: string,
  locale: "en" | "es" = "en",
  limit = 6,
): Promise<LucySearchHit[]> {
  if (!isSupabaseConfigured() || !query.trim()) return [];
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

  // Also search published immigration norms by title if section hits are thin
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
    .in("slug_key", IMMIGRATION_GUIDE_SLUGS)
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
      .in("slug_key", IMMIGRATION_GUIDE_SLUGS)
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

  // Dedupe by kind+slug_key
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
