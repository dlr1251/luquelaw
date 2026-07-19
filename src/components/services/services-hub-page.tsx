import Link from "next/link";

import { Container } from "@/components/container";
import {
  getServiceAreas,
  servicesHubContent,
  type ServicesLocale,
} from "@/lib/services/content";

type Props = {
  locale: ServicesLocale;
};

export function ServicesHubPage({ locale }: Props) {
  const c = servicesHubContent[locale];
  const areas = getServiceAreas(locale);

  return (
    <main>
      <section className="bg-hero text-hero-foreground">
        <Container className="marketing-section">
          <div className="max-w-3xl space-y-6">
            <p className="marketing-eyebrow marketing-eyebrow-on-hero">{c.eyebrow}</p>
            <h1 className="marketing-display text-hero-foreground">{c.title}</h1>
            <p className="marketing-lead max-w-2xl italic text-hero-muted">{c.intro}</p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background">
        <Container className="marketing-section">
          <p className="marketing-eyebrow">{c.areasLabel}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <li key={area.id} className="h-full">
                <Link
                  href={area.href}
                  className="flex h-full flex-col border border-border bg-surface/60 p-5 transition-colors hover:border-foreground/25 sm:p-6"
                >
                  <h2 className="font-[family-name:var(--font-ui)] text-[0.9375rem] font-semibold text-foreground">
                    {area.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {area.blurb}
                  </p>
                  <span className="mt-6 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-[color:var(--forest)]">
                    {c.learnMore} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </main>
  );
}
