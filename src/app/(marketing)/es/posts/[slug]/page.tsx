import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClkrSectionBody } from "@/components/clkr/section-body";
import { PostLayout } from "@/components/posts/post-layout";
import {
  getPublishedPost,
  getRelatedPublishedPosts,
  getTranslationSlugKey,
} from "@/lib/posts/get-posts";
import { recordToHubPost } from "@/lib/posts/types";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildPostMetadata } from "@/lib/seo/metadata";
import { postJsonLd } from "@/lib/seo/schemas";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = "es" as const;
  const post = await getPublishedPost(slug, locale);

  if (!post) {
    return { title: "Artículo no encontrado" };
  }

  const translationSlugKey = await getTranslationSlugKey(slug, locale);
  return buildPostMetadata(post, translationSlugKey);
}

export default async function PostEsPage({ params }: Props) {
  const { slug } = await params;
  const locale = "es" as const;
  const post = await getPublishedPost(slug, locale);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPublishedPosts(slug, locale);
  const sections = post.sections.map((s) => ({ id: s.id, title: s.title }));

  return (
    <>
      <JsonLd data={postJsonLd(post)} />
      <PostLayout
        locale={locale}
        title={post.title}
        category={post.category}
        readingTime={post.reading_time}
        description={post.description}
        publishedAt={post.published_at}
        sections={sections}
        relatedPosts={related.map(recordToHubPost)}
      >
        <ClkrSectionBody sections={post.sections} />
      </PostLayout>
    </>
  );
}

export async function generateStaticParams() {
  return [];
}
