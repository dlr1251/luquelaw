import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/container";
import { Prose } from "@/components/prose";

export type ArticleSection = {
  id: string;
  title: string;
};

type Props = {
  title: string;
  category: string;
  readingTime?: string;
  description?: string;
  sections: ArticleSection[];
  children: ReactNode;
  locale?: "en" | "es";
};

export function ClkrArticleLayout({
  title,
  category,
  readingTime,
  description,
  sections,
  children,
  locale = "en",
}: Props) {
  const prefix = locale === "es" ? "/es" : "";
  const copy =
    locale === "es"
      ? {
          hub: "Repositorio CLKR",
          contents: "Contenido",
          mobileContents: "Tabla de contenido",
          ctaTitle: "¿Tienes una consulta puntual?",
          ctaBody:
            "Agenda una consulta y recibe un concepto jurídico escrito y una cotización dentro de 3 días hábiles.",
          book: "Agendar",
          contact: "Contacto",
        }
      : {
          hub: "CLKR hub",
          contents: "Contents",
          mobileContents: "Table of contents",
          ctaTitle: "Have a fact-specific question?",
          ctaBody:
            "Book a consultation and receive a written legal concept and a quotation within 3 business days.",
          book: "Book",
          contact: "Contact",
        };

  return (
    <main className="flex-1">
      <section className="border-b-2 border-[color:var(--moss)] bg-[color:var(--hero)] text-[color:var(--hero-foreground)]">
        <Container className="py-12 sm:py-14">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
            <span className="border border-[color:var(--moss)]/50 bg-[color:var(--hero-button)] px-2 py-1 text-[color:var(--hero-muted)]">
              {category}
            </span>
            {readingTime ? <span className="font-normal normal-case">{readingTime}</span> : null}
            <span className="hidden font-normal text-[color:var(--hero-muted)] sm:inline">·</span>
            <Link
              href={`${prefix}/clkr`}
              className="font-normal normal-case text-[color:var(--hero-muted)] hover:text-[color:var(--parchment)] hover:underline"
            >
              {copy.hub}
            </Link>
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--parchment)] sm:text-[2.6rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[color:var(--hero-muted)] sm:text-lg">
              {description}
            </p>
          ) : null}
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <div className="hidden lg:block">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
                  {copy.contents}
                </div>
                <nav className="mt-4 space-y-2 text-sm">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block border-l-2 border-transparent px-2 py-1.5 text-[color:var(--muted)] transition hover:border-[color:var(--moss)] hover:text-[color:var(--ink)]"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>

              <details className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-5 lg:hidden">
                <summary className="cursor-pointer list-none text-sm font-bold text-[color:var(--ink)]">
                  {copy.mobileContents}
                </summary>
                <nav className="mt-4 space-y-2 text-sm">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block px-2 py-1.5 text-[color:var(--muted)] hover:text-[color:var(--ink)]"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </details>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6 sm:p-10">
              <Prose>{children}</Prose>

              <div className="mt-12 border border-[color:var(--moss)]/35 bg-[color:var(--surface)] p-6">
                <div className="font-display text-xl font-normal tracking-tight text-[color:var(--forest)]">
                  {copy.ctaTitle}
                </div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{copy.ctaBody}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`${prefix}/contact#consultation`} className="btn-primary btn-primary-sm">
                    {copy.book}
                  </Link>
                  <Link href={`${prefix}/contact`} className="btn-secondary btn-secondary-sm">
                    {copy.contact}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
