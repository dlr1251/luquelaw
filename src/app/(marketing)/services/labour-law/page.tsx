import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/services/service-area-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.labourLaw.en.title,
  description: PAGE_SEO.labourLaw.en.description,
  path: "/services/labour-law",
  locale: "en",
});

export default function Page() {
  return <ServiceAreaPage locale="en" areaId="labour-law" />;
}
