import { createClient } from "@/lib/supabase/server";

import { clkrArticles, clkrArticlesEs, type ClkrArticle } from "./articles";
import { slugKeyFromArticle } from "./slug-key";

type SettingsRow = {
  slug_key: string;
  locale: string;
  sort_order: number;
  is_hidden: boolean;
  title_override: string | null;
  description_override: string | null;
};

export async function getHubArticles(locale: "en" | "es"): Promise<ClkrArticle[]> {
  const base = locale === "es" ? [...clkrArticlesEs] : [...clkrArticles];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clkr_article_settings")
      .select("slug_key, locale, sort_order, is_hidden, title_override, description_override")
      .eq("locale", locale);

    if (error || !data?.length) {
      return base;
    }

    const map = new Map<string, SettingsRow>(
      (data as SettingsRow[]).map((r) => [r.slug_key, r]),
    );

    type Row = ClkrArticle & { sort_order: number };

    const merged: Row[] = [];

    base.forEach((article, index) => {
      const key = slugKeyFromArticle(article, locale);
      const o = map.get(key);
      if (o?.is_hidden) return;
      merged.push({
        ...article,
        title: o?.title_override?.trim() ? o.title_override.trim() : article.title,
        description: o?.description_override?.trim()
          ? o.description_override.trim()
          : article.description,
        sort_order: typeof o?.sort_order === "number" ? o.sort_order : index * 10,
      });
    });

    merged.sort((a, b) => a.sort_order - b.sort_order);

    return merged.map(({ sort_order: _s, ...rest }) => rest);
  } catch {
    return base;
  }
}
