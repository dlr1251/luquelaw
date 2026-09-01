import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleHero } from "@/components/clkr/clkr-module-hero";
import { Container } from "@/components/container";
import { Suspense } from "react";

import { NormsBrowser } from "@/components/norms/norms-browser";
import type { NormCatalogItem } from "@/lib/norms/types";
import { normsHubContent, type NormsHubLocale } from "@/lib/norms/hub-content";

type Props = {
  norms: NormCatalogItem[];
  locale?: NormsHubLocale;
};

export function NormsHub({ norms, locale = "en" }: Props) {
  const copy = normsHubContent[locale];

  return (
    <main className="flex-1">
      <ClkrModuleHero
        locale={locale}
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
        contactCta={locale === "es" ? "¿Consulta sobre tu caso?" : "Questions about your situation?"}
        contactLink={locale === "es" ? "Escríbenos" : "Get in touch"}
      />

      <Container className="py-12 sm:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-xl">
            <h2 className="marketing-title text-[color:var(--forest)]">{copy.browseTitle}</h2>
            <p className="marketing-body mt-1 text-sm">{copy.browseSubtitle}</p>
          </div>
          <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
            {norms.length} {copy.normCountLabel.toLowerCase()}
          </p>
        </div>

        <Suspense fallback={<p className="text-sm text-muted-foreground">…</p>}>
          <NormsBrowser norms={norms} locale={locale} />
        </Suspense>

        <ClkrDisclaimer text={copy.disclaimer} className="mt-12" />
      </Container>
    </main>
  );
}
