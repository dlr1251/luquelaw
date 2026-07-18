import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleHero } from "@/components/clkr/clkr-module-hero";
import { ClkrProductNav } from "@/components/clkr/clkr-product-nav";
import { Container } from "@/components/container";
import { NormsBrowser } from "@/components/norms/norms-browser";
import type { NormCatalogItem } from "@/lib/norms/types";
import { normsHubContent, type NormsHubLocale } from "@/lib/norms/hub-content";

type Props = {
  norms: NormCatalogItem[];
  locale?: NormsHubLocale;
  signedIn?: boolean;
};

export function NormsHub({ norms, locale = "en", signedIn = false }: Props) {
  const copy = normsHubContent[locale];

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

        <NormsBrowser norms={norms} locale={locale} />

        <ClkrDisclaimer text={copy.disclaimer} className="mt-12" />
      </Container>
    </main>
  );
}
