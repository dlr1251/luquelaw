import type { ClkrArticle } from "./articles";

export function slugKeyFromArticle(article: ClkrArticle, locale: "en" | "es"): string {
  if (locale === "es") {
    return article.slug.replace(/^\/es\/clkr\//, "").replace(/^\//, "") || article.slug;
  }
  return article.slug.replace(/^\/clkr\//, "").replace(/^\//, "") || article.slug;
}
