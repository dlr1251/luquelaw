import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import {
  getStaticPublishedArticle,
  getStaticPublishedArticles,
  getStaticTranslationSlugKey,
  staticClkrArticleRecords,
} from "./static-articles";
import {
  type ClkrArticle,
  type ClkrArticleRecord,
  type ClkrCategory,
  parseSections,
  recordToHubArticle,
} from "./types";

/** Service areas that surface CLKR guides by category. */
export type ServiceAreaWithClkr = "labour-law" | "corporate-law" | "taxes" | "family-law";

export const SERVICE_AREA_CLKR_CATEGORIES: Record<ServiceAreaWithClkr, ClkrCategory[]> = {
  "labour-law": ["Labor"],
  "corporate-law": ["Corporate"],
  taxes: ["Tax"],
  "family-law": ["Family", "Civil"],
};

function fallbackHub(locale: "en" | "es"): ClkrArticle[] {
  return getStaticPublishedArticles(locale).map(recordToHubArticle);
}

function fallbackHubByCategories(
  locale: "en" | "es",
  categories: ClkrCategory[],
  limit: number,
): ClkrArticle[] {
  return getStaticPublishedArticles(locale)
    .filter((article) => categories.includes(article.category))
    .slice(0, limit)
    .map(recordToHubArticle);
}

function mapRow(row: Record<string, unknown>): ClkrArticleRecord {
  return {
    id: String(row.id),
    slug_key: String(row.slug_key),
    locale: row.locale as "en" | "es",
    title: String(row.title),
    description: String(row.description),
    category: row.category as ClkrArticleRecord["category"],
    reading_time: String(row.reading_time),
    sections: parseSections(row.sections),
    status: row.status as ClkrArticleRecord["status"],
    sort_order: Number(row.sort_order) || 0,
    translation_group_id: row.translation_group_id ? String(row.translation_group_id) : null,
    published_at: row.published_at ? String(row.published_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export type ClkrArticleSort = "sort_order" | "title" | "published_at";

export type ClkrArticleSearchFilters = {
  category?: ClkrCategory;
  sort?: ClkrArticleSort;
  limit?: number;
};

export async function searchHubArticles(
  query: string,
  locale: "en" | "es",
  filters: ClkrArticleSearchFilters = {},
): Promise<ClkrArticle[]> {
  const q = query.trim();
  const limit = filters.limit ?? 200;
  const sort = filters.sort ?? "sort_order";

  if (!isSupabaseConfigured()) {
    const all = getStaticPublishedArticles(locale).map(recordToHubArticle);
    return filterAndSortArticles(all, q, filters.category, sort).slice(0, limit);
  }

  try {
    const supabase = await createClient();
    let dbQuery = supabase
      .from("clkr_articles")
      .select("*")
      .eq("locale", locale)
      .eq("status", "published");

    if (filters.category) {
      dbQuery = dbQuery.eq("category", filters.category);
    }

    if (q) {
      const pattern = `%${q.replace(/[%_\\]/g, "\\$&")}%`;
      dbQuery = dbQuery.or(
        `title.ilike.${pattern},description.ilike.${pattern},sections::text.ilike.${pattern}`,
      );
    }

    if (sort === "title") {
      dbQuery = dbQuery.order("title", { ascending: true });
    } else if (sort === "published_at") {
      dbQuery = dbQuery.order("published_at", { ascending: false, nullsFirst: false });
    } else {
      dbQuery = dbQuery.order("sort_order", { ascending: true });
    }

    dbQuery = dbQuery.limit(limit);

    const { data, error } = await dbQuery;

    if (error || !data?.length) {
      const all = await getHubArticles(locale);
      return filterAndSortArticles(all, q, filters.category, sort).slice(0, limit);
    }

    return data.map((row) => recordToHubArticle(mapRow(row)));
  } catch {
    const all = await getHubArticles(locale);
    return filterAndSortArticles(all, q, filters.category, sort).slice(0, limit);
  }
}

function filterAndSortArticles(
  articles: ClkrArticle[],
  query: string,
  category: ClkrCategory | undefined,
  sort: ClkrArticleSort,
): ClkrArticle[] {
  const q = query.trim().toLowerCase();
  let result = articles.filter((a) => {
    if (category && a.category !== category) return false;
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  });

  if (sort === "title") {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "published_at") {
    result = [...result].sort((a, b) => {
      const da = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const db = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return db - da;
    });
  } else {
    result = [...result].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return result;
}

export async function getRelatedArticlesForArticle(
  articleId: string,
  slugKey: string,
  locale: "en" | "es",
  limit = 4,
): Promise<ClkrArticle[]> {
  const { getArticleRelations } = await import("./get-study-paths");
  const relations = await getArticleRelations(articleId, "related");
  const fromRelations = relations
    .map((rel) => rel.to_article as ClkrArticle)
    .slice(0, limit);

  if (fromRelations.length >= limit) return fromRelations;

  const fallback = await getRelatedPublishedArticles(slugKey, locale, limit);
  const seen = new Set(fromRelations.map((a) => a.slugKey));
  for (const row of fallback) {
    if (fromRelations.length >= limit) break;
    const hub = recordToHubArticle(row);
    if (!seen.has(hub.slugKey)) {
      fromRelations.push(hub);
      seen.add(hub.slugKey);
    }
  }

  return fromRelations;
}

export async function getHubArticlesByClkrCategories(
  categories: ClkrCategory[],
  locale: "en" | "es",
  limit = 6,
): Promise<ClkrArticle[]> {
  if (categories.length === 0) return [];
  const all = await getHubArticles(locale);
  const set = new Set(categories);
  return all.filter((a) => set.has(a.category)).slice(0, limit);
}

export async function getHubArticlesForServiceArea(
  areaId: ServiceAreaWithClkr,
  locale: "en" | "es",
  limit = 6,
): Promise<ClkrArticle[]> {
  const categories = SERVICE_AREA_CLKR_CATEGORIES[areaId];

  if (!isSupabaseConfigured()) {
    return fallbackHubByCategories(locale, categories, limit);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clkr_articles")
      .select("*")
      .eq("locale", locale)
      .eq("status", "published")
      .in("category", categories)
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error || !data?.length) {
      return fallbackHubByCategories(locale, categories, limit);
    }

    return data.map((row) => recordToHubArticle(mapRow(row)));
  } catch {
    return fallbackHubByCategories(locale, categories, limit);
  }
}

export async function getHubArticles(locale: "en" | "es"): Promise<ClkrArticle[]> {
  if (!isSupabaseConfigured()) {
    return fallbackHub(locale);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clkr_articles")
      .select("*")
      .eq("locale", locale)
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return fallbackHub(locale);
    }

    return data.map((row) => recordToHubArticle(mapRow(row)));
  } catch {
    return fallbackHub(locale);
  }
}

export async function getPublishedArticle(
  slugKey: string,
  locale: "en" | "es",
): Promise<ClkrArticleRecord | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("clkr_articles")
        .select("*")
        .eq("slug_key", slugKey)
        .eq("locale", locale)
        .eq("status", "published")
        .maybeSingle();

      if (!error && data) return mapRow(data);
    } catch {
      // Fall through to static catalog.
    }
  }

  return getStaticPublishedArticle(slugKey, locale);
}

