import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NormLongRead } from "@/components/norms/norm-long-read";
import {
  getPublishedNormWithSections,
  getTranslationSlugKey,
} from "@/lib/norms/get-norms";
import { buildTocTree } from "@/lib/norms/tree";
import { loadNormReaderExtras } from "@/lib/norms/load-reader-extras";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildNormReaderMetadata } from "@/lib/seo/metadata";
import { normJsonLd } from "@/lib/seo/schemas";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = "es" as const;
  const data = await getPublishedNormWithSections(slug, locale);

  if (!data) {
    return { title: "Norma no encontrada" };
  }

  const translationSlugKey = await getTranslationSlugKey(slug, locale);
  return buildNormReaderMetadata(data.norm, translationSlugKey);
}

export default async function NormReaderPageEs({ params }: Props) {
  const { slug } = await params;
  const locale = "es" as const;
  const data = await getPublishedNormWithSections(slug, locale);

  if (!data) {
    notFound();
  }

  const { norm, tree } = data;
  const toc = buildTocTree(tree, slug, locale, [], "anchor");
  const extras = await loadNormReaderExtras(
    slug,
    locale,
    norm.id,
    norm.category,
    data.sections.map((s) => s.id),
  );

  return (
    <>
      <JsonLd data={normJsonLd(norm, [], norm.title)} />
      <NormLongRead
        locale={locale}
        slugKey={slug}
        title={norm.title}
        description={norm.description}
        category={norm.category}
        normType={norm.norm_type}
        officialReference={norm.official_reference}
        officialSourceUrl={norm.official_source_url}
        tree={tree}
        toc={toc}
        readerPath={extras.readerPath}
        commentariesBySection={extras.commentariesBySection}
        translationNotesBySection={extras.translationNotesBySection}
        apparatusCountBySection={extras.apparatusCountBySection}
        otherNorms={extras.otherNorms}
      />
    </>
  );
}
