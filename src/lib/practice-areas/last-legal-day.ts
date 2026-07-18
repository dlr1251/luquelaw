/** Pure Last Legal Day / tourism-quota helpers (Colombia 180-day calendar-year rule). */

export type TourismTrip = {
  /** ISO date YYYY-MM-DD */
  entry: string;
  /** ISO date YYYY-MM-DD; omit or empty if still in country */
  exit?: string | null;
  /** Days granted on the entry stamp (default 90). */
  stampDays?: number;
};

export type YearQuotaBreakdown = {
  year: number;
  daysUsed: number;
  daysRemaining: number;
};

export type LastLegalDayResult = {
  quotaByYear: YearQuotaBreakdown[];
  /** Inclusive days from entry through exit (or through asOf if still inside). */
  currentStayDays: number | null;
  /** Last day covered by the current stamp (entry + stampDays - 1). */
  stampLastDay: string | null;
  /** Last day still within remaining calendar-year quota from current entry. */
  quotaLastDay: string | null;
  /** Effective last legal day = earlier of stampLastDay and quotaLastDay (when both exist). */
  lastLegalDay: string | null;
  warnings: string[];
  stillInside: boolean;
};

const MS_PER_DAY = 86_400_000;
export const TOURISM_ANNUAL_QUOTA = 180;
export const DEFAULT_TOURISM_STAMP_DAYS = 90;

export function parseIsoDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    return null;
  }
  return dt;
}

export function formatIsoDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Inclusive day count between two UTC calendar dates. */
export function inclusiveDays(start: Date, end: Date): number {
  const a = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const b = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  if (b < a) return 0;
  return Math.floor((b - a) / MS_PER_DAY) + 1;
}

export function addDays(iso: string, days: number): string | null {
  const d = parseIsoDate(iso);
  if (!d) return null;
  d.setUTCDate(d.getUTCDate() + days);
  return formatIsoDate(d);
}

/** Distribute inclusive stay days across calendar years. */
export function daysByCalendarYear(entry: Date, exit: Date): Map<number, number> {
  const map = new Map<number, number>();
  let cursor = new Date(Date.UTC(entry.getUTCFullYear(), entry.getUTCMonth(), entry.getUTCDate()));
  const end = new Date(Date.UTC(exit.getUTCFullYear(), exit.getUTCMonth(), exit.getUTCDate()));

  while (cursor.getTime() <= end.getTime()) {
    const year = cursor.getUTCFullYear();
    const yearEnd = new Date(Date.UTC(year, 11, 31));
    const segmentEnd = yearEnd.getTime() < end.getTime() ? yearEnd : end;
    const days = inclusiveDays(cursor, segmentEnd);
    map.set(year, (map.get(year) ?? 0) + days);
    cursor = new Date(segmentEnd.getTime() + MS_PER_DAY);
  }
  return map;
}

function priorQuotaUsedInYear(
  trips: TourismTrip[],
  year: number,
  excludeOpen: boolean,
): number {
  let total = 0;
  for (const trip of trips) {
    const entry = parseIsoDate(trip.entry);
    if (!entry) continue;
    const exitIso = trip.exit?.trim();
    if (!exitIso) {
      if (excludeOpen) continue;
      continue;
    }
    const exit = parseIsoDate(exitIso);
    if (!exit) continue;
    total += daysByCalendarYear(entry, exit).get(year) ?? 0;
  }
  return total;
}

