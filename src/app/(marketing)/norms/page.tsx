import type { Metadata } from "next";

import { NormsHub } from "@/components/norms/norms-hub";
import { getHubNorms } from "@/lib/norms/get-norms";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/config";
import { normsHubJsonLd } from "@/lib/seo/schemas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.normsHub.en.title,
  description: PAGE_SEO.normsHub.en.description,
  path: "/norms",
  locale: "en",
});

export default async function NormsHubPage() {
  const norms = await getHubNorms("en");

  return (
    <>
      <JsonLd data={normsHubJsonLd("en")} />
      <NormsHub norms={norms} locale="en" />
    </>
  );
}
