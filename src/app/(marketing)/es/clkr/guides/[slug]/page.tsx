import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClkrArticleLayout } from "@/components/clkr/article-layout";
import { ClkrSectionBody } from "@/components/clkr/section-body";
import { SaveButton } from "@/components/saves/save-button";
import {
  getPublishedArticle,
  getRelatedArticlesForArticle,
  getTranslationSlugKey,
} from "@/lib/clkr/get-articles";
import {
  getPublishedPromptsByArticle,
  getPublishedSkillsByArticle,
} from "@/lib/agents/get-agents";
import { getArticleRelations, getArticleStudyPaths } from "@/lib/clkr/get-study-paths";
import { clkrPublicPath } from "@/lib/clkr/types";
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

  const [related, prerequisites, nextSteps, studyPaths, linkedPrompts, linkedSkills, saved] =
    await Promise.all([
      getRelatedArticlesForArticle(article.id, slug, locale),
      getArticleRelations(article.id, "prerequisite"),
      getArticleRelations(article.id, "next_step"),
      getArticleStudyPaths(article.id, locale),
      getPublishedPromptsByArticle(slug, locale),
      getPublishedSkillsByArticle(slug, locale),
      isSaved("guide", slug, locale),
    ]);

  const sections = article.sections.map((s) => ({ id: s.id, title: s.title }));

  return (
    <>
      <JsonLd data={clkrArticleJsonLd(article)} />
      <ClkrArticleLayout
        locale={locale}
        currentSlug={clkrPublicPath(slug, locale)}
        articleSlugKey={slug}
        title={article.title}
        category={article.category}
        readingTime={article.reading_time}
        description={article.description}
        sections={sections}
        relatedArticles={related}
        prerequisites={prerequisites.map((rel) => rel.to_article)}
        nextSteps={nextSteps.map((rel) => rel.to_article)}
        studyPaths={studyPaths.map((path) => ({
          id: path.id,
          slug: path.slug,
          title: path.title,
        }))}
        linkedPrompts={linkedPrompts}
        linkedSkills={linkedSkills}
        headerAction={
          <SaveButton
            targetType="guide"
            targetSlug={slug}
            title={article.title}
            locale={locale}
            initiallySaved={saved}
            loginHref={`/es/login?next=/es/clkr/guides/${slug}`}
          />
        }
      >
        <ClkrSectionBody sections={article.sections} locale={locale} />
      </ClkrArticleLayout>
    </>
  );
}

export async function generateStaticParams() {
  return [];
}
