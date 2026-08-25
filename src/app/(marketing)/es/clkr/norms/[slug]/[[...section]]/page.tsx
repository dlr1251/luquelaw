import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { NormLayout } from "@/components/norms/norm-layout";
import { NormComments } from "@/components/norms/norm-comments";
import { NormDoctrinalCommentaries } from "@/components/norms/norm-doctrinal-commentaries";
import { getPublishedCommentariesForSection } from "@/lib/commentaries/get-commentaries";
import {
  getPublishedNormWithSections,
  getTranslationSlugKey,
} from "@/lib/norms/get-norms";
import {
  buildTocTree,
  defaultSectionPath,
  resolveSectionRequest,
} from "@/lib/norms/tree";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { listCommentsForSection } from "@/lib/comments/queries";
import { normPublicPath } from "@/lib/norms/types";
import { isSaved } from "@/lib/saves/actions";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildNormMetadata } from "@/lib/seo/metadata";
import { normJsonLd } from "@/lib/seo/schemas";
import { SaveButton } from "@/components/saves/save-button";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string; section?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, section } = await params;
  const locale = "es" as const;
  const data = await getPublishedNormWithSections(slug, locale);

  if (!data) {
    return { title: "Norma no encontrada" };
  }

  const sectionPath = section?.length ? section : defaultSectionPath(data.tree);
  const resolved = resolveSectionRequest(data.tree, sectionPath);
  const active = resolved?.node;
  const translationSlugKey = await getTranslationSlugKey(slug, locale);

  return buildNormMetadata(
    data.norm,
    resolved?.canonicalPath ?? sectionPath,
    active?.title,
    translationSlugKey,
  );
}

export default async function NormPageEs({ params }: Props) {
  const { slug, section } = await params;
  const locale = "es" as const;
  const data = await getPublishedNormWithSections(slug, locale);

  if (!data) {
    notFound();
  }

  const { norm, tree } = data;

  if (!section?.length && tree.length) {
    redirect(normPublicPath(slug, locale, defaultSectionPath(tree)));
  }

  const sectionPath = section ?? [];
  const resolved = resolveSectionRequest(tree, sectionPath);

  if (!resolved) {
    notFound();
  }

  const { node: active, canonicalPath } = resolved;

  if (canonicalPath.join("/") !== sectionPath.join("/")) {
    redirect(normPublicPath(slug, locale, canonicalPath));
  }

  const toc = buildTocTree(tree, slug, locale, canonicalPath);
  const [signedIn, viewerUserId, doctrinal, saved] = await Promise.all([
    getSignedInFlag(),
    getSessionUserId(),
    getPublishedCommentariesForSection(active.id),
    isSaved("norm", slug, locale),
  ]);
  const comments = await listCommentsForSection(active.id, viewerUserId);
  const currentPath = normPublicPath(slug, locale, canonicalPath);

  return (
    <>
      <JsonLd data={normJsonLd(norm, canonicalPath, active.title)} />
      <NormLayout
        locale={locale}
        signedIn={signedIn}
        sectionPath={canonicalPath}
        sectionTitle={active.title}
        sectionNumberLabel={active.number_label}
        sectionHtml={active.html}
        title={norm.title}
        description={norm.description}
        category={norm.category}
        normType={norm.norm_type}
        officialReference={norm.official_reference}
        officialSourceUrl={norm.official_source_url}
        toc={toc}
        headerAction={
          <SaveButton
            targetType="norm"
            targetSlug={slug}
            title={norm.title}
            locale={locale}
            initiallySaved={saved}
            loginHref={`/login?next=${encodeURIComponent(currentPath)}`}
          />
        }
      >
        <NormDoctrinalCommentaries
          commentaries={doctrinal}
          locale={locale}
        />
        <NormComments
          normId={norm.id}
          sectionId={active.id}
          locale={locale}
          signedIn={signedIn}
          viewerUserId={viewerUserId}
          initialComments={comments}
          currentPath={currentPath}
        />
      </NormLayout>
    </>
  );
}

export async function generateStaticParams() {
  return [];
}
