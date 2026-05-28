export type ClkrCategory =
  | "Immigration"
  | "Real Estate"
  | "Corporate"
  | "Labor"
  | "Civil";

export type ClkrSection = {
  id: string;
  title: string;
  html: string;
};

export type ClkrArticleStatus = "draft" | "published" | "archived";

export type ClkrArticleRecord = {
  id: string;
  slug_key: string;
  locale: "en" | "es";
  title: string;
  description: string;
  category: ClkrCategory;
  reading_time: string;
  sections: ClkrSection[];
  status: ClkrArticleStatus;
  sort_order: number;
  translation_group_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Hub card + link shape (public) */
export type ClkrArticle = {
  slug: string;
  title: string;
  category: ClkrCategory;
  readingTime: string;
  description: string;
};

export const CLKR_CATEGORIES: ClkrCategory[] = [
  "Immigration",
  "Real Estate",
  "Corporate",
  "Labor",
  "Civil",
];

export function clkrPublicPath(slugKey: string, locale: "en" | "es"): string {
  return locale === "es" ? `/es/clkr/${slugKey}` : `/clkr/${slugKey}`;
}

export function recordToHubArticle(row: ClkrArticleRecord): ClkrArticle {
  return {
    slug: clkrPublicPath(row.slug_key, row.locale),
    title: row.title,
    category: row.category,
    readingTime: row.reading_time,
    description: row.description,
  };
}

export function parseSections(raw: unknown): ClkrSection[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const id = String(o.id ?? "").trim();
      const title = String(o.title ?? "").trim();
      const html = String(o.html ?? "").trim();
      if (!id || !title) return null;
      return { id, title, html };
    })
    .filter((s): s is ClkrSection => s !== null);
}

export function slugKeyFromInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
