"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, List, Search } from "lucide-react";

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
  category,
  onNavigate,
}: {
  locale: Locale;
  currentSlugKey: string;
  articles: ClkrArticleNavItem[];
  query: string;
  category: ClkrCategory | "all";
  onNavigate?: () => void;
}) {
  const currentRef = useRef<HTMLAnchorElement>(null);
  const labels = CATEGORY_LABELS[locale];
  const empty = locale === "es" ? "Sin coincidencias." : "No matches.";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (!q) return true;
      return a.title.toLowerCase().includes(q) || a.slugKey.includes(q);
    });
  }, [articles, category, query]);

  useEffect(() => {
    if (!currentRef.current) return;
    currentRef.current.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [currentSlugKey, category, query]);

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
  category,
  setCategory,
}: {
  locale: Locale;
  query: string;
  setQuery: (v: string) => void;
  category: ClkrCategory | "all";
  setCategory: (v: ClkrCategory | "all") => void;
}) {
  const labels = CATEGORY_LABELS[locale];
  const copy =
    locale === "es"
      ? { search: "Buscar…", all: "Todas" }
      : { search: "Search…", all: "All" };

  return (
    <div className="space-y-3">
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
          className="w-full border border-[color:var(--moss)]/35 bg-[color:var(--card)] py-2 pl-8 pr-2 text-sm text-[color:var(--ink)] placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={cn(
            "border px-2 py-1 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.1em] transition",
            category === "all"
              ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
              : "border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--forest)] hover:border-[color:var(--moss)]",
          )}
        >
          {copy.all}
        </button>
        {CLKR_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "border px-2 py-1 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.1em] transition",
              category === c
                ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
                : "border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--forest)] hover:border-[color:var(--moss)]",
            )}
          >
            {labels[c]}
          </button>
        ))}
      </div>
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
  const [category, setCategory] = useState<ClkrCategory | "all">(
    currentCategory ?? "all",
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
        category={category}
        setCategory={setCategory}
      />
      <div className="max-h-[min(40vh,22rem)] overflow-y-auto">
        <ArticleList
          locale={locale}
          currentSlugKey={currentSlugKey}
          articles={articles}
          query={query}
          category={category}
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
  const [category, setCategory] = useState<ClkrCategory | "all">(
    currentCategory ?? "all",
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
    if (next) setCategory(currentCategory ?? "all");
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
              category={category}
              setCategory={setCategory}
            />
          </div>
          <div className="px-2 pb-8">
            <ArticleList
              locale={locale}
              currentSlugKey={currentSlugKey}
              articles={articles}
              query={query}
              category={category}
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
