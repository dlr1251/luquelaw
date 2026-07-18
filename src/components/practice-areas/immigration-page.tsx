import Link from "next/link";

import { BookingCalendarEmbed } from "@/components/booking/booking-calendar-embed";
import { Container } from "@/components/container";
import { EngagementModel } from "@/components/engagement/EngagementModel";
import { ImmigrationHubShell } from "@/components/practice-areas/immigration-hub-shell";
import { loginHref } from "@/lib/auth/safe-next";
import {
  immigrationContent,
  type ImmigrationLocale,
} from "@/lib/practice-areas/immigration";

type Props = {
  locale: ImmigrationLocale;
  signedIn?: boolean;
};

export function ImmigrationPage({ locale, signedIn = false }: Props) {
  const c = immigrationContent[locale];
  const lucyHref = signedIn ? c.lucyHref : loginHref(c.lucyHref);

  return (
    <ImmigrationHubShell locale={locale}>
      <main>
        <section className="bg-hero text-hero-foreground">
          <Container className="marketing-section">
            <div className="max-w-3xl space-y-6">
              <p className="marketing-eyebrow marketing-eyebrow-on-hero">{c.eyebrow}</p>
              <h1 className="marketing-display text-hero-foreground">{c.title}</h1>
              <p className="marketing-lead max-w-2xl italic text-hero-muted">{c.intro}</p>
              <div className="flex flex-wrap gap-3">
                <Link href={c.bookHref} className="btn-primary-inverted btn-primary-lg">
                  {c.bookCta}
                </Link>
                <Link
                  href={lucyHref}
                  className="btn-secondary btn-secondary-lg border-hero-foreground/35 !text-white hover:bg-hero-foreground/10"
                >
                  {c.lucyCta}
                </Link>
                <Link
                  href={c.visasHref}
                  className="btn-secondary btn-secondary-lg border-hero-foreground/35 !text-white hover:bg-hero-foreground/10"
                >
                  {c.visasCta}
                </Link>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-hero-muted/80">{c.disclaimer}</p>
            </div>
          </Container>
        </section>

        <section className="border-b border-border bg-background">
          <Container className="marketing-section">
            <div className="max-w-2xl space-y-3">
              <p className="marketing-eyebrow">{c.servicesLabel}</p>
              <h2 className="marketing-title">{c.servicesTitle}</h2>
              <p className="marketing-body">{c.servicesBody}</p>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {c.services.map((service) => (
                <li
                  key={service.id}
                  className="flex h-full flex-col border border-border bg-surface/60 p-5 sm:p-6"
                >
                  <p className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {service.group} · {service.tier}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-ui)] text-[0.9375rem] font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.detail}
                  </p>
                  <Link href={c.bookHref} className="btn-primary mt-6 w-full sm:w-auto">
                    {c.serviceCta}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="border-b border-border bg-surface">
          <Container className="marketing-section">
            <div className="max-w-2xl space-y-3">
              <p className="marketing-eyebrow">{c.processLabel}</p>
              <h2 className="marketing-title">{c.processTitle}</h2>
              <p className="marketing-body">{c.processBody}</p>
            </div>
            <div className="mt-10 max-w-2xl">
              <EngagementModel
                label={c.processLabel}
                steps={c.processSteps}
                footer={c.processFooter}
              />
            </div>
          </Container>
        </section>

        <section id="guides" className="scroll-mt-28 border-b border-border bg-background">
          <Container className="marketing-section">
            <div className="max-w-2xl space-y-3">
              <p className="marketing-eyebrow">{c.guidesLabel}</p>
              <h2 className="marketing-title">{c.guidesTitle}</h2>
              <p className="marketing-body">{c.guidesBody}</p>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.featuredArticles.map((article) => (
                <li key={article.slugKey}>
                  <Link
                    href={article.href}
                    className="flex h-full flex-col border border-border bg-card p-5 transition-colors hover:border-foreground/25 sm:p-6"
                  >
                    <h3 className="font-[family-name:var(--font-ui)] text-[0.9375rem] font-semibold text-foreground">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {article.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="border-b border-border bg-surface">
          <Container className="marketing-section">
            <div className="max-w-2xl space-y-3">
              <p className="marketing-eyebrow">{c.hubLabel}</p>
              <h2 className="marketing-title">{c.hubTitle}</h2>
              <p className="marketing-body">{c.hubBody}</p>
            </div>

            <ul className="mt-10 grid gap-8 sm:grid-cols-2">
              {c.hubCards.map((card) => (
                <li key={card.id}>
                  <h3 className="font-[family-name:var(--font-ui)] text-[0.875rem] font-semibold uppercase tracking-[0.06em] text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {card.body}
                  </p>
                  <Link
                    href={card.href}
                    className="mt-4 inline-flex font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-foreground underline-offset-4 hover:underline"
                  >
                    {card.cta}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section id="book" className="scroll-mt-28 bg-background">
          <Container className="py-10 sm:py-12 lg:py-14">
            <div className="mx-auto max-w-4xl space-y-5">
              <p className="marketing-eyebrow">{c.bookingLabel}</p>
              <h2 className="marketing-title">{c.bookingTitle}</h2>
              <p className="marketing-body max-w-2xl">{c.bookingBody}</p>
              <BookingCalendarEmbed title={c.bookingTitle} locale={locale} />
            </div>
          </Container>
        </section>
      </main>
    </ImmigrationHubShell>
  );
}
