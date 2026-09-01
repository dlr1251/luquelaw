import type { SiteSearchItem, SiteSearchItemType } from "./types";
import { SEARCH_TYPE_ORDER } from "./types";

export type RankedSearchHit = SiteSearchItem & { score: number };

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

function words(value: string): string[] {
  return value.split(/[^a-z0-9]+/).filter(Boolean);
}

function scoreItem(item: SiteSearchItem, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const title = normalize(item.title);
  const description = normalize(item.description);
  const category = normalize(item.category ?? "");
  const keywords = normalize((item.keywords ?? []).join(" "));
  const haystack = `${title} ${description} ${category} ${keywords}`;
  const titleWords = words(title);
  const categoryWords = words(category);
  const keywordWords = words(keywords);

  let score = 0;

  // Avoid single-character substring noise ("a" matching half the catalog)
  const allowSubstring = q.length >= 2;

  if (title === q) score += 120;
  else if (allowSubstring && title.startsWith(q)) score += 90;
  else if (allowSubstring && title.includes(q)) score += 60;

  if (allowSubstring && category && category.includes(q)) score += 25;
  if (allowSubstring && description.includes(q)) score += 18;
  if (allowSubstring && keywords.includes(q)) score += 55;

  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
  for (const token of tokens) {
    if (titleWords.some((w) => w === token)) score += 40;
    else if (titleWords.some((w) => w.startsWith(token))) score += 32;
    else if (titleWords.some((w) => w.includes(token))) score += 14;

    if (categoryWords.some((w) => w.startsWith(token))) score += 16;
    if (keywordWords.some((w) => w.startsWith(token) || w === token)) score += 28;
    else if (haystack.includes(token)) score += 8;
  }

  // Type boost only when the query already matched content — otherwise every
  // keystroke returns the first N items by type, which feels broken.
  if (score === 0) return 0;

  const typeBoost: Partial<Record<SiteSearchItemType, number>> = {
    article: 4,
    norm: 4,
    post: 3,
    torny: 2,
    service: 2,
    page: 1,
  };
  score += typeBoost[item.type] ?? 0;

  return score;
}

export function rankSearchResults(
  items: SiteSearchItem[],
  query: string,
  limit = 24,
): RankedSearchHit[] {
  const q = query.trim();
  if (!q) return [];

  return items
    .map((item) => ({ ...item, score: scoreItem(item, q) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export function groupHitsByType(
  hits: RankedSearchHit[],
): { type: SiteSearchItemType; hits: RankedSearchHit[] }[] {
  const map = new Map<SiteSearchItemType, RankedSearchHit[]>();
  for (const hit of hits) {
    const list = map.get(hit.type) ?? [];
    list.push(hit);
    map.set(hit.type, list);
  }
  return SEARCH_TYPE_ORDER.filter((type) => map.has(type)).map((type) => ({
    type,
    hits: map.get(type)!,
  }));
}
