"use client";

import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ClkrArticleCard } from "@/components/clkr/clkr-article-card";
import type { ClkrArticle, ClkrCategory } from "@/lib/clkr/articles";
import { CLKR_CATEGORIES } from "@/lib/clkr/types";

const PAGE_SIZE = 12;

type SortMode = "sort_order" | "title" | "published_at";

type Props = {
  articles: ClkrArticle[];
  locale?: "en" | "es";
};

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-[color:var(--moss)]/25 text-inherit">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function ClkrBrowser({ articles, locale = "en" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [category, setCategory] = useState<ClkrCategory | "All">(
    (searchParams.get("category") as ClkrCategory) || "All",
  );
  const [sort, setSort] = useState<SortMode>(
    (searchParams.get("sort") as SortMode) || "sort_order",
  );
  const [readingTime, setReadingTime] = useState<"all" | "short" | "long">("all");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [page, setPage] = useState(1);
  const [remoteArticles, setRemoteArticles] = useState<ClkrArticle[] | null>(null);
  const [searching, setSearching] = useState(false);

  const copy =
    locale === "es"
      ? {
          search: "Buscar",
          searchPlaceholder: "Tema, palabra clave o término…",
          filter: "Área",
          all: "Todas",
          read: "Leer guía",
          featured: "Recomendado para empezar",
          results: "guías",
          showing: "Mostrando",
          of: "de",
          empty: "Sin resultados. Prueba otra búsqueda o categoría.",
          prev: "Anterior",
          next: "Siguiente",
          page: "Página",
          sort: "Orden",
          sortOrder: "Recomendado",
          sortTitle: "A–Z",
          sortDate: "Más recientes",
          readingTime: "Lectura",
          readingAll: "Cualquiera",
          readingShort: "≤ 10 min",
          readingLong: "> 10 min",
          advanced: "Filtros",
          clear: "Limpiar filtros",
          searching: "Buscando…",
          categories: {
            Immigration: "Inmigración",
            "Real Estate": "Inmobiliario",
            Corporate: "Corporativo",
            Labor: "Laboral",
            Civil: "Civil",
            Family: "Familia",
            Tax: "Tributario",
            Digital: "Digital",
            Administrative: "Administrativo",
            IP: "Propiedad intelectual",
            Criminal: "Penal",
            International: "Internacional",
          } as Record<ClkrCategory, string>,
        }
      : {
          search: "Search",
          searchPlaceholder: "Topic, keyword, or legal term…",
          filter: "Practice area",
          all: "All",
          read: "Read guide",
          featured: "Recommended starting point",
          results: "guides",
          showing: "Showing",
          of: "of",
          empty: "No matches. Try a different search or category.",
          prev: "Previous",
          next: "Next",
          page: "Page",
          sort: "Sort",
          sortOrder: "Recommended",
          sortTitle: "A–Z",
          sortDate: "Newest",
          readingTime: "Reading time",
          readingAll: "Any",
          readingShort: "≤ 10 min",
          readingLong: "> 10 min",
          advanced: "Filters",
          clear: "Clear filters",
          searching: "Searching…",
          categories: {
            Immigration: "Immigration",
            "Real Estate": "Real Estate",
            Corporate: "Corporate",
            Labor: "Labor",
            Civil: "Civil",
            Family: "Family",
            Tax: "Tax",
            Digital: "Digital",
            Administrative: "Administrative",
            IP: "IP",
            Criminal: "Criminal",
            International: "International",
          } as Record<ClkrCategory, string>,
        };

  const syncUrl = useCallback(
    (next: { q?: string; category?: string; sort?: string }) => {
      const params = new URLSearchParams();
      const qVal = next.q ?? debouncedQuery;
      const catVal = next.category ?? (category === "All" ? "" : category);
      const sortVal = next.sort ?? sort;
      if (qVal.trim()) params.set("q", qVal.trim());
      if (catVal) params.set("category", catVal);
      if (sortVal && sortVal !== "sort_order") params.set("sort", sortVal);
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router, debouncedQuery, category, sort],
  );

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    syncUrl({});
  }, [debouncedQuery, category, sort, syncUrl]);

  useEffect(() => {
    if (!debouncedQuery.trim() && category === "All" && sort === "sort_order") {
      setRemoteArticles(null);
      return;
    }

    let cancelled = false;
    setSearching(true);

    const params = new URLSearchParams({ locale, sort });
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (category !== "All") params.set("category", category);

    fetch(`/api/clkr/search?${params}`)
      .then((res) => res.json())
      .then((data: { articles: ClkrArticle[] }) => {
        if (!cancelled) setRemoteArticles(data.articles ?? []);
      })
      .catch(() => {
        if (!cancelled) setRemoteArticles(null);
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, category, sort, locale]);

  const sourceArticles = remoteArticles ?? articles;

  const categoryCounts = useMemo(() => {
    const map = new Map<ClkrCategory, number>();
    for (const a of articles) {
      map.set(a.category, (map.get(a.category) ?? 0) + 1);
    }
    return map;
  }, [articles]);

  const availableCategories = useMemo(() => {
    return CLKR_CATEGORIES.filter((c) => categoryCounts.has(c)).sort((a, b) =>
      copy.categories[a].localeCompare(copy.categories[b], locale),
    );
  }, [categoryCounts, copy.categories, locale]);

  const parseMinutes = (rt: string) => {
    const m = rt.match(/(\d+)/);
    return m ? Number(m[1]) : 0;
  };

  const filtered = useMemo(() => {
    let list = [...sourceArticles];
    if (readingTime === "short") {
      list = list.filter((a) => parseMinutes(a.readingTime) <= 10);
    } else if (readingTime === "long") {
      list = list.filter((a) => parseMinutes(a.readingTime) > 10);
    }
    if (sort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title, locale));
    } else if (sort === "published_at") {
      list.sort((a, b) => {
        const da = a.publishedAt ? Date.parse(a.publishedAt) : 0;
        const db = b.publishedAt ? Date.parse(b.publishedAt) : 0;
        return db - da;
      });
    } else {
      list.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return list;
  }, [sourceArticles, readingTime, sort, locale]);

  const showFeatured = filtered.length > 0 && !debouncedQuery && category === "All";
  const featured = showFeatured ? filtered[0] : null;
  const list = showFeatured ? filtered.slice(1) : filtered;

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = list.slice(start, start + PAGE_SIZE);
  const from = list.length === 0 ? 0 : start + 1;
  const to = Math.min(start + PAGE_SIZE, list.length);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category, sort, readingTime]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function goToPage(next: number) {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setPage(clamped);
    document.getElementById("clkr-guides-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function clearFilters() {
    setQuery("");
    setDebouncedQuery("");
    setCategory("All");
    setSort("sort_order");
    setReadingTime("all");
    setRemoteArticles(null);
    router.replace("?", { scroll: false });
  }

  const hasActiveFilters =
    debouncedQuery.trim() !== "" ||
    category !== "All" ||
    sort !== "sort_order" ||
    readingTime !== "all";

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set<number>([1, totalPages, safePage, safePage - 1, safePage + 1]);
    if (safePage <= 3) {
      pages.add(2);
      pages.add(3);
      pages.add(4);
    }
    if (safePage >= totalPages - 2) {
      pages.add(totalPages - 1);
      pages.add(totalPages - 2);
      pages.add(totalPages - 3);
    }
    return Array.from(pages)
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
  }, [safePage, totalPages]);

  return (
    <div className="space-y-10">
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top,0px))] z-10 -mx-1 border-b border-[color:var(--moss)]/20 bg-[color:var(--background)]/95 px-1 py-4 backdrop-blur-sm">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <label
              htmlFor="clkr-guides-search"
              className="block font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]"
            >
              {copy.search}
            </label>
            <div className="relative mt-2">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <input
                id="clkr-guides-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-11 w-full border border-[color:var(--moss)]/35 bg-[color:var(--card)] py-2 pl-10 pr-4 text-sm text-[color:var(--ink)] outline-none ring-[color:var(--moss)]/35 focus:ring-2"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 lg:col-span-7 lg:justify-end">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="inline-flex h-11 items-center gap-2 border border-[color:var(--moss)]/35 bg-[color:var(--card)] px-4 text-[0.75rem] font-medium uppercase tracking-[0.06em] text-[color:var(--forest)]"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
              {copy.advanced}
            </button>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-11 items-center gap-1.5 px-2 text-[0.75rem] font-medium text-muted-foreground hover:text-[color:var(--forest)]"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
                {copy.clear}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <div className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
            {copy.filter}
          </div>
          <div className="mt-2 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
            <button
              type="button"
              onClick={() => setCategory("All")}
              className={[
                "h-9 shrink-0 border px-3 font-[family-name:var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.06em] transition sm:px-3.5 sm:text-[0.75rem]",
                category === "All"
                  ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
                  : "border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--ink)] hover:border-[color:var(--moss)]",
              ].join(" ")}
            >
              {copy.all}
              <span className="ml-1.5 tabular-nums opacity-70">{articles.length}</span>
            </button>
            {availableCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={[
                  "h-9 shrink-0 border px-3 font-[family-name:var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.06em] transition sm:px-3.5 sm:text-[0.75rem]",
                  category === c
                    ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
                    : "border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--ink)] hover:border-[color:var(--moss)]",
                ].join(" ")}
              >
                {copy.categories[c]}
                <span className="ml-1.5 tabular-nums opacity-70">
                  {categoryCounts.get(c) ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {showAdvanced ? (
          <div className="mt-4 grid gap-4 border-t border-[color:var(--moss)]/15 pt-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="clkr-sort"
                className="block font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]"
              >
                {copy.sort}
              </label>
              <select
                id="clkr-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="mt-2 h-10 w-full border border-[color:var(--moss)]/35 bg-[color:var(--card)] px-3 text-sm"
              >
                <option value="sort_order">{copy.sortOrder}</option>
                <option value="title">{copy.sortTitle}</option>
                <option value="published_at">{copy.sortDate}</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="clkr-reading"
                className="block font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]"
              >
                {copy.readingTime}
              </label>
              <select
                id="clkr-reading"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value as "all" | "short" | "long")}
                className="mt-2 h-10 w-full border border-[color:var(--moss)]/35 bg-[color:var(--card)] px-3 text-sm"
              >
                <option value="all">{copy.readingAll}</option>
                <option value="short">{copy.readingShort}</option>
                <option value="long">{copy.readingLong}</option>
              </select>
            </div>
          </div>
        ) : null}
      </div>

      <div
        id="clkr-guides-results"
        className="flex flex-wrap items-end justify-between gap-3 scroll-mt-36"
      >
        <p className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
          {searching ? (
            copy.searching
          ) : (
            <>
              <span className="font-medium tabular-nums text-[color:var(--forest)]">
                {filtered.length}
              </span>{" "}
              {copy.results}
              {list.length > 0 ? (
                <>
                  {" · "}
                  {copy.showing}{" "}
                  <span className="tabular-nums">
                    {from}–{to}
                  </span>{" "}
                  {copy.of} <span className="tabular-nums">{list.length}</span>
                </>
              ) : null}
            </>
          )}
        </p>
      </div>

      {featured ? (
        <section>
          <p className="mb-4 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[color:var(--moss)]">
            {copy.featured}
          </p>
          <ClkrArticleCard
            article={featured}
            readLabel={copy.read}
            categoryLabel={copy.categories[featured.category]}
            featured
            titleOverride={
              debouncedQuery ? highlightText(featured.title, debouncedQuery) : undefined
            }
          />
        </section>
      ) : null}

      {pageItems.length > 0 ? (
        <section>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((a) => (
              <li key={a.slug}>
                <ClkrArticleCard
                  article={a}
                  readLabel={copy.read}
                  categoryLabel={copy.categories[a.category]}
                  titleOverride={
                    debouncedQuery ? highlightText(a.title, debouncedQuery) : undefined
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {filtered.length === 0 && !searching ? (
        <div className="border border-[color:var(--moss)]/30 bg-[color:var(--surface)] p-8 text-center">
          <p className="text-sm text-muted-foreground">{copy.empty}</p>
        </div>
      ) : null}

      {totalPages > 1 ? (
        <nav
          className="flex flex-col items-stretch justify-between gap-4 border-t border-[color:var(--moss)]/20 pt-6 sm:flex-row sm:items-center"
          aria-label={copy.page}
        >
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage <= 1}
            className="inline-flex h-10 items-center justify-center gap-1.5 border border-[color:var(--moss)]/35 bg-[color:var(--card)] px-4 font-[family-name:var(--font-ui)] text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[color:var(--forest)] transition hover:border-[color:var(--moss)] disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            {copy.prev}
          </button>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {pageNumbers.map((n, idx) => {
              const prev = pageNumbers[idx - 1];
              const showEllipsis = prev != null && n - prev > 1;
              return (
                <span key={n} className="contents">
                  {showEllipsis ? (
                    <span className="px-1 text-muted-foreground" aria-hidden="true">
                      …
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => goToPage(n)}
                    aria-current={n === safePage ? "page" : undefined}
                    className={[
                      "inline-flex h-10 min-w-10 items-center justify-center border px-3 font-[family-name:var(--font-ui)] text-sm tabular-nums transition",
                      n === safePage
                        ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
                        : "border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--ink)] hover:border-[color:var(--moss)]",
                    ].join(" ")}
                  >
                    {n}
                  </button>
                </span>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="inline-flex h-10 items-center justify-center gap-1.5 border border-[color:var(--moss)]/35 bg-[color:var(--card)] px-4 font-[family-name:var(--font-ui)] text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[color:var(--forest)] transition hover:border-[color:var(--moss)] disabled:pointer-events-none disabled:opacity-40"
          >
            {copy.next}
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
