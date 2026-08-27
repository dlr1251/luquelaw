"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  StayRangeCalendar,
  STAMP_TONE,
  type TripDraft,
} from "@/components/practice-areas/stay-range-calendar";
import { clkrPublicPath } from "@/lib/clkr/types";
import type { ImmigrationLocale } from "@/lib/practice-areas/immigration";
import {
  computeLastLegalDay,
  computeTaxResidency,
  countsTowardTourismQuota,
  DEFAULT_TOURISM_STAMP_DAYS,
  defaultStampDays,
  effectiveStampDays,
  inclusiveDays,
  maxIso,
  minIso,
  parseIsoDate,
  rangesContiguous,
  rangesOverlap,
  STAMP_KINDS,
  TAX_PRESENCE_THRESHOLD,
  TAX_PRESENCE_WINDOW_DAYS,
  todayIso,
  TOURISM_ANNUAL_QUOTA,
  TOURISM_EXTENDED_STAMP_DAYS,
  type StampKind,
  type TourismTrip,
} from "@/lib/practice-areas/last-legal-day";
import { immigrationPath } from "@/lib/practice-areas/paths";

type Props = {
  locale: ImmigrationLocale;
};

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function stampLabel(kind: StampKind, locale: ImmigrationLocale): string {
  const es: Record<StampKind, string> = {
    tourism90: "Sello (turismo)",
    visa: "Visa",
  };
  const en: Record<StampKind, string> = {
    tourism90: "Stamp (tourism)",
    visa: "Visa",
  };
  return locale === "es" ? es[kind] : en[kind];
}

function formatShort(iso: string, locale: ImmigrationLocale): string {
  const d = parseIsoDate(iso);
  if (!d) return iso;
  return new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

function tripEnd(trip: TripDraft, asOf: string): string {
  return trip.open ? asOf : trip.exit || trip.entry;
}

function tripsContiguous(a: TripDraft, b: TripDraft, asOf: string): boolean {
  if (!a.entry || !b.entry) return false;
  return rangesContiguous(a.entry, tripEnd(a, asOf), b.entry, tripEnd(b, asOf));
}

function mergePair(a: TripDraft, b: TripDraft, asOf: string): TripDraft {
  const start = minIso(a.entry, b.entry);
  const end = maxIso(tripEnd(a, asOf), tripEnd(b, asOf));
  const open = a.open || b.open || (start <= asOf && end >= asOf);
  const extended = a.extended === true || b.extended === true ? true : a.extended ?? b.extended;
  const stampDays =
    Number(a.stampDays) >= Number(b.stampDays) ? a.stampDays : b.stampDays;
  return {
    ...a,
    entry: start,
    exit: open ? "" : end,
    open,
    extended,
    stampDays,
  };
}

function coalesceTrips(trips: TripDraft[]): TripDraft[] {
  const asOf = todayIso();
  const list = [...trips].sort((a, b) => a.entry.localeCompare(b.entry));
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[i].stampKind !== list[j].stampKind) continue;
        if (!tripsContiguous(list[i], list[j], asOf)) continue;
        list[i] = mergePair(list[i], list[j], asOf);
        list.splice(j, 1);
        changed = true;
        break;
      }
      if (changed) break;
    }
  }
  const openId = [...list].reverse().find((t) => t.open)?.id;
  return list
    .map((t) => (openId && t.id !== openId ? { ...t, open: false } : t))
    .sort((a, b) => a.entry.localeCompare(b.entry));
}

function overlapsDifferentKind(candidate: TripDraft, trips: TripDraft[]): boolean {
  if (!candidate.entry) return false;
  const asOf = todayIso();
  const aEnd = tripEnd(candidate, asOf);
  return trips.some((other) => {
    if (other.id === candidate.id || !other.entry) return false;
    if (other.stampKind === candidate.stampKind) return false;
    return rangesOverlap(candidate.entry, aEnd, other.entry, tripEnd(other, asOf));
  });
}

