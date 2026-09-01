import { notFound } from "next/navigation";

import { LibraryDetailView } from "@/components/agents/library-detail-view";
import { Container } from "@/components/container";
import { getPublishedPromptBySlug } from "@/lib/agents/get-agents";
import { clkrLibraryPath, clkrPublicPath } from "@/lib/clkr/types";

type Props = { params: Promise<{ slug: string }> };

export default async function PromptDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = "en" as const;
  const prompt = await getPublishedPromptBySlug(slug, locale);

  if (!prompt) notFound();

  const articleHref = prompt.article_slug_key
    ? clkrPublicPath(prompt.article_slug_key, locale)
    : null;

  return (
    <main className="flex-1">
      <Container className="py-12 sm:py-14">
        <LibraryDetailView
          title={prompt.title}
          description={prompt.description}
          body={prompt.prompt_text}
          locale={locale}
          articleHref={articleHref}
          articleLabel="Read CLKR article"
          backHref={clkrLibraryPath(locale)}
          backLabel="Skills & prompts library"
          kind="prompt"
        />
      </Container>
    </main>
  );
}
