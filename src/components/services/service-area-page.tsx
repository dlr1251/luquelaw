"use client";

import Link from "next/link";

import { useBookingModal } from "@/components/booking/BookingProvider";
import { ClkrArticleCard } from "@/components/clkr/clkr-article-card";
import { Container } from "@/components/container";
import { RegisteredServiceSection } from "@/components/services/registered-service-section";
import type { ClkrArticle, ClkrCategory } from "@/lib/clkr/articles";
import type { LibraryPrompt } from "@/lib/agents/get-agents";
import { clkrGuidesHubPath, clkrLibraryPath } from "@/lib/clkr/types";
import {
  getServiceArea,
  getServiceAreaClkrCopy,
  servicesHubContent,
  type ServiceAreaId,
  type ServiceAreaWithClkr,
  type ServicesLocale,
} from "@/lib/services/content";
import { getRegisteredService } from "@/lib/services/registered-services";

const clkrCategoryLabels: Record<ServicesLocale, Record<ClkrCategory, string>> = {
  en: {
    Immigration: "Immigration",
    "Real Estate": "Real Estate",
    Corporate: "Corporate",
    Labor: "Labor",
    Civil: "Civil",
    Family: "Family",
    Tax: "Tax",
    Digital: "Digital",
    Administrative: "Administrative",
    IP: "IP",
    Criminal: "Criminal",
    International: "International",
  },
  es: {
    Immigration: "Inmigración",
    "Real Estate": "Inmobiliario",
    Corporate: "Corporativo",
    Labor: "Laboral",
    Civil: "Civil",
    Family: "Familia",
    Tax: "Tributario",
    Digital: "Digital",
    Administrative: "Administrativo",
    IP: "Propiedad intelectual",
    Criminal: "Penal",
    International: "Internacional",
  },
};

type Props = {
  locale: ServicesLocale;
  areaId: Exclude<ServiceAreaId, "immigration">;
  relatedArticles?: ClkrArticle[];
  relatedPrompts?: LibraryPrompt[];
};

function isClkrServiceArea(areaId: ServiceAreaId): areaId is ServiceAreaWithClkr {
  return areaId !== "immigration" && areaId !== "real-estate";
}

export function ServiceAreaPage({
  locale,
  areaId,
  relatedArticles = [],
  relatedPrompts = [],
}: Props) {
  const area = getServiceArea(areaId, locale);
  const hub = servicesHubContent[locale];
  const registered = getRegisteredService(areaId, locale);
  const { open: openBooking } = useBookingModal();
  const clkrCopy = isClkrServiceArea(areaId) ? getServiceAreaClkrCopy(areaId, locale) : null;
  const categoryLabels = clkrCategoryLabels[locale];
  const guidesHubHref = clkrGuidesHubPath(locale);
  const libraryHref = clkrLibraryPath(locale);

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
        </Container>
      </section>

      {clkrCopy && relatedArticles.length > 0 ? (
        <section className="border-b border-border bg-surface">
          <Container className="marketing-section">
            <div className="max-w-2xl space-y-3">
              <p className="marketing-eyebrow">{clkrCopy.eyebrow}</p>
              <h2 className="marketing-title">{clkrCopy.title}</h2>
              <p className="marketing-body">{clkrCopy.body}</p>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((article) => (
                <li key={article.slug}>
                  <ClkrArticleCard
                    article={article}
                    readLabel={clkrCopy.readLabel}
                    categoryLabel={categoryLabels[article.category]}
                  />
                </li>
              ))}
            </ul>

            <p className="mt-8">
              <Link
                href={guidesHubHref}
                className="text-sm font-semibold text-[color:var(--forest)] hover:underline"
              >
                {clkrCopy.browseAll} →
              </Link>
            </p>
          </Container>
        </section>
      ) : null}

      {clkrCopy && relatedPrompts.length > 0 ? (
        <section className="border-b border-border bg-background">
          <Container className="marketing-section">
            <div className="max-w-2xl space-y-3">
              <p className="marketing-eyebrow">
                {locale === "es" ? "Biblioteca LegalAI" : "LegalAI library"}
              </p>
              <h2 className="marketing-title">
                {locale === "es" ? "Prompts relacionados" : "Related prompts"}
              </h2>
              <p className="marketing-body">
                {locale === "es"
                  ? "Copia prompts listos para tareas concretas de esta área."
                  : "Copy-ready prompts for concrete tasks in this practice area."}
              </p>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPrompts.map((prompt) => (
                <li key={prompt.slug}>
                  <Link
                    href={prompt.slug}
                    className="flex h-full flex-col border border-border bg-card p-5 transition hover:border-foreground/25"
                  >
                    <h3 className="font-[family-name:var(--font-ui)] text-[0.9375rem] font-semibold text-foreground">
                      {prompt.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{prompt.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <Link
                href={libraryHref}
                className="text-sm font-semibold text-[color:var(--forest)] hover:underline"
              >
                {locale === "es" ? "Ver biblioteca completa" : "Open full library"} →
              </Link>
            </p>
          </Container>
        </section>
      ) : null}

      {registered ? <RegisteredServiceSection service={registered} /> : null}

      <section className="border-b border-border bg-background">
        <Container className="py-10 sm:py-12">
          <button
            type="button"
            onClick={openBooking}
            className="btn-primary btn-primary-lg"
          >
            {hub.bookCta}
          </button>
        </Container>
      </section>
    </main>
  );
}
