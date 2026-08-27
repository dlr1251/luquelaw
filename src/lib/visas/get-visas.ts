import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  parseVisaCategoryRow,
  recordToCatalogEntry,
  type VisaCategoryRecord,
} from "@/lib/visas/types";
import { withApplicationChecklist } from "@/lib/practice-areas/visa-checklists";
import {
  getVisaBySlug as getHardcodedVisa,
  VISAS_CATALOG,
  type VisaCatalogEntry,
} from "@/lib/practice-areas/visas-catalog";

const SELECT_COLS =
  "id, slug, category, article_num, name, summary, who_for, eligibility, rights, restrictions, application_checklist, key_requirements, duration_notes, work_permit, work_permit_notes, beneficiary_notes, related_guide_slug, enable_norm_comments, status, sort_order, published_at, created_at, updated_at";

function mapRows(rows: unknown[] | null): VisaCategoryRecord[] {
  if (!rows?.length) return [];
  const out: VisaCategoryRecord[] = [];
  for (const row of rows) {
    const parsed = parseVisaCategoryRow(row as Record<string, unknown>);
    if (parsed) out.push(parsed);
  }
  return out;
}

export async function listPublishedVisaRecords(): Promise<VisaCategoryRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_categories")
    .select(SELECT_COLS)
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return mapRows(data);
}

export async function getPublishedVisaRecordBySlug(
  slug: string,
): Promise<VisaCategoryRecord | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_categories")
    .select(SELECT_COLS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return parseVisaCategoryRow(data as Record<string, unknown>);
}

export async function getVisaRecordById(id: string): Promise<VisaCategoryRecord | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_categories")
    .select(SELECT_COLS)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return parseVisaCategoryRow(data as Record<string, unknown>);
}

export async function listAllVisaRecordsForAdmin(): Promise<VisaCategoryRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_categories")
    .select(SELECT_COLS)
    .order("category", { ascending: true })
    .order("article_num", { ascending: true });
  if (error) return [];
  return mapRows(data);
}

/** Published CMS row wins over hardcoded stub for the same slug. */
export async function resolveVisaBySlug(
  slug: string,
): Promise<VisaCatalogEntry | undefined> {
  const fromDb = await getPublishedVisaRecordBySlug(slug);
  if (fromDb) return withApplicationChecklist(recordToCatalogEntry(fromDb));
  const hard = getHardcodedVisa(slug);
  return hard ? withApplicationChecklist(hard) : undefined;
}

/** Merge CMS published visas over the static catalog (CMS wins on slug clash). */
export async function resolveVisasCatalog(): Promise<VisaCatalogEntry[]> {
  const published = await listPublishedVisaRecords();
  const bySlug = new Map(published.map((r) => [r.slug, recordToCatalogEntry(r)]));

  const merged: VisaCatalogEntry[] = [];
  const seen = new Set<string>();

  for (const hard of VISAS_CATALOG) {
    const override = bySlug.get(hard.slug);
    merged.push(withApplicationChecklist(override ?? hard));
    seen.add(hard.slug);
  }
  for (const [slug, entry] of bySlug) {
    if (!seen.has(slug)) merged.push(withApplicationChecklist(entry));
  }
  return merged;
}
