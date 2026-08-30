"use client";

import { ChevronDown, List } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { cn } from "@/lib/cn";

export type ArticleTocSection = {
  id: string;
  title: string;
};

function useHeaderOffset() {
  const [offset, setOffset] = useState(112);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const update = () => {
      setOffset(Math.round(header.getBoundingClientRect().height));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return offset;
}

function useActiveSectionId(ids: string[], offsetPx: number) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (ids.length === 0) return;

    function update() {
      let current = ids[0] ?? null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offsetPx + 12) current = id;
      }
      setActiveId(current);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [ids, offsetPx]);

  return activeId;
}

function TocLinks({
  sections,
  activeId,
  onNavigate,
}: {
  sections: ArticleTocSection[];
  activeId: string | null;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-0.5 text-sm">
      {sections.map((s) => {
        const active = s.id === activeId;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={onNavigate}
            className={cn(
              "block border-l-2 px-2 py-1.5 transition",
              active
                ? "border-[color:var(--forest)] text-[color:var(--forest)]"
                : "border-transparent text-muted-foreground hover:border-[color:var(--moss)] hover:text-[color:var(--ink)]",
            )}
            aria-current={active ? "true" : undefined}
          >
            {s.title}
          </a>
        );
      })}
    </nav>
  );
}

export function ArticleDesktopToc({
  sections,
  label,
}: {
  sections: ArticleTocSection[];
  label: string;
}) {
  const headerOffset = useHeaderOffset();
  const activeId = useActiveSectionId(
    sections.map((s) => s.id),
    headerOffset,
  );

  if (sections.length === 0) return null;

  return (
    <div className="hidden lg:block">
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
        {label}
      </div>
      <div className="mt-4">
        <TocLinks sections={sections} activeId={activeId} />
      </div>
    </div>
  );
}

export function ArticleMobileToc({
  sections,
  label,
  locale,
}: {
  sections: ArticleTocSection[];
  label: string;
  locale: "en" | "es";
}) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const headerOffset = useHeaderOffset();
  const activeId = useActiveSectionId(
    sections.map((s) => s.id),
    headerOffset + 48,
  );

  const activeTitle =
    sections.find((s) => s.id === activeId)?.title ?? sections[0]?.title ?? label;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (sections.length === 0) return null;

  const nowReading = locale === "es" ? "Leyendo" : "Reading";

  return (
    <div className="sticky z-40 lg:hidden" style={{ top: headerOffset }}>
        <button
          type="button"
          className="relative z-50 -mx-4 flex w-[calc(100%+2rem)] items-center gap-2.5 border-y border-[color:var(--moss)]/25 bg-[color:var(--background)]/95 px-4 py-2.5 text-left backdrop-blur-md sm:-mx-6 sm:w-[calc(100%+3rem)] sm:px-6"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <List className="size-4 shrink-0 text-[color:var(--moss)]" strokeWidth={1.8} aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
              {open ? label : nowReading}
            </span>
            <span className="block truncate text-sm font-medium text-[color:var(--ink)]">
              {activeTitle}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-[color:var(--moss)] transition-transform duration-200",
              open && "rotate-180",
            )}
            strokeWidth={1.8}
            aria-hidden
          />
        </button>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-[color:var(--ink)]/25 backdrop-blur-[2px] animate-in fade-in-0 duration-200"
            style={{ top: headerOffset + 52 }}
            aria-label={locale === "es" ? "Cerrar contenido" : "Close contents"}
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className={cn(
            "absolute inset-x-0 top-full z-50 -mx-4 overflow-hidden border-b border-[color:var(--moss)]/25 bg-[color:var(--card)] shadow-[0_16px_40px_-20px_rgba(0,0,0,0.35)] sm:-mx-6",
            open
              ? "max-h-[min(60vh,28rem)] animate-in fade-in-0 slide-in-from-top-2 duration-200"
              : "pointer-events-none hidden",
          )}
        >
          <div className="max-h-[min(60vh,28rem)] overflow-y-auto px-4 py-3 sm:px-6">
            <TocLinks
              sections={sections}
              activeId={activeId}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
    </div>
  );
}
