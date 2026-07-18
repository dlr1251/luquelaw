import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Legacy `/clkr/[slug]` → `/clkr/guides/[slug]` */
export default async function LegacyClkrArticleRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/clkr/guides/${slug}`);
}
