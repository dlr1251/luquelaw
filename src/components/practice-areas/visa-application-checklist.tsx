"use client";

import { Download } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/cn";
import { visaChecklistWhatsappHref } from "@/lib/practice-areas/checklist-contact";
import type { ImmigrationLocale } from "@/lib/practice-areas/paths";
import type { ChecklistGroupView } from "@/lib/practice-areas/visa-checklists";

type Props = {
  locale: ImmigrationLocale;
  storageKey: string;
  items: string[];
  groups?: ChecklistGroupView[] | null;
  title: string;
  slug: string;
  category: string;
  articleNum: number;
};

function readStored(key: string, len: number): boolean[] {
  if (typeof window === "undefined") return Array(len).fill(false);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return Array(len).fill(false);
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return Array(len).fill(false);
    return Array.from({ length: len }, (_, i) => Boolean(parsed[i]));
  } catch {
    return Array(len).fill(false);
  }
}

export function VisaApplicationChecklist({
  locale,
  storageKey,
  items,
  groups = null,
  title,
  slug,
  category,
  articleNum,
}: Props) {
  const baseId = useId();
  const sections: ChecklistGroupView[] =
    groups && groups.length > 0 ? groups : [{ items }];
  const flatItems = sections.flatMap((g) => g.items);

  const [checked, setChecked] = useState<boolean[]>(() =>
    Array(flatItems.length).fill(false),
  );
  const [hydrated, setHydrated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setChecked(readStored(storageKey, flatItems.length));
    setHydrated(true);
  }, [storageKey, flatItems.length]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // ignore quota / private mode
    }
  }, [checked, hydrated, storageKey]);

  const done = useMemo(() => checked.filter(Boolean).length, [checked]);
  const total = flatItems.length;
  const whatsappHref = visaChecklistWhatsappHref(locale, title);

  const copy =
    locale === "es"
      ? {
          progress: `${done} de ${total} listos`,
          reset: "Limpiar",
          download: downloading ? "Preparando PDF" : "Descargar PDF",
          ask: "Pregunta aquí",
          hint: "Se guarda en este navegador. No se envía a Cancillería ni a Luque Law.",
        }
      : {
          progress: `${done} of ${total} done`,
          reset: "Clear",
          download: downloading ? "Preparing PDF" : "Download PDF",
          ask: "Ask here",
          hint: "Saved in this browser only. Not sent to Cancillería or Luque Law.",
        };

  function toggle(index: number) {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }

  function reset() {
    setChecked(Array(flatItems.length).fill(false));
  }

  async function downloadPdf() {
    if (downloading) return;
    setDownloading(true);
    try {
      const { downloadVisaChecklistPdf } = await import(
        "@/lib/practice-areas/checklist-pdf"
      );
      downloadVisaChecklistPdf({
        locale,
        title,
        slug,
        category,
        articleNum,
        items: flatItems,
        groups: sections,
        checked,
        pageUrl: window.location.href,
      });
    } finally {
      setDownloading(false);
    }
  }

  const downloadClass =
    "inline-flex min-h-9 items-center gap-1.5 border border-border bg-background px-3 py-1.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-foreground transition hover:border-foreground/40 hover:bg-surface/80 disabled:opacity-60";
  const contactClass =
    "inline-flex min-h-9 items-center gap-1.5 border border-border bg-background px-3 py-1.5 font-[family-name:var(--font-ui)] text-[0.75rem] font-medium text-foreground transition hover:border-foreground/40 hover:bg-surface/80";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-[family-name:var(--font-ui)] text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {copy.progress}
        </p>
        {done > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="font-[family-name:var(--font-ui)] text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {copy.reset}
          </button>
        ) : null}
      </div>

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => {
          const start = sections
            .slice(0, sectionIndex)
            .reduce((n, g) => n + g.items.length, 0);
          return (
            <div key={`sec-${sectionIndex}-${section.heading ?? "items"}`} className="space-y-2">
              {section.heading ? (
                <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground">
                  {section.heading}
                </p>
              ) : null}
              {section.items.length ? (
                <ul className="space-y-1">
                  {section.items.map((item, localIndex) => {
                    const index = start + localIndex;
                    const id = `${baseId}-${index}`;
                    const isOn = checked[index] ?? false;
                    return (
                      <li key={`${index}-${item.slice(0, 24)}`}>
                        <label
                          htmlFor={id}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 border border-transparent px-2 py-2.5 transition",
                            "hover:border-border hover:bg-surface/60",
                            isOn && "bg-surface/40",
                          )}
                        >
                          <input
                            id={id}
                            type="checkbox"
                            checked={isOn}
                            onChange={() => toggle(index)}
                            className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
                          />
                          <span
                            className={cn(
                              "text-sm leading-relaxed text-foreground",
                              isOn && "text-muted-foreground line-through",
                            )}
                          >
                            {item}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={downloadPdf}
          disabled={downloading}
          className={downloadClass}
        >
          <Download className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
          {copy.download}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className={contactClass}
        >
          <WhatsappIcon className="size-3.5" />
          {copy.ask}
        </a>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{copy.hint}</p>
    </div>
  );
}
