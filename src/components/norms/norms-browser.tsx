"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { NormCard } from "@/components/norms/norm-card";
import type { NormCatalogItem, NormCategory, NormType } from "@/lib/norms/types";
import { NORM_CATEGORIES, NORM_TYPES, normCategoryLabel, normTypeLabel } from "@/lib/norms/types";

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
          search: "Buscar",
          searchPlaceholder: "Título, referencia o palabra clave…",
          filterCategory: "Rama",
          filterType: "Tipo",
          all: "Todas",
          read: "Abrir norma",
          featured: "Norma destacada",
          more: "Más normas",
          empty: "Sin resultados. Prueba otra búsqueda o filtro.",
        }
      : {
          search: "Search",
          searchPlaceholder: "Title, reference, or keyword…",
          filterCategory: "Area",
          filterType: "Type",
          all: "All",
          read: "Open norm",
          featured: "Featured norm",
          more: "More norms",
          empty: "No matches. Try a different search or filter.",
        };

  const availableCategories = useMemo(() => {
    const set = new Set<NormCategory>();
    norms.forEach((n) => set.add(n.category));
    return NORM_CATEGORIES.filter((c) => set.has(c));
  }, [norms]);

  const availableTypes = useMemo(() => {
    const set = new Set<NormType>();
    norms.forEach((n) => set.add(n.normType));
    return NORM_TYPES.filter((t) => set.has(t));
  }, [norms]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return norms.filter((n) => {
      if (category !== "All" && n.category !== category) return false;
      if (normType !== "All" && n.normType !== normType) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.officialReference.toLowerCase().includes(q) ||
        normCategoryLabel(n.category, locale).toLowerCase().includes(q)
      );
    });
  }, [category, locale, normType, norms, query]);

  const showFeatured = filtered.length > 0 && !query && category === "All" && normType === "All";
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;

  return (
    <div className="space-y-10">
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top,0px))] z-10 -mx-1 border-b border-[color:var(--moss)]/20 bg-[color:var(--background)]/95 px-1 py-4 backdrop-blur-sm">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <label className="block font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
              {copy.search}
            </label>
            <div className="relative mt-2">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
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

          <div className="lg:col-span-3">
            <div className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
              {copy.filterCategory}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <FilterChip active={category === "All"} onClick={() => setCategory("All")} label={copy.all} />
              {availableCategories.map((c) => (
                <FilterChip
                  key={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                  label={normCategoryLabel(c, locale)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
              {copy.filterType}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <FilterChip active={normType === "All"} onClick={() => setNormType("All")} label={copy.all} />
              {availableTypes.map((t) => (
                <FilterChip
                  key={t}
                  active={normType === t}
                  onClick={() => setNormType(t)}
                  label={normTypeLabel(t, locale)}
                />
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
          <NormCard norm={featured} locale={locale} readLabel={copy.read} featured />
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
            {rest.map((norm) => (
              <li key={norm.slug}>
                <NormCard norm={norm} locale={locale} readLabel={copy.read} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {filtered.length === 0 ? (
        <div className="border border-[color:var(--moss)]/30 bg-[color:var(--surface)] p-8 text-center">
          <p className="text-sm text-muted-foreground">{copy.empty}</p>
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-9 border px-3 font-[family-name:var(--font-ui)] text-[0.7rem] font-medium uppercase tracking-[0.06em] transition max-sm:px-2.5 sm:px-3.5 sm:text-[0.75rem]",
        active
          ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--parchment)]"
          : "border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--ink)] hover:border-[color:var(--moss)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
