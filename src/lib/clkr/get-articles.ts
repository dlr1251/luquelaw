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
  parseSections,
  recordToHubArticle,
} from "./types";

function fallbackHub(locale: "en" | "es"): ClkrArticle[] {
  return getStaticPublishedArticles(locale).map(recordToHubArticle);
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
