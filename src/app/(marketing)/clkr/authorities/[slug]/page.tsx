import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AuthorityRecord } from "@/components/norms/authority-record";
import {
  getAuthorityBySlug,
  getCitationsFromAuthority,
} from "@/lib/norms/get-apparatus";
import { getPublishedNormWithSections } from "@/lib/norms/get-norms";
import { findPathToSectionKey } from "@/lib/norms/tree";
import { authorityPublicPath } from "@/lib/norms/citations";
import { normPublicPath } from "@/lib/norms/types";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/routes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const authority = await getAuthorityBySlug(slug);
  if (!authority) return { title: "Authority not found" };
  return buildPageMetadata({
    title: authority.title_en || authority.title,
    description: authority.citation_label,
    path: authorityPublicPath(slug, "en"),
    locale: "en",
    languageAlternates: {
      en: absoluteUrl(authorityPublicPath(slug, "en")),
      es: absoluteUrl(authorityPublicPath(slug, "es")),
      "x-default": absoluteUrl(authorityPublicPath(slug, "en")),
    },
    noIndex: authority.ingest_status === "stub",
  });
}

export default async function AuthorityPage({ params }: Props) {
  const { slug } = await params;
  const locale = "en" as const;
  const authority = await getAuthorityBySlug(slug);
  if (!authority) notFound();
  if (authority.target_norm_slug_key) {
    redirect(normPublicPath(authority.target_norm_slug_key, locale));
  }

  const raw = await getCitationsFromAuthority(authority.id, 24);
  const et = await getPublishedNormWithSections("estatuto-tributario", locale);
  const citedFrom = [];
  const seen = new Set<string>();
  if (et) {
    for (const row of raw) {
      const section = et.sections.find((s) => s.id === row.section_id);
      if (!section || seen.has(section.id)) continue;
      seen.add(section.id);
      const path = findPathToSectionKey(et.tree, section.section_key) ?? [section.section_key];
      citedFrom.push({
        href: normPublicPath("estatuto-tributario", locale, path),
        label: section.number_label || section.title,
      });
    }
  }

  return (
    <AuthorityRecord locale={locale} authority={authority} citedFrom={citedFrom.slice(0, 12)} />
  );
}
