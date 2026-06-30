import { ClkrHub } from "@/components/clkr/clkr-hub";
import { getHubArticles } from "@/lib/clkr/get-hub-articles";
import { getStudyPaths } from "@/lib/clkr/get-study-paths";
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
  const articles = await getHubArticles("en");
  const studyPaths = await getStudyPaths("en");
  return (
    <>
      <JsonLd data={clkrHubJsonLd("en")} />
      <ClkrHub articles={articles} studyPaths={studyPaths} locale="en" />
    </>
  );
}
