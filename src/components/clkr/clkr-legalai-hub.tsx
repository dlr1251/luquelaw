import Link from "next/link";
import { ArrowRight, BookOpen, Bot, Library, Scale, Sparkles } from "lucide-react";

import { ClkrArticleCard } from "@/components/clkr/clkr-article-card";
import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrProductNav } from "@/components/clkr/clkr-product-nav";
import { Container } from "@/components/container";
import { loginHref } from "@/lib/auth/safe-next";
import type { ClkrArticle, ClkrCategory } from "@/lib/clkr/articles";
import {
  clkrLegalAiHubContent,
  type ClkrHubLocale,
} from "@/lib/clkr/hub-content";
import { cn } from "@/lib/utils";

type Props = {
  locale?: ClkrHubLocale;
  signedIn?: boolean;
  articles?: ClkrArticle[];
};

const HUB_ARTICLE_LIMIT = 9;

const moduleMeta = [
  {
    key: "guides" as const,
    href: (prefix: string) => `${prefix}/clkr/guides`,
    icon: BookOpen,
    tone: "from-[color:var(--moss)]/15 to-transparent",
  },
  {
    key: "norms" as const,
    href: (prefix: string) => `${prefix}/clkr/norms`,
    icon: Scale,
    tone: "from-[color:var(--forest)]/12 to-transparent",
  },
  {
    key: "library" as const,
    href: (prefix: string) => `${prefix}/clkr/library`,
    icon: Library,
    tone: "from-[color:var(--moss)]/10 to-transparent",
  },
  {
    key: "agents" as const,
    href: (prefix: string) => `${prefix}/clkr/agents`,
    icon: Bot,
    tone: "from-[color:var(--forest)]/8 to-transparent",
  },
];

