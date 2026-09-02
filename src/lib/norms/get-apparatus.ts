import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

import {
  type ApparatusBox,
  type ApparatusKind,
  type LegalAuthorityRecord,
  type NormCitationRecord,
  type TranslationNoteRecord,
  resolveCitationHref,
  rewriteDianHrefs,
} from "./citations";

function mapAuthority(row: Record<string, unknown>): LegalAuthorityRecord {
  return {
    id: String(row.id),
    slug_key: String(row.slug_key),
    kind: row.kind as LegalAuthorityRecord["kind"],
    title: String(row.title),
    title_en: row.title_en ? String(row.title_en) : null,
    citation_label: String(row.citation_label),
    official_source_url: row.official_source_url ? String(row.official_source_url) : null,
    dian_file: row.dian_file ? String(row.dian_file) : null,
    ingest_status: row.ingest_status as LegalAuthorityRecord["ingest_status"],
    listed_in_hub: Boolean(row.listed_in_hub),
    target_norm_slug_key: row.target_norm_slug_key ? String(row.target_norm_slug_key) : null,
    html_es: row.html_es != null ? String(row.html_es) : null,
    html_en: row.html_en != null ? String(row.html_en) : null,
    citation_count: Number(row.citation_count) || 0,
    year: row.year != null ? Number(row.year) : null,
    number_label: row.number_label ? String(row.number_label) : null,
  };
}

export async function getAuthorityBySlug(
  slugKey: string,
): Promise<LegalAuthorityRecord | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("legal_authorities")
      .select("*")
      .eq("slug_key", slugKey)
      .maybeSingle();
    if (error || !data) return null;
    return mapAuthority(data);
  } catch {
    return null;
  }
}

export async function getAuthoritiesByIds(
  ids: string[],
): Promise<Map<string, LegalAuthorityRecord>> {
  const map = new Map<string, LegalAuthorityRecord>();
  if (!ids.length || !isSupabaseConfigured()) return map;
  try {
    const supabase = await createClient();
    for (let i = 0; i < ids.length; i += 80) {
      const slice = ids.slice(i, i + 80);
      const { data, error } = await supabase.from("legal_authorities").select("*").in("id", slice);
      if (error || !data) continue;
      for (const row of data) {
        const rec = mapAuthority(row);
        map.set(rec.id, rec);
      }
    }
  } catch {
    return map;
  }
  return map;
}

export async function getCitationsFromAuthority(
  authorityId: string,
  limit = 40,
): Promise<Array<{ section_id: string; label: string; dian_file: string }>> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("norm_citations")
      .select("section_id, label, dian_file")
      .eq("target_authority_id", authorityId)
      .limit(limit);
    if (error || !data) return [];
    return data.map((row) => ({
      section_id: String(row.section_id),
      label: String(row.label),
      dian_file: String(row.dian_file),
    }));
  } catch {
    return [];
  }
}

function mapCitation(
  row: Record<string, unknown>,
  locale: "en" | "es",
  authorities: Map<string, LegalAuthorityRecord>,
): NormCitationRecord {
  const authorityId = row.target_authority_id ? String(row.target_authority_id) : null;
  const authority = authorityId ? authorities.get(authorityId) ?? null : null;
  const resolved = resolveCitationHref({
    locale,
    dianFile: String(row.dian_file),
    dianAnchor: row.dian_anchor ? String(row.dian_anchor) : null,
    authority,
  });
  return {
    id: String(row.id),
    apparatus_id: String(row.apparatus_id),
    section_id: String(row.section_id),
    dian_file: String(row.dian_file),
    dian_anchor: row.dian_anchor ? String(row.dian_anchor) : null,
    label: String(row.label),
    target_authority_id: authorityId,
    sort_order: Number(row.sort_order) || 0,
    href: resolved.href,
    isStub: resolved.isStub,
  };
}

