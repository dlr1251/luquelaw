"use client";

import { Search } from "lucide-react";

import { useSiteSearch } from "@/components/search/site-search-provider";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "light" | "forest";
  showShortcut?: boolean;
  label?: string;
};

export function SiteSearchTrigger({
  className,
  variant = "light",
  showShortcut = true,
  label = "Search",
}: Props) {
  const { openSearch } = useSiteSearch();
  const isForest = variant === "forest";

  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label={label}
      className={cn(
        "group inline-flex items-center gap-2 transition",
        showShortcut
          ? cn(
              "h-9 rounded-md border px-2.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.08em]",
              isForest
                ? "border-[color:var(--parchment)]/20 text-[color:var(--parchment)]/75 hover:border-[color:var(--parchment)]/40 hover:text-[color:var(--parchment)]"
                : "border-border text-[color:var(--forest)]/70 hover:border-[color:var(--forest)]/35 hover:text-[color:var(--forest)]",
            )
          : cn(
              "inline-flex h-10 w-10 items-center justify-center",
              isForest
                ? "text-[color:var(--parchment)]/75 hover:text-[color:var(--parchment)]"
                : "text-[color:var(--forest)]/65 hover:text-[color:var(--forest)]",
            ),
        className,
      )}
    >
      <Search className="size-3.5 shrink-0 opacity-80" strokeWidth={1.75} aria-hidden />
      {showShortcut ? (
        <>
          <span className="hidden sm:inline">{label}</span>
          <kbd
            className={cn(
              "hidden rounded px-1.5 py-0.5 font-mono text-[0.625rem] font-medium normal-case tracking-normal sm:inline",
              isForest
                ? "bg-[color:var(--parchment)]/10 text-[color:var(--parchment)]/55"
                : "bg-muted text-muted-foreground",
            )}
          >
            ⌘K
          </kbd>
        </>
      ) : null}
    </button>
  );
}
