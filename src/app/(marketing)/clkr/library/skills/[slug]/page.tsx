import { notFound } from "next/navigation";

import { LibraryDetailView } from "@/components/agents/library-detail-view";
import { ClkrProductNav } from "@/components/clkr/clkr-product-nav";
import { Container } from "@/components/container";
import { getPublishedSkillBySlug } from "@/lib/agents/get-agents";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { clkrLibraryPath, clkrPublicPath } from "@/lib/clkr/types";

type Props = { params: Promise<{ slug: string }> };

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = "en" as const;
  const [skill, signedIn] = await Promise.all([
    getPublishedSkillBySlug(slug, locale),
    getSignedInFlag(),
  ]);

  if (!skill) notFound();

  const articleHref = skill.article_slug_key
    ? clkrPublicPath(skill.article_slug_key, locale)
    : null;

  return (
    <main className="flex-1">
      <ClkrProductNav locale={locale} signedIn={signedIn} />
      <Container className="py-12 sm:py-14">
        <LibraryDetailView
          title={skill.title}
          description={skill.description}
          body={skill.body}
          locale={locale}
          articleHref={articleHref}
          articleLabel="Read CLKR article"
          backHref={clkrLibraryPath(locale)}
          backLabel="Skills & prompts library"
          kind="skill"
        />
      </Container>
    </main>
  );
}
