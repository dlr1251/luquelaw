import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Legacy `/es/clkr/[slug]` → `/es/clkr/guides/[slug]` */
export default async function LegacyClkrArticleRedirectEs({ params }: Props) {
  const { slug } = await params;
  redirect(`/es/clkr/guides/${slug}`);
}
