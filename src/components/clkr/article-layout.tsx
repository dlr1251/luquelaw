import Link from "next/link";
import type { ReactNode } from "react";

import { ArticleDesktopToc, ArticleMobileToc } from "@/components/clkr/article-toc";
import { ArticleNavigation } from "@/components/clkr/article-navigation";
import {
  ArticleRepoMobileNav,
  ArticleRepoSidebar,
} from "@/components/clkr/article-repo-nav";
import { ClkrArticleCard } from "@/components/clkr/clkr-article-card";
import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { Container } from "@/components/container";
import { Prose } from "@/components/prose";
import type { ClkrArticle, ClkrArticleNavItem, ClkrCategory } from "@/lib/clkr/types";

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
  articleSlugKey?: string;
  relatedArticles?: ClkrArticle[];
  navArticles?: ClkrArticleNavItem[];
  prerequisites?: ClkrArticle[];
  nextSteps?: ClkrArticle[];
  studyPaths?: Array<{ id: string; slug: string; title: string }>;
  linkedPrompts?: Array<{ slug: string; title: string; description: string; useCase?: string | null }>;
  linkedSkills?: Array<{ slug: string; title: string; description: string }>;
  headerAction?: ReactNode;
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
  articleSlugKey,
  relatedArticles = [],
  navArticles = [],
  prerequisites = [],
  nextSteps = [],
  studyPaths = [],
  linkedPrompts = [],
  linkedSkills = [],
  headerAction,
}: Props) {
  const prefix = locale === "es" ? "/es" : "";
  const homeHref = locale === "es" ? "/es" : "/";
  const clkrHref = `${prefix}/clkr`;
  const guidesHref = `${prefix}/clkr/guides`;
  const libraryHref = `${prefix}/clkr/library`;
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
          prompts: "Prompts y skills",
          viewPrompt: "Ver prompt",
          viewSkill: "Ver skill",
          library: "Abrir biblioteca",
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
          prompts: "Prompts & skills",
          viewPrompt: "View prompt",
          viewSkill: "View skill",
          library: "Open library",
          ctaTitle: "A question about your facts?",
          ctaBody:
            "Write us with the facts. After the initial consultation, you get a written legal concept (Concepto Jurídico) and a quotation within 3 business days.",
          contact: "Get in touch →",
          disclaimer:
            "Informational only. Colombian law changes; confirm the current rules for your case.",
        };

  const related = relatedArticles;
  const slugKey = articleSlugKey ?? currentSlug ?? "";
  const showRepoNav = navArticles.length > 0 && Boolean(slugKey);
  const currentCategory = category as ClkrCategory;

  return (
    <main
      className={
        showRepoNav
          ? "flex-1 pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:pb-0"
          : "flex-1"
      }
    >
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
          <div className="mt-4 flex max-w-4xl items-start gap-2">
            <h1 className="min-w-0 flex-1 font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[2.6rem]">
              {title}
            </h1>
            {headerAction ? <div className="mt-1.5 shrink-0 sm:mt-2">{headerAction}</div> : null}
          </div>
          {description ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </Container>
      </section>

      {showRepoNav ? (
        <ArticleRepoMobileNav
          key={slugKey}
          locale={locale}
          currentSlugKey={slugKey}
          articles={navArticles}
          currentCategory={currentCategory}
        />
      ) : null}

      <Container className="py-10 sm:py-14">
        <ArticleMobileToc
          sections={sections}
          label={copy.mobileContents}
          locale={locale}
        />
        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
              <ArticleDesktopToc sections={sections} label={copy.contents} />
              {showRepoNav ? (
                <ArticleRepoSidebar
                  key={slugKey}
                  locale={locale}
                  currentSlugKey={slugKey}
                  articles={navArticles}
                  currentCategory={currentCategory}
                />
              ) : null}
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

            <ArticleNavigation
              prerequisites={prerequisites}
              nextSteps={nextSteps}
              studyPaths={studyPaths}
              locale={locale}
            />

            {linkedPrompts.length > 0 || linkedSkills.length > 0 ? (
              <section className="mt-12 border-t border-[color:var(--moss)]/25 pt-10">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h2 className="font-display text-xl font-normal tracking-tight text-[color:var(--forest)]">
                    {copy.prompts}
                  </h2>
                  <Link
                    href={libraryHref}
                    className="text-sm font-semibold text-[color:var(--forest)] hover:underline"
                  >
                    {copy.library} →
                  </Link>
                </div>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {linkedPrompts.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={p.slug}
                        className="flex h-full flex-col border border-[color:var(--moss)]/30 bg-[color:var(--card)] p-5 transition hover:border-[color:var(--moss)]/55"
                      >
                        <span className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.14em] text-[color:var(--moss)]">
                          Prompt
                        </span>
                        <h3 className="mt-2 font-[family-name:var(--font-ui)] text-[0.9375rem] font-semibold text-[color:var(--forest)]">
                          {p.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                        <span className="mt-auto pt-4 text-sm font-bold text-[color:var(--forest)]">
                          {copy.viewPrompt} →
                        </span>
                      </Link>
                    </li>
                  ))}
                  {linkedSkills.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={s.slug}
                        className="flex h-full flex-col border border-[color:var(--moss)]/30 bg-[color:var(--card)] p-5 transition hover:border-[color:var(--moss)]/55"
                      >
                        <span className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.14em] text-[color:var(--moss)]">
                          Skill
                        </span>
                        <h3 className="mt-2 font-[family-name:var(--font-ui)] text-[0.9375rem] font-semibold text-[color:var(--forest)]">
                          {s.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                        <span className="mt-auto pt-4 text-sm font-bold text-[color:var(--forest)]">
                          {copy.viewSkill} →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

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
