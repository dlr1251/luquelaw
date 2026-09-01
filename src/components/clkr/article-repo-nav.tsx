"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, List, Search } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import {
  CLKR_CATEGORIES,
  type ClkrArticleNavItem,
  type ClkrCategory,
} from "@/lib/clkr/types";

type Locale = "en" | "es";

type Props = {
  locale: Locale;
  currentSlugKey: string;
  articles: ClkrArticleNavItem[];
  currentCategory?: ClkrCategory;
};

const CATEGORY_LABELS: Record<Locale, Record<ClkrCategory, string>> = {
  es: {
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
  },
  en: {
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
  },
};

function adjacent(articles: ClkrArticleNavItem[], slugKey: string) {
  const i = articles.findIndex((a) => a.slugKey === slugKey);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: articles[i - 1] ?? null,
    next: articles[i + 1] ?? null,
  };
}

function truncateTitle(title: string, max = 28): string {
  return title.length > max ? `${title.slice(0, max)}…` : title;
}

function ArticleList({
  locale,
  currentSlugKey,
  articles,
  query,
  categories,
  onNavigate,
}: {
  locale: Locale;
  currentSlugKey: string;
  articles: ClkrArticleNavItem[];
  query: string;
  categories: ClkrCategory[];
  onNavigate?: () => void;
}) {
  const currentRef = useRef<HTMLAnchorElement>(null);
  const labels = CATEGORY_LABELS[locale];
  const empty = locale === "es" ? "Sin coincidencias." : "No matches.";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const set = categories.length > 0 ? new Set(categories) : null;
    return articles.filter((a) => {
      if (set && !set.has(a.category)) return false;
      if (!q) return true;
      return a.title.toLowerCase().includes(q) || a.slugKey.includes(q);
    });
  }, [articles, categories, query]);

  useEffect(() => {
    if (!currentRef.current) return;
    currentRef.current.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [currentSlugKey, categories, query]);

  if (filtered.length === 0) {
    return <p className="px-1 py-3 text-sm text-muted-foreground">{empty}</p>;
  }

  return (
    <ul className="divide-y divide-[color:var(--moss)]/20">
      {filtered.map((article) => {
        const active = article.slugKey === currentSlugKey;
        return (
          <li key={article.slugKey}>
            <Link
              ref={active ? currentRef : undefined}
              href={article.slug}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block border-l-2 px-3 py-2.5 transition",
                active
                  ? "border-l-[color:var(--forest)] bg-[color:var(--surface)] text-[color:var(--forest)]"
                  : "border-l-transparent text-[color:var(--ink)] hover:bg-[color:var(--surface)]/80",
              )}
            >
              <span
                className={cn(
                  "font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.12em]",
                  active ? "text-[color:var(--moss)]" : "text-muted-foreground",
                )}
              >
                {labels[article.category]}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-sm leading-snug",
                  active && "font-semibold",
                )}
              >
                {article.title}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Filters({
  locale,
  query,
  setQuery,
  categories,
  setCategories,
  articles,
}: {
  locale: Locale;
  query: string;
  setQuery: (v: string) => void;
  categories: ClkrCategory[];
  setCategories: (v: ClkrCategory[] | ((prev: ClkrCategory[]) => ClkrCategory[])) => void;
  articles: ClkrArticleNavItem[];
}) {
  const labels = CATEGORY_LABELS[locale];
  const copy =
    locale === "es"
      ? {
          search: "Buscar…",
          all: "Todas",
          filter: "Área",
          areasCount: (n: number) => `${n} áreas`,
        }
      : {
          search: "Search…",
          all: "All",
          filter: "Area",
          areasCount: (n: number) => `${n} areas`,
        };

  const categoryCounts = useMemo(() => {
    const map = new Map<ClkrCategory, number>();
    for (const a of articles) {
      map.set(a.category, (map.get(a.category) ?? 0) + 1);
    }
    return map;
  }, [articles]);

  const availableCategories = useMemo(() => {
    return CLKR_CATEGORIES.filter((c) => categoryCounts.has(c)).sort((a, b) =>
      labels[a].localeCompare(labels[b], locale),
    );
  }, [categoryCounts, labels, locale]);

  const selected = categories[0];
  const triggerLabel =
    categories.length === 0 || !selected
      ? copy.filter
      : categories.length === 1
        ? labels[selected]
        : copy.areasCount(categories.length);

  function toggleCategory(c: ClkrCategory) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={copy.search}
          className="h-9 w-full border border-[color:var(--moss)]/35 bg-[color:var(--card)] py-1.5 pl-8 pr-2 text-sm text-[color:var(--ink)] placeholder:text-muted-foreground"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "inline-flex h-9 w-full items-center gap-1.5 border border-[color:var(--moss)]/35 bg-[color:var(--card)] px-2.5 text-left font-[family-name:var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.06em] text-[color:var(--ink)]",
            categories.length > 0 &&
              "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]",
          )}
          aria-label={copy.filter}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.75} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 max-w-[calc(100vw-2rem)]">
          <DropdownMenuCheckboxItem
            checked={categories.length === 0}
            onCheckedChange={(checked) => {
              if (checked) setCategories([]);
            }}
          >
            {copy.all}
            <span className="ml-auto tabular-nums text-muted-foreground">{articles.length}</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {availableCategories.map((c) => (
            <DropdownMenuCheckboxItem
              key={c}
              checked={categories.includes(c)}
              onCheckedChange={() => toggleCategory(c)}
            >
              {labels[c]}
              <span className="ml-auto tabular-nums text-muted-foreground">
                {categoryCounts.get(c) ?? 0}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SidebarAdjacent({
  locale,
  currentSlugKey,
  articles,
}: {
  locale: Locale;
  currentSlugKey: string;
  articles: ClkrArticleNavItem[];
}) {
  const { prev, next } = adjacent(articles, currentSlugKey);
  const copy =
    locale === "es"
      ? { previous: "Anterior", next: "Siguiente" }
      : { previous: "Previous", next: "Next" };

  if (!prev && !next) return null;

  return (
    <div className="grid gap-2 border-t border-[color:var(--moss)]/25 pt-3">
      {prev ? (
        <Link href={prev.slug} className="min-w-0 text-left">
          <span className="block font-[family-name:var(--font-ui)] text-[0.5625rem] uppercase tracking-[0.1em] text-muted-foreground">
            {copy.previous}
          </span>
          <span className="mt-0.5 block truncate text-xs font-medium text-[color:var(--forest)]">
            {prev.title}
          </span>
        </Link>
      ) : null}
      {next ? (
        <Link href={next.slug} className="min-w-0 text-left">
          <span className="block font-[family-name:var(--font-ui)] text-[0.5625rem] uppercase tracking-[0.1em] text-muted-foreground">
            {copy.next}
          </span>
          <span className="mt-0.5 block truncate text-xs font-medium text-[color:var(--forest)]">
            {next.title}
          </span>
        </Link>
      ) : null}
    </div>
  );
}

export function ArticleRepoSidebar({
  locale,
  currentSlugKey,
  articles,
  currentCategory,
}: Props) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<ClkrCategory[]>(
    currentCategory ? [currentCategory] : [],
  );
  const title = locale === "es" ? "Artículos" : "Articles";

  return (
    <div className="mt-8 space-y-3 border-t border-[color:var(--moss)]/25 pt-6">
      <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--moss)]">
        {title}
      </p>
      <Filters
        locale={locale}
        query={query}
        setQuery={setQuery}
        categories={categories}
        setCategories={setCategories}
        articles={articles}
      />
      <div className="max-h-[min(40vh,22rem)] overflow-y-auto">
        <ArticleList
          locale={locale}
          currentSlugKey={currentSlugKey}
          articles={articles}
          query={query}
          categories={categories}
        />
      </div>
      <SidebarAdjacent
        locale={locale}
        currentSlugKey={currentSlugKey}
        articles={articles}
      />
    </div>
  );
}

