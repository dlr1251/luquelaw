import { ClkrLegalAiHub } from "@/components/clkr/clkr-legalai-hub";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { getHubArticles } from "@/lib/clkr/get-hub-articles";
import { JsonLd } from "@/lib/seo/json-ld";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { clkrHubJsonLd } from "@/lib/seo/schemas";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.clkrHub.en.title,
  description: PAGE_SEO.clkrHub.en.description,
  path: "/clkr",
  locale: "en",
});

export default async function ClkrHubPage() {
  const [signedIn, articles] = await Promise.all([
    getSignedInFlag(),
    getHubArticles("en"),
  ]);

  return (
    <>
      <JsonLd data={clkrHubJsonLd("en")} />
      <ClkrLegalAiHub locale="en" signedIn={signedIn} articles={articles} />
    </>
  );
}
