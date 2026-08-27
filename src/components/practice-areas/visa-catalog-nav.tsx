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
import type { ImmigrationLocale } from "@/lib/practice-areas/paths";
import {
  type VisaCategory,
  type VisaNavItem,
  visaDetailPath,
} from "@/lib/practice-areas/visas-catalog";

type Props = {
  locale: ImmigrationLocale;
  currentSlug: string;
  visas: VisaNavItem[];
};

function adjacent(visas: VisaNavItem[], slug: string) {
  const i = visas.findIndex((v) => v.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: visas[i - 1] ?? null,
    next: visas[i + 1] ?? null,
  };
}

function SidebarAdjacent({
  locale,
  currentSlug,
  visas,
}: {
  locale: ImmigrationLocale;
  currentSlug: string;
  visas: VisaNavItem[];
}) {
  const { prev, next } = adjacent(visas, currentSlug);
  const copy =
    locale === "es"
      ? { previous: "Anterior", next: "Siguiente" }
      : { previous: "Previous", next: "Next" };

  return (
    <div className="grid gap-2 border-t border-border pt-3">
      {prev ? (
        <Link
          href={visaDetailPath(prev.slug, locale)}
          className="min-w-0 text-left"
        >
          <span className="block font-[family-name:var(--font-ui)] text-[0.5625rem] uppercase tracking-[0.1em] text-muted-foreground">
            {copy.previous}
          </span>
          <span className="mt-0.5 block truncate text-xs font-medium text-foreground">
            {prev.name[locale]}
          </span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={visaDetailPath(next.slug, locale)}
          className="min-w-0 text-left"
        >
          <span className="block font-[family-name:var(--font-ui)] text-[0.5625rem] uppercase tracking-[0.1em] text-muted-foreground">
            {copy.next}
          </span>
          <span className="mt-0.5 block truncate text-xs font-medium text-foreground">
            {next.name[locale]}
          </span>
        </Link>
      ) : null}
    </div>
  );
}

function CatalogList({
  locale,
  currentSlug,
  visas,
  query,
  category,
  onNavigate,
}: {
  locale: ImmigrationLocale;
  currentSlug: string;
  visas: VisaNavItem[];
  query: string;
  category: VisaCategory | "all";
  onNavigate?: () => void;
}) {
  const currentRef = useRef<HTMLAnchorElement>(null);
  const copy =
    locale === "es"
      ? { article: "Art.", empty: "Sin coincidencias." }
      : { article: "Art.", empty: "No matches." };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visas.filter((v) => {
      if (category !== "all" && v.category !== category) return false;
      if (!q) return true;
      return (
        v.name[locale].toLowerCase().includes(q) ||
        v.slug.includes(q) ||
        String(v.articleNum).includes(q)
      );
    });
  }, [category, locale, query, visas]);

  useEffect(() => {
    if (!currentRef.current) return;
    currentRef.current.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [currentSlug, category, query]);

  if (filtered.length === 0) {
    return <p className="px-1 py-3 text-sm text-muted-foreground">{copy.empty}</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {filtered.map((visa) => {
        const active = visa.slug === currentSlug;
        return (
          <li key={visa.slug}>
            <Link
              ref={active ? currentRef : undefined}
              href={visaDetailPath(visa.slug, locale)}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block border-l-2 px-3 py-3 transition",
                active
                  ? "border-l-foreground bg-surface text-foreground"
                  : "border-l-transparent hover:bg-surface/80",
              )}
            >
              <span
                className={cn(
                  "font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em]",
                  active ? "text-foreground/70" : "text-foreground/60",
                )}
              >
                {visa.category} · {copy.article} {visa.articleNum}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-sm leading-snug text-foreground",
                  active && "font-semibold",
                )}
              >
                {visa.name[locale]}
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
  locale: ImmigrationLocale;
  query: string;
  setQuery: (v: string) => void;
  category: VisaCategory | "all";
  setCategory: (v: VisaCategory | "all") => void;
}) {
  const copy =
    locale === "es"
      ? { search: "Buscar visa o artículo…", all: "Todas" }
      : { search: "Search visa or article…", all: "All" };
  const filters: Array<VisaCategory | "all"> = ["all", "V", "M", "R"];

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
          className="w-full border border-border bg-card py-2.5 pl-8 pr-2 text-sm text-foreground placeholder:text-foreground/45"
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setCategory(f)}
            className={cn(
              "border px-2.5 py-1.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] transition",
              category === f
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-foreground hover:border-foreground/40",
            )}
          >
            {f === "all" ? copy.all : f}
          </button>
        ))}
      </div>
    </div>
  );
}

