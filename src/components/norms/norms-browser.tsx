"use client";

import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import type { NormCatalogItem, NormCategory, NormType } from "@/lib/norms/types";
import {
  NORM_CATEGORIES,
  NORM_TYPES,
  normCategoryLabel,
  normTypeLabel,
} from "@/lib/norms/types";
import { cn } from "@/lib/utils";

type Props = {
  norms: NormCatalogItem[];
  locale?: "en" | "es";
};

export function NormsBrowser({ norms, locale = "en" }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NormCategory | "All">("All");
  const [normType, setNormType] = useState<NormType | "All">("All");

  const copy =
    locale === "es"
      ? {
          searchPlaceholder: "Buscar norma…",
          allAreas: "Todas las ramas",
          allTypes: "Todos los tipos",
          results: "resultados",
          empty: "Sin coincidencias.",
          clear: "Limpiar",
        }
      : {
          searchPlaceholder: "Search norms…",
          allAreas: "All areas",
          allTypes: "All types",
          results: "results",
          empty: "No matches.",
          clear: "Clear",
        };

  const availableCategories = useMemo(() => {
    const set = new Set(norms.map((n) => n.category));
    return NORM_CATEGORIES.filter((c) => set.has(c));
  }, [norms]);

  const availableTypes = useMemo(() => {
    const set = new Set(norms.map((n) => n.normType));
    return NORM_TYPES.filter((t) => set.has(t));
  }, [norms]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return norms
      .filter((n) => {
        if (category !== "All" && n.category !== category) return false;
        if (normType !== "All" && n.normType !== normType) return false;
        if (!q) return true;
        return (
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.officialReference.toLowerCase().includes(q) ||
          (n.shortTitle?.toLowerCase().includes(q) ?? false) ||
          normCategoryLabel(n.category, locale).toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.title.localeCompare(b.title, locale));
  }, [category, locale, normType, norms, query]);

  const grouped = useMemo(() => {
    const byCategory = new Map<NormCategory, NormCatalogItem[]>();
    for (const norm of filtered) {
      const list = byCategory.get(norm.category) ?? [];
      list.push(norm);
      byCategory.set(norm.category, list);
    }
    return NORM_CATEGORIES.filter((c) => byCategory.has(c)).map((c) => ({
      category: c,
      items: byCategory.get(c)!,
    }));
  }, [filtered]);

  const hasFilters = query.trim() !== "" || category !== "All" || normType !== "All";

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setNormType("All");
  };

  return (
    <div className="space-y-6">
      {/* Minimal toolbar */}
      <div className="sticky top-[calc(4rem+2.75rem)] z-10 -mx-1 border-b border-[color:var(--moss)]/15 bg-[color:var(--background)]/90 px-1 py-3 backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchPlaceholder}
              className="h-10 w-full border-0 border-b border-transparent bg-transparent py-2 pl-7 pr-8 text-sm text-[color:var(--ink)] outline-none placeholder:text-muted-foreground/70 focus:border-[color:var(--moss)]/40"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[color:var(--forest)]"
                aria-label={copy.clear}
              >
                <X className="size-3.5" strokeWidth={1.75} />
              </button>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NormCategory | "All")}
              aria-label={copy.allAreas}
              className="h-9 max-w-[11rem] border-0 bg-transparent font-[family-name:var(--font-ui)] text-[0.75rem] uppercase tracking-[0.06em] text-[color:var(--forest)] outline-none"
            >
              <option value="All">{copy.allAreas}</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {normCategoryLabel(c, locale)}
                </option>
              ))}
            </select>
            <span className="text-muted-foreground/30" aria-hidden>
              /
            </span>
            <select
              value={normType}
              onChange={(e) => setNormType(e.target.value as NormType | "All")}
              aria-label={copy.allTypes}
              className="h-9 max-w-[10rem] border-0 bg-transparent font-[family-name:var(--font-ui)] text-[0.75rem] uppercase tracking-[0.06em] text-[color:var(--forest)] outline-none"
            >
              <option value="All">{copy.allTypes}</option>
              {availableTypes.map((t) => (
                <option key={t} value={t}>
                  {normTypeLabel(t, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] text-muted-foreground">
            {filtered.length} {copy.results}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="font-[family-name:var(--font-ui)] text-[0.6875rem] text-[color:var(--moss)] underline-offset-2 hover:underline"
            >
              {copy.clear}
            </button>
          ) : null}
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <div className="space-y-10">
          {grouped.map(({ category: cat, items }) => (
            <section key={cat}>
              <header className="mb-3 flex items-baseline justify-between gap-3 border-b border-[color:var(--moss)]/20 pb-2">
                <h3 className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--moss)]">
                  {normCategoryLabel(cat, locale)}
                </h3>
                <span className="font-[family-name:var(--font-ui)] text-[0.6875rem] tabular-nums text-muted-foreground">
                  {items.length}
                </span>
              </header>

              <ul className="divide-y divide-[color:var(--moss)]/15">
                {items.map((norm) => (
                  <li key={norm.slug}>
                    <Link
                      href={norm.slug}
                      className="group flex items-start gap-4 py-4 transition hover:bg-[color:var(--surface)]/60 sm:items-center sm:gap-6"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span
                            className={cn(
                              "font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.1em]",
                              "text-[color:var(--moss)]",
                            )}
                          >
                            {normTypeLabel(norm.normType, locale)}
                          </span>
                          <span className="hidden text-muted-foreground/40 sm:inline" aria-hidden>
                            ·
                          </span>
                          <span className="hidden truncate font-[family-name:var(--font-ui)] text-[0.6875rem] text-muted-foreground sm:inline">
                            {norm.officialReference}
                          </span>
                        </div>
                        <p className="mt-1 font-display text-lg leading-snug tracking-tight text-[color:var(--forest)] transition group-hover:text-[color:var(--moss)] sm:text-xl">
                          {norm.shortTitle || norm.title}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {norm.description}
                        </p>
                        <p className="mt-1 font-[family-name:var(--font-ui)] text-[0.6875rem] text-muted-foreground sm:hidden">
                          {norm.officialReference}
                        </p>
                      </div>
                      <ArrowRight
                        className="mt-1 size-4 shrink-0 text-[color:var(--moss)]/50 transition group-hover:translate-x-0.5 group-hover:text-[color:var(--forest)] sm:mt-0"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
