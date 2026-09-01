"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowRight,
  FileText,
  BookOpen,
  Scale,
  Briefcase,
  Sparkles,
  Layout,
} from "lucide-react";

import { useSiteSearch } from "@/components/search/site-search-provider";
import { loginHref } from "@/lib/auth/safe-next";
import { localeFromPathname } from "@/lib/locale/paths";
import { groupHitsByType, rankSearchResults } from "@/lib/search/rank";
import {
  SEARCH_TYPE_LABELS,
  filterIndexForLocale,
  type SiteSearchItem,
  type SiteSearchItemType,
} from "@/lib/search/types";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<SiteSearchItemType, typeof FileText> = {
  article: BookOpen,
  norm: Scale,
  post: FileText,
  service: Briefcase,
  page: Layout,
  torny: Sparkles,
};

const SUGGESTION_HREF_SUFFIXES = [
  "/clkr",
  "/clkr/norms",
  "/clkr/library",
  "/posts",
  "/services",
  "/pricing",
  "/about",
  "/portal/lucy",
] as const;

type Props = {
  signedIn?: boolean;
};

type IndexStatus = "idle" | "loading" | "ready" | "error";

function pickSuggestions(items: SiteSearchItem[]): SiteSearchItem[] {
  const byHref = new Map(items.map((item) => [item.href.replace(/\/$/, "") || "/", item]));
  const out: SiteSearchItem[] = [];
  for (const suffix of SUGGESTION_HREF_SUFFIXES) {
    const match =
      byHref.get(suffix) ||
      [...byHref.entries()].find(([href]) => href.endsWith(suffix))?.[1];
    if (match && !out.some((item) => item.id === match.id)) out.push(match);
  }
  return out.slice(0, 8);
}

