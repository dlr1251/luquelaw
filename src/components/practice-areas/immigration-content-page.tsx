import Link from "next/link";

import { Container } from "@/components/container";
import { ImmigrationHubShell } from "@/components/practice-areas/immigration-hub-shell";
import type { ImmigrationLocale } from "@/lib/practice-areas/immigration";

type Section = { id: string; title: string; body: string };

type Props = {
  locale: ImmigrationLocale;
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
  ctaTitle: string;
  ctaBody: string;
  bookCta: string;
  bookHref: string;
  disclaimer: string;
};

export function ImmigrationContentPage({
  locale,
  eyebrow,
  title,
  intro,
  sections,
  ctaTitle,
  ctaBody,
  bookCta,
  bookHref,
  disclaimer,
}: Props) {
  return (
    <ImmigrationHubShell locale={locale}>
      <main>
        <section className="bg-hero text-hero-foreground">
          <Container className="marketing-section">
            <div className="max-w-3xl space-y-5">
              <p className="marketing-eyebrow marketing-eyebrow-on-hero">{eyebrow}</p>
              <h1 className="marketing-display text-hero-foreground">{title}</h1>
              <p className="marketing-lead max-w-2xl italic text-hero-muted">{intro}</p>
            </div>
          </Container>
        </section>

        <section className="border-b border-border bg-background">
          <Container className="marketing-section">
            <div className="mx-auto max-w-3xl space-y-10">
              {sections.map((section) => (
                <article key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="marketing-title text-[1.35rem] sm:text-[1.5rem]">
                    {section.title}
                  </h2>
                  <p className="marketing-body mt-3">{section.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-surface">
          <Container className="marketing-section">
            <div className="max-w-2xl space-y-4">
              <h2 className="marketing-title text-[1.35rem] sm:text-[1.5rem]">{ctaTitle}</h2>
              <p className="marketing-body">{ctaBody}</p>
              <Link href={bookHref} className="btn-primary btn-primary-lg inline-flex">
                {bookCta}
              </Link>
              <p className="text-xs leading-relaxed text-muted-foreground">{disclaimer}</p>
            </div>
          </Container>
        </section>
      </main>
    </ImmigrationHubShell>
  );
}
