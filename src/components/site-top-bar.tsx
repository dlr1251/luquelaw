"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useBookingModal } from "@/components/booking/BookingProvider";
import { Container } from "@/components/container";
import { localeFromPathname } from "@/lib/locale/paths";
import { formatCopRate, type FxRates } from "@/lib/markets/fx";

const TZ = "America/Bogota";

type Props = {
  rates: FxRates;
};

function formatBogotaClock(now: Date, locale: "en" | "es") {
  const date = new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    timeZone: TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(now);

  const time = new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(now);

  return { date, time };
}

export function SiteTopBar({ rates }: Props) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname) === "es" ? "es" : "en";
  const { open: openBooking } = useBookingModal();
  const [clock, setClock] = useState(() => formatBogotaClock(new Date(), locale));

  useEffect(() => {
    const tick = () => setClock(formatBogotaClock(new Date(), locale));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [locale]);

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

  return (
    <div className="border-b border-hero-foreground/10 bg-hero text-hero-foreground">
      <Container className="flex min-h-9 items-center justify-between gap-3 py-1.5">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden sm:gap-5">
          <p className="hidden shrink-0 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.12em] text-hero-foreground/75 sm:block">
            <span>{copy.medellin} · </span>
            <span className="normal-case tracking-normal text-hero-foreground/90">
              {clock.date}
            </span>
            <span className="mx-1.5 text-hero-foreground/35" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums text-hero-foreground">{clock.time}</span>
          </p>

          <p className="shrink-0 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium tabular-nums text-hero-foreground sm:hidden">
            {clock.time}
          </p>

          <span className="hidden h-3 w-px shrink-0 bg-hero-foreground/20 sm:block" aria-hidden="true" />

          <div
            className="flex min-w-0 items-center gap-2.5 overflow-hidden font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.1em] text-hero-foreground/70 sm:gap-3"
            title={
              rates.updatedAt
                ? locale === "es"
                  ? `Actualizado ${rates.updatedAt}`
                  : `Updated ${rates.updatedAt}`
                : undefined
            }
          >
            <p className="truncate">
              <span className="text-hero-foreground/50">{copy.usd}</span>{" "}
              <span className="tabular-nums text-hero-foreground">{usd}</span>
            </p>
            <p className="truncate">
              <span className="text-hero-foreground/50">{copy.eur}</span>{" "}
              <span className="tabular-nums text-hero-foreground">{eur}</span>
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
