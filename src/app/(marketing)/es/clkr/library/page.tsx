import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleHero } from "@/components/clkr/clkr-module-hero";
import { ClkrProductNav } from "@/components/clkr/clkr-product-nav";
import { PromptsLibrary } from "@/components/agents/prompts-library";
import { Container } from "@/components/container";
import { getLibraryPrompts, getLibrarySkills } from "@/lib/agents/get-agents";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { clkrLibraryHubContent } from "@/lib/clkr/hub-content";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.clkrLibrary.es.title,
  description: PAGE_SEO.clkrLibrary.es.description,
  path: "/es/clkr/library",
  locale: "es",
});

export default async function ClkrLibraryEsPage() {
  const [prompts, skills, signedIn] = await Promise.all([
    getLibraryPrompts("es"),
    getLibrarySkills("es"),
    getSignedInFlag(),
  ]);
  const copy = clkrLibraryHubContent.es;

  return (
    <main className="flex-1">
      <ClkrProductNav locale="es" signedIn={signedIn} />
      <ClkrModuleHero
        locale="es"
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
        contactCta="Explorar artículos CLKR"
        contactLink="Abrir CLKR"
        contactHref="/es/clkr/guides"
      />
      <Container className="py-12 sm:py-14">
        <PromptsLibrary prompts={prompts} skills={skills} locale="es" />
        <ClkrDisclaimer text={copy.disclaimer} className="mt-12" />
      </Container>
    </main>
  );
}