export function ArticleRepoMobileNav({
  locale,
  currentSlugKey,
  articles,
  currentCategory,
}: Props) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<ClkrCategory[]>(
    currentCategory ? [currentCategory] : [],
  );
  const [open, setOpen] = useState(false);
  const { prev, next } = adjacent(articles, currentSlugKey);

  const copy =
    locale === "es"
      ? {
          catalog: "Artículos",
          catalogTitle: "Artículos CLKR",
          previous: "Anterior",
          next: "Siguiente",
        }
      : {
          catalog: "Articles",
          catalogTitle: "CLKR articles",
          previous: "Previous",
          next: "Next",
        };

  function handleSheetOpenChange(next: boolean) {
    setOpen(next);
    if (next) setCategories(currentCategory ? [currentCategory] : []);
  }

  return (
    <nav
      aria-label={locale === "es" ? "Navegación de artículos" : "Article navigation"}
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-[color:var(--moss)]/25 bg-[color:var(--card)]/95 text-[color:var(--forest)] shadow-[0_-12px_32px_rgba(0,0,0,0.12)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {prev ? (
        <Link
          href={prev.slug}
          aria-label={`${copy.previous}: ${prev.title}`}
          className="flex min-w-0 flex-1 items-center gap-1.5 px-3 py-3 text-left transition active:bg-[color:var(--surface)]"
        >
          <ChevronLeft className="size-5 shrink-0 text-[color:var(--moss)]" aria-hidden />
          <span className="min-w-0">
            <span className="block font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[color:var(--moss)]">
              {copy.previous}
            </span>
            <span className="block truncate text-xs font-medium leading-tight">
              {truncateTitle(prev.title)}
            </span>
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}

      <Sheet open={open} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger
          className="inline-flex shrink-0 flex-col items-center justify-center gap-0.5 self-stretch bg-[color:var(--forest)] px-3.5 py-2 font-[family-name:var(--font-ui)] text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--parchment)]"
          aria-label={copy.catalogTitle}
        >
          <List className="size-4" aria-hidden />
          {copy.catalog}
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[min(88dvh,40rem)] gap-0 overflow-y-auto overscroll-contain touch-pan-y border-t-2 border-[color:var(--forest)] bg-[color:var(--background)] p-0 text-[color:var(--ink)] data-[side=bottom]:h-auto data-[side=bottom]:max-h-[min(88dvh,40rem)]"
          showCloseButton
        >
          <SheetHeader className="border-b border-[color:var(--moss)]/25 bg-[color:var(--background)]">
            <SheetTitle className="text-[color:var(--forest)]">{copy.catalogTitle}</SheetTitle>
          </SheetHeader>
          <div className="border-b border-[color:var(--moss)]/25 bg-[color:var(--background)] px-4 py-3">
            <Filters
              locale={locale}
              query={query}
              setQuery={setQuery}
              categories={categories}
              setCategories={setCategories}
              articles={articles}
            />
          </div>
          <div className="px-2 pb-8">
            <ArticleList
              locale={locale}
              currentSlugKey={currentSlugKey}
              articles={articles}
              query={query}
              categories={categories}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {next ? (
        <Link
          href={next.slug}
          aria-label={`${copy.next}: ${next.title}`}
          className="flex min-w-0 flex-1 items-center justify-end gap-1.5 px-3 py-3 text-right transition active:bg-[color:var(--surface)]"
        >
          <span className="min-w-0">
            <span className="block font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[color:var(--moss)]">
              {copy.next}
            </span>
            <span className="block truncate text-xs font-medium leading-tight">
              {truncateTitle(next.title)}
            </span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-[color:var(--moss)]" aria-hidden />
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}
