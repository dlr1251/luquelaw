import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClkrArticleLayout } from "@/components/clkr/article-layout";
import { ClkrSectionBody } from "@/components/clkr/section-body";
import { ArticleNavigation } from "@/components/clkr/article-navigation";
import {
  getPublishedArticle,
  getRelatedPublishedArticles,
  getTranslationSlugKey,
} from "@/lib/clkr/get-articles";
import { getArticleRelations, getArticleStudyPaths } from "@/lib/clkr/get-study-paths";
import { clkrPublicPath, recordToHubArticle } from "@/lib/clkr/types";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildClkrArticleMetadata } from "@/lib/seo/metadata";
import { clkrArticleJsonLd } from "@/lib/seo/schemas";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = "en" as const;
  const article = await getPublishedArticle(slug, locale);

  if (!article) {
    return { title: "Article not found" };
  }

  const translationSlugKey = await getTranslationSlugKey(slug, locale);
  return buildClkrArticleMetadata(article, translationSlugKey);
}

export default async function ClkrArticlePage({ params }: Props) {
  const { slug } = await params;
  const locale = "en" as const;
  const article = await getPublishedArticle(slug, locale);

  if (!article) {
    notFound();
  }

  const related = await getRelatedPublishedArticles(slug, locale);
  const sections = article.sections.map((s) => ({ id: s.id, title: s.title }));

  // Get article relationships
  const prerequisites = await getArticleRelations(article.id, "prerequisite");
  const nextSteps = await getArticleRelations(article.id, "next_step");
  const studyPaths = await getArticleStudyPaths(article.id, locale);

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
      >
        <ClkrSectionBody sections={article.sections} />
        <ArticleNavigation
          prerequisites={prerequisites.map((r) => r.to_article)}
          nextSteps={nextSteps.map((r) => r.to_article)}
          studyPaths={studyPaths}
          locale={locale}
        />
      </ClkrArticleLayout>
    </>
  );
}

export async function generateStaticParams() {
  return [];
}
