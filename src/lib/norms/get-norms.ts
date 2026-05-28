import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import { buildSectionTree } from "./tree";
import {
  type NormCatalogItem,
  type NormRecord,
  type NormSectionRecord,
  parseSectionRows,
  recordToCatalogItem,
} from "./types";

function mapNormRow(row: Record<string, unknown>): NormRecord {
  return {
    id: String(row.id),
    slug_key: String(row.slug_key),
    locale: row.locale as "en" | "es",
    title: String(row.title),
    short_title: row.short_title ? String(row.short_title) : null,
    description: String(row.description),
    norm_type: row.norm_type as NormRecord["norm_type"],
    category: row.category as NormRecord["category"],
    official_reference: String(row.official_reference),
    official_source_url: row.official_source_url ? String(row.official_source_url) : null,
    status: row.status as NormRecord["status"],
    sort_order: Number(row.sort_order) || 0,
    translation_group_id: row.translation_group_id ? String(row.translation_group_id) : null,
    published_at: row.published_at ? String(row.published_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapSectionRow(row: Record<string, unknown>): NormSectionRecord {
  return {
    id: String(row.id),
    norm_id: String(row.norm_id),
    parent_id: row.parent_id ? String(row.parent_id) : null,
    section_key: String(row.section_key),
    title: String(row.title),
    number_label: row.number_label ? String(row.number_label) : null,
    html: row.html != null ? String(row.html) : null,
    sort_order: Number(row.sort_order) || 0,
    depth: Number(row.depth) || 0,
    translation_group_id: row.translation_group_id ? String(row.translation_group_id) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function getHubNorms(locale: "en" | "es"): Promise<NormCatalogItem[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("norms")
      .select("*")
      .eq("locale", locale)
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return [];
    return data.map((row) => recordToCatalogItem(mapNormRow(row)));
  } catch {
    return [];
  }
}

export async function getPublishedNorm(
  slugKey: string,
  locale: "en" | "es",
): Promise<NormRecord | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("norms")
      .select("*")
      .eq("slug_key", slugKey)
      .eq("locale", locale)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) return null;
    return mapNormRow(data);
  } catch {
    return null;
  }
}

export async function getNormSections(normId: string): Promise<NormSectionRecord[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("norm_sections")
      .select("*")
      .eq("norm_id", normId)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map((row) => mapSectionRow(row));
  } catch {
    return [];
  }
}

export async function getPublishedNormWithSections(
  slugKey: string,
  locale: "en" | "es",
) {
  const norm = await getPublishedNorm(slugKey, locale);
  if (!norm) return null;

  const sections = await getNormSections(norm.id);
  const tree = buildSectionTree(sections);

  return { norm, sections, tree };
}

export async function getAllNormsForAdmin(): Promise<NormRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("norms")
    .select("*")
    .order("locale")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapNormRow(row));
}

export async function getNormById(id: string): Promise<NormRecord | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("norms").select("*").eq("id", id).maybeSingle();

  if (error || !data) return null;
  return mapNormRow(data);
}

export async function getNormSectionsForAdmin(normId: string): Promise<NormSectionRecord[]> {
  return getNormSections(normId);
}

export async function getAllPublishedNorms(): Promise<NormRecord[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("norms")
      .select("*")
      .eq("status", "published")
      .order("locale")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map((row) => mapNormRow(row));
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
      .from("norms")
      .select("translation_group_id")
      .eq("slug_key", slugKey)
      .eq("locale", locale)
      .eq("status", "published")
      .maybeSingle();

    if (sourceError || !source?.translation_group_id) return null;

    const otherLocale = locale === "en" ? "es" : "en";
    const { data: translation, error: translationError } = await supabase
      .from("norms")
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

export { parseSectionRows };
