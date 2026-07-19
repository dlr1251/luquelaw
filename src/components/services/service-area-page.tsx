"use client";

import Link from "next/link";

import { useBookingModal } from "@/components/booking/BookingProvider";
import { Container } from "@/components/container";
import {
  getServiceArea,
  servicesHubContent,
  type ServiceAreaId,
  type ServicesLocale,
} from "@/lib/services/content";

type Props = {
  locale: ServicesLocale;
  areaId: Exclude<ServiceAreaId, "immigration">;
};

export function ServiceAreaPage({ locale, areaId }: Props) {
  const area = getServiceArea(areaId, locale);
  const hub = servicesHubContent[locale];
  const { open: openBooking } = useBookingModal();

  if (!area) return null;

  const servicesHref = locale === "es" ? "/es/servicios" : "/services";
  const servicesLabel = locale === "es" ? "Todos los servicios" : "All services";

  return (
    <main>
      <section className="bg-hero text-hero-foreground">
        <Container className="marketing-section">
          <div className="max-w-3xl space-y-6">
            <p className="marketing-eyebrow marketing-eyebrow-on-hero">{hub.eyebrow}</p>
            <h1 className="marketing-display text-hero-foreground">{area.title}</h1>
            <p className="marketing-lead max-w-2xl italic text-hero-muted">{area.intro}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openBooking}
                className="btn-primary-inverted btn-primary-lg"
              >
                {hub.bookCta}
              </button>
              <Link
                href={servicesHref}
                className="btn-secondary btn-secondary-lg border-hero-foreground/35 !text-white hover:bg-hero-foreground/10"
              >
                {servicesLabel}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background">
        <Container className="marketing-section">
          <div className="max-w-2xl space-y-3">
            <p className="marketing-eyebrow">
              {locale === "es" ? "Qué cubrimos" : "What we cover"}
            </p>
            <h2 className="marketing-title">
              {locale === "es" ? "Servicios principales" : "Core services"}
            </h2>
            <p className="marketing-body">{area.blurb}</p>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {area.services.map((item) => (
              <li
                key={item}
                className="border border-border bg-surface/60 px-5 py-4 text-sm leading-relaxed text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-border pt-10">
            <button
              type="button"
              onClick={openBooking}
              className="btn-primary btn-primary-lg"
            >
              {hub.bookCta}
            </button>
          </div>
        </Container>
      </section>
    </main>
  );
}
