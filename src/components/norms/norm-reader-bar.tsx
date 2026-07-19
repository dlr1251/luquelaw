"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { NormCopyMarkdownButton } from "@/components/norms/norm-copy-markdown-button";
import type { TocEntry } from "@/lib/norms/tree";

type Props = {
  locale: "en" | "es";
  prev: TocEntry | null;
  next: TocEntry | null;
  sectionTitle: string;
  sectionNumberLabel: string | null;
  sectionHtml: string | null;
};

function navLabel(entry: TocEntry | null, fallback: string): string {
  if (!entry) return fallback;
  if (entry.numberLabel) return entry.numberLabel;
  return entry.title.length > 28 ? `${entry.title.slice(0, 28)}…` : entry.title;
}

export function NormReaderBar({
  locale,
  prev,
  next,
  sectionTitle,
  sectionNumberLabel,
  sectionHtml,
}: Props) {
  const copy =
    locale === "es"
      ? {
          previous: "Anterior",
          next: "Siguiente",
          previousAria: "Artículo anterior",
          nextAria: "Artículo siguiente",
        }
      : {
          previous: "Previous",
          next: "Next",
          previousAria: "Previous article",
          nextAria: "Next article",
        };

  const canCopy = Boolean(sectionHtml?.trim());

  return (
    <nav
      aria-label={locale === "es" ? "Navegación del artículo" : "Article navigation"}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--moss)]/25 bg-[color:var(--card)]/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-stretch gap-1 px-2 py-1.5">
        {prev ? (
          <Link
            href={prev.href}
            className="flex min-w-0 items-center gap-1 rounded-md px-2 py-2 text-[color:var(--forest)] transition active:bg-[color:var(--surface)]"
            aria-label={`${copy.previousAria}: ${prev.numberLabel ?? prev.title}`}
          >
            <ChevronLeft className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
            <span className="min-w-0 text-left">
              <span className="block font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[color:var(--moss)]">
                {copy.previous}
              </span>
              <span className="block truncate text-xs font-medium leading-tight">
                {navLabel(prev, copy.previous)}
              </span>
            </span>
          </Link>
        ) : (
          <div className="px-2 py-2 opacity-35" aria-hidden>
            <span className="flex items-center gap-1">
              <ChevronLeft className="size-5" strokeWidth={1.75} />
              <span className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.08em]">
                {copy.previous}
              </span>
            </span>
          </div>
        )}

        <NormCopyMarkdownButton
          locale={locale}
          title={sectionTitle}
          numberLabel={sectionNumberLabel}
          html={sectionHtml}
          variant="bar"
          disabled={!canCopy}
        />

        {next ? (
          <Link
            href={next.href}
            className="flex min-w-0 items-center justify-end gap-1 rounded-md px-2 py-2 text-right text-[color:var(--forest)] transition active:bg-[color:var(--surface)]"
            aria-label={`${copy.nextAria}: ${next.numberLabel ?? next.title}`}
          >
            <span className="min-w-0">
              <span className="block font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[color:var(--moss)]">
                {copy.next}
              </span>
              <span className="block truncate text-xs font-medium leading-tight">
                {navLabel(next, copy.next)}
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
          </Link>
        ) : (
          <div className="flex items-center justify-end px-2 py-2 opacity-35" aria-hidden>
            <span className="flex items-center gap-1">
              <span className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.08em]">
                {copy.next}
              </span>
              <ChevronRight className="size-5" strokeWidth={1.75} />
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}
