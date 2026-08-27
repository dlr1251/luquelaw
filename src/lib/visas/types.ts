import type { ImmigrationLocale } from "@/lib/practice-areas/paths";
import type { VisaCategory, VisaCatalogEntry } from "@/lib/practice-areas/visas-catalog";

export type VisaCmsStatus = "draft" | "published" | "archived";

export type LocaleText = Record<ImmigrationLocale, string>;
export type LocaleStringList = Record<ImmigrationLocale, string[]>;

export type VisaCategoryRecord = {
  id: string;
  slug: string;
  category: VisaCategory;
  article_num: number;
  name: LocaleText;
  summary: LocaleText;
  who_for: LocaleText;
  eligibility: LocaleText | null;
  rights: LocaleStringList | null;
  restrictions: LocaleStringList | null;
  application_checklist: LocaleStringList | null;
  key_requirements: LocaleStringList;
  duration_notes: LocaleText;
  work_permit: boolean | null;
  work_permit_notes: LocaleText | null;
  beneficiary_notes: LocaleText;
  related_guide_slug: string | null;
  enable_norm_comments: boolean;
  status: VisaCmsStatus;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export function slugFromInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asLocaleText(value: unknown): LocaleText | null {
  if (!value || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  const en = typeof o.en === "string" ? o.en : "";
  const es = typeof o.es === "string" ? o.es : "";
  if (!en && !es) return null;
  return { en, es };
}

function asLocaleStringList(value: unknown): LocaleStringList | null {
  if (!value || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  const en = Array.isArray(o.en) ? o.en.filter((x): x is string => typeof x === "string") : [];
  const es = Array.isArray(o.es) ? o.es.filter((x): x is string => typeof x === "string") : [];
  return { en, es };
}

export function parseVisaCategoryRow(row: Record<string, unknown>): VisaCategoryRecord | null {
  const id = String(row.id ?? "");
  const slug = String(row.slug ?? "").trim();
  const category = String(row.category ?? "");
  if (!id || !slug || (category !== "V" && category !== "M" && category !== "R")) {
    return null;
  }

  const name = asLocaleText(row.name);
  const summary = asLocaleText(row.summary);
  const who_for = asLocaleText(row.who_for);
  const key_requirements = asLocaleStringList(row.key_requirements);
  const duration_notes = asLocaleText(row.duration_notes);
  const beneficiary_notes = asLocaleText(row.beneficiary_notes);
  if (!name || !summary || !who_for || !key_requirements || !duration_notes || !beneficiary_notes) {
    return null;
  }

  const status = String(row.status ?? "draft");
  if (status !== "draft" && status !== "published" && status !== "archived") return null;

  return {
    id,
    slug,
    category,
    article_num: Number(row.article_num) || 0,
    name,
    summary,
    who_for,
    eligibility: asLocaleText(row.eligibility),
    rights: asLocaleStringList(row.rights),
    restrictions: asLocaleStringList(row.restrictions),
    application_checklist: asLocaleStringList(row.application_checklist),
    key_requirements,
    duration_notes,
    work_permit:
      typeof row.work_permit === "boolean"
        ? row.work_permit
        : row.work_permit === null
          ? null
          : null,
    work_permit_notes: asLocaleText(row.work_permit_notes),
    beneficiary_notes,
    related_guide_slug:
      typeof row.related_guide_slug === "string" && row.related_guide_slug.trim()
        ? row.related_guide_slug.trim()
        : null,
    enable_norm_comments: Boolean(row.enable_norm_comments),
    status,
    sort_order: Number(row.sort_order) || 0,
    published_at: row.published_at ? String(row.published_at) : null,
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export function recordToCatalogEntry(row: VisaCategoryRecord): VisaCatalogEntry {
  const workPermit: boolean | string =
    row.work_permit !== null
      ? row.work_permit
      : row.work_permit_notes?.en || row.work_permit_notes?.es || false;

  return {
    slug: row.slug,
    category: row.category,
    articleNum: row.article_num,
    name: row.name,
    summary: row.summary,
    whoFor: row.who_for,
    eligibility: row.eligibility ?? undefined,
    rights: row.rights ?? undefined,
    restrictions: row.restrictions ?? undefined,
    applicationChecklist: row.application_checklist ?? undefined,
    keyRequirements: row.key_requirements,
    durationNotes: row.duration_notes,
    workPermit,
    workPermitNotes: row.work_permit_notes ?? undefined,
    beneficiaries: row.beneficiary_notes.en,
    beneficiaryNotes: row.beneficiary_notes,
    relatedGuideSlug: row.related_guide_slug,
    enableNormComments: row.enable_norm_comments,
  };
}

/** Lines → string[]; empty lines dropped. */
export function linesToList(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function listToLines(items: string[] | undefined | null): string {
  return (items ?? []).join("\n");
}
