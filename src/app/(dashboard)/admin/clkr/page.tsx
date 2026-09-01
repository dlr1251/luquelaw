import Link from "next/link";

import { AdminContentFilters } from "@/components/admin/admin-content-filters";
import {
  AdminClkrArticleList,
  type AdminClkrPairView,
} from "@/components/admin/clkr-article-list";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllArticlesForAdmin } from "@/lib/clkr/get-articles";
import type { ClkrArticleRecord, ClkrCategory } from "@/lib/clkr/types";
import { CLKR_CATEGORIES } from "@/lib/clkr/types";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type Search = {
  error?: string;
  saved?: string;
  deleted?: string;
  q?: string;
  status?: string;
};

type ArticlePair = {
  key: string;
  category: ClkrCategory;
  sortOrder: number;
  en: ClkrArticleRecord | null;
  es: ClkrArticleRecord | null;
};

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function excerpt(article: ClkrArticleRecord, max = 160) {
  const raw =
    article.description.trim() || stripHtml(article.sections?.[0]?.html ?? "");
  if (!raw) return "";
  if (raw.length <= max) return raw;
  return `${raw.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

function pairArticles(items: ClkrArticleRecord[]): ArticlePair[] {
  const bySlug = new Map<string, ArticlePair>();

  for (const row of items) {
    const existing = bySlug.get(row.slug_key);
    if (!existing) {
      bySlug.set(row.slug_key, {
        key: row.slug_key,
        category: row.category,
        sortOrder: row.sort_order,
        en: row.locale === "en" ? row : null,
        es: row.locale === "es" ? row : null,
      });
      continue;
    }
    if (row.locale === "en") existing.en = row;
    else existing.es = row;
    existing.sortOrder = Math.min(existing.sortOrder, row.sort_order);
    if (row.locale === "en") existing.category = row.category;
  }

  // Pair leftovers that share a translation group but not a slug.
  const singles = [...bySlug.values()].filter((p) => !p.en || !p.es);
  const byGroup = new Map<string, ArticlePair[]>();
  for (const pair of singles) {
    const group = pair.en?.translation_group_id ?? pair.es?.translation_group_id;
    if (!group) continue;
    const list = byGroup.get(group) ?? [];
    list.push(pair);
    byGroup.set(group, list);
  }
  for (const groupPairs of byGroup.values()) {
    const enPair = groupPairs.find((p) => p.en && !p.es);
    const esPair = groupPairs.find((p) => p.es && !p.en);
    if (!enPair || !esPair || enPair === esPair) continue;
    enPair.es = esPair.es;
    enPair.sortOrder = Math.min(enPair.sortOrder, esPair.sortOrder);
    bySlug.delete(esPair.key);
  }

  return [...bySlug.values()].sort((a, b) => {
    const cat = a.category.localeCompare(b.category);
    if (cat) return cat;
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.key.localeCompare(b.key);
  });
}

function pairMatches(pair: ArticlePair, q: string, status: string) {
  const rows = [pair.en, pair.es].filter((row): row is ClkrArticleRecord => Boolean(row));
  if (status && status !== "all" && !rows.some((row) => row.status === status)) {
    return false;
  }
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const hay = [
    pair.key,
    pair.category,
    ...rows.flatMap((row) => [row.title, row.description, row.slug_key, row.category]),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(query);
}

function addLocaleHref(pair: ArticlePair, locale: "en" | "es") {
  const sibling = locale === "en" ? pair.es : pair.en;
  const params = new URLSearchParams({ locale });
  params.set("slug_key", pair.key);
  const category = sibling?.category ?? pair.category;
  if (CLKR_CATEGORIES.includes(category)) params.set("category", category);
  params.set("sort_order", String(sibling?.sort_order ?? pair.sortOrder));
  return `/admin/clkr/new?${params.toString()}`;
}

function toLocaleView(article: ClkrArticleRecord | null) {
  if (!article) return null;
  return {
    id: article.id,
    title: article.title,
    excerpt: excerpt(article),
    status: article.status,
    slug_key: article.slug_key,
  };
}

function toPairView(pair: ArticlePair): AdminClkrPairView {
  return {
    key: pair.key,
    category: pair.category,
    addEnHref: addLocaleHref(pair, "en"),
    addEsHref: addLocaleHref(pair, "es"),
    en: toLocaleView(pair.en),
    es: toLocaleView(pair.es),
  };
}

export default async function AdminClkrPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const articles = isSupabaseConfigured() ? await getAllArticlesForAdmin() : [];
  const q = sp.q ?? "";
  const status = sp.status ?? "all";
  const pairs = pairArticles(articles).filter((pair) => pairMatches(pair, q, status));
  const incomplete = pairs.filter((pair) => !pair.en || !pair.es).length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">CLKR articles</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Cada fila es un artículo con sus versiones en inglés y español. Lo publicado aparece en{" "}
            <Link href="/clkr" className="font-medium text-foreground underline-offset-4 hover:underline">
              /clkr
            </Link>{" "}
            y{" "}
            <Link href="/es/clkr" className="font-medium text-foreground underline-offset-4 hover:underline">
              /es/clkr
            </Link>
            .
          </p>
        </div>
        <ButtonLink href="/admin/clkr/new?locale=en" size="sm">
          + New article
        </ButtonLink>
      </div>

      {!isSupabaseConfigured() ? (
        <Alert>
          <AlertDescription>
            Supabase is not configured. Add keys to <code className="font-mono">.env.local</code> and
            run migrations in <code className="font-mono">supabase/migrations/</code>.
          </AlertDescription>
        </Alert>
      ) : null}

      {sp.error ? (
        <Alert variant="destructive">
          <AlertDescription>{sp.error}</AlertDescription>
        </Alert>
      ) : null}
      {sp.deleted ? (
        <Alert>
          <AlertDescription>Article deleted.</AlertDescription>
        </Alert>
      ) : null}

      <AdminContentFilters
        basePath="/admin/clkr"
        q={q}
        status={status}
        placeholder="Search title or excerpt…"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Articles</CardTitle>
          <CardDescription>
            {pairs.length} article{pairs.length === 1 ? "" : "s"}
            {incomplete > 0 ? ` · ${incomplete} missing a language` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pairs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No articles match.{" "}
              <Link
                href="/admin/clkr/new?locale=en"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          ) : (
            <AdminClkrArticleList pairs={pairs.map(toPairView)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
