import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { NormLayout } from "@/components/norms/norm-layout";
import {
  getPublishedNormWithSections,
  getTranslationSlugKey,
} from "@/lib/norms/get-norms";
import {
  buildTocEntries,
  defaultSectionPath,
  findSectionByPath,
} from "@/lib/norms/tree";
import { normPublicPath } from "@/lib/norms/types";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildNormMetadata } from "@/lib/seo/metadata";
import { normJsonLd } from "@/lib/seo/schemas";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string; section?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, section } = await params;
  const locale = "en" as const;
  const data = await getPublishedNormWithSections(slug, locale);

  if (!data) {
    return { title: "Norm not found" };
  }

  const sectionPath = section?.length ? section : defaultSectionPath(data.tree);
  const active = findSectionByPath(data.tree, sectionPath);
  const translationSlugKey = await getTranslationSlugKey(slug, locale);

  return buildNormMetadata(
    data.norm,
    sectionPath,
    active?.title,
    translationSlugKey,
  );
}

export default async function NormPage({ params }: Props) {
  const { slug, section } = await params;
  const locale = "en" as const;
  const data = await getPublishedNormWithSections(slug, locale);

  if (!data) {
    notFound();
  }

  const { norm, tree } = data;

  if (!section?.length && tree.length) {
    redirect(normPublicPath(slug, locale, defaultSectionPath(tree)));
  }

  const sectionPath = section ?? [];
  const active = findSectionByPath(tree, sectionPath);

  if (!active) {
    notFound();
  }

  const toc = buildTocEntries(tree, slug, locale, sectionPath);

  return (
    <>
      <JsonLd data={normJsonLd(norm, sectionPath, active.title)} />
      <NormLayout
        locale={locale}
        normSlug={slug}
        sectionPath={sectionPath}
        title={norm.title}
        description={norm.description}
        category={norm.category}
        normType={norm.norm_type}
        officialReference={norm.official_reference}
        officialSourceUrl={norm.official_source_url}
        toc={toc}
      >
        <article>
          <header className="mb-6 border-b border-[color:var(--moss)]/20 pb-4">
            {active.number_label ? (
              <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
                {active.number_label}
              </p>
            ) : null}
            <h2 className="font-display text-2xl font-normal tracking-tight text-[color:var(--forest)]">
              {active.title}
            </h2>
          </header>
          {active.html ? (
            <div dangerouslySetInnerHTML={{ __html: active.html }} />
          ) : (
            <p className="text-sm text-[color:var(--muted)]">
              This section is a structural heading. Select a child section in the table of contents.
            </p>
          )}
        </article>
      </NormLayout>
    </>
  );
}

export async function generateStaticParams() {
  return [];
}
