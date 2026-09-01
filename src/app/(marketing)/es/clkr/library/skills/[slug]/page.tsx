import { notFound } from "next/navigation";

import { LibraryDetailView } from "@/components/agents/library-detail-view";
import { Container } from "@/components/container";
import { getPublishedSkillBySlug } from "@/lib/agents/get-agents";
import { clkrLibraryPath, clkrPublicPath } from "@/lib/clkr/types";

type Props = { params: Promise<{ slug: string }> };

export default async function SkillDetailEsPage({ params }: Props) {
  const { slug } = await params;
  const locale = "es" as const;
  const skill = await getPublishedSkillBySlug(slug, locale);

  if (!skill) notFound();

  const articleHref = skill.article_slug_key
    ? clkrPublicPath(skill.article_slug_key, locale)
    : null;

  return (
    <main className="flex-1">
      <Container className="py-12 sm:py-14">
        <LibraryDetailView
          title={skill.title}
          description={skill.description}
          body={skill.body}
          locale={locale}
          articleHref={articleHref}
          articleLabel="Leer artículo CLKR"
          backHref={clkrLibraryPath(locale)}
          backLabel="Biblioteca de skills y prompts"
          kind="skill"
        />
      </Container>
    </main>
  );
}
