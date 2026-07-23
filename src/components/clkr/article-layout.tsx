import Link from "next/link";
import type { ReactNode } from "react";

import { ClkrArticleCard } from "@/components/clkr/clkr-article-card";
import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { Container } from "@/components/container";
import { Prose } from "@/components/prose";
import type { ClkrArticle } from "@/lib/clkr/types";

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
  relatedArticles?: ClkrArticle[];
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
  relatedArticles = [],
}: Props) {
  const prefix = locale === "es" ? "/es" : "";
  const homeHref = locale === "es" ? "/es" : "/";
  const clkrHref = `${prefix}/clkr`;
  const guidesHref = `${prefix}/clkr/guides`;
  const contactHref = locale === "es" ? "/es#contact" : "/#contact";

  const copy =
    locale === "es"
      ? {
          home: "Inicio",
          hub: "CLKR",
          guides: "Artículos",
          contents: "Contenido",
          mobileContents: "Tabla de contenido",
          related: "Otros artículos",
          read: "Leer artículo",
          ctaTitle: "¿Consulta sobre hechos concretos?",
          ctaBody:
            "Escríbenos con los hechos. Tras la consulta inicial, recibes un concepto jurídico escrito y una cotización dentro de 3 días hábiles.",
          contact: "Escríbenos →",
          disclaimer:
            "Solo informativo. La ley colombiana cambia; confirma las reglas vigentes para tu caso.",
        }
      : {
          home: "Home",
          hub: "CLKR",
          guides: "Articles",
          contents: "Contents",
          mobileContents: "Table of contents",
          related: "More articles",
          read: "Read article",
          ctaTitle: "A question about your facts?",
          ctaBody:
            "Write us with the facts. After the initial consultation, you get a written legal concept (Concepto Jurídico) and a quotation within 3 business days.",
          contact: "Get in touch →",
          disclaimer:
            "Informational only. Colombian law changes; confirm the current rules for your case.",
        };

  const related = relatedArticles;

  return (
    <main className="flex-1">
      <section className="border-b border-[color:var(--moss)]/25 bg-[color:var(--background)]">
        <Container className="py-12 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-[family-name:var(--font-ui)] text-[0.75rem] text-muted-foreground">
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
              <li aria-hidden="true">/</li>
              <li>
                <Link href={guidesHref} className="hover:text-[color:var(--forest)] hover:underline">
                  {copy.guides}
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
              <span className="font-normal normal-case text-muted-foreground">{readingTime}</span>
            ) : null}
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[2.6rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
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
                      className="block border-l-2 border-transparent px-2 py-1.5 text-muted-foreground transition hover:border-[color:var(--moss)] hover:text-[color:var(--ink)]"
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
                      className="block px-2 py-1.5 text-muted-foreground hover:text-[color:var(--ink)]"
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
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.ctaBody}</p>
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
