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

export function clkrGuidesHubPath(locale: "en" | "es"): string {
  return locale === "es" ? "/es/clkr/guides" : "/clkr/guides";
}

export function clkrPublicPath(slugKey: string, locale: "en" | "es"): string {
  return locale === "es" ? `/es/clkr/guides/${slugKey}` : `/clkr/guides/${slugKey}`;
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

// Study path types
export type StudyPathDifficulty = "beginner" | "intermediate" | "advanced";

export type StudyPathRecord = {
  id: string;
  slug_key: string;
  locale: "en" | "es";
  title: string;
  description: string;
  category: ClkrCategory;
  difficulty: StudyPathDifficulty;
  estimated_time: string | null;
  icon: string | null;
  sort_order: number;
  status: ClkrArticleStatus;
  created_at: string;
  updated_at: string;
};

export type StudyPathStep = {
  id: string;
  study_path_id: string;
  article_id: string;
  step_order: number;
  description: string | null;
  article?: ClkrArticleRecord;
};

export type StudyPath = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ClkrCategory;
  difficulty: StudyPathDifficulty;
  estimatedTime: string | null;
  icon: string | null;
  articleCount: number;
};

export type StudyPathWithSteps = StudyPath & {
  steps: Array<{
    stepOrder: number;
    description: string | null;
    article: ClkrArticle & { id: string };
  }>;
};

// Article relation types
export type ArticleRelationType = "prerequisite" | "next_step" | "related";

export type ArticleRelation = {
  id: string;
  from_article_id: string;
  to_article_id: string;
  relation_type: ArticleRelationType;
  to_article?: ClkrArticleRecord;
};

// User progress types
export type UserProgressStatus = "started" | "completed" | "bookmarked";

export type UserProgress = {
  id: string;
  user_id: string;
  article_id: string;
  status: UserProgressStatus;
  last_position: string | null;
  created_at: string;
  updated_at: string;
};

export function studyPathPublicPath(slugKey: string, locale: "en" | "es"): string {
  return locale === "es" ? `/es/clkr/study/${slugKey}` : `/clkr/study/${slugKey}`;
}

export function recordToStudyPath(
  row: StudyPathRecord,
  articleCount: number = 0
): StudyPath {
  return {
    id: row.id,
    slug: studyPathPublicPath(row.slug_key, row.locale),
    title: row.title,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty,
    estimatedTime: row.estimated_time,
    icon: row.icon,
    articleCount,
  };
}
