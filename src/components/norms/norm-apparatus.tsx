"use client";

import Link from "next/link";

import {
  APPARATUS_KIND_ORDER,
  apparatusKindLabel,
  type ApparatusBox,
  type ApparatusKind,
} from "@/lib/norms/citations";
import { Prose } from "@/components/prose";
import { cn } from "@/lib/cn";

type Props = {
  boxes: ApparatusBox[];
  locale: "en" | "es";
  compact?: boolean;
};

const LIST_KINDS = new Set<ApparatusKind>([
  "concordancias",
  "jurisprudencia",
  "jurisprudencia_vigencia",
  "doctrina",
]);

function groupByKind(boxes: ApparatusBox[]): Array<[ApparatusKind, ApparatusBox[]]> {
  const map = new Map<ApparatusKind, ApparatusBox[]>();
  for (const box of boxes) {
    const list = map.get(box.kind) ?? [];
    list.push(box);
    map.set(box.kind, list);
  }
  return APPARATUS_KIND_ORDER.filter((kind) => map.has(kind)).map((kind) => [
    kind,
    map.get(kind)!,
  ]);
}

function anchorLabel(anchor: string | null, locale: "en" | "es"): string | null {
  if (!anchor) return null;
  if (anchor.startsWith("num-")) {
    return locale === "es" ? `Numeral ${anchor.slice(4)}` : `Numeral ${anchor.slice(4)}`;
  }
  if (anchor.startsWith("lit-")) {
    return locale === "es" ? `Literal ${anchor.slice(4)}` : `Literal ${anchor.slice(4)}`;
  }
  if (anchor === "par") return locale === "es" ? "Parágrafo" : "Paragraph";
  return anchor;
}

export function NormApparatus({ boxes, locale, compact = false }: Props) {
  if (!boxes.length) return null;
  const grouped = groupByKind(boxes);
  if (!grouped.length) return null;

  const copy =
    locale === "es"
      ? {
          hint: "Aparato de la compilación DIAN, resuelto a páginas de Luque Law. La fuente oficial queda al pie de cada ficha.",
        }
      : {
          hint: "Apparatus from the DIAN compilation, resolved inside Luque Law. The official source sits at the bottom of each record.",
        };

  return (
    <aside
      className={cn(
        "space-y-2",
        compact ? "mt-6 border-t border-[color:var(--moss)]/15 pt-5" : "mt-8",
      )}
    >
      <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">{copy.hint}</p>
      {grouped.map(([kind, kindBoxes]) => {
        const citations = kindBoxes.flatMap((box) =>
          box.citations.map((cite) => ({ ...cite, anchor: box.anchor_key })),
        );
        const htmlBoxes = kindBoxes.filter((box) => box.html?.trim());
        const useList = LIST_KINDS.has(kind) && citations.length > 0;

        return (
          <details
            key={kind}
            className="group border border-[color:var(--moss)]/20 bg-[color:var(--parchment,#f5f2ec)]/40"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-[color:var(--forest)] [&::-webkit-details-marker]:hidden">
              <span>{apparatusKindLabel(kind, locale)}</span>
              <span className="text-[color:var(--moss)]">
                {useList ? citations.length : htmlBoxes.length || kindBoxes.length}
              </span>
            </summary>
            <div className="border-t border-[color:var(--moss)]/15 px-3 py-3">
              {useList ? (
                <ul className="space-y-1.5 text-sm">
                  {citations.map((cite) => (
                    <li key={cite.id} className="flex flex-wrap items-baseline gap-x-2">
                      {cite.anchor ? (
                        <span className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.08em] text-[color:var(--moss)]">
                          {anchorLabel(cite.anchor, locale)}
                        </span>
                      ) : null}
                      <Link
                        href={cite.href}
                        className="text-[color:var(--forest)] underline-offset-2 hover:underline"
                      >
                        {cite.label}
                      </Link>
                      {cite.isStub ? (
                        <span className="text-[0.625rem] uppercase tracking-[0.06em] text-muted-foreground">
                          {locale === "es" ? "Ficha" : "Record"}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                htmlBoxes.map((box) => (
                  <div key={box.id} className="space-y-2">
                    {box.anchor_key ? (
                      <p className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.08em] text-[color:var(--moss)]">
                        {anchorLabel(box.anchor_key, locale)}
                      </p>
                    ) : null}
                    <Prose className="text-sm">
                      <div dangerouslySetInnerHTML={{ __html: box.html || "" }} />
                    </Prose>
                  </div>
                ))
              )}
            </div>
          </details>
        );
      })}
    </aside>
  );
}
