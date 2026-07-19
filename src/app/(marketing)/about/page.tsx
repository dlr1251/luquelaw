import type { Metadata } from "next";

import { AboutPage } from "@/components/about/about-page";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_SEO.about.en.title,
  description: PAGE_SEO.about.en.description,
  path: "/about",
  locale: "en",
});

export default function AboutRoutePage() {
  return <AboutPage locale="en" />;
}
