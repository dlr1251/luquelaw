import { notFound } from "next/navigation";

import { VisaDetail } from "@/components/practice-areas/visa-detail";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { listCommentsForSection } from "@/lib/comments/queries";
import { VISAS_CATALOG, toVisaNavItems } from "@/lib/practice-areas/visas-catalog";
import { getVisaNormCommentTarget } from "@/lib/visas/norm-comments";
import { resolveVisaBySlug, resolveVisasCatalog } from "@/lib/visas/get-visas";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return VISAS_CATALOG.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const visa = await resolveVisaBySlug(slug);
  if (!visa) return {};
  return buildPageMetadata({
    title: `${visa.name.es} — Visa colombiana`,
    description: visa.summary.es,
    path: `/es/servicios/migracion/visas/${slug}`,
    locale: "es",
  });
}

export default async function ImmigrationVisaDetailPageEs({ params }: Props) {
  const { slug } = await params;
  const [visa, catalog] = await Promise.all([
    resolveVisaBySlug(slug),
    resolveVisasCatalog(),
  ]);
  if (!visa) notFound();

  let comments = null;
  if (visa.enableNormComments) {
    const [target, signedIn, viewerUserId] = await Promise.all([
      getVisaNormCommentTarget(visa.articleNum, "es"),
      getSignedInFlag(),
      getSessionUserId(),
    ]);
    if (target) {
      const initialComments = await listCommentsForSection(
        target.sectionId,
        viewerUserId,
      );
      comments = { target, initialComments, signedIn, viewerUserId };
    }
  }

  return <VisaDetail locale="es" visa={visa} catalog={toVisaNavItems(catalog)} comments={comments} />;
}
