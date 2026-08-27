import Link from "next/link";

import { Container } from "@/components/container";
import { EngagementModel } from "@/components/engagement/EngagementModel";
import { ImmigrationHubShell } from "@/components/practice-areas/immigration-hub-shell";
import {
  immigrationContent,
  type ImmigrationLocale,
} from "@/lib/practice-areas/immigration";

type Props = {
  locale: ImmigrationLocale;
};

export function ImmigrationPage({ locale }: Props) {
  const c = immigrationContent[locale];

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
                <Link
                  href={c.bookHref}
                  className="inline-flex min-h-11 items-center justify-center border border-hero-accent bg-hero-accent px-6 font-[family-name:var(--font-ui)] text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-hero transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-accent/50"
                >
                  {c.bookCta}
                </Link>
                <Link
                  href={c.visasHref}
                  className="inline-flex min-h-11 items-center justify-center border border-hero-foreground/70 bg-transparent px-6 font-[family-name:var(--font-ui)] text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-hero-foreground transition hover:bg-hero-foreground/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-foreground/40"
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
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.detail}
                  </p>
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
                ctaLabel={c.bookCta}
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

        <section className="bg-surface">
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
      </main>
    </ImmigrationHubShell>
  );
}
