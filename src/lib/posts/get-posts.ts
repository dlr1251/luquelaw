import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import { posts, postsEs } from "./posts";
import {
  type Post,
  type PostRecord,
  parseSections,
  recordToHubPost,
} from "./types";

function fallbackHub(locale: "en" | "es"): Post[] {
  return locale === "es" ? [...postsEs] : [...posts];
}

function mapRow(row: Record<string, unknown>): PostRecord {
  return {
    id: String(row.id),
    slug_key: String(row.slug_key),
    locale: row.locale as "en" | "es",
    title: String(row.title),
    description: String(row.description),
    category: row.category as PostRecord["category"],
    reading_time: String(row.reading_time),
    sections: parseSections(row.sections),
    status: row.status as PostRecord["status"],
    sort_order: Number(row.sort_order) || 0,
    translation_group_id: row.translation_group_id ? String(row.translation_group_id) : null,
    published_at: row.published_at ? String(row.published_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function getHubPosts(locale: "en" | "es"): Promise<Post[]> {
  if (!isSupabaseConfigured()) {
    return fallbackHub(locale);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("locale", locale)
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return fallbackHub(locale);
    }

    return data.map((row) => recordToHubPost(mapRow(row)));
  } catch {
    return fallbackHub(locale);
  }
}

export async function getPublishedPost(
  slugKey: string,
  locale: "en" | "es",
): Promise<PostRecord | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
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

export async function getAllPostsForAdmin(): Promise<PostRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("locale")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapRow(row));
}

export async function getPostById(id: string): Promise<PostRecord | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();

  if (error || !data) return null;
  return mapRow(data);
}

export async function getRelatedPublishedPosts(
  slugKey: string,
  locale: "en" | "es",
  limit = 2,
): Promise<PostRecord[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
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

export async function getAllPublishedPosts(): Promise<PostRecord[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("locale")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map((row) => mapRow(row));
  } catch {
    return [];
  }
}

export async function getTranslationSlugKey(
  slugKey: string,
  locale: "en" | "es",
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data: source, error: sourceError } = await supabase
      .from("posts")
      .select("translation_group_id")
      .eq("slug_key", slugKey)
      .eq("locale", locale)
      .eq("status", "published")
      .maybeSingle();

    if (sourceError || !source?.translation_group_id) return null;

    const otherLocale = locale === "en" ? "es" : "en";
    const { data: translation, error: translationError } = await supabase
      .from("posts")
      .select("slug_key")
      .eq("translation_group_id", source.translation_group_id)
      .eq("locale", otherLocale)
      .eq("status", "published")
      .maybeSingle();

    if (translationError || !translation?.slug_key) return null;
    return String(translation.slug_key);
  } catch {
    return null;
  }
}