export function LastLegalDayCalculator({ locale }: Props) {
  const [trips, setTrips] = useState<TripDraft[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState("");
  const [manualExit, setManualExit] = useState("");
  const [showManual, setShowManual] = useState(false);

  const copy =
    locale === "es"
      ? {
          title: "Calculadora de último día legal",
          body: `Pinta los días que estuviste en Colombia — o ingresa las fechas a mano. La cuenta es teórica: la cuota de ${TOURISM_ANNUAL_QUOTA} días de turismo por año calendario, no el sello que te pusieron en el aeropuerto. La visa no entra en esos 180. Conteo inclusivo (entrada y salida). Informativo — no es asesoría.`,
          hint: "Arrastra el dedo sobre los días. Los tramos pegados del mismo tipo se unen en un solo viaje.",
          trips: "Tus tramos",
          empty: "Todavía no hay tramos. Pinta uno o ingresa las fechas a mano.",
          manual: "Ingresar a mano",
          manualAdd: "Agregar tramo",
          entry: "Entrada",
          exit: "Salida",
          stamp: "Tipo",
          days: "Días teóricos del permiso",
          daysHint: "Regla general: 90 al ingreso, 180 si hay prórroga. Esto es lo que debería cubrir el sello, no lo que te hayan estampado.",
          open: "Sigo en Colombia",
          remove: "Quitar",
          overlap: "Ese tramo se cruza con una visa u otro tipo distinto. Ajusta las fechas o cambia el tipo.",
          result: "Cuota de turismo (teórica)",
          lastLegal: "Último día legal estimado",
          stampLast: "Último día teórico del permiso",
          quotaLast: "Último día por cuota",
          stayDays: "Días de la estadía actual",
          quotaYear: "Cuota por año",
          used: "Usados",
          remaining: "Restantes",
          warnings: "Avisos",
          needEntry: "Agrega al menos una fecha de entrada.",
          nights: "días",
          extensionAsk: "Esta estadía pasa de 90 días. ¿Tramitaste la prórroga del permiso de turismo?",
          extensionYes: "Sí, hubo prórroga",
          extensionNo: "No",
          taxTitle: "Residencia fiscal",
          taxBody: `Otra cuenta: el art. 10 del Estatuto Tributario mira si estuviste más de ${TAX_PRESENCE_THRESHOLD} días en Colombia en cualquier ventana de ${TAX_PRESENCE_WINDOW_DAYS} días seguidos, continuos o no. Aquí entra toda permanencia física — turismo y visa. Hay otros criterios (familia, nacionalidad). Esto no es una calificación tributaria.`,
          taxYes: "Cumple la prueba de permanencia",
          taxNo: "No llega a la prueba de permanencia",
          taxDays: "días en Colombia ese año",
          taxEmpty: "Pinta tramos para ver el estimado por año.",
          taxDisclaimer:
            "DIAN y las reglas de residencia van más allá de los días. Esto es brújula, no una declaración.",
          guide: "Leer la guía Último día legal",
          book: "Agendar consulta",
          disclaimer:
            "Esto estima la regla de 180 días. Cancillería y Migración conservan discrecionalidad; el sello real puede ser otro.",
        }
      : {
          title: "Last Legal Day calculator",
          body: `Paint the days you were in Colombia — or enter dates by hand. The count is theoretical: the ${TOURISM_ANNUAL_QUOTA}-day tourism quota per calendar year, not the stamp they inked at the airport. Visa time does not consume those 180 days. Inclusive counting (entry and exit). Informational — not legal advice.`,
          hint: "Drag across days. Back-to-back stretches of the same type merge into one stay.",
          trips: "Your stays",
          empty: "No stays yet. Paint one or enter the dates by hand.",
          manual: "Enter by hand",
          manualAdd: "Add stay",
          entry: "Entry",
          exit: "Exit",
          stamp: "Type",
          days: "Theoretical permit days",
          daysHint: "Usual rule: 90 on entry, 180 with an extension. This is what the stamp should cover, not what they actually inked.",
          open: "Still in Colombia",
          remove: "Remove",
          overlap: "That stretch overlaps a visa or a different type. Adjust the dates or change the type.",
          result: "Tourism quota (theoretical)",
          lastLegal: "Estimated last legal day",
          stampLast: "Theoretical permit last day",
          quotaLast: "Quota last day",
          stayDays: "Current stay days",
          quotaYear: "Quota by year",
          used: "Used",
          remaining: "Remaining",
          warnings: "Warnings",
          needEntry: "Add at least one entry date.",
          nights: "days",
          extensionAsk: "This stay is longer than 90 days. Did you file the tourism permit extension (prórroga)?",
          extensionYes: "Yes, there was an extension",
          extensionNo: "No",
          taxTitle: "Tax residency",
          taxBody: `A separate count: Estatuto Tributario art. 10 looks at more than ${TAX_PRESENCE_THRESHOLD} days in Colombia in any ${TAX_PRESENCE_WINDOW_DAYS}-day window, continuous or not. Physical presence counts — tourism and visa. Other tests exist (family, nationality). This is not a tax determination.`,
          taxYes: "Meets the presence test",
          taxNo: "Does not meet the presence test",
          taxDays: "days in Colombia that year",
          taxEmpty: "Paint stays to see the year-by-year estimate.",
          taxDisclaimer:
            "DIAN and residency rules go beyond day counts. Treat this as a compass, not a filing position.",
          guide: "Read the Last Legal Day guide",
          book: "Book a consultation",
          disclaimer:
            "This estimates the 180-day rule. Cancillería and Migración retain discretion; the actual stamp may differ.",
        };

  function patchTrip(id: string, patch: Partial<TripDraft>) {
    setTrips((current) => {
      const next = current.map((trip) => (trip.id === id ? { ...trip, ...patch } : trip));
      const updated = next.find((t) => t.id === id);
      if (updated && overlapsDifferentKind(updated, next)) {
        setNotice(copy.overlap);
        return current;
      }
      setNotice(null);
      return coalesceTrips(next);
    });
  }

  function addStay(start: string, end: string, stampKind: StampKind = "tourism90") {
    if (!start) return;
    const asOf = todayIso();
    const last = end || start;
    const coversToday = start <= asOf && last >= asOf;
    const draft: TripDraft = {
      id: newId(),
      entry: start,
      exit: coversToday ? "" : last,
      open: coversToday,
      stampKind,
      stampDays: String(DEFAULT_TOURISM_STAMP_DAYS),
      extended: null,
    };
    setTrips((current) => {
      if (overlapsDifferentKind(draft, current)) {
        setNotice(copy.overlap);
        return current;
      }
      setNotice(null);
      const merged = coalesceTrips([...current, draft]);
      const selected =
        merged.find((t) => t.stampKind === stampKind && start >= t.entry && start <= tripEnd(t, asOf)) ??
        merged[merged.length - 1];
      if (selected) setSelectedId(selected.id);
      return merged;
    });
  }

  function paintRange(start: string, end: string) {
    addStay(start, end);
  }

  function submitManual() {
    if (!manualEntry) return;
    addStay(manualEntry, manualExit || manualEntry);
    setManualEntry("");
    setManualExit("");
    setShowManual(false);
  }

  const result = useMemo(() => {
    const mapped: TourismTrip[] = trips
      .filter((t) => t.entry)
      .map((t) => ({
        entry: t.entry,
        exit: t.open ? null : t.exit || null,
        stampDays: effectiveStampDays(t),
        countsTowardQuota: countsTowardTourismQuota(t.stampKind),
        extended: t.stampKind === "tourism90" ? t.extended : undefined,
      }));
    if (!mapped.length) return null;
    return computeLastLegalDay(mapped, { locale });
  }, [locale, trips]);

  const taxYears = useMemo(() => {
    const mapped: TourismTrip[] = trips
      .filter((t) => t.entry)
      .map((t) => ({
        entry: t.entry,
        exit: t.open ? null : t.exit || null,
      }));
    if (!mapped.length) return [];
    return computeTaxResidency(mapped);
  }, [trips]);

  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <h1 className="marketing-title">{copy.title}</h1>
        <p className="marketing-body">{copy.body}</p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-6">
          <StayRangeCalendar
            locale={locale}
            trips={trips}
            selectedId={selectedId}
            onSelectTrip={setSelectedId}
            onPaintRange={paintRange}
            hint={copy.hint}
          />
          {notice ? (
            <p className="rounded-xl border border-border bg-muted/60 px-4 py-3 text-sm text-foreground">
              {notice}
            </p>
          ) : null}

          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                {copy.trips}
              </h2>
              <button
                type="button"
                className="font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
                onClick={() => setShowManual((v) => !v)}
              >
                {copy.manual}
              </button>
            </div>
            {showManual ? (
              <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <label className="block text-sm">
                  <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {copy.entry}
                  </span>
                  <input
                    type="date"
                    value={manualEntry}
                    onChange={(e) => setManualEntry(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {copy.exit}
                  </span>
                  <input
                    type="date"
                    value={manualExit}
                    onChange={(e) => setManualExit(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                  />
                </label>
                <button type="button" className="btn-secondary" onClick={submitManual} disabled={!manualEntry}>
                  {copy.manualAdd}
                </button>
              </div>
            ) : null}
            {trips.length === 0 ? (
              <p className="text-sm text-muted-foreground">{copy.empty}</p>
            ) : (
              <ul className="space-y-3">
                {trips.map((trip) => {
                  const start = parseIsoDate(trip.entry);
                  const end = trip.open
                    ? parseIsoDate(todayIso())
                    : parseIsoDate(trip.exit || trip.entry);
                  const days = start && end ? inclusiveDays(start, end) : 0;
                  const selected = trip.id === selectedId;
                  return (
                    <li
                      key={trip.id}
                      className={`rounded-2xl border bg-card p-4 transition ${
                        selected
                          ? "border-[var(--moss)] shadow-[0_8px_28px_-18px_rgb(0_0_0/0.4)]"
                          : "border-border"
                      }`}
                    >
                      <button
                        type="button"
                        className="flex w-full items-start gap-3 text-left"
                        onClick={() => setSelectedId(trip.id)}
                      >
                        <span
                          className="mt-1 size-3 shrink-0 rounded-full"
                          style={{ background: STAMP_TONE[trip.stampKind] }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-foreground">
                            {trip.entry ? formatShort(trip.entry, locale) : "—"}
                            {" → "}
                            {trip.open
                              ? copy.open
                              : trip.exit
                                ? formatShort(trip.exit, locale)
                                : "—"}
                          </span>
                          <span className="mt-0.5 block text-sm text-muted-foreground">
                            {days} {copy.nights} · {stampLabel(trip.stampKind, locale)}
                          </span>
                        </span>
                      </button>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <label className="block text-sm">
                          <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            {copy.entry}
                          </span>
                          <input
                            type="date"
                            value={trip.entry}
                            onChange={(e) => patchTrip(trip.id, { entry: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
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
                            onChange={(e) => patchTrip(trip.id, { exit: e.target.value, open: false })}
                            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground disabled:opacity-50"
                          />
                        </label>
                      </div>

                      <div className="mt-4">
                        <p className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          {copy.stamp}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {STAMP_KINDS.map((kind) => (
                            <button
                              key={kind}
                              type="button"
                              onClick={() =>
                                patchTrip(trip.id, {
                                  stampKind: kind,
                                  stampDays: String(defaultStampDays(kind)),
                                  extended: kind === "tourism90" ? trip.extended : null,
                                })
                              }
                              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                trip.stampKind === kind
                                  ? kind === "visa"
                                    ? "text-[var(--parchment)]"
                                    : "text-[var(--ink)]"
                                  : "border border-border bg-background text-foreground hover:bg-muted"
                              }`}
                              style={
                                trip.stampKind === kind
                                  ? { background: STAMP_TONE[kind] }
                                  : undefined
                              }
                            >
                              {stampLabel(kind, locale)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {trip.stampKind === "tourism90" && days > 90 ? (
                        <div className="mt-4 rounded-xl bg-muted/70 px-3 py-3">
                          <p className="text-sm text-foreground">{copy.extensionAsk}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                patchTrip(trip.id, {
                                  extended: true,
                                  stampDays: String(TOURISM_EXTENDED_STAMP_DAYS),
                                })
                              }
                              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                trip.extended === true
                                  ? "bg-[var(--forest)] text-[var(--parchment)]"
                                  : "border border-border bg-background text-foreground"
                              }`}
                            >
                              {copy.extensionYes}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                patchTrip(trip.id, {
                                  extended: false,
                                  stampDays: String(DEFAULT_TOURISM_STAMP_DAYS),
                                })
                              }
                              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                trip.extended === false
                                  ? "bg-[var(--forest)] text-[var(--parchment)]"
                                  : "border border-border bg-background text-foreground"
                              }`}
                            >
                              {copy.extensionNo}
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {trip.stampKind === "tourism90" ? (
                        <label className="mt-3 block text-sm">
                          <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                            {copy.days}
                          </span>
                          <input
                            type="number"
                            min={1}
                            max={180}
                            value={trip.stampDays}
                            onChange={(e) => patchTrip(trip.id, { stampDays: e.target.value })}
                            className="mt-1 w-full max-w-[10rem] rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
                          />
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                            {copy.daysHint}
                          </span>
                        </label>
                      ) : (
                        <p className="mt-3 text-sm text-muted-foreground">
                          {locale === "es"
                            ? "La visa no consume la cuota teórica de 180 días de turismo."
                            : "Visa time does not consume the theoretical 180-day tourism quota."}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-sm text-foreground">
                          <input
                            type="checkbox"
                            checked={trip.open}
                            onChange={(e) =>
                              patchTrip(trip.id, {
                                open: e.target.checked,
                                exit: e.target.checked ? "" : trip.exit,
                              })
                            }
                            className="size-4 accent-[var(--moss)]"
                          />
                          {copy.open}
                        </label>
                        <button
                          type="button"
                          className="font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setTrips((current) => current.filter((t) => t.id !== trip.id));
                            if (selectedId === trip.id) setSelectedId(null);
                          }}
                        >
                          {copy.remove}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="lg:sticky lg:top-16">
          <div className="rounded-2xl border border-border bg-background p-5 sm:p-6">
            <h2 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
              {copy.result}
            </h2>
            {!result ? (
              <p className="mt-3 text-sm text-muted-foreground">{copy.needEntry}</p>
            ) : (
              <div className="mt-4 space-y-4">
                {result.lastLegalDay ? (
                  <p className="text-lg font-semibold text-foreground">
                    {copy.lastLegal}:{" "}
                    <span className="font-[family-name:var(--font-ui)]">
                      {formatShort(result.lastLegalDay, locale)}
                    </span>
                  </p>
                ) : null}
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  {result.stampLastDay ? (
                    <div>
                      <dt className="text-muted-foreground">{copy.stampLast}</dt>
                      <dd className="font-medium text-foreground">
                        {formatShort(result.stampLastDay, locale)}
                      </dd>
                    </div>
                  ) : null}
                  {result.quotaLastDay ? (
                    <div>
                      <dt className="text-muted-foreground">{copy.quotaLast}</dt>
                      <dd className="font-medium text-foreground">
                        {formatShort(result.quotaLastDay, locale)}
                      </dd>
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

          <div className="mt-4 rounded-2xl border border-border bg-background p-5 sm:p-6">
            <h2 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
              {copy.taxTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.taxBody}</p>
            {taxYears.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">{copy.taxEmpty}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {taxYears.map((row) => (
                  <li key={row.year} className="rounded-xl border border-border px-3 py-3">
                    <p className="font-medium text-foreground">{row.year}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {row.daysInColombia} {copy.taxDays}
                    </p>
                    <p
                      className={`mt-1 text-sm font-medium ${
                        row.meetsPresenceTest ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {row.meetsPresenceTest ? copy.taxYes : copy.taxNo}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.taxDisclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
