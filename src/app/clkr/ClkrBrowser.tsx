"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { ClkrArticle, ClkrCategory } from "@/lib/clkr/articles";

const categories: Array<ClkrCategory | "All"> = [
  "All",
  "Immigration",
  "Real Estate",
  "Corporate",
  "Labor",
  "Civil",
];

export function ClkrBrowser({
  articles,
  locale = "en",
}: {
  articles: ClkrArticle[];
  locale?: "en" | "es";
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const copy =
    locale === "es"
      ? {
          search: "Buscar",
          searchPlaceholder: "Buscar artículos, temas o términos…",
          category: "Categoría",
          read: "Leer",
          empty: "Sin resultados. Prueba con otra búsqueda o categoría.",
        }
      : {
          search: "Search",
          searchPlaceholder: "Search articles, topics, or terms…",
          category: "Category",
          read: "Read",
          empty: "No matches. Try a different search term or category.",
        };
  const categoryLabels: Record<string, string> =
    locale === "es"
      ? {
          All: "Todas",
          Immigration: "Inmigración",
          "Real Estate": "Inmobiliario",
          Corporate: "Corporativo",
          Labor: "Laboral",
          Civil: "Civil",
        }
      : {
          All: "All",
          Immigration: "Immigration",
          "Real Estate": "Real Estate",
          Corporate: "Corporate",
          Labor: "Labor",
          Civil: "Civil",
        };

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

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <label className="block text-sm font-bold text-[color:var(--ink)]">
            {copy.search}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="mt-2 h-11 w-full border border-[color:var(--caramel)]/40 bg-[color:var(--card)] px-4 text-sm text-[color:var(--ink)] outline-none ring-[color:var(--caramel)]/35 focus:ring-2"
            />
          </label>
        </div>

        <div className="lg:col-span-5">
          <div className="text-sm font-bold text-[color:var(--ink)]">{copy.category}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={[
                    "h-9 border px-4 text-sm font-bold transition",
                    active
                      ? "border-[color:var(--caramel)] bg-[color:var(--caramel)] text-[color:var(--ink)]"
                      : "border-[color:var(--caramel)]/40 bg-[color:var(--card)] text-[color:var(--ink)] hover:border-[color:var(--caramel)]",
                  ].join(" ")}
                >
                  {categoryLabels[c]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((a) => (
          <Link
            key={a.slug}
            href={a.slug}
            className="group border border-[color:var(--caramel)]/35 bg-[color:var(--card)] p-6 transition hover:border-[color:var(--caramel)]/60 hover:shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--caramel)]">
              <span className="border border-[color:var(--caramel)]/40 bg-[color:var(--surface)] px-2 py-1 text-[color:var(--muted)]">
                {a.category}
              </span>
              <span className="font-normal normal-case tracking-normal text-[color:var(--muted)]">
                {a.readingTime}
              </span>
            </div>
            <div className="mt-4 font-display text-xl font-normal tracking-tight text-[color:var(--forest)] group-hover:underline">
              {a.title}
            </div>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{a.description}</p>
            <div className="mt-5 text-sm font-bold text-[color:var(--caramel)]">
              {copy.read} →
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[color:var(--caramel)]/35 bg-[color:var(--card)] p-6 text-sm text-[color:var(--muted)]">
          {copy.empty}
        </div>
      ) : null}
    </div>
  );
}
