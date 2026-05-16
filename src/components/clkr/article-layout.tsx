import Link from "next/link";
import type { ReactNode } from "react";

import { ClkrArticleCard } from "@/components/clkr/clkr-article-card";
import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { Container } from "@/components/container";
import { Prose } from "@/components/prose";
import { clkrArticles, clkrArticlesEs } from "@/lib/clkr/articles";

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
  currentSlug?: string;
};

export function ClkrArticleLayout({
  title,
  category,
  readingTime,
  description,
  sections,
  children,
  locale = "en",
  currentSlug,
}: Props) {
  const prefix = locale === "es" ? "/es" : "";
  const homeHref = locale === "es" ? "/es" : "/";
  const clkrHref = `${prefix}/clkr`;
  const contactHref = locale === "es" ? "/es#contact" : "/#contact";

  const copy =
    locale === "es"
      ? {
          home: "Inicio",
          hub: "CLKR",
          contents: "Contenido",
          mobileContents: "Tabla de contenido",
          related: "Otras guías",
          read: "Leer guía",
          ctaTitle: "¿Tienes una consulta puntual?",
          ctaBody:
            "Escríbeme con los hechos de tu caso. Recibirás un concepto jurídico escrito y una cotización dentro de 3 días hábiles tras la consulta inicial.",
          contact: "Contactar →",
          disclaimer:
            "Solo fines informativos. La ley colombiana cambia; confirma siempre las reglas vigentes para tu caso.",
        }
      : {
          home: "Home",
          hub: "CLKR",
          contents: "Contents",
          mobileContents: "Table of contents",
          related: "More guides",
          read: "Read guide",
          ctaTitle: "Have a fact-specific question?",
          ctaBody:
            "Send me the facts of your case. After an initial consultation, you'll receive a written legal concept and a quotation within 3 business days.",
          contact: "Get in touch →",
          disclaimer:
            "For informational purposes only. Colombian law changes; always confirm current rules for your case.",
        };

  const catalog = locale === "es" ? clkrArticlesEs : clkrArticles;
  const related = currentSlug
    ? catalog.filter((a) => a.slug !== currentSlug).slice(0, 2)
    : [];

  return (
    <main className="flex-1">
      <section className="border-b border-[color:var(--moss)]/25 bg-[color:var(--background)]">
        <Container className="py-12 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-[family-name:var(--font-ui)] text-[0.75rem] text-[color:var(--muted)]">
              <li>
                <Link href={homeHref} className="hover:text-[color:var(--forest)] hover:underline">
                  {copy.home}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={clkrHref} className="hover:text-[color:var(--forest)] hover:underline">
                  {copy.hub}
                </Link>
              </li>
              <li aria-hidden="true" className="max-sm:hidden">
                /
              </li>
              <li
                className="hidden max-w-full text-[color:var(--ink)] line-clamp-2 sm:block"
                aria-current="page"
              >
                {title}
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
            <span className="border border-[color:var(--moss)]/40 bg-[color:var(--surface)] px-2 py-1 text-[color:var(--forest)]">
              {category}
            </span>
            {readingTime ? (
              <span className="font-normal normal-case text-[color:var(--muted)]">{readingTime}</span>
            ) : null}
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[2.6rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
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

              <ClkrDisclaimer text={copy.disclaimer} className="mt-10" />

              <div className="mt-12 border border-[color:var(--moss)]/35 bg-[color:var(--surface)] p-6">
                <div className="font-display text-xl font-normal tracking-tight text-[color:var(--forest)]">
                  {copy.ctaTitle}
                </div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{copy.ctaBody}</p>
                <div className="mt-5">
                  <Link href={contactHref} className="btn-primary btn-primary-sm">
                    {copy.contact}
                  </Link>
                </div>
              </div>
            </div>

            {related.length > 0 ? (
              <section className="mt-12">
                <h2 className="font-display text-xl font-normal tracking-tight text-[color:var(--forest)]">
                  {copy.related}
                </h2>
                <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                  {related.map((article) => (
                    <li key={article.slug}>
                      <ClkrArticleCard article={article} readLabel={copy.read} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </Container>
    </main>
  );
}
