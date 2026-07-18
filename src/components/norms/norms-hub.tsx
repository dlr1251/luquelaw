import { BookMarked, Layers } from "lucide-react";

import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleHero } from "@/components/clkr/clkr-module-hero";
import { ClkrProductNav } from "@/components/clkr/clkr-product-nav";
import { Container } from "@/components/container";
import { NormsBrowser } from "@/components/norms/norms-browser";
import type { NormCatalogItem } from "@/lib/norms/types";
import { normCategoryLabel } from "@/lib/norms/types";
import { normsHubContent, type NormsHubLocale } from "@/lib/norms/hub-content";

type Props = {
  norms: NormCatalogItem[];
  locale?: NormsHubLocale;
  signedIn?: boolean;
};

export function NormsHub({ norms, locale = "en", signedIn = false }: Props) {
  const copy = normsHubContent[locale];
  const categoryCount = new Set(norms.map((n) => n.category)).size;

  return (
    <main className="flex-1">
      <ClkrProductNav locale={locale} signedIn={signedIn} />
      <ClkrModuleHero
        locale={locale}
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
        contactCta={locale === "es" ? "¿Consulta sobre tu caso?" : "Questions about your situation?"}
        contactLink={locale === "es" ? "Escríbenos" : "Get in touch"}
      />

      <section className="border-b border-[color:var(--moss)]/20 bg-[color:var(--surface)]">
        <Container className="py-10 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <div className="flex flex-wrap gap-6 sm:gap-8">
                <StatBlock
                  icon={<BookMarked className="h-5 w-5" strokeWidth={1.75} />}
                  label={copy.normCountLabel}
                  value={String(norms.length)}
                />
                <StatBlock
                  icon={<Layers className="h-5 w-5" strokeWidth={1.75} />}
                  label={copy.categoryLabel}
                  value={String(categoryCount)}
                />
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

      <Container className="py-14 sm:py-16">
        <div className="mb-10 max-w-2xl space-y-2">
          <h2 className="marketing-title text-[color:var(--forest)]">{copy.browseTitle}</h2>
          <p className="marketing-body text-sm">{copy.browseSubtitle}</p>
        </div>

        <NormsBrowser norms={norms} locale={locale} />

        {norms.length > 0 ? (
          <div className="mt-12 flex flex-wrap gap-2">
            {Array.from(new Set(norms.map((n) => n.category))).map((category) => (
              <span
                key={category}
                className="border border-[color:var(--moss)]/30 bg-[color:var(--surface)] px-3 py-1 font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground"
              >
                {normCategoryLabel(category, locale)}
              </span>
            ))}
          </div>
        ) : null}

        <ClkrDisclaimer text={copy.disclaimer} className="mt-12" />
      </Container>
    </main>
  );
}

function StatBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--moss)]">
        {icon}
      </span>
      <div>
        <p className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
          {label}
        </p>
        <p className="mt-1 font-display text-3xl font-normal tracking-tight text-[color:var(--forest)]">
          {value}
        </p>
      </div>
    </div>
  );
}
