import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClkrArticleLayout } from "@/components/clkr/article-layout";
import { ClkrSectionBody } from "@/components/clkr/section-body";
import { SaveButton } from "@/components/saves/save-button";
import {
  getPublishedArticle,
  getRelatedPublishedArticles,
  getTranslationSlugKey,
} from "@/lib/clkr/get-articles";
import { clkrPublicPath, recordToHubArticle } from "@/lib/clkr/types";
import { isSaved } from "@/lib/saves/actions";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildClkrArticleMetadata } from "@/lib/seo/metadata";
import { clkrArticleJsonLd } from "@/lib/seo/schemas";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = "es" as const;
  const article = await getPublishedArticle(slug, locale);

  if (!article) {
    return { title: "Artículo no encontrado" };
  }

  const translationSlugKey = await getTranslationSlugKey(slug, locale);
  return buildClkrArticleMetadata(article, translationSlugKey);
}

export default async function ClkrArticleEsPage({ params }: Props) {
  const { slug } = await params;
  const locale = "es" as const;
  const article = await getPublishedArticle(slug, locale);

  if (!article) {
    notFound();
  }

  const related = await getRelatedPublishedArticles(slug, locale);
  const sections = article.sections.map((s) => ({ id: s.id, title: s.title }));
  const saved = await isSaved("guide", slug, locale);

  return (
    <>
      <JsonLd data={clkrArticleJsonLd(article)} />
      <ClkrArticleLayout
        locale={locale}
        currentSlug={clkrPublicPath(slug, locale)}
        title={article.title}
        category={article.category}
        readingTime={article.reading_time}
        description={article.description}
        sections={sections}
        relatedArticles={related.map(recordToHubArticle)}
        headerAction={
          <SaveButton
            targetType="guide"
            targetSlug={slug}
            title={article.title}
            locale={locale}
            initiallySaved={saved}
            loginHref={`/login?next=/es/clkr/guides/${slug}`}
          />
        }
      >
        <ClkrSectionBody sections={article.sections} />
      </ClkrArticleLayout>
    </>
  );
}

export async function generateStaticParams() {
  return [];
}
