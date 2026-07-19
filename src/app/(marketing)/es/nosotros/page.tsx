import type { Metadata } from "next";

import { AboutPage } from "@/components/about/about-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.about.es.title,
  description: PAGE_SEO.about.es.description,
  path: "/es/nosotros",
  locale: "es",
});

export default function NosotrosPage() {
  return <AboutPage locale="es" />;
}
