import Link from "next/link";

import { Container } from "@/components/container";
import { ImmigrationHubShell } from "@/components/practice-areas/immigration-hub-shell";
import type { ImmigrationLocale } from "@/lib/practice-areas/immigration";
import { immigrationPath } from "@/lib/practice-areas/paths";
import {
  formatWorkPermit,
  type VisaCatalogEntry,
  visaGuideHref,
  visaNormHref,
} from "@/lib/practice-areas/visas-catalog";

type Props = {
  locale: ImmigrationLocale;
  visa: VisaCatalogEntry;
};

export function VisaDetail({ locale, visa }: Props) {
  const copy =
    locale === "es"
      ? {
          back: "Volver al catálogo",
          who: "¿Para quién?",
          requirements: "Requisitos clave",
          duration: "Vigencia / permanencia",
          work: "Permiso de trabajo",
          beneficiaries: "Beneficiarios",
          norm: "Ver Resolución 5477",
          guide: "Leer guía relacionada",
          book: "Agendar consulta",
          article: "Artículo",
          disclaimer:
            "Informativo — no constituye asesoría. Cancillería tiene facultad discrecional sobre cada solicitud.",
        }
      : {
          back: "Back to catalog",
          who: "Who is it for?",
          requirements: "Key requirements",
          duration: "Validity / stay",
          work: "Work authorization",
          beneficiaries: "Beneficiaries",
          norm: "View Resolución 5477",
          guide: "Read related guide",
          book: "Book a consultation",
          article: "Article",
          disclaimer:
            "Informational — not legal advice. Cancillería has discretionary authority over every application.",
        };

  return (
    <ImmigrationHubShell locale={locale}>
      <main>
        <section className="border-b border-border bg-hero text-hero-foreground">
          <Container className="marketing-section">
            <Link
              href={immigrationPath("/visas", locale)}
              className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-hero-muted transition hover:text-hero-foreground"
            >
              ← {copy.back}
            </Link>
            <p className="marketing-eyebrow marketing-eyebrow-on-hero mt-6">
              {visa.category} · {copy.article} {visa.articleNum}
            </p>
            <h1 className="marketing-display mt-3 text-hero-foreground">{visa.name[locale]}</h1>
            <p className="marketing-lead mt-4 max-w-2xl italic text-hero-muted">
              {visa.summary[locale]}
            </p>
          </Container>
        </section>

        <section className="bg-background">
          <Container className="marketing-section">
            <div className="grid max-w-3xl gap-10">
              <div>
                <h2 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                  {copy.who}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {visa.whoFor[locale]}
                </p>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                  {copy.requirements}
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {visa.keyRequirements[locale].map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h2 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                    {copy.duration}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {visa.durationNotes[locale]}
                  </p>
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                    {copy.work}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {formatWorkPermit(visa.workPermit, locale)}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                  {copy.beneficiaries}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {visa.beneficiaries}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">{copy.disclaimer}</p>

              <div className="flex flex-wrap gap-3">
                <Link href={visaNormHref(locale)} className="btn-secondary">
                  {copy.norm}
                </Link>
                {visa.relatedGuideSlug ? (
                  <Link
                    href={visaGuideHref(visa.relatedGuideSlug, locale)}
                    className="btn-secondary"
                  >
                    {copy.guide}
                  </Link>
                ) : null}
                <Link href={`${immigrationPath("", locale)}#book`} className="btn-primary">
                  {copy.book}
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </ImmigrationHubShell>
  );
}
