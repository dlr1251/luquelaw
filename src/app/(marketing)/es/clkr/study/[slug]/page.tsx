import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookMarked, Clock, GraduationCap } from "lucide-react";

import { Container } from "@/components/container";
import { ClkrArticleCard } from "@/components/clkr/clkr-article-card";
import { ClkrCategoryIcon } from "@/components/clkr/category-icon";
import { getStudyPathWithSteps } from "@/lib/clkr/get-study-paths";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = "es" as const;
  const path = await getStudyPathWithSteps(slug, locale);

  if (!path) {
    return { title: "Ruta de estudio no encontrada" };
  }

  return {
    title: `${path.title} - Ruta de estudio | CLKR`,
    description: path.description,
  };
}

export default async function StudyPathPageES({ params }: Props) {
  const { slug } = await params;
  const locale = "es" as const;
  const path = await getStudyPathWithSteps(slug, locale);

  if (!path) {
    notFound();
  }

  const copy = {
    back: "Volver a CLKR",
    articles: "artículos",
    difficulty: {
      beginner: "Principiante",
      intermediate: "Intermedio",
      advanced: "Avanzado",
    },
    steps: "Ruta de aprendizaje",
    read: "Leer guía",
  };

  return (
    <main className="flex-1">
      <section className="border-b border-[color:var(--moss)]/25 bg-[color:var(--background)]">
        <Container className="py-12 sm:py-14">
          <Link
            href="/es/clkr"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-ui)] text-[0.75rem] text-muted-foreground transition hover:text-[color:var(--forest)]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            {copy.back}
          </Link>

          <div className="mt-6 flex flex-wrap items-start gap-4">
            <ClkrCategoryIcon category={path.category} className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
                <span className="border border-[color:var(--moss)]/40 bg-[color:var(--surface)] px-2 py-1 text-[color:var(--forest)]">
                  {path.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {copy.difficulty[path.difficulty]}
                </span>
              </div>

              <h1 className="mt-3 font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[2.6rem]">
                {path.title}
              </h1>

              <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                {path.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-[family-name:var(--font-ui)] text-[0.75rem] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <BookMarked className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  <span>
                    {path.articleCount} {copy.articles}
                  </span>
                </div>
                {path.estimatedTime ? (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    <span>{path.estimatedTime}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <div className="mb-8">
          <h2 className="font-display text-xl font-normal tracking-tight text-[color:var(--forest)] sm:text-2xl">
            {copy.steps}
          </h2>
        </div>

        <ol className="space-y-6">
          {path.steps.map((step, index) => (
            <li key={step.article.id} className="flex gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[color:var(--moss)] bg-[color:var(--card)] font-[family-name:var(--font-ui)] text-sm font-bold text-[color:var(--moss)]">
                  {index + 1}
                </div>
                {index < path.steps.length - 1 ? (
                  <div className="mt-2 h-full w-[2px] bg-[color:var(--moss)]/25" />
                ) : null}
              </div>

              <div className="flex-1 pb-6">
                {step.description ? (
                  <p className="mb-4 text-sm text-muted-foreground">{step.description}</p>
                ) : null}
                <ClkrArticleCard article={step.article} readLabel={copy.read} />
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </main>
  );
}

export async function generateStaticParams() {
  return [];
}
