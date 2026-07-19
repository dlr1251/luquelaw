export type SearchLocale = "en" | "es";

export type SiteSearchItemType =
  | "page"
  | "norm"
  | "article"
  | "post"
  | "torny"
  | "service";

export type SiteSearchItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: SiteSearchItemType;
  locale: SearchLocale | "all";
  category?: string;
};

export const SEARCH_TYPE_LABELS: Record<
  SiteSearchItemType,
  { en: string; es: string }
> = {
  page: { en: "Pages", es: "Páginas" },
  norm: { en: "Norms", es: "Normas" },
  article: { en: "Articles", es: "Artículos" },
  post: { en: "Blog", es: "Blog" },
  torny: { en: "Torny", es: "Torny" },
  service: { en: "Services", es: "Servicios" },
};

export const SEARCH_TYPE_ORDER: SiteSearchItemType[] = [
  "article",
  "norm",
  "post",
  "service",
  "page",
  "torny",
];

export function filterIndexForLocale(
  items: SiteSearchItem[],
  locale: SearchLocale,
): SiteSearchItem[] {
  return items.filter((item) => item.locale === locale || item.locale === "all");
}