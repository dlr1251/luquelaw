import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/services/service-area-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.corporateLaw.en.title,
  description: PAGE_SEO.corporateLaw.en.description,
  path: "/services/corporate-law",
  locale: "en",
});

export default function Page() {
  return <ServiceAreaPage locale="en" areaId="corporate-law" />;
}
