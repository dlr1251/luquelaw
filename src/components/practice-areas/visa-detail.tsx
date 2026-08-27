import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/container";
import { NormComments } from "@/components/norms/norm-comments";
import { ImmigrationHubShell } from "@/components/practice-areas/immigration-hub-shell";
import { VisaCatalogNav, VisaCatalogSidebar } from "@/components/practice-areas/visa-catalog-nav";
import { VisaApplicationChecklist } from "@/components/practice-areas/visa-application-checklist";
import { SharePageButton } from "@/components/share-page-button";
import type { NormCommentView } from "@/lib/comments/types";
import type { ImmigrationLocale } from "@/lib/practice-areas/immigration";
import { immigrationPath } from "@/lib/practice-areas/paths";
import { checklistGroupsFor } from "@/lib/practice-areas/visa-checklists";
import {
  formatBeneficiaries,
  formatWorkPermit,
  type VisaCatalogEntry,
  type VisaNavItem,
  visaDetailPath,
  visaGuideHref,
  visaNormHref,
} from "@/lib/practice-areas/visas-catalog";
import type { VisaNormCommentTarget } from "@/lib/visas/norm-comments";

type Props = {
  locale: ImmigrationLocale;
  visa: VisaCatalogEntry;
  catalog: VisaNavItem[];
  comments?: {
    target: VisaNormCommentTarget;
    initialComments: NormCommentView[];
    signedIn: boolean;
    viewerUserId: string | null;
  } | null;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-ui)] text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export function VisaDetail({ locale, visa, catalog, comments = null }: Props) {
  const copy =
    locale === "es"
      ? {
          back: "Volver al catálogo",
          who: "¿Para quién?",
          eligibility: "Elegibilidad general",
          rights: "Derechos / alcance",
          restrictions: "Restricciones",
          checklist: "Checklist de solicitud",
          requirements: "Requisitos clave",
          duration: "Vigencia / permanencia",
          work: "Permiso de trabajo",
          beneficiaries: "Beneficiarios",
          norm: "Ver Resolución 5477",
          guide: "Leer guía relacionada",
          book: "Agendar consulta",
          article: "Artículo",
          disclaimer:
            "Informativo — no constituye asesoría. Cancillería tiene facultad discrecional sobre cada solicitud. Verifique el listado vigente de nacionalidades y el texto oficial antes de radicar.",
        }
      : {
          back: "Back to catalog",
          who: "Who is it for?",
          eligibility: "General eligibility",
          rights: "Rights / scope",
          restrictions: "Restrictions",
          checklist: "Application checklist",
          requirements: "Key requirements",
          duration: "Validity / stay",
          work: "Work authorization",
          beneficiaries: "Beneficiaries",
          norm: "View Resolución 5477",
          guide: "Read related guide",
          book: "Book a consultation",
          article: "Article",
          disclaimer:
            "Informational — not legal advice. Cancillería has discretionary authority over every application. Confirm the current nationality list and official text before filing.",
        };

  const pagePath = visaDetailPath(visa.slug, locale);

  return (
    <ImmigrationHubShell locale={locale}>
      <main className="pb-[calc(4.75rem+env(safe-area-inset-bottom))] lg:pb-0">
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
            <h1 className="marketing-display mt-3 text-hero-foreground">
              {visa.name[locale]}
            </h1>
            <p className="marketing-lead mt-4 max-w-2xl italic text-hero-muted">
              {visa.summary[locale]}
            </p>
            <div className="mt-6">
              <SharePageButton
                locale={locale}
                title={visa.name[locale]}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-hero-foreground/70 bg-transparent px-6 font-[family-name:var(--font-ui)] text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-hero-foreground transition hover:bg-hero-foreground/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-foreground/40"
              />
            </div>
          </Container>
        </section>

        <VisaCatalogNav locale={locale} currentSlug={visa.slug} visas={catalog} />

        <section className="bg-background">
          <Container className="marketing-section">
            <div className="grid gap-10 lg:grid-cols-[minmax(16rem,18rem)_minmax(0,1fr)] lg:items-start">
              <VisaCatalogSidebar
                locale={locale}
                currentSlug={visa.slug}
                visas={catalog}
              />
              <div className="grid max-w-3xl gap-10">
              <Section title={copy.who}>
                <p>{visa.whoFor[locale]}</p>
              </Section>

              {visa.eligibility?.[locale] ? (
                <Section title={copy.eligibility}>
                  <p>{visa.eligibility[locale]}</p>
                </Section>
              ) : null}

              {visa.rights?.[locale]?.length ? (
                <Section title={copy.rights}>
                  <ul className="list-disc space-y-2 pl-5">
                    {visa.rights[locale].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Section>
              ) : null}

              {visa.restrictions?.[locale]?.length ? (
                <Section title={copy.restrictions}>
                  <ul className="list-disc space-y-2 pl-5">
                    {visa.restrictions[locale].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Section>
              ) : null}

              {visa.applicationChecklist?.[locale]?.length ? (
                <Section title={copy.checklist}>
                  <VisaApplicationChecklist
                    locale={locale}
                    storageKey={`visa-checklist:${visa.slug}:${locale}`}
                    items={visa.applicationChecklist[locale]}
                    groups={checklistGroupsFor(visa.articleNum, locale)}
                    title={visa.name[locale]}
                    slug={visa.slug}
                    category={visa.category}
                    articleNum={visa.articleNum}
                  />
                </Section>
              ) : (
                <Section title={copy.requirements}>
                  <ul className="list-disc space-y-2 pl-5">
                    {visa.keyRequirements[locale].map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </Section>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <Section title={copy.duration}>
                  <p>{visa.durationNotes[locale]}</p>
                </Section>
                <Section title={copy.work}>
                  <p>{formatWorkPermit(visa.workPermit, locale, visa.workPermitNotes)}</p>
                </Section>
              </div>

              <Section title={copy.beneficiaries}>
                <p>{formatBeneficiaries(visa, locale)}</p>
              </Section>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {copy.disclaimer}
              </p>

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
                <SharePageButton locale={locale} title={visa.name[locale]} />
                <Link href={`${immigrationPath("", locale)}#book`} className="btn-primary">
                  {copy.book}
                </Link>
              </div>
              </div>
            </div>
          </Container>
        </section>

        {comments ? (
          <section className="border-t border-border bg-surface">
            <Container className="marketing-section max-w-3xl">
              <NormComments
                normId={comments.target.normId}
                sectionId={comments.target.sectionId}
                locale={locale}
                signedIn={comments.signedIn}
                viewerUserId={comments.viewerUserId}
                initialComments={comments.initialComments}
                currentPath={pagePath}
              />
              <p className="mt-4 text-xs text-muted-foreground">
                {locale === "es" ? (
                  <>
                    La discusión se guarda sobre el{" "}
                    <Link
                      href={comments.target.currentPath}
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      artículo {visa.articleNum} de la Resolución 5477
                    </Link>{" "}
                    en CLKR Normas.
                  </>
                ) : (
                  <>
                    Discussion is stored on{" "}
                    <Link
                      href={comments.target.currentPath}
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      article {visa.articleNum} of Resolución 5477
                    </Link>{" "}
                    in CLKR Norms.
                  </>
                )}
              </p>
            </Container>
          </section>
        ) : null}
      </main>
    </ImmigrationHubShell>
  );
}
