import Link from "next/link";
import { ArrowRight, BookOpen, TrendingUp } from "lucide-react";
import type { ClkrArticle } from "@/lib/clkr/types";

type Props = {
  prerequisites?: ClkrArticle[];
  nextSteps?: ClkrArticle[];
  studyPaths?: Array<{ id: string; slug: string; title: string }>;
  locale?: "en" | "es";
};

export function ArticleNavigation({ prerequisites, nextSteps, studyPaths, locale = "en" }: Props) {
  const copy =
    locale === "es"
      ? {
          prerequisites: "Antes de continuar",
          prerequisitesDesc: "Se recomienda leer primero:",
          nextSteps: "Próximos pasos",
          nextStepsDesc: "Continúa tu aprendizaje con:",
          studyPaths: "Parte de estas rutas",
          viewPath: "Ver ruta completa",
          read: "Leer →",
        }
      : {
          prerequisites: "Prerequisites",
          prerequisitesDesc: "Recommended reading first:",
          nextSteps: "Next steps",
          nextStepsDesc: "Continue your learning with:",
          studyPaths: "Part of these learning paths",
          viewPath: "View full path",
          read: "Read →",
        };

  const hasContent =
    (prerequisites && prerequisites.length > 0) ||
    (nextSteps && nextSteps.length > 0) ||
    (studyPaths && studyPaths.length > 0);

  if (!hasContent) return null;

  return (
    <aside className="mt-12 space-y-6 border-t border-[color:var(--moss)]/25 pt-10">
      {prerequisites && prerequisites.length > 0 ? (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[color:var(--moss)]" strokeWidth={1.75} aria-hidden="true" />
            <h3 className="font-[family-name:var(--font-ui)] text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[color:var(--forest)]">
              {copy.prerequisites}
            </h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{copy.prerequisitesDesc}</p>
          <ul className="space-y-3">
            {prerequisites.map((article) => (
              <li
                key={article.slug}
                className="border-l-2 border-[color:var(--moss)]/40 pl-4 transition hover:border-[color:var(--moss)]"
              >
                <Link
                  href={article.slug}
                  className="block text-sm font-medium text-[color:var(--forest)] hover:text-[color:var(--moss)]"
                >
                  {article.title}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{article.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {nextSteps && nextSteps.length > 0 ? (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[color:var(--moss)]" strokeWidth={1.75} aria-hidden="true" />
            <h3 className="font-[family-name:var(--font-ui)] text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[color:var(--forest)]">
              {copy.nextSteps}
            </h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{copy.nextStepsDesc}</p>
          <ul className="space-y-3">
            {nextSteps.map((article) => (
              <li key={article.slug}>
                <Link
                  href={article.slug}
                  className="group flex items-start gap-3 border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-4 transition hover:border-[color:var(--moss)] hover:shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[color:var(--forest)] group-hover:text-[color:var(--moss)]">
                      {article.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{article.description}</p>
                  </div>
                  <ArrowRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--moss)] opacity-0 transition group-hover:opacity-100"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {studyPaths && studyPaths.length > 0 ? (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[color:var(--moss)]" strokeWidth={1.75} aria-hidden="true" />
            <h3 className="font-[family-name:var(--font-ui)] text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[color:var(--forest)]">
              {copy.studyPaths}
            </h3>
          </div>
          <ul className="space-y-2">
            {studyPaths.map((path) => (
              <li key={path.id}>
                <Link
                  href={path.slug}
                  className="block border border-[color:var(--moss)]/35 bg-[color:var(--surface)] px-4 py-3 text-sm font-medium text-[color:var(--forest)] transition hover:border-[color:var(--moss)] hover:bg-[color:var(--card)]"
                >
                  {path.title}
                  <span className="ml-2 text-xs text-muted-foreground">{copy.viewPath} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
