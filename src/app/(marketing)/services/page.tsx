import type { Metadata } from "next";

import { ServicesHubPage } from "@/components/services/services-hub-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.services.en.title,
  description: PAGE_SEO.services.en.description,
  path: "/services",
  locale: "en",
});

export default function ServicesPage() {
  return <ServicesHubPage locale="en" />;
}
