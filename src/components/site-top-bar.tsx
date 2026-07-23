"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useBookingModal } from "@/components/booking/BookingProvider";
import { Container } from "@/components/container";
import { localeFromPathname } from "@/lib/locale/paths";
import { formatCopRate, type FxRates } from "@/lib/markets/fx";

const TZ = "America/Bogota";
const FX_REFRESH_MS = 60 * 60 * 1000;

type Props = {
  rates: FxRates;
};

/** Node and browsers disagree on narrow/NBSP in es-CO time strings (a. m. vs a.\u00a0m.). */
function normalizeIntlText(value: string) {
  return value.replace(/[\u00a0\u202f\u2007\u2009]/g, " ");
}

function formatBogotaClock(now: Date, locale: "en" | "es") {
  const date = normalizeIntlText(
    new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
      timeZone: TZ,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(now),
  );

  const time = normalizeIntlText(
    new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
      timeZone: TZ,
      hour: "numeric",
      minute: "2-digit",
    }).format(now),
  );

  return { date, time };
}

function formatUpdatedAt(updatedAt: string | null, locale: "en" | "es"): string | undefined {
  if (!updatedAt) return undefined;
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) {
    return locale === "es" ? `Actualizado ${updatedAt}` : `Updated ${updatedAt}`;
  }
  const formatted = normalizeIntlText(
    new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
      timeZone: TZ,
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date),
  );
  return locale === "es" ? `Actualizado ${formatted}` : `Updated ${formatted}`;
}

export function SiteTopBar({ rates: initialRates }: Props) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname) === "es" ? "es" : "en";
  const { open: openBooking } = useBookingModal();
  // Render clock only after mount so SSR/client ICU + wall-clock can't mismatch.
  const [clock, setClock] = useState<{ date: string; time: string } | null>(null);
  const [rates, setRates] = useState(initialRates);

  useEffect(() => {
    setRates(initialRates);
  }, [initialRates]);

  useEffect(() => {
    const tick = () => setClock(formatBogotaClock(new Date(), locale));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [locale]);
  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      try {
        const res = await fetch("/api/fx", { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as FxRates;
        if (!cancelled && next.usdCop && next.eurCop) setRates(next);
      } catch {
        // Keep last good snapshot.
      }
    };

    const id = window.setInterval(refresh, FX_REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const copy =
    locale === "es"
      ? {
          cta: "Agendar consulta",
          medellin: "Medellín",
          usd: "USD/COP",
          eur: "EUR/COP",
        }
      : {
          cta: "Book consultation",
          medellin: "Medellín",
          usd: "USD/COP",
          eur: "EUR/COP",
        };

  const usd = formatCopRate(rates.usdCop, locale);
  const eur = formatCopRate(rates.eurCop, locale);

  const ratesInline = (
    <>
      <span className="text-hero-foreground/50">{copy.usd}</span>{" "}
      <span className="tabular-nums text-hero-foreground">{usd}</span>
      <span className="mx-2.5 text-hero-foreground/35">·</span>
      <span className="text-hero-foreground/50">{copy.eur}</span>{" "}
      <span className="tabular-nums text-hero-foreground">{eur}</span>
    </>
  );

  return (
    <div className="border-b border-hero-foreground/10 bg-hero text-hero-foreground">
      <Container className="flex min-h-9 items-center justify-between gap-3 py-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden sm:gap-5">
          <p className="hidden shrink-0 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.12em] text-hero-foreground/75 sm:block">
            <span>{copy.medellin}</span>
            {clock ? (
              <>
                <span> · </span>
                <span className="normal-case tracking-normal text-hero-foreground/90">
                  {clock.date}
                </span>
                <span className="mx-1.5 text-hero-foreground/35" aria-hidden="true">
                  ·
                </span>
                <span className="tabular-nums text-hero-foreground">{clock.time}</span>
              </>
            ) : null}
          </p>

          <p className="shrink-0 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium tabular-nums text-hero-foreground sm:hidden">
            {clock?.time ?? "\u00a0"}
          </p>

          <span className="hidden h-3 w-px shrink-0 bg-hero-foreground/20 sm:block" aria-hidden="true" />

          <div
            className="min-w-0 flex-1 overflow-hidden font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.1em] text-hero-foreground/70 sm:flex-none"
            title={formatUpdatedAt(rates.updatedAt, locale)}
          >
            <div className="fx-marquee sm:hidden" aria-hidden="true">
              <div className="fx-marquee-track">
                <span className="fx-marquee-item">{ratesInline}</span>
                <span className="fx-marquee-item">{ratesInline}</span>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <p>
                <span className="text-hero-foreground/50">{copy.usd}</span>{" "}
                <span className="tabular-nums text-hero-foreground">{usd}</span>
              </p>
              <p>
                <span className="text-hero-foreground/50">{copy.eur}</span>{" "}
                <span className="tabular-nums text-hero-foreground">{eur}</span>
              </p>
            </div>

            <p className="sr-only">
              {copy.usd} {usd}, {copy.eur} {eur}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openBooking}
          className="shrink-0 whitespace-nowrap border border-hero-foreground/35 bg-transparent px-3 py-1.5 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.1em] text-hero-foreground transition hover:bg-hero-foreground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-foreground/50"
        >
          {copy.cta}
        </button>
      </Container>
    </div>
  );
}