export async function getApparatusForSections(
  sectionIds: string[],
  locale: "en" | "es",
): Promise<Record<string, ApparatusBox[]>> {
  const empty: Record<string, ApparatusBox[]> = {};
  if (!sectionIds.length || !isSupabaseConfigured()) return empty;

  try {
    const supabase = await createClient();
    const boxes: Record<string, unknown>[] = [];
    for (let i = 0; i < sectionIds.length; i += 80) {
      const slice = sectionIds.slice(i, i + 80);
      const { data, error } = await supabase
        .from("norm_section_apparatus")
        .select("*")
        .in("section_id", slice)
        .order("sort_order", { ascending: true });
      if (error) return empty;
      if (data?.length) boxes.push(...data);
    }
    if (!boxes.length) return empty;

    const boxIds = boxes.map((row) => String(row.id));
    const cites: Record<string, unknown>[] = [];
    for (let i = 0; i < boxIds.length; i += 80) {
      const slice = boxIds.slice(i, i + 80);
      const { data, error } = await supabase
        .from("norm_citations")
        .select("*")
        .in("apparatus_id", slice)
        .order("sort_order", { ascending: true });
      if (error) return empty;
      if (data?.length) cites.push(...data);
    }

    const authorityIds = [
      ...new Set(
        (cites || [])
          .map((row) => (row.target_authority_id ? String(row.target_authority_id) : ""))
          .filter(Boolean),
      ),
    ];
    const authorities = await getAuthoritiesByIds(authorityIds);
    const byFile = new Map<string, LegalAuthorityRecord>();
    for (const rec of authorities.values()) {
      if (rec.dian_file) byFile.set(rec.dian_file, rec);
    }

    const citationsByBox = new Map<string, NormCitationRecord[]>();
    for (const row of cites || []) {
      const mapped = mapCitation(row, locale, authorities);
      const list = citationsByBox.get(mapped.apparatus_id) ?? [];
      list.push(mapped);
      citationsByBox.set(mapped.apparatus_id, list);
    }

    const resolveFile = (file: string, anchor: string | null) =>
      resolveCitationHref({
        locale,
        dianFile: file,
        dianAnchor: anchor,
        authority: byFile.get(file) ?? null,
      }).href;

    const grouped: Record<string, ApparatusBox[]> = {};
    for (const row of boxes) {
      const sectionId = String(row.section_id);
      const box: ApparatusBox = {
        id: String(row.id),
        section_id: sectionId,
        kind: row.kind as ApparatusKind,
        anchor_key: row.anchor_key ? String(row.anchor_key) : null,
        sort_order: Number(row.sort_order) || 0,
        html: row.html ? rewriteDianHrefs(String(row.html), locale, resolveFile) : null,
        citations: citationsByBox.get(String(row.id)) ?? [],
      };
      const list = grouped[sectionId] ?? [];
      list.push(box);
      grouped[sectionId] = list;
    }
    return grouped;
  } catch {
    return empty;
  }
}

export async function getPublishedTranslationNotes(
  sectionIds: string[],
): Promise<Record<string, TranslationNoteRecord[]>> {
  const empty: Record<string, TranslationNoteRecord[]> = {};
  if (!sectionIds.length || !isSupabaseConfigured()) return empty;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("norm_translation_notes")
      .select("*")
      .in("section_id", sectionIds)
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return empty;
    const grouped: Record<string, TranslationNoteRecord[]> = {};
    for (const row of data) {
      const rec: TranslationNoteRecord = {
        id: String(row.id),
        section_id: String(row.section_id),
        span_es: String(row.span_es),
        rendering_us: String(row.rendering_us),
        variant_uk: row.variant_uk ? String(row.variant_uk) : null,
        risk: row.risk as TranslationNoteRecord["risk"],
        note_html: String(row.note_html),
        sort_order: Number(row.sort_order) || 0,
        status: row.status as TranslationNoteRecord["status"],
      };
      const list = grouped[rec.section_id] ?? [];
      list.push(rec);
      grouped[rec.section_id] = list;
    }
    return grouped;
  } catch {
    return empty;
  }
}

export async function getTranslationNotesForAdmin(): Promise<
  Array<TranslationNoteRecord & { section_title: string | null; number_label: string | null }>
> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("norm_translation_notes")
    .select("*, norm_sections(title, number_label)")
    .order("risk")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  return data.map((row) => {
    const sections = row.norm_sections as
      | { title?: string; number_label?: string | null }
      | { title?: string; number_label?: string | null }[]
      | null;
    const section = Array.isArray(sections) ? sections[0] : sections;
    return {
      id: String(row.id),
      section_id: String(row.section_id),
      span_es: String(row.span_es),
      rendering_us: String(row.rendering_us),
      variant_uk: row.variant_uk ? String(row.variant_uk) : null,
      risk: row.risk as TranslationNoteRecord["risk"],
      note_html: String(row.note_html),
      sort_order: Number(row.sort_order) || 0,
      status: row.status as TranslationNoteRecord["status"],
      section_title: section?.title ?? null,
      number_label: section?.number_label ?? null,
    };
  });
}

export async function getApparatusSummaryForSections(
  sectionIds: string[],
): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  if (!sectionIds.length || !isSupabaseConfigured()) return counts;
  try {
    const supabase = await createClient();
    for (let i = 0; i < sectionIds.length; i += 80) {
      const slice = sectionIds.slice(i, i + 80);
      const { data, error } = await supabase
        .from("norm_section_apparatus")
        .select("section_id")
        .in("section_id", slice);
      if (error || !data) continue;
      for (const row of data) {
        const id = String(row.section_id);
        counts[id] = (counts[id] ?? 0) + 1;
      }
    }
  } catch {
    return counts;
  }
  return counts;
}
