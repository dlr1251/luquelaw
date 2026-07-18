"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { clkrPublicPath } from "@/lib/clkr/types";
import type { ImmigrationLocale } from "@/lib/practice-areas/immigration";
import {
  computeLastLegalDay,
  DEFAULT_TOURISM_STAMP_DAYS,
  TOURISM_ANNUAL_QUOTA,
  type TourismTrip,
} from "@/lib/practice-areas/last-legal-day";
import { immigrationPath } from "@/lib/practice-areas/paths";

type Props = {
  locale: ImmigrationLocale;
};

type TripDraft = {
  id: string;
  entry: string;
  exit: string;
  stampDays: string;
  open: boolean;
};

function newTrip(): TripDraft {
  return {
    id: Math.random().toString(36).slice(2, 10),
    entry: "",
    exit: "",
    stampDays: String(DEFAULT_TOURISM_STAMP_DAYS),
    open: false,
  };
}

export function LastLegalDayCalculator({ locale }: Props) {
  const [trips, setTrips] = useState<TripDraft[]>([newTrip()]);

  const copy =
    locale === "es"
      ? {
          title: "Calculadora de último día legal",
          body: `Estima el uso de la cuota de ${TOURISM_ANNUAL_QUOTA} días por año calendario y el último día cubierto por tu sello actual. Conteo inclusivo (entrada y salida). Informativo — no es asesoría.`,
          entry: "Entrada",
          exit: "Salida",
          stamp: "Días del sello",
          open: "Sigo en Colombia",
          add: "Agregar viaje",
          remove: "Quitar",
          result: "Resultado",
          lastLegal: "Último día legal estimado",
          stampLast: "Último día del sello",
          quotaLast: "Último día por cuota",
          stayDays: "Días de la estadía actual",
          quotaYear: "Cuota por año",
          used: "Usados",
          remaining: "Restantes",
          warnings: "Avisos",
          empty: "Agrega al menos una fecha de entrada.",
          guide: "Leer la guía Último día legal",
          book: "Agendar consulta",
          disclaimer:
            "Cancillería y Migración conservan discrecionalidad. Los sellos reales pueden diferir de esta estimación.",
        }
      : {
          title: "Last Legal Day calculator",
          body: `Estimate ${TOURISM_ANNUAL_QUOTA}-day calendar-year quota use and the last day covered by your current stamp. Inclusive counting (entry and exit). Informational — not legal advice.`,
          entry: "Entry",
          exit: "Exit",
          stamp: "Stamp days",
          open: "Still in Colombia",
          add: "Add trip",
          remove: "Remove",
          result: "Result",
          lastLegal: "Estimated last legal day",
          stampLast: "Stamp last day",
          quotaLast: "Quota last day",
          stayDays: "Current stay days",
          quotaYear: "Quota by year",
          used: "Used",
          remaining: "Remaining",
          warnings: "Warnings",
          empty: "Add at least one entry date.",
          guide: "Read the Last Legal Day guide",
          book: "Book a consultation",
          disclaimer:
            "Cancillería and Migración retain discretion. Actual stamps may differ from this estimate.",
        };

  const result = useMemo(() => {
    const mapped: TourismTrip[] = trips
      .filter((t) => t.entry)
      .map((t) => ({
        entry: t.entry,
        exit: t.open ? null : t.exit || null,
        stampDays: Number(t.stampDays) || DEFAULT_TOURISM_STAMP_DAYS,
      }));
    if (!mapped.length) return null;
    return computeLastLegalDay(mapped, { locale });
  }, [locale, trips]);

  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <h1 className="marketing-title">{copy.title}</h1>
        <p className="marketing-body">{copy.body}</p>
      </div>

      <div className="space-y-4">
        {trips.map((trip, index) => (
          <div
            key={trip.id}
            className="grid gap-3 border border-border bg-surface/50 p-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="block text-sm">
              <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {copy.entry}
              </span>
              <input
                type="date"
                value={trip.entry}
                onChange={(e) => {
                  const next = [...trips];
                  next[index] = { ...trip, entry: e.target.value };
                  setTrips(next);
                }}
                className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="block text-sm">
              <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {copy.exit}
              </span>
              <input
                type="date"
                value={trip.exit}
                disabled={trip.open}
                onChange={(e) => {
                  const next = [...trips];
                  next[index] = { ...trip, exit: e.target.value };
                  setTrips(next);
                }}
                className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50"
              />
            </label>
            <label className="block text-sm">
              <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {copy.stamp}
              </span>
              <input
                type="number"
                min={1}
                max={180}
                value={trip.stampDays}
                onChange={(e) => {
                  const next = [...trips];
                  next[index] = { ...trip, stampDays: e.target.value };
                  setTrips(next);
                }}
                className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
            <div className="flex flex-col justify-end gap-2">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={trip.open}
                  onChange={(e) => {
                    const next = [...trips];
                    next[index] = {
                      ...trip,
                      open: e.target.checked,
                      exit: e.target.checked ? "" : trip.exit,
                    };
                    // only one open stay
                    if (e.target.checked) {
                      for (let i = 0; i < next.length; i++) {
                        if (i !== index) next[i] = { ...next[i], open: false };
                      }
                    }
                    setTrips(next);
                  }}
                />
                {copy.open}
              </label>
              {trips.length > 1 ? (
                <button
                  type="button"
                  className="text-left font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
                  onClick={() => setTrips(trips.filter((t) => t.id !== trip.id))}
                >
                  {copy.remove}
                </button>
              ) : null}
            </div>
          </div>
        ))}

        <button type="button" className="btn-secondary" onClick={() => setTrips([...trips, newTrip()])}>
          {copy.add}
        </button>
      </div>

      <div className="border border-border bg-background p-5 sm:p-6">
        <h2 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
          {copy.result}
        </h2>
        {!result ? (
          <p className="mt-3 text-sm text-muted-foreground">{copy.empty}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {result.lastLegalDay ? (
              <p className="text-lg font-semibold text-foreground">
                {copy.lastLegal}:{" "}
                <span className="font-[family-name:var(--font-ui)]">{result.lastLegalDay}</span>
              </p>
            ) : null}
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {result.stampLastDay ? (
                <div>
                  <dt className="text-muted-foreground">{copy.stampLast}</dt>
                  <dd className="font-medium text-foreground">{result.stampLastDay}</dd>
                </div>
              ) : null}
              {result.quotaLastDay ? (
                <div>
                  <dt className="text-muted-foreground">{copy.quotaLast}</dt>
                  <dd className="font-medium text-foreground">{result.quotaLastDay}</dd>
                </div>
              ) : null}
              {result.currentStayDays != null ? (
                <div>
                  <dt className="text-muted-foreground">{copy.stayDays}</dt>
                  <dd className="font-medium text-foreground">{result.currentStayDays}</dd>
                </div>
              ) : null}
            </dl>

            {result.quotaByYear.length ? (
              <div>
                <p className="text-sm font-medium text-foreground">{copy.quotaYear}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {result.quotaByYear.map((row) => (
                    <li key={row.year}>
                      {row.year}: {copy.used} {row.daysUsed} · {copy.remaining}{" "}
                      {row.daysRemaining}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {result.warnings.length ? (
              <div>
                <p className="text-sm font-medium text-foreground">{copy.warnings}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {result.warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.disclaimer}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={clkrPublicPath("last-legal-day", locale)} className="btn-secondary">
            {copy.guide}
          </Link>
          <Link href={`${immigrationPath("", locale)}#book`} className="btn-primary">
            {copy.book}
          </Link>
        </div>
      </div>
    </div>
  );
}
