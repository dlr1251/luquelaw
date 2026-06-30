import Link from "next/link";
import { BookMarked, Clock, GraduationCap, Layers, TrendingUp } from "lucide-react";
import type { StudyPath } from "@/lib/clkr/types";
import { ClkrCategoryIcon } from "./category-icon";

type Props = {
  path: StudyPath;
  locale?: "en" | "es";
};

const difficultyIcons = {
  beginner: GraduationCap,
  intermediate: TrendingUp,
  advanced: Layers,
};

export function StudyPathCard({ path, locale = "en" }: Props) {
  const copy =
    locale === "es"
      ? {
          articles: "artículos",
          difficulty: {
            beginner: "Principiante",
            intermediate: "Intermedio",
            advanced: "Avanzado",
          },
          start: "Comenzar →",
        }
      : {
          articles: "articles",
          difficulty: {
            beginner: "Beginner",
            intermediate: "Intermediate",
            advanced: "Advanced",
          },
          start: "Start learning →",
        };

  const DifficultyIcon = difficultyIcons[path.difficulty];

  return (
    <article className="group flex h-full flex-col border border-[color:var(--moss)]/35 bg-[color:var(--card)] transition hover:border-[color:var(--moss)] hover:shadow-sm">
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <ClkrCategoryIcon category={path.category} className="h-8 w-8 shrink-0" />
          <div className="flex items-center gap-1.5 text-[color:var(--moss)]">
            <DifficultyIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em]">
              {copy.difficulty[path.difficulty]}
            </span>
          </div>
        </div>

        <h3 className="font-display text-xl font-normal leading-snug tracking-tight text-[color:var(--forest)] group-hover:text-[color:var(--moss)]">
          {path.title}
        </h3>

        <p className="mt-2.5 flex-1 text-sm leading-6 text-muted-foreground line-clamp-3">
          {path.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[color:var(--moss)]/20 pt-4 font-[family-name:var(--font-ui)] text-[0.75rem] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookMarked className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span>
              {path.articleCount} {copy.articles}
            </span>
          </div>
          {path.estimatedTime ? (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              <span>{path.estimatedTime}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-[color:var(--moss)]/20 bg-[color:var(--surface)] px-6 py-4">
        <Link
          href={path.slug}
          className="inline-flex items-center text-sm font-bold text-[color:var(--forest)] underline-offset-2 transition hover:text-[color:var(--moss)] hover:underline"
        >
          {copy.start}
        </Link>
      </div>
    </article>
  );
}
