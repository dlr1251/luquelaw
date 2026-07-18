import { notFound } from "next/navigation";

import { VisaDetail } from "@/components/practice-areas/visa-detail";
import { getVisaBySlug, VISAS_CATALOG } from "@/lib/practice-areas/visas-catalog";
import { buildPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return VISAS_CATALOG.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const visa = getVisaBySlug(slug);
  if (!visa) return {};
  return buildPageMetadata({
    title: `${visa.name.es} — Visa colombiana`,
    description: visa.summary.es,
    path: `/es/migracion/visas/${slug}`,
    locale: "es",
  });
}

export default async function ImmigrationVisaDetailPageEs({ params }: Props) {
  const { slug } = await params;
  const visa = getVisaBySlug(slug);
  if (!visa) notFound();
  return <VisaDetail locale="es" visa={visa} />;
}
