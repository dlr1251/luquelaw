export type NormType = "constitution" | "resolution" | "code" | "law";

export type NormCategory =
  | "constitutional"
  | "immigration"
  | "civil"
  | "criminal"
  | "labor"
  | "commercial"
  | "administrative"
  | "procedural";

export type NormStatus = "draft" | "published" | "archived";

export type NormSectionRecord = {
  id: string;
  norm_id: string;
  parent_id: string | null;
  section_key: string;
  title: string;
  number_label: string | null;
  html: string | null;
  sort_order: number;
  depth: number;
  translation_group_id: string | null;
  created_at: string;
  updated_at: string;
};

export type NormSectionNode = NormSectionRecord & {
  children: NormSectionNode[];
};

export type NormRecord = {
  id: string;
  slug_key: string;
  locale: "en" | "es";
  title: string;
  short_title: string | null;
  description: string;
  norm_type: NormType;
  category: NormCategory;
  official_reference: string;
  official_source_url: string | null;
  status: NormStatus;
  sort_order: number;
  translation_group_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Hub card shape (public) */
export type NormCatalogItem = {
  slug: string;
  title: string;
  shortTitle: string | null;
  description: string;
  normType: NormType;
  category: NormCategory;
  officialReference: string;
};

export const NORM_CATEGORIES: NormCategory[] = [
  "constitutional",
  "immigration",
  "civil",
  "criminal",
  "labor",
  "commercial",
  "administrative",
  "procedural",
];

export const NORM_TYPES: NormType[] = ["constitution", "resolution", "code", "law"];

export function normCategoryLabel(category: NormCategory, locale: "en" | "es"): string {
  const labels: Record<NormCategory, { en: string; es: string }> = {
    constitutional: { en: "Constitutional", es: "Constitucional" },
    immigration: { en: "Immigration", es: "Migratorio" },
    civil: { en: "Civil", es: "Civil" },
    criminal: { en: "Criminal", es: "Penal" },
    labor: { en: "Labor", es: "Laboral" },
    commercial: { en: "Commercial", es: "Mercantil" },
    administrative: { en: "Administrative", es: "Administrativo" },
    procedural: { en: "Procedural", es: "Procesal" },
  };
  return labels[category][locale];
}

export function normTypeLabel(type: NormType, locale: "en" | "es"): string {
  const labels: Record<NormType, { en: string; es: string }> = {
    constitution: { en: "Constitution", es: "Constitución" },
    resolution: { en: "Resolution", es: "Resolución" },
    code: { en: "Code", es: "Código" },
    law: { en: "Law", es: "Ley" },
  };
  return labels[type][locale];
}

export function normsHubPath(locale: "en" | "es"): string {
  return locale === "es" ? "/es/clkr/norms" : "/clkr/norms";
}

export function normPublicPath(
  slugKey: string,
  locale: "en" | "es",
  sectionPath?: string[],
): string {
  const prefix = locale === "es" ? "/es" : "";
  const base = `${prefix}/clkr/norms/${slugKey}`;
  if (!sectionPath?.length) return base;
  return `${base}/${sectionPath.join("/")}`;
}

export function recordToCatalogItem(row: NormRecord): NormCatalogItem {
  return {
    slug: normPublicPath(row.slug_key, row.locale),
    title: row.title,
    shortTitle: row.short_title,
    description: row.description,
    normType: row.norm_type,
    category: row.category,
    officialReference: row.official_reference,
  };
}

export function slugKeyFromInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sectionKeyFromInput(input: string): string {
  return slugKeyFromInput(input);
}

export function parseSectionRows(raw: unknown): NormSectionRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const id = String(o.id ?? "").trim();
      const norm_id = String(o.norm_id ?? "").trim();
      const section_key = String(o.section_key ?? "").trim();
      const title = String(o.title ?? "").trim();
      if (!id || !norm_id || !section_key || !title) return null;
      return {
        id,
        norm_id,
        parent_id: o.parent_id ? String(o.parent_id) : null,
        section_key,
        title,
        number_label: o.number_label ? String(o.number_label) : null,
        html: o.html != null ? String(o.html) : null,
        sort_order: Number(o.sort_order) || 0,
        depth: Number(o.depth) || 0,
        translation_group_id: o.translation_group_id ? String(o.translation_group_id) : null,
        created_at: String(o.created_at ?? ""),
        updated_at: String(o.updated_at ?? ""),
      };
    })
    .filter((s): s is NormSectionRecord => s !== null);
}
