import type { Metadata } from "next";

import { ServiceAreaPage } from "@/components/services/service-area-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.realEstate.en.title,
  description: PAGE_SEO.realEstate.en.description,
  path: "/services/real-estate",
  locale: "en",
});

export default function Page() {
  return <ServiceAreaPage locale="en" areaId="real-estate" />;
}