export async function getAllArticlesForAdmin(): Promise<ClkrArticleRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clkr_articles")
    .select("*")
    .order("locale")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapRow(row));
}

export async function getArticleById(id: string): Promise<ClkrArticleRecord | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("clkr_articles").select("*").eq("id", id).maybeSingle();

  if (error || !data) return null;
  return mapRow(data);
}

export async function getRelatedPublishedArticles(
  slugKey: string,
  locale: "en" | "es",
  limit = 2,
): Promise<ClkrArticleRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("clkr_articles")
        .select("*")
        .eq("locale", locale)
        .eq("status", "published")
        .neq("slug_key", slugKey)
        .order("sort_order", { ascending: true })
        .limit(limit);

      if (!error && data?.length) return data.map((row) => mapRow(row));
    } catch {
      // Fall through to static catalog.
    }
  }

  return getStaticPublishedArticles(locale)
    .filter((article) => article.slug_key !== slugKey)
    .slice(0, limit);
}

export async function getAllPublishedArticles(): Promise<ClkrArticleRecord[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("clkr_articles")
        .select("*")
        .eq("status", "published")
        .order("locale")
        .order("sort_order", { ascending: true });

      if (!error && data?.length) return data.map((row) => mapRow(row));
    } catch {
      // Fall through to static catalog.
    }
  }

  return staticClkrArticleRecords
    .filter((article) => article.status === "published")
    .sort((a, b) => a.locale.localeCompare(b.locale) || a.sort_order - b.sort_order);
}

export async function getTranslationSlugKey(
  slugKey: string,
  locale: "en" | "es",
): Promise<string | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: source, error: sourceError } = await supabase
        .from("clkr_articles")
        .select("translation_group_id")
        .eq("slug_key", slugKey)
        .eq("locale", locale)
        .eq("status", "published")
        .maybeSingle();

      if (!sourceError && source?.translation_group_id) {
        const otherLocale = locale === "en" ? "es" : "en";
        const { data: translation, error: translationError } = await supabase
          .from("clkr_articles")
          .select("slug_key")
          .eq("translation_group_id", source.translation_group_id)
          .eq("locale", otherLocale)
          .eq("status", "published")
          .maybeSingle();

        if (!translationError && translation?.slug_key) {
          return String(translation.slug_key);
        }
      }
    } catch {
      // Fall through to static catalog.
    }
  }

  return getStaticTranslationSlugKey(slugKey, locale);
}
