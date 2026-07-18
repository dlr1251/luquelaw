"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { ImmigrationLocale } from "@/lib/practice-areas/immigration";
import {
  VISAS_CATALOG,
  type VisaCategory,
  visaDetailPath,
} from "@/lib/practice-areas/visas-catalog";
import { cn } from "@/lib/cn";

type Props = {
  locale: ImmigrationLocale;
};

export function VisasCatalogBrowser({ locale }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<VisaCategory | "all">("all");

  const copy =
    locale === "es"
      ? {
          search: "Buscar visa…",
          all: "Todas",
          results: "resultados",
          empty: "Sin coincidencias.",
          article: "Art.",
          disclaimer:
            "Resúmenes informativos basados en la Resolución 5477 de 2022. No sustituyen el texto oficial ni una asesoría de caso.",
        }
      : {
          search: "Search visas…",
          all: "All",
          results: "results",
          empty: "No matches.",
          article: "Art.",
          disclaimer:
            "Informational summaries based on Resolución 5477 de 2022. Not a substitute for the official text or case advice.",
        };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VISAS_CATALOG.filter((v) => {
      if (category !== "all" && v.category !== category) return false;
      if (!q) return true;
      return (
        v.name[locale].toLowerCase().includes(q) ||
        v.summary[locale].toLowerCase().includes(q) ||
        v.slug.includes(q) ||
        String(v.articleNum).includes(q)
      );
    });
  }, [category, locale, query]);

  const filters: Array<VisaCategory | "all"> = ["all", "V", "M", "R"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.search}
            className="w-full border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setCategory(f)}
              className={cn(
                "px-3 py-2 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] transition",
                category === f
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "all" ? copy.all : f}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} {copy.results}
      </p>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <ul className="divide-y divide-border border-t border-border">
          {filtered.map((visa) => (
            <li key={visa.slug}>
              <Link
                href={visaDetailPath(visa.slug, locale)}
                className="block py-4 transition hover:bg-surface/40 sm:px-2"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {visa.category} · {copy.article} {visa.articleNum}
                  </span>
                  <h2 className="font-[family-name:var(--font-ui)] text-[0.9375rem] font-semibold text-foreground">
                    {visa.name[locale]}
                  </h2>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {visa.summary[locale]}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">{copy.disclaimer}</p>
    </div>
  );
}
