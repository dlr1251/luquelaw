import { notFound } from "next/navigation";

import { LibraryDetailView } from "@/components/agents/library-detail-view";
import { ClkrProductNav } from "@/components/clkr/clkr-product-nav";
import { Container } from "@/components/container";
import { getPublishedPromptBySlug } from "@/lib/agents/get-agents";
import { getSignedInFlag } from "@/lib/auth/signed-in";
import { clkrLibraryPath, clkrPublicPath } from "@/lib/clkr/types";

type Props = { params: Promise<{ slug: string }> };

export default async function PromptDetailEsPage({ params }: Props) {
  const { slug } = await params;
  const locale = "es" as const;
  const [prompt, signedIn] = await Promise.all([
    getPublishedPromptBySlug(slug, locale),
    getSignedInFlag(),
  ]);

  if (!prompt) notFound();

  const articleHref = prompt.article_slug_key
    ? clkrPublicPath(prompt.article_slug_key, locale)
    : null;

  return (
    <main className="flex-1">
      <ClkrProductNav locale={locale} signedIn={signedIn} />
      <Container className="py-12 sm:py-14">
        <LibraryDetailView
          title={prompt.title}
          description={prompt.description}
          body={prompt.prompt_text}
          locale={locale}
          articleHref={articleHref}
          articleLabel="Leer artículo CLKR"
          backHref={clkrLibraryPath(locale)}
          backLabel="Biblioteca de skills y prompts"
          kind="prompt"
        />
      </Container>
    </main>
  );
}