export function VisaCatalogNav({ locale, currentSlug, visas }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<VisaCategory | "all">("all");
  const [open, setOpen] = useState(false);
  const { prev, next } = adjacent(visas, currentSlug);

  const copy =
    locale === "es"
      ? {
          catalog: "Catálogo",
          catalogTitle: "Catálogo de visas",
          previous: "Anterior",
          next: "Siguiente",
        }
      : {
          catalog: "Catalog",
          catalogTitle: "Visa catalog",
          previous: "Previous",
          next: "Next",
        };

  const list = (
    <CatalogList
      locale={locale}
      currentSlug={currentSlug}
      visas={visas}
      query={query}
      category={category}
      onNavigate={() => setOpen(false)}
    />
  );

  const filters = (
    <Filters
      locale={locale}
      query={query}
      setQuery={setQuery}
      category={category}
      setCategory={setCategory}
    />
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-hero-border bg-hero text-hero-foreground pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_32px_rgba(0,0,0,0.28)] lg:hidden">
        {prev ? (
          <Link
            href={visaDetailPath(prev.slug, locale)}
            aria-label={`${copy.previous}: ${prev.name[locale]}`}
            className="flex min-w-0 flex-1 items-center gap-1.5 px-3 py-3 text-left"
          >
            <ChevronLeft className="size-5 shrink-0 text-hero-accent" aria-hidden />
            <span className="min-w-0 truncate text-sm font-medium text-hero-foreground">
              {prev.name[locale]}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="inline-flex shrink-0 flex-col items-center justify-center gap-0.5 self-stretch bg-hero-accent px-3.5 py-2 font-[family-name:var(--font-ui)] text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-hero"
            aria-label={copy.catalogTitle}
          >
            <List className="size-4" aria-hidden />
            {copy.catalog}
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[min(88dvh,40rem)] gap-0 overflow-y-auto overscroll-contain touch-pan-y border-t-2 border-hero bg-background p-0 text-foreground data-[side=bottom]:h-auto data-[side=bottom]:max-h-[min(88dvh,40rem)]"
            showCloseButton
          >
            <SheetHeader className="border-b border-border bg-background">
              <SheetTitle className="text-foreground">{copy.catalogTitle}</SheetTitle>
            </SheetHeader>
            <div className="border-b border-border bg-background px-4 py-3">{filters}</div>
            <div className="px-2 pb-8">{list}</div>
          </SheetContent>
        </Sheet>

        {next ? (
          <Link
            href={visaDetailPath(next.slug, locale)}
            aria-label={`${copy.next}: ${next.name[locale]}`}
            className="flex min-w-0 flex-1 items-center justify-end gap-1.5 px-3 py-3 text-right"
          >
            <span className="min-w-0 truncate text-sm font-medium text-hero-foreground">
              {next.name[locale]}
            </span>
            <ChevronRight className="size-5 shrink-0 text-hero-accent" aria-hidden />
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </div>
  );
}

export function VisaCatalogSidebar({ locale, currentSlug, visas }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<VisaCategory | "all">("all");
  const title = locale === "es" ? "Catálogo de visas" : "Visa catalog";

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-16 space-y-4 border border-border bg-card p-4">
        <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground">
          {title}
        </p>
        <Filters
          locale={locale}
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
        />
        <div className="max-h-[min(70vh,36rem)] overflow-y-auto">
          <CatalogList
            locale={locale}
            currentSlug={currentSlug}
            visas={visas}
            query={query}
            category={category}
          />
        </div>
        <SidebarAdjacent locale={locale} currentSlug={currentSlug} visas={visas} />
      </div>
    </aside>
  );
}
