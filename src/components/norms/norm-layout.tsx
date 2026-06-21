"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { Container } from "@/components/container";
import { Prose } from "@/components/prose";
import type { TocEntry } from "@/lib/norms/tree";
import type { NormCategory, NormType } from "@/lib/norms/types";
import { normCategoryLabel, normTypeLabel } from "@/lib/norms/types";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  category: NormCategory;
  normType: NormType;
  officialReference: string;
  officialSourceUrl?: string | null;
  locale?: "en" | "es";
  normSlug: string;
  sectionPath: string[];
  toc: TocEntry[];
  children: ReactNode;
};

export function NormLayout({
  title,
  description,
  category,
  normType,
  officialReference,
  officialSourceUrl,
  locale = "en",
  normSlug,
  sectionPath,
  toc,
  children,
}: Props) {
  const prefix = locale === "es" ? "/es" : "";
  const homeHref = locale === "es" ? "/es" : "/";
  const normsHref = `${prefix}/norms`;
  const normHref = `${normsHref}/${normSlug}`;

  const copy =
    locale === "es"
      ? {
          home: "Inicio",
          hub: "Normas",
          contents: "Tabla de contenidos",
          mobileContents: "Contenido",
          officialSource: "Referencia oficial",
          disclaimer:
            "Solo referencia. La ley colombiana cambia; confirma el texto oficial vigente antes de actuar.",
          backToNorm: "Volver a la norma",
        }
      : {
          home: "Home",
          hub: "Norms",
          contents: "Table of contents",
          mobileContents: "Contents",
          officialSource: "Official reference",
          disclaimer:
            "For reference only. Colombian law changes; confirm the current official text before acting.",
          backToNorm: "Back to norm",
        };

  const breadcrumbSection =
    sectionPath.length > 0
      ? toc.find((entry) => entry.href.endsWith(`/${sectionPath.join("/")}`))?.title
      : null;

  return (
    <main className="flex-1">
      <section className="border-b border-[color:var(--moss)]/25 bg-[color:var(--background)]">
        <Container className="py-12 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-[family-name:var(--font-ui)] text-[0.75rem] text-muted-foreground">
              <li>
                <Link href={homeHref} className="hover:text-[color:var(--forest)] hover:underline">
                  {copy.home}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={normsHref} className="hover:text-[color:var(--forest)] hover:underline">
                  {copy.hub}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={normHref} className="hover:text-[color:var(--forest)] hover:underline">
                  {title}
                </Link>
              </li>
              {breadcrumbSection ? (
                <>
                  <li aria-hidden="true" className="max-sm:hidden">
                    /
                  </li>
                  <li
                    className="hidden max-w-full text-[color:var(--ink)] line-clamp-2 sm:block"
                    aria-current="page"
                  >
                    {breadcrumbSection}
                  </li>
                </>
              ) : null}
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
            <span className="border border-[color:var(--moss)]/40 bg-[color:var(--surface)] px-2 py-1 text-[color:var(--forest)]">
              {normCategoryLabel(category, locale)}
            </span>
            <span className="font-normal normal-case text-muted-foreground">
              {normTypeLabel(normType, locale)}
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[2.6rem]">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
          <p className="mt-3 font-[family-name:var(--font-ui)] text-[0.8125rem] text-muted-foreground">
            <span className="font-medium uppercase tracking-[0.08em] text-[color:var(--moss)]">
              {copy.officialSource}:
            </span>{" "}
            {officialSourceUrl ? (
              <a
                href={officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--forest)] underline-offset-2 hover:underline"
              >
                {officialReference}
              </a>
            ) : (
              officialReference
            )}
          </p>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-24">
              <NormTocNav toc={toc} copy={copy} variant="desktop" />
              <details className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-5 lg:hidden">
                <summary className="cursor-pointer list-none text-sm font-bold text-[color:var(--ink)]">
                  {copy.mobileContents}
                </summary>
                <div className="mt-4">
                  <NormTocNav toc={toc} copy={copy} variant="mobile" />
                </div>
              </details>
            </div>
          </aside>

          <div className="lg:col-span-8 xl:col-span-9">
            <div className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6 sm:p-10">
              <Prose>{children}</Prose>
              <ClkrDisclaimer text={copy.disclaimer} className="mt-10" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function NormTocNav({
  toc,
  copy,
  variant,
}: {
  toc: TocEntry[];
  copy: { contents: string };
  variant: "desktop" | "mobile";
}) {
  if (variant === "desktop") {
    return (
      <div className="hidden lg:block">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
          {copy.contents}
        </div>
        <nav className="mt-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          <TocTree entries={toc} />
        </nav>
      </div>
    );
  }

  return (
    <nav>
      <TocTree entries={toc} />
    </nav>
  );
}

function TocTree({ entries }: { entries: TocEntry[] }) {
  return (
    <ul className="space-y-1 text-sm">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={entry.href}
            className={cn(
              "group flex items-start gap-1 border-l-2 py-1.5 pl-2 transition",
              entry.isActive
                ? "border-[color:var(--forest)] bg-[color:var(--surface)] font-medium text-[color:var(--ink)]"
                : "border-transparent text-muted-foreground hover:border-[color:var(--moss)] hover:text-[color:var(--ink)]",
            )}
            style={{ marginLeft: `${entry.depth * 0.75}rem` }}
          >
            {entry.hasChildren ? (
              <ChevronRight
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--moss)]"
                aria-hidden="true"
              />
            ) : (
              <span className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {entry.numberLabel ? (
                <span className="mr-1 font-[family-name:var(--font-ui)] text-[0.6875rem] uppercase tracking-[0.06em] text-[color:var(--moss)]">
                  {entry.numberLabel}
                </span>
              ) : null}
              {entry.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
