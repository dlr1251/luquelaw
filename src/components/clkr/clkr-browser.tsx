"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ClkrArticleCard } from "@/components/clkr/clkr-article-card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import type { ClkrArticle, ClkrCategory } from "@/lib/clkr/articles";
import { CLKR_CATEGORIES } from "@/lib/clkr/types";

const PAGE_SIZE = 12;
const SORT_CYCLE = ["sort_order", "title", "published_at"] as const;

type SortMode = (typeof SORT_CYCLE)[number];
type ReadingMode = "all" | "short" | "long";

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

function parseCategories(raw: string | null): ClkrCategory[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((c): c is ClkrCategory => CLKR_CATEGORIES.includes(c as ClkrCategory));
}

function parseSort(raw: string | null): SortMode {
  return raw === "title" || raw === "published_at" ? raw : "sort_order";
}

function parseReading(raw: string | null): ReadingMode {
  return raw === "short" || raw === "long" ? raw : "all";
}

const control =
  "h-9 border border-[color:var(--moss)]/35 bg-[color:var(--card)] font-[family-name:var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.06em] text-[color:var(--ink)]";

export function ClkrBrowser({ articles, locale = "en" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [categories, setCategories] = useState<ClkrCategory[]>(() =>
    parseCategories(searchParams.get("category")),
  );
  const [sort, setSort] = useState<SortMode>(() => parseSort(searchParams.get("sort")));
  const [readingTime, setReadingTime] = useState<ReadingMode>(() =>
    parseReading(searchParams.get("rt")),
  );
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
          areasCount: (n: number) => `${n} áreas`,
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
          sortPrev: "Orden anterior",
          sortNext: "Orden siguiente",
          sortOrder: "Recomendado",
          sortTitle: "A–Z",
          sortDate: "Recientes",
          readingTime: "Lectura",
          readingAll: "Cualquiera",
          readingShort: "≤ 10 min",
          readingLong: "> 10 min",
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
          filter: "Area",
          all: "All",
          areasCount: (n: number) => `${n} areas`,
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
          sortPrev: "Previous sort",
          sortNext: "Next sort",
          sortOrder: "Recommended",
          sortTitle: "A–Z",
          sortDate: "Newest",
          readingTime: "Reading time",
          readingAll: "Any",
          readingShort: "≤ 10 min",
          readingLong: "> 10 min",
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

  const sortLabels: Record<SortMode, string> = {
    sort_order: copy.sortOrder,
    title: copy.sortTitle,
    published_at: copy.sortDate,
  };

  const readingOptions: { value: ReadingMode; label: string }[] = [
    { value: "all", label: copy.readingAll },
    { value: "short", label: copy.readingShort },
    { value: "long", label: copy.readingLong },
  ];

  const syncUrl = useCallback(
    (next: { q?: string; categories?: ClkrCategory[]; sort?: string; rt?: ReadingMode }) => {
      const params = new URLSearchParams();
      const qVal = next.q ?? debouncedQuery;
      const cats = next.categories ?? categories;
      const sortVal = next.sort ?? sort;
      const rtVal = next.rt ?? readingTime;
      if (qVal.trim()) params.set("q", qVal.trim());
      if (cats.length) params.set("category", cats.join(","));
      if (sortVal && sortVal !== "sort_order") params.set("sort", sortVal);
      if (rtVal !== "all") params.set("rt", rtVal);
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router, debouncedQuery, categories, sort, readingTime],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    syncUrl({});
  }, [debouncedQuery, categories, sort, readingTime, syncUrl]);

  const needsRemoteSearch =
    Boolean(debouncedQuery.trim()) || categories.length > 0 || sort !== "sort_order";

  useEffect(() => {
    if (!needsRemoteSearch) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setSearching(true);
    });

    const params = new URLSearchParams({ locale, sort });
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (categories.length) params.set("category", categories.join(","));

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
  }, [needsRemoteSearch, debouncedQuery, categories, sort, locale]);

  const sourceArticles = needsRemoteSearch ? (remoteArticles ?? articles) : articles;

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
    if (categories.length > 0 && remoteArticles == null) {
      const set = new Set(categories);
      list = list.filter((a) => set.has(a.category));
    }
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
  }, [sourceArticles, remoteArticles, categories, readingTime, sort, locale]);

  const showFeatured = filtered.length > 0 && !debouncedQuery && categories.length === 0;
  const featured = showFeatured ? filtered[0] : null;
  const list = showFeatured ? filtered.slice(1) : filtered;

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = list.slice(start, start + PAGE_SIZE);
  const from = list.length === 0 ? 0 : start + 1;
  const to = Math.min(start + PAGE_SIZE, list.length);

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
    setCategories([]);
    setSort("sort_order");
    setReadingTime("all");
    setRemoteArticles(null);
    setPage(1);
    router.replace("?", { scroll: false });
  }

  function toggleCategory(c: ClkrCategory) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
    setPage(1);
  }

  function cycleSort(dir: 1 | -1) {
    const i = SORT_CYCLE.indexOf(sort);
    setSort(SORT_CYCLE[(i + dir + SORT_CYCLE.length) % SORT_CYCLE.length]);
    setPage(1);
  }

  const hasActiveFilters =
    debouncedQuery.trim() !== "" ||
    categories.length > 0 ||
    sort !== "sort_order" ||
    readingTime !== "all";

  const areaTriggerLabel =
    categories.length === 0
      ? copy.filter
      : categories.length === 1
        ? copy.categories[categories[0]]
        : copy.areasCount(categories.length);

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
      <div className="sticky top-[calc(6.75rem+env(safe-area-inset-top,0px))] z-10 -mx-1 border-b border-[color:var(--moss)]/20 bg-[color:var(--background)]/95 px-1 py-2 backdrop-blur-sm">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="clkr-guides-search" className="sr-only">
              {copy.search}
            </label>
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <input
              id="clkr-guides-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="h-9 w-full border border-[color:var(--moss)]/35 bg-[color:var(--card)] py-1.5 pl-8 pr-3 text-sm text-[color:var(--ink)] outline-none ring-[color:var(--moss)]/35 focus:ring-2"
            />
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  control,
                  "inline-flex max-w-[11rem] items-center gap-1.5 px-2.5 text-left",
                  categories.length > 0 &&
                    "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]",
                )}
                aria-label={copy.filter}
              >
                <span className="truncate">{areaTriggerLabel}</span>
                <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.75} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 max-w-[calc(100vw-2rem)]">
                <DropdownMenuCheckboxItem
                  checked={categories.length === 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCategories([]);
                      setPage(1);
                    }
                  }}
                >
                  {copy.all}
                  <span className="ml-auto tabular-nums text-muted-foreground">
                    {articles.length}
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {availableCategories.map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c}
                    checked={categories.includes(c)}
                    onCheckedChange={() => toggleCategory(c)}
                  >
                    {copy.categories[c]}
                    <span className="ml-auto tabular-nums text-muted-foreground">
                      {categoryCounts.get(c) ?? 0}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div
              role="group"
              aria-label={`${copy.sort}: ${sortLabels[sort]}`}
              className={cn(
                control,
                "inline-flex min-w-[9.25rem] items-stretch overflow-hidden p-0",
                sort !== "sort_order" &&
                  "border-[color:var(--forest)] text-[color:var(--forest)]",
              )}
            >
              <button
                type="button"
                onClick={() => cycleSort(-1)}
                aria-label={copy.sortPrev}
                className="px-1.5 hover:bg-[color:var(--surface)]"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              </button>
              <span className="flex min-w-0 flex-1 items-center justify-center px-1">
                {sortLabels[sort]}
              </span>
              <button
                type="button"
                onClick={() => cycleSort(1)}
                aria-label={copy.sortNext}
                className="px-1.5 hover:bg-[color:var(--surface)]"
              >
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              </button>
            </div>

            <fieldset
              className={cn(control, "m-0 inline-flex items-center gap-0.5 px-1.5 sm:gap-1 sm:px-2")}
            >
              <legend className="sr-only">{copy.readingTime}</legend>
              {readingOptions.map((opt) => {
                const selected = readingTime === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1 px-1.5 py-1",
                      selected
                        ? "text-[color:var(--forest)]"
                        : "text-muted-foreground hover:text-[color:var(--ink)]",
                    )}
                  >
                    <input
                      type="radio"
                      name="clkr-reading"
                      value={opt.value}
                      checked={selected}
                      onChange={() => {
                        setReadingTime(opt.value);
                        setPage(1);
                      }}
                      className="size-3 shrink-0 accent-[color:var(--forest)]"
                    />
                    <span className="whitespace-nowrap">{opt.label}</span>
                  </label>
                );
              })}
            </fieldset>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-9 items-center gap-1 px-1.5 text-[0.7rem] font-medium text-muted-foreground hover:text-[color:var(--forest)]"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="sr-only sm:not-sr-only">{copy.clear}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div
        id="clkr-guides-results"
        className="flex flex-wrap items-end justify-between gap-3 scroll-mt-44"
      >
        <p className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
          {searching && needsRemoteSearch ? (
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

      {filtered.length === 0 && !(searching && needsRemoteSearch) ? (
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
                    className={cn(
                      "inline-flex h-10 min-w-10 items-center justify-center border px-3 font-[family-name:var(--font-ui)] text-sm tabular-nums transition",
                      n === safePage
                        ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
                        : "border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--ink)] hover:border-[color:var(--moss)]",
                    )}
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
