export type PostCategory = "Immigration" | "Real Estate" | "Business";

export type PostSection = {
  id: string;
  title: string;
  html: string;
};

export type PostStatus = "draft" | "published" | "archived";

export type PostRecord = {
  id: string;
  slug_key: string;
  locale: "en" | "es";
  title: string;
  description: string;
  category: PostCategory;
  reading_time: string;
  sections: PostSection[];
  status: PostStatus;
  sort_order: number;
  translation_group_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Hub card + link shape (public) */
export type Post = {
  slug: string;
  title: string;
  category: PostCategory;
  readingTime: string;
  description: string;
  publishedAt?: string | null;
};

export const POST_CATEGORIES: PostCategory[] = ["Immigration", "Real Estate", "Business"];

export function postPublicPath(slugKey: string, locale: "en" | "es"): string {
  return locale === "es" ? `/es/posts/${slugKey}` : `/posts/${slugKey}`;
}

export function recordToHubPost(row: PostRecord): Post {
  return {
    slug: postPublicPath(row.slug_key, row.locale),
    title: row.title,
    category: row.category,
    readingTime: row.reading_time,
    description: row.description,
    publishedAt: row.published_at,
  };
}

export function parseSections(raw: unknown): PostSection[] {
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
    .filter((s): s is PostSection => s !== null);
}

export function slugKeyFromInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
