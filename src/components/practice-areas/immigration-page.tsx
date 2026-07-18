import Link from "next/link";

import { Container } from "@/components/container";
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
    <main className="flex-1">
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
                href={c.guidesHref}
                className="btn-secondary btn-secondary-lg border-hero-foreground/35 !text-white hover:bg-hero-foreground/10"
              >
                {c.guidesCta}
              </Link>
            </div>
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

      <section id="guides" className="scroll-mt-28 border-b border-border bg-surface">
        <Container className="marketing-section">
          <div className="max-w-2xl space-y-3">
            <p className="marketing-eyebrow">{c.guidesLabel}</p>
            <h2 className="marketing-title">{c.guidesTitle}</h2>
            <p className="marketing-body">{c.guidesBody}</p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
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

      <section className="border-b border-border bg-background">
        <Container className="marketing-section">
          <p className="marketing-eyebrow">{c.toolsLabel}</p>
          <div className="mt-6 border border-dashed border-border bg-surface/40 px-5 py-10 sm:px-8 sm:py-14">
            <h2 className="marketing-title text-[1.35rem] sm:text-[1.5rem]">
              {c.calculatorPlaceholder.title}
            </h2>
            <p className="marketing-body mt-3 max-w-2xl">{c.calculatorPlaceholder.body}</p>
          </div>
        </Container>
      </section>

      <section className="bg-surface">
        <Container className="marketing-section">
          <div className="max-w-2xl space-y-3">
            <p className="marketing-eyebrow">{c.comingSoonLabel}</p>
            <h2 className="marketing-title">{c.comingSoonTitle}</h2>
            <p className="marketing-body">{c.comingSoonBody}</p>
          </div>

          <ul className="mt-10 space-y-6">
            {c.deferredPillars.map((pillar) => (
              <li key={pillar.id} className="border-t border-border pt-6 first:border-t-0 first:pt-0">
                <h3 className="font-[family-name:var(--font-ui)] text-[0.875rem] font-semibold uppercase tracking-[0.06em] text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {pillar.teaser}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  );
}
