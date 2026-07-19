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

function scoreItem(item: SiteSearchItem, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const title = normalize(item.title);
  const description = normalize(item.description);
  const category = normalize(item.category ?? "");
  const haystack = `${title} ${description} ${category}`;

  let score = 0;

  if (title === q) score += 120;
  else if (title.startsWith(q)) score += 90;
  else if (title.includes(q)) score += 60;

  if (category && category.includes(q)) score += 25;
  if (description.includes(q)) score += 18;

  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const matched = tokens.filter((t) => haystack.includes(t)).length;
    score += matched * 8;
  }

  // Prefer primary content types slightly
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