export function SiteSearchPalette({ signedIn = false }: Props) {
  const { open, closeSearch } = useSiteSearch();
  const pathname = usePathname();
  const router = useRouter();
  const locale = localeFromPathname(pathname);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const loadedRef = useRef(false);
  const fetchGen = useRef(0);

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SiteSearchItem[]>([]);
  const [indexStatus, setIndexStatus] = useState<IndexStatus>("idle");
  const [activeIndex, setActiveIndex] = useState(0);

  const copy =
    locale === "es"
      ? {
          placeholder: "Buscar normas, artículos, blog, servicios…",
          empty: "Empieza por un atajo, o escribe para buscar",
          noResults: "Sin resultados para eso — prueba otra búsqueda",
          loading: "Cargando índice…",
          error: "No pudimos cargar el índice de búsqueda",
          retry: "Reintentar",
          hint: "↑↓ navegar · ↵ abrir · esc cerrar",
          title: "Buscar",
          suggestions: "Atajos",
        }
      : {
          placeholder: "Search norms, articles, blog, services…",
          empty: "Pick a shortcut, or start typing to search",
          noResults: "Nothing for that — try another search",
          loading: "Loading index…",
          error: "We could not load the search index",
          retry: "Retry",
          hint: "↑↓ navigate · ↵ open · esc close",
          title: "Search",
          suggestions: "Shortcuts",
        };

  function loadIndex(force = false) {
    if (loadedRef.current && !force) return;
    const gen = ++fetchGen.current;
    setIndexStatus("loading");

    fetch("/api/search/index")
      .then(async (res) => {
        if (!res.ok) throw new Error(`search index ${res.status}`);
        return res.json() as Promise<{ items?: SiteSearchItem[] }>;
      })
      .then((data) => {
        if (gen !== fetchGen.current) return;
        setItems(Array.isArray(data.items) ? data.items : []);
        loadedRef.current = true;
        setIndexStatus("ready");
      })
      .catch(() => {
        if (gen !== fetchGen.current) return;
        loadedRef.current = false;
        setItems([]);
        setIndexStatus("error");
      });
  }

  // Prefetch on mount so opening the palette is instant
  useEffect(() => {
    loadIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only prefetch
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    } else if (indexStatus === "idle" || indexStatus === "error") {
      loadIndex(indexStatus === "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open transitions only
  }, [open]);

  const localeItems = useMemo(
    () => filterIndexForLocale(items, locale),
    [items, locale],
  );

  const suggestions = useMemo(() => pickSuggestions(localeItems), [localeItems]);

  const hits = useMemo(
    () => rankSearchResults(localeItems, query),
    [localeItems, query],
  );

  const groups = useMemo(() => groupHitsByType(hits), [hits]);
  const flatHits = hits;
  const q = query.trim();
  const listItems = q ? flatHits : suggestions;

  function resolveHref(item: SiteSearchItem): string {
    if (item.type === "torny" && !signedIn) {
      return loginHref("/portal/lucy", locale);
    }
    return item.href;
  }

  function goTo(index: number) {
    const hit = listItems[index];
    if (!hit) return;
    closeSearch();
    router.push(resolveHref(hit));
  }

  function onQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(listItems.length - 1, 0)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      goTo(activeIndex);
    }
  }

  if (!open) return null;

  let runningIndex = -1;
  const loading = indexStatus === "loading" || indexStatus === "idle";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] sm:pt-[14vh]"
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[color:var(--ink)]/55 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={closeSearch}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-lg border border-border bg-card shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Sparkles
            className="size-4 shrink-0 text-[color:var(--moss)]"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={copy.placeholder}
            className="h-14 w-full bg-transparent font-[family-name:var(--font-ui)] text-base text-foreground outline-none placeholder:text-muted-foreground"
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground sm:inline">
            esc
          </kbd>
        </div>

        <div id={listId} className="max-h-[min(60vh,28rem)] overflow-y-auto p-2" role="listbox">
          {loading ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">{copy.loading}</p>
          ) : indexStatus === "error" ? (
            <div className="flex flex-col items-center gap-3 px-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">{copy.error}</p>
              <button
                type="button"
                onClick={() => loadIndex(true)}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
              >
                {copy.retry}
              </button>
            </div>
          ) : q && flatHits.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">{copy.noResults}</p>
          ) : !q ? (
            <div>
              <p className="px-3 py-1.5 font-[family-name:var(--font-ui)] text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--moss)]">
                {copy.suggestions}
              </p>
              {suggestions.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">{copy.empty}</p>
              ) : (
                <ul className="space-y-0.5">
                  {suggestions.map((hit, index) => {
                    const active = index === activeIndex;
                    const Icon = TYPE_ICONS[hit.type];
                    return (
                      <li key={hit.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => goTo(index)}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition",
                            active
                              ? "bg-[color:var(--forest)] text-[color:var(--parchment)]"
                              : "hover:bg-muted",
                          )}
                        >
                          <Icon
                            className={cn(
                              "mt-0.5 size-4 shrink-0",
                              active ? "opacity-90" : "text-[color:var(--moss)]",
                            )}
                            strokeWidth={1.75}
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{hit.title}</span>
                            {hit.description ? (
                              <span
                                className={cn(
                                  "mt-0.5 block line-clamp-1 text-xs",
                                  active
                                    ? "text-[color:var(--parchment)]/70"
                                    : "text-muted-foreground",
                                )}
                              >
                                {hit.description}
                              </span>
                            ) : null}
                          </span>
                          <ArrowRight
                            className={cn(
                              "mt-0.5 size-3.5 shrink-0",
                              active ? "opacity-80" : "opacity-0",
                            )}
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.type} className="mb-2">
                <p className="px-3 py-1.5 font-[family-name:var(--font-ui)] text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--moss)]">
                  {SEARCH_TYPE_LABELS[group.type][locale]}
                </p>
                <ul className="space-y-0.5">
                  {group.hits.map((hit) => {
                    runningIndex += 1;
                    const index = runningIndex;
                    const active = index === activeIndex;
                    const Icon = TYPE_ICONS[hit.type];
                    return (
                      <li key={hit.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => goTo(index)}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition",
                            active
                              ? "bg-[color:var(--forest)] text-[color:var(--parchment)]"
                              : "hover:bg-muted",
                          )}
                        >
                          <Icon
                            className={cn(
                              "mt-0.5 size-4 shrink-0",
                              active ? "opacity-90" : "text-[color:var(--moss)]",
                            )}
                            strokeWidth={1.75}
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{hit.title}</span>
                            {hit.description ? (
                              <span
                                className={cn(
                                  "mt-0.5 block line-clamp-1 text-xs",
                                  active
                                    ? "text-[color:var(--parchment)]/70"
                                    : "text-muted-foreground",
                                )}
                              >
                                {hit.description}
                              </span>
                            ) : null}
                          </span>
                          <ArrowRight
                            className={cn(
                              "mt-0.5 size-3.5 shrink-0",
                              active ? "opacity-80" : "opacity-0",
                            )}
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2">
          <p className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
            {copy.hint}
          </p>
          <p className="font-[family-name:var(--font-ui)] text-[0.625rem] text-muted-foreground">
            {q && flatHits.length > 0 ? `${flatHits.length}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
