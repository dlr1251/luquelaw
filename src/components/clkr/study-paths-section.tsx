import { BookOpen } from "lucide-react";
import type { StudyPath } from "@/lib/clkr/types";
import { StudyPathCard } from "./study-path-card";

type Props = {
  paths: StudyPath[];
  locale?: "en" | "es";
};

export function StudyPathsSection({ paths, locale = "en" }: Props) {
  if (paths.length === 0) return null;

  const copy =
    locale === "es"
      ? {
          title: "Rutas de estudio",
          subtitle:
            "Sigue estas rutas curadas para aprender temas complejos paso a paso, desde los fundamentos hasta temas avanzados.",
          eyebrow: "Aprende de forma estructurada",
        }
      : {
          title: "Study Paths",
          subtitle:
            "Follow these curated learning tracks to master complex topics step by step, from fundamentals to advanced concepts.",
          eyebrow: "Structured learning",
        };

  return (
    <section className="border-b border-[color:var(--moss)]/20 bg-[color:var(--surface)] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-[color:var(--moss)]/35 bg-[color:var(--card)] text-[color:var(--moss)]">
            <BookOpen className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.18em] text-[color:var(--moss)]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-2xl font-normal tracking-tight text-[color:var(--forest)] sm:text-3xl">
              {copy.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.subtitle}</p>
          </div>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <li key={path.id}>
              <StudyPathCard path={path} locale={locale} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