export function ClkrLegalAiHub({
  locale = "en",
  signedIn = false,
  articles = [],
}: Props) {
  const copy = clkrLegalAiHubContent[locale];
  const prefix = locale === "es" ? "/es" : "";
  const contactHref = locale === "es" ? "/es#contact" : "/#contact";
  const lucyHref = signedIn ? "/portal/lucy" : loginHref("/portal/lucy", locale);
  const guidesHref = `${prefix}/clkr/guides`;
  const listedArticles = articles.slice(0, HUB_ARTICLE_LIMIT);
  const categoryLabels = copy.articleCategories as Record<ClkrCategory, string>;

  return (
    <main className="flex-1">
      <ClkrProductNav locale={locale} signedIn={signedIn} />

      <section className="relative overflow-hidden bg-hero text-hero-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 15% 20%, color-mix(in srgb, var(--hero-accent) 35%, transparent), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, color-mix(in srgb, var(--moss) 25%, transparent), transparent 50%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-12deg, transparent, transparent 11px, currentColor 11px, currentColor 12px)",
          }}
        />

        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl animate-[fade-up_0.7s_ease-out_both]">
            <p className="marketing-eyebrow marketing-eyebrow-on-hero">{copy.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl font-display text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-snug text-hero-foreground">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-hero-muted sm:text-lg">
              {copy.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={guidesHref} className="btn-primary-inverted inline-flex items-center gap-2">
                {copy.modules.guides.cta}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={lucyHref}
                className="inline-flex items-center gap-2 border border-hero-foreground/35 px-5 py-2.5 font-[family-name:var(--font-ui)] text-sm font-medium text-hero-foreground transition hover:bg-hero-foreground/10"
              >
                <Sparkles className="size-4" aria-hidden />
                {signedIn ? copy.lucyCtaShort : copy.lucySignIn}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-[color:var(--moss)]/20 bg-[color:var(--background)]">
        <Container className="py-14 sm:py-16 lg:py-20">
          <div className="mb-10 max-w-2xl animate-[fade-up_0.7s_ease-out_0.08s_both]">
            <h2 className="marketing-title text-[color:var(--forest)]">{copy.modulesTitle}</h2>
            <p className="marketing-body mt-2 text-sm sm:text-base">{copy.modulesSubtitle}</p>
          </div>

          <div className="grid gap-px overflow-hidden border border-[color:var(--moss)]/25 bg-[color:var(--moss)]/25 sm:grid-cols-2">
            {moduleMeta.map(({ key, href, icon: Icon, tone }, index) => {
              const mod = copy.modules[key];
              return (
                <Link
                  key={key}
                  href={href(prefix)}
                  className={cn(
                    "group relative flex min-h-[11rem] flex-col justify-between bg-[color:var(--card)] p-6 transition duration-300 sm:p-8",
                    "hover:bg-[color:var(--surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[color:var(--moss)]",
                    "animate-[fade-up_0.65s_ease-out_both]",
                  )}
                  style={{ animationDelay: `${0.12 + index * 0.06}s` }}
                >
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition duration-500 group-hover:opacity-100",
                      tone,
                    )}
                  />
                  <div className="relative flex items-start justify-between gap-3">
                    <span className="inline-flex size-10 items-center justify-center border border-[color:var(--moss)]/30 text-[color:var(--moss)] transition group-hover:border-[color:var(--moss)]/55 group-hover:text-[color:var(--forest)]">
                      <Icon className="size-5" strokeWidth={1.6} aria-hidden />
                    </span>
                    <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
                      {mod.badge}
                    </span>
                  </div>
                  <div className="relative mt-8">
                    <h3 className="font-display text-xl tracking-tight text-[color:var(--forest)] sm:text-2xl">
                      {mod.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {mod.description}
                    </p>
                    <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--forest)] transition group-hover:gap-2.5 group-hover:text-[color:var(--moss)]">
                      {mod.cta}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {listedArticles.length > 0 ? (
        <section className="border-b border-[color:var(--moss)]/20 bg-[color:var(--surface)]">
          <Container className="py-14 sm:py-16 lg:py-20">
            <div className="mb-10 max-w-2xl animate-[fade-up_0.7s_ease-out_0.08s_both]">
              <h2 className="marketing-title text-[color:var(--forest)]">{copy.articlesTitle}</h2>
              <p className="marketing-body mt-2 text-sm sm:text-base">{copy.articlesSubtitle}</p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listedArticles.map((article, index) => (
                <li
                  key={article.slugKey}
                  className="animate-[fade-up_0.65s_ease-out_both]"
                  style={{ animationDelay: `${0.1 + index * 0.04}s` }}
                >
                  <ClkrArticleCard
                    article={article}
                    readLabel={copy.articlesRead}
                    categoryLabel={categoryLabels[article.category]}
                  />
                </li>
              ))}
            </ul>

            <p className="mt-8">
              <Link
                href={guidesHref}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--forest)] underline-offset-4 hover:underline"
              >
                {copy.articlesBrowseAll}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </p>
          </Container>
        </section>
      ) : null}

      <section className="relative overflow-hidden bg-[color:var(--background)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-1/2 size-64 -translate-y-1/2 rounded-full bg-[color:var(--moss)]/15 blur-3xl"
        />
        <Container className="relative grid gap-8 py-14 sm:py-16 lg:grid-cols-12 lg:items-end lg:gap-12 lg:py-20">
          <div className="lg:col-span-7">
            <p className="marketing-eyebrow">{copy.lucyEyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,3.5vw,2.35rem)] text-[color:var(--forest)]">
              {copy.lucyTitle}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {copy.lucyBody}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Link href={lucyHref} className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="size-4" aria-hidden />
              {signedIn ? copy.lucyCta : copy.lucySignIn}
            </Link>
            <Link
              href={contactHref}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--forest)] underline-offset-4 hover:underline"
            >
              {copy.contactCta} {copy.contactLink}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-12">
        <ClkrDisclaimer text={copy.disclaimer} />
      </Container>
    </main>
  );
}
