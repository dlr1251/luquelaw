import { BookOpen, Layers } from "lucide-react";

import { ClkrBrowser } from "@/components/clkr/clkr-browser";
import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleHero } from "@/components/clkr/clkr-module-hero";
import { ClkrProductNav } from "@/components/clkr/clkr-product-nav";
import { StudyPathsSection } from "@/components/clkr/study-paths-section";
import { Container } from "@/components/container";
import type { ClkrArticle } from "@/lib/clkr/articles";
import type { StudyPath } from "@/lib/clkr/types";
import { clkrHubContent, type ClkrHubLocale } from "@/lib/clkr/hub-content";

type Props = {
  articles: ClkrArticle[];
  studyPaths?: StudyPath[];
  locale?: ClkrHubLocale;
  signedIn?: boolean;
};

export function ClkrHub({
  articles,
  studyPaths = [],
  locale = "en",
  signedIn = false,
}: Props) {
  const copy = clkrHubContent[locale];
  const topicCount = new Set(articles.map((a) => a.category)).size;

  return (
    <main className="flex-1">
      <ClkrProductNav locale={locale} signedIn={signedIn} />
      <ClkrModuleHero
        locale={locale}
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
        contactCta={copy.contactCta}
        contactLink={copy.contactLink}
      />

      <section className="border-b border-[color:var(--moss)]/20 bg-[color:var(--surface)]">
        <Container className="py-10 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <div className="flex flex-wrap gap-6 sm:gap-8">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--moss)]">
                    <BookOpen className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
                      {copy.articleCountLabel}
                    </p>
                    <p className="mt-1 font-display text-3xl font-normal tracking-tight text-[color:var(--forest)]">
                      {articles.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--moss)]">
                    <Layers className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
                      {copy.categoryLabel}
                    </p>
                    <p className="mt-1 font-display text-3xl font-normal tracking-tight text-[color:var(--forest)]">
                      {topicCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <h2 className="font-display text-xl font-normal tracking-tight text-[color:var(--forest)]">
                {copy.howItWorksTitle}
              </h2>
              <ol className="mt-4 space-y-3">
                {copy.howItWorks.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-[color:var(--moss)]/40 bg-[color:var(--card)] font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium text-[color:var(--moss)]">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <StudyPathsSection paths={studyPaths} locale={locale} />

      <Container className="py-14 sm:py-16">
        <div className="mb-10 max-w-2xl space-y-2">
          <h2 className="marketing-title text-[color:var(--forest)]">{copy.browseTitle}</h2>
          <p className="marketing-body text-sm">{copy.browseSubtitle}</p>
        </div>

        <ClkrBrowser articles={articles} locale={locale} />

        <ClkrDisclaimer text={copy.disclaimer} className="mt-12" />
      </Container>
    </main>
  );
}
