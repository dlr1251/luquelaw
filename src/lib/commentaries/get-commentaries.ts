import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import {
  type DoctrinalCommentaryAdminRow,
  type DoctrinalCommentaryRecord,
  mapDoctrinalCommentaryRow,
} from "./types";

export async function getPublishedCommentariesForSection(
  sectionId: string,
): Promise<DoctrinalCommentaryRecord[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("norm_doctrinal_commentaries")
      .select("*")
      .eq("section_id", sectionId)
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return [];
    return data.map((row) => mapDoctrinalCommentaryRow(row));
  } catch {
    return [];
  }
}

export async function getAllCommentariesForAdmin(): Promise<DoctrinalCommentaryAdminRow[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("norm_doctrinal_commentaries")
      .select(
        "*, norms(title, slug_key), norm_sections(title, section_key, number_label)",
      )
      .order("updated_at", { ascending: false });

    if (error || !data?.length) return [];

    return data.map((row) => {
      const base = mapDoctrinalCommentaryRow(row as Record<string, unknown>);
      const norms = row.norms as
        | { title?: string; slug_key?: string }
        | { title?: string; slug_key?: string }[]
        | null;
      const sections = row.norm_sections as
        | { title?: string; section_key?: string; number_label?: string | null }
        | { title?: string; section_key?: string; number_label?: string | null }[]
        | null;
      const norm = Array.isArray(norms) ? norms[0] : norms;
      const section = Array.isArray(sections) ? sections[0] : sections;

      return {
        ...base,
        norm_title: norm?.title ?? null,
        norm_slug_key: norm?.slug_key ?? null,
        section_title: section?.title ?? null,
        section_key: section?.section_key ?? null,
        section_number_label: section?.number_label ?? null,
      };
    });
  } catch {
    return [];
  }
}

export async function getCommentaryById(
  id: string,
): Promise<DoctrinalCommentaryRecord | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("norm_doctrinal_commentaries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return mapDoctrinalCommentaryRow(data);
  } catch {
    return null;
  }
}

export type NormOption = {
  id: string;
  locale: "en" | "es";
  title: string;
  slug_key: string;
  status: string;
};

export type SectionOption = {
  id: string;
  section_key: string;
  title: string;
  number_label: string | null;
  depth: number;
  sort_order: number;
};

export async function getNormOptionsForAdmin(
  locale?: "en" | "es",
): Promise<NormOption[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    let query = supabase
      .from("norms")
      .select("id, locale, title, slug_key, status")
      .order("title", { ascending: true });

    if (locale) {
      query = query.eq("locale", locale);
    }

    const { data, error } = await query;
    if (error || !data?.length) return [];

    return data.map((row) => ({
      id: String(row.id),
      locale: row.locale as "en" | "es",
      title: String(row.title),
      slug_key: String(row.slug_key),
      status: String(row.status),
    }));
  } catch {
    return [];
  }
}

export async function getSectionOptionsForNorm(
  normId: string,
): Promise<SectionOption[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("norm_sections")
      .select("id, section_key, title, number_label, depth, sort_order")
      .eq("norm_id", normId)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return [];

    return data.map((row) => ({
      id: String(row.id),
      section_key: String(row.section_key),
      title: String(row.title),
      number_label: row.number_label ? String(row.number_label) : null,
      depth: Number(row.depth) || 0,
      sort_order: Number(row.sort_order) || 0,
    }));
  } catch {
    return [];
  }
}
