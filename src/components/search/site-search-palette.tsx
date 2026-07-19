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

type Props = {
  signedIn?: boolean;
};

type IndexStatus = "idle" | "loading" | "ready" | "error";

export function SiteSearchPalette({ signedIn = false }: Props) {
  const { open, closeSearch } = useSiteSearch();
  const pathname = usePathname();
  const router = useRouter();
  const locale = localeFromPathname(pathname);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const loadedRef = useRef(false);

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SiteSearchItem[]>([]);
  const [indexStatus, setIndexStatus] = useState<IndexStatus>("idle");
  const [activeIndex, setActiveIndex] = useState(0);

  const copy =
    locale === "es"
      ? {
          placeholder: "Buscar normas, artículos, blog, servicios…",
          empty: "Escribe para buscar en el sitio",
          noResults: "Sin resultados",
          loading: "Cargando índice…",
          hint: "↑↓ navegar · ↵ abrir · esc cerrar",
          title: "Buscar",
        }
      : {
          placeholder: "Search norms, articles, blog, services…",
          empty: "Start typing to search the site",
          noResults: "No results",
          loading: "Loading index…",
          hint: "↑↓ navigate · ↵ open · esc close",
          title: "Search",
        };

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
    if (!open || loadedRef.current) return;
    let cancelled = false;

    fetch("/api/search/index")
      .then((res) => res.json())
      .then((data: { items?: SiteSearchItem[] }) => {
        if (cancelled) return;
        setItems(Array.isArray(data.items) ? data.items : []);
        loadedRef.current = true;
        setIndexStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setItems([]);
        setIndexStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  // Reset query when closing; mark loading when opening before index is ready
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    } else if (indexStatus !== "ready") {
      setIndexStatus("loading");
    }
  }

  const localeItems = useMemo(
    () => filterIndexForLocale(items, locale),
    [items, locale],
  );

  const hits = useMemo(
    () => rankSearchResults(localeItems, query),
    [localeItems, query],
  );

  const groups = useMemo(() => groupHitsByType(hits), [hits]);
  const flatHits = hits;

  function resolveHref(item: SiteSearchItem): string {
    if (item.type === "torny" && !signedIn) {
      return loginHref("/portal/lucy");
    }
    return item.href;
  }

  function goTo(index: number) {
    const hit = flatHits[index];
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
      setActiveIndex((i) => Math.min(i + 1, Math.max(flatHits.length - 1, 0)));
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
          ) : !query.trim() ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">{copy.empty}</p>
          ) : flatHits.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">{copy.noResults}</p>
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
            {flatHits.length > 0 ? `${flatHits.length}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
