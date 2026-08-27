"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ImmigrationLocale } from "@/lib/practice-areas/immigration";
import {
  addDays,
  inclusiveDays,
  isoInInclusiveRange,
  maxIso,
  minIso,
  monthGrid,
  parseIsoDate,
  todayIso,
  type StampKind,
  effectiveStampDays,
} from "@/lib/practice-areas/last-legal-day";

export type TripDraft = {
  id: string;
  entry: string;
  exit: string;
  open: boolean;
  stampKind: StampKind;
  stampDays: string;
  /** Tourism stays over 90 days: whether they filed the prórroga. */
  extended: boolean | null;
};

type DraftRange = { start: string; end: string };

type Props = {
  locale: ImmigrationLocale;
  trips: TripDraft[];
  selectedId: string | null;
  onSelectTrip: (id: string | null) => void;
  onPaintRange: (start: string, end: string) => void;
  hint: string;
};

const WEEKDAYS = {
  es: ["L", "M", "X", "J", "V", "S", "D"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
};

const MONTHS = {
  es: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

export const STAMP_TONE: Record<StampKind, string> = {
  tourism90: "var(--moss)",
  visa: "#6b7280",
};

function tripCovers(
  trip: TripDraft,
  iso: string,
  asOf: string,
): "stay" | "authorized" | null {
  if (!trip.entry) return null;
  const stampDays = effectiveStampDays(trip);
  const stampLast = addDays(trip.entry, stampDays - 1);
  if (trip.open) {
    const stayEnd = maxIso(trip.entry, minIso(asOf, stampLast ?? asOf));
    if (isoInInclusiveRange(iso, trip.entry, stayEnd)) return "stay";
    if (stampLast && iso > stayEnd && iso <= stampLast) return "authorized";
    return null;
  }
  if (!trip.exit) return iso === trip.entry ? "stay" : null;
  if (isoInInclusiveRange(iso, trip.entry, trip.exit)) return "stay";
  return null;
}

function tripOnDay(trips: TripDraft[], iso: string, asOf: string): TripDraft | null {
  for (const trip of trips) {
    if (tripCovers(trip, iso, asOf)) return trip;
  }
  return null;
}

export function StayRangeCalendar({
  locale,
  trips,
  selectedId,
  onSelectTrip,
  onPaintRange,
  hint,
}: Props) {
  const asOf = todayIso();
  const todayParsed = parseIsoDate(asOf) ?? new Date();
  const [year, setYear] = useState(todayParsed.getUTCFullYear());
  const [month, setMonth] = useState(todayParsed.getUTCMonth());
  const [draft, setDraft] = useState<DraftRange | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startIso: string;
    originX: number;
    originY: number;
    isDrag: boolean;
    hitTripId: string | null;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const jumpToIso = useCallback((iso: string) => {
    const d = parseIsoDate(iso);
    if (!d) return;
    setYear(d.getUTCFullYear());
    setMonth(d.getUTCMonth());
  }, []);

  useEffect(() => {
    const selected = trips.find((t) => t.id === selectedId);
    if (selected?.entry) jumpToIso(selected.entry);
    // Jump only when the selected trip changes, not on every date edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- trips intentionally omitted
  }, [jumpToIso, selectedId]);

  const cells = monthGrid(year, month);

  function shiftMonth(delta: number) {
    const next = new Date(Date.UTC(year, month + delta, 1));
    setYear(next.getUTCFullYear());
    setMonth(next.getUTCMonth());
  }

  function isoFromPoint(x: number, y: number): string | null {
    const node = document.elementFromPoint(x, y);
    const cell = node?.closest("[data-cal-iso]") as HTMLElement | null;
    return cell?.dataset.calIso ?? null;
  }

  function endPointer(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const currentDraft = draft;
    dragRef.current = null;
    setDraft(null);
    try {
      gridRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    if (!drag.isDrag) {
      if (drag.hitTripId) onSelectTrip(drag.hitTripId);
      else onPaintRange(drag.startIso, drag.startIso);
      return;
    }
    if (!currentDraft) return;
    onPaintRange(minIso(currentDraft.start, currentDraft.end), maxIso(currentDraft.start, currentDraft.end));
  }

  const monthOccupancy = Array.from({ length: 12 }, (_, i) => {
    const start = `${year}-${String(i + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(Date.UTC(year, i + 1, 0)).getUTCDate();
    const end = `${year}-${String(i + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    let days = 0;
    for (const trip of trips) {
      if (!trip.entry) continue;
      const tripEnd = trip.open ? asOf : trip.exit || trip.entry;
      if (!rangesTouch(trip.entry, tripEnd, start, end)) continue;
      const from = maxIso(trip.entry, start);
      const to = minIso(tripEnd, end);
      const a = parseIsoDate(from);
      const b = parseIsoDate(to);
      if (a && b) days += inclusiveDays(a, b);
    }
    return days;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_12px_40px_-24px_rgb(0_0_0/0.35)]">
      <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-4 sm:px-5">
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted"
          onClick={() => shiftMonth(-1)}
          aria-label={locale === "es" ? "Mes anterior" : "Previous month"}
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="min-w-0 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--heading)] sm:text-2xl">
            {MONTHS[locale][month]} {year}
          </p>
          <button
            type="button"
            className="mt-0.5 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            onClick={() => jumpToIso(asOf)}
          >
            {locale === "es" ? "Hoy" : "Today"}
          </button>
        </div>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted"
          onClick={() => shiftMonth(1)}
          aria-label={locale === "es" ? "Mes siguiente" : "Next month"}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="flex gap-1 px-4 pb-3 sm:px-5">
        {monthOccupancy.map((days, i) => (
          <button
            key={i}
            type="button"
            title={MONTHS[locale][i]}
            onClick={() => setMonth(i)}
            className={cn(
              "h-1.5 flex-1 rounded-full transition",
              i === month ? "bg-[var(--moss)]" : days > 0 ? "bg-[var(--forest)]/35" : "bg-muted",
            )}
            aria-label={MONTHS[locale][i]}
          />
        ))}
      </div>

      <div className="grid grid-cols-7 px-2 sm:px-3">
        {WEEKDAYS[locale].map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="pb-1 text-center font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.12em] text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      <div
        ref={gridRef}
        className="grid touch-none grid-cols-7 gap-0.5 px-2 pb-3 select-none sm:px-3"
        role="grid"
        aria-label={locale === "es" ? "Calendario de permanencia" : "Stay calendar"}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          const iso = isoFromPoint(e.clientX, e.clientY);
          if (!iso) return;
          const hit = tripOnDay(trips, iso, asOf);
          dragRef.current = {
            pointerId: e.pointerId,
            startIso: iso,
            originX: e.clientX,
            originY: e.clientY,
            isDrag: false,
            hitTripId: hit?.id ?? null,
          };
          gridRef.current?.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const drag = dragRef.current;
          if (!drag || drag.pointerId !== e.pointerId) return;
          const dist = Math.hypot(e.clientX - drag.originX, e.clientY - drag.originY);
          if (!drag.isDrag && dist < 10) return;
          const iso = isoFromPoint(e.clientX, e.clientY);
          if (!iso) return;
          if (!drag.isDrag) {
            if (drag.hitTripId) return;
            drag.isDrag = true;
          }
          setDraft({ start: drag.startIso, end: iso });
        }}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        {cells.map((cell) => {
          const hit = tripOnDay(trips, cell.iso, asOf);
          const phase = hit ? tripCovers(hit, cell.iso, asOf) : null;
          const inDraft =
            draft && isoInInclusiveRange(cell.iso, draft.start, draft.end);
          const isToday = cell.iso === asOf;
          const isSelected = hit?.id === selectedId;
          const tone = hit ? STAMP_TONE[hit.stampKind] : STAMP_TONE.tourism90;
          const dayNum = Number(cell.iso.slice(8, 10));

          return (
            <div
              key={cell.iso}
              data-cal-iso={cell.iso}
              role="gridcell"
              aria-label={cell.iso}
              className={cn(
                "relative flex aspect-square min-h-11 items-center justify-center rounded-xl text-sm tabular-nums",
                cell.inMonth ? "text-foreground" : "text-muted-foreground/55",
                isToday && "font-semibold",
              )}
            >
              <span
                className={cn(
                  "absolute inset-0.5 rounded-xl",
                  inDraft && "bg-[color-mix(in_srgb,var(--moss)_28%,transparent)]",
                  hit && !inDraft && "opacity-100",
                  isSelected && "ring-2 ring-[var(--moss)] ring-offset-1 ring-offset-card",
                )}
                style={
                  hit && !inDraft
                    ? {
                        background:
                          phase === "authorized"
                            ? `repeating-linear-gradient(-45deg, color-mix(in srgb, ${tone} 22%, transparent) 0 6px, transparent 6px 11px)`
                            : `color-mix(in srgb, ${tone} 32%, transparent)`,
                      }
                    : undefined
                }
              />
              {isToday ? (
                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[var(--moss)]" />
              ) : null}
              <span className="relative z-[1]">{dayNum}</span>
            </div>
          );
        })}
      </div>

      <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground sm:px-5">
        {hint}
      </p>
    </div>
  );
}

function rangesTouch(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return minIso(aStart, aEnd) <= maxIso(bStart, bEnd) && minIso(bStart, bEnd) <= maxIso(aStart, aEnd);
}
