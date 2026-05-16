"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ClkrArticleCard } from "@/components/clkr/clkr-article-card";
import type { ClkrArticle, ClkrCategory } from "@/lib/clkr/articles";

type Props = {
  articles: ClkrArticle[];
  locale?: "en" | "es";
};

export function ClkrBrowser({ articles, locale = "en" }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ClkrCategory | "All">("All");

  const copy =
    locale === "es"
      ? {
          search: "Buscar",
          searchPlaceholder: "Tema, palabra clave o término…",
          filter: "Filtrar",
          all: "Todas",
          read: "Leer guía",
          featured: "Recomendado para empezar",
          more: "Más guías",
          empty: "Sin resultados. Prueba otra búsqueda o categoría.",
          categories: {
            Immigration: "Inmigración",
            "Real Estate": "Inmobiliario",
            Corporate: "Corporativo",
            Labor: "Laboral",
            Civil: "Civil",
          } as Record<ClkrCategory, string>,
        }
      : {
          search: "Search",
          searchPlaceholder: "Topic, keyword, or legal term…",
          filter: "Filter",
          all: "All",
          read: "Read guide",
          featured: "Recommended starting point",
          more: "More guides",
          empty: "No matches. Try a different search or category.",
          categories: {
            Immigration: "Immigration",
            "Real Estate": "Real Estate",
            Corporate: "Corporate",
            Labor: "Labor",
            Civil: "Civil",
          } as Record<ClkrCategory, string>,
        };

  const availableCategories = useMemo(() => {
    const set = new Set<ClkrCategory>();
    articles.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (category !== "All" && a.category !== category) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
  }, [articles, category, query]);

  const showFeatured = filtered.length > 0 && !query && category === "All";
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;

  return (
    <div className="space-y-10">
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top,0px))] z-10 -mx-1 border-b border-[color:var(--moss)]/20 bg-[color:var(--background)]/95 px-1 py-4 backdrop-blur-sm">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <label className="block font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
              {copy.search}
            </label>
            <div className="relative mt-2">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-11 w-full border border-[color:var(--moss)]/35 bg-[color:var(--card)] py-2 pl-10 pr-4 text-sm text-[color:var(--ink)] outline-none ring-[color:var(--moss)]/35 focus:ring-2"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
              {copy.filter}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory("All")}
                className={[
                  "h-9 border px-3 font-[family-name:var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.06em] transition max-sm:px-2.5 sm:px-3.5 sm:text-[0.75rem]",
                  category === "All"
                    ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
                    : "border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--ink)] hover:border-[color:var(--moss)]",
                ].join(" ")}
              >
                {copy.all}
              </button>
              {availableCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={[
                    "h-9 border px-3 font-[family-name:var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.06em] transition max-sm:px-2.5 sm:px-3.5 sm:text-[0.75rem]",
                    category === c
                      ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
                      : "border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--ink)] hover:border-[color:var(--moss)]",
                  ].join(" ")}
                >
                  {copy.categories[c]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {featured ? (
        <section>
          <p className="mb-4 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[color:var(--moss)]">
            {copy.featured}
          </p>
          <ClkrArticleCard article={featured} readLabel={copy.read} featured />
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section>
          {featured ? (
            <p className="mb-4 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[color:var(--moss)]">
              {copy.more}
            </p>
          ) : null}
          <ul className="grid gap-5 md:grid-cols-2">
            {rest.map((a) => (
              <li key={a.slug}>
                <ClkrArticleCard article={a} readLabel={copy.read} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {filtered.length === 0 ? (
        <div className="border border-[color:var(--moss)]/30 bg-[color:var(--surface)] p-8 text-center">
          <p className="text-sm text-[color:var(--muted)]">{copy.empty}</p>
        </div>
      ) : null}
    </div>
  );
}
