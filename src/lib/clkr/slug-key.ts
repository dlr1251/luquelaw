export function slugKeyFromArticle(article: { slugKey: string; slug: string }, locale: "en" | "es"): string {
  if (article.slugKey) return article.slugKey;
  if (locale === "es") {
    return article.slug.replace(/^\/es\/clkr\/guides\//, "").replace(/^\//, "") || article.slug;
  }
  return article.slug.replace(/^\/clkr\/guides\//, "").replace(/^\//, "") || article.slug;
}