export function computeLastLegalDay(
  trips: TourismTrip[],
  options?: { asOf?: string; locale?: "en" | "es" },
): LastLegalDayResult {
  const locale = options?.locale ?? "en";
  const asOfIso = options?.asOf ?? formatIsoDate(new Date());
  const asOf = parseIsoDate(asOfIso) ?? new Date();
  const warnings: string[] = [];
  const yearTotals = new Map<number, number>();

  const sorted = [...trips].filter((t) => t.entry).sort((a, b) => a.entry.localeCompare(b.entry));

  let stillInside = false;
  let currentStayDays: number | null = null;
  let stampLastDay: string | null = null;
  let quotaLastDay: string | null = null;
  let currentEntry: Date | null = null;
  let currentStampDays = DEFAULT_TOURISM_STAMP_DAYS;

  for (const trip of sorted) {
    const entry = parseIsoDate(trip.entry);
    if (!entry) {
      warnings.push(
        locale === "es"
          ? `Fecha de entrada inválida: ${trip.entry}`
          : `Invalid entry date: ${trip.entry}`,
      );
      continue;
    }

    const exitIso = trip.exit?.trim() || null;
    let exit: Date;
    if (!exitIso) {
      stillInside = true;
      exit = asOf;
      currentEntry = entry;
      currentStampDays =
        trip.stampDays && trip.stampDays > 0 ? trip.stampDays : DEFAULT_TOURISM_STAMP_DAYS;
    } else {
      const parsedExit = parseIsoDate(exitIso);
      if (!parsedExit) {
        warnings.push(
          locale === "es"
            ? `Fecha de salida inválida: ${exitIso}`
            : `Invalid exit date: ${exitIso}`,
        );
        continue;
      }
      if (parsedExit.getTime() < entry.getTime()) {
        warnings.push(
          locale === "es"
            ? `La salida ${exitIso} es anterior a la entrada ${trip.entry}.`
            : `Exit ${exitIso} is before entry ${trip.entry}.`,
        );
        continue;
      }
      exit = parsedExit;
    }

    for (const [year, days] of daysByCalendarYear(entry, exit)) {
      yearTotals.set(year, (yearTotals.get(year) ?? 0) + days);
    }
  }

  if (stillInside && currentEntry) {
    const entryIso = formatIsoDate(currentEntry);
    currentStayDays = inclusiveDays(currentEntry, asOf);
    stampLastDay = addDays(entryIso, currentStampDays - 1);

    const year = currentEntry.getUTCFullYear();
    const priorUsed = priorQuotaUsedInYear(sorted, year, true);
    const remainingAtEntry = Math.max(0, TOURISM_ANNUAL_QUOTA - priorUsed);
    const allowedFromEntry = Math.max(1, Math.min(currentStampDays, remainingAtEntry));
    quotaLastDay = addDays(entryIso, allowedFromEntry - 1);

    if (priorUsed >= TOURISM_ANNUAL_QUOTA) {
      warnings.push(
        locale === "es"
          ? "La cuota de 180 días del año de ingreso ya estaba agotada antes de esta entrada."
          : "The 180-day quota for the entry year was already exhausted before this entry.",
      );
    }

    if (asOf.getUTCFullYear() > currentEntry.getUTCFullYear()) {
      warnings.push(
        locale === "es"
          ? "Sigues dentro en un año nuevo: la cuota no se reinicia automáticamente sin salir y volver a entrar."
          : "You are still inside across a new year: the quota does not auto-reset without exiting and re-entering.",
      );
    }
  }

  const quotaByYear: YearQuotaBreakdown[] = [...yearTotals.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, daysUsed]) => ({
      year,
      daysUsed,
      daysRemaining: Math.max(0, TOURISM_ANNUAL_QUOTA - daysUsed),
    }));

  for (const row of quotaByYear) {
    if (row.daysUsed > TOURISM_ANNUAL_QUOTA) {
      warnings.push(
        locale === "es"
          ? `El año ${row.year} excede la cuota de 180 días (${row.daysUsed} días contados).`
          : `Year ${row.year} exceeds the 180-day quota (${row.daysUsed} days counted).`,
      );
    } else if (row.daysRemaining <= 14 && row.daysRemaining > 0) {
      warnings.push(
        locale === "es"
          ? `Quedan solo ${row.daysRemaining} días de cuota en ${row.year}.`
          : `Only ${row.daysRemaining} quota days left in ${row.year}.`,
      );
    }
  }

  let lastLegalDay: string | null = null;
  if (stampLastDay && quotaLastDay) {
    lastLegalDay = stampLastDay <= quotaLastDay ? stampLastDay : quotaLastDay;
  } else {
    lastLegalDay = stampLastDay ?? quotaLastDay;
  }

  if (stillInside && lastLegalDay && lastLegalDay < asOfIso) {
    warnings.push(
      locale === "es"
        ? "Según esta estimación, tu último día legal ya pasó — revisa regulación de inmediato."
        : "Per this estimate, your last legal day has already passed — review regularization immediately.",
    );
  } else if (stillInside && lastLegalDay) {
    const last = parseIsoDate(lastLegalDay);
    if (last) {
      const daysLeft = inclusiveDays(asOf, last) - 1;
      if (daysLeft >= 0 && daysLeft <= 14) {
        warnings.push(
          locale === "es"
            ? `Estás a ${daysLeft} día(s) del último día legal estimado.`
            : `You are ${daysLeft} day(s) from the estimated last legal day.`,
        );
      }
    }
  }

  return {
    quotaByYear,
    currentStayDays,
    stampLastDay,
    quotaLastDay,
    lastLegalDay,
    warnings,
    stillInside,
  };
}
