import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleHero } from "@/components/clkr/clkr-module-hero";
import { PromptsLibrary } from "@/components/agents/prompts-library";
import { Container } from "@/components/container";
import { getLibraryPrompts, getLibrarySkills } from "@/lib/agents/get-agents";
import { clkrLibraryHubContent } from "@/lib/clkr/hub-content";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.clkrLibrary.en.title,
  description: PAGE_SEO.clkrLibrary.en.description,
  path: "/clkr/library",
  locale: "en",
});

export default async function ClkrLibraryPage() {
  const [prompts, skills] = await Promise.all([
    getLibraryPrompts("en"),
    getLibrarySkills("en"),
  ]);
  const copy = clkrLibraryHubContent.en;

  return (
    <main className="flex-1">
      <ClkrModuleHero
        locale="en"
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
        contactCta="Browse CLKR articles"
        contactLink="Open CLKR"
        contactHref="/clkr"
      />
      <Container className="py-12 sm:py-14">
        <PromptsLibrary prompts={prompts} skills={skills} locale="en" />
        <ClkrDisclaimer text={copy.disclaimer} className="mt-12" />
      </Container>
    </main>
  );
}
