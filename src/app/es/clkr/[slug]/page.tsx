import { notFound } from "next/navigation";

import { ClkrArticleLayout } from "@/components/clkr/article-layout";
import { ClkrSectionBody } from "@/components/clkr/section-body";
import { getPublishedArticle, getRelatedPublishedArticles } from "@/lib/clkr/get-articles";
import { clkrPublicPath, recordToHubArticle } from "@/lib/clkr/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ClkrArticleEsPage({ params }: Props) {
  const { slug } = await params;
  const locale = "es" as const;
  const article = await getPublishedArticle(slug, locale);

  if (!article) {
    notFound();
  }

  const related = await getRelatedPublishedArticles(slug, locale);
  const sections = article.sections.map((s) => ({ id: s.id, title: s.title }));

  return (
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
    </ClkrArticleLayout>
  );
}

export async function generateStaticParams() {
  return [];
}
