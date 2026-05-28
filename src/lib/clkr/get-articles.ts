import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import { clkrArticles, clkrArticlesEs } from "./articles";
import {
  type ClkrArticle,
  type ClkrArticleRecord,
  parseSections,
  recordToHubArticle,
} from "./types";

function fallbackHub(locale: "en" | "es"): ClkrArticle[] {
  return locale === "es" ? [...clkrArticlesEs] : [...clkrArticles];
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
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clkr_articles")
      .select("*")
      .eq("slug_key", slugKey)
      .eq("locale", locale)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) return null;
    return mapRow(data);
  } catch {
    return null;
  }
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
  if (!isSupabaseConfigured()) return [];

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

    if (error || !data) return [];
    return data.map((row) => mapRow(row));
  } catch {
    return [];
  }
}
