"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { Container } from "@/components/container";
import { NormCopyMarkdownButton } from "@/components/norms/norm-copy-markdown-button";
import { NormReaderBar } from "@/components/norms/norm-reader-bar";
import { NormToc } from "@/components/norms/norm-toc";
import { NormApparatus } from "@/components/norms/norm-apparatus";
import { NormTranslationNotes } from "@/components/norms/norm-translation-notes";
import { Prose } from "@/components/prose";
import { findAdjacentContent, type TocNode } from "@/lib/norms/tree";
import type { ClkrArticle } from "@/lib/clkr/articles";
import { normsHubContent } from "@/lib/norms/hub-content";
import type { ApparatusBox, TranslationNoteRecord } from "@/lib/norms/citations";
import {
  etDeskTranslationNotice,
  resolveCitationHref,
  rewriteDianHrefs,
} from "@/lib/norms/citations";
import type { NormCategory, NormType } from "@/lib/norms/types";
import { normCategoryLabel, normTypeLabel } from "@/lib/norms/types";

type Props = {
  title: string;
  description: string;
  category: NormCategory;
  normType: NormType;
  officialReference: string;
  officialSourceUrl?: string | null;
  locale?: "en" | "es";
  slugKey?: string;
  signedIn?: boolean;
  sectionPath: string[];
  sectionTitle: string;
  sectionNumberLabel?: string | null;
  sectionHtml?: string | null;
  toc: TocNode[];
  children: ReactNode;
  headerAction?: ReactNode;
  relatedArticles?: ClkrArticle[];
  readerHref?: string | null;
  apparatus?: ApparatusBox[];
  translationNotes?: TranslationNoteRecord[];
};

export function NormLayout({
  title,
  description,
  category,
  normType,
  officialReference,
  officialSourceUrl,
  locale = "en",
  slugKey,
  signedIn = false,
  sectionPath,
  sectionTitle,
  sectionNumberLabel = null,
  sectionHtml = null,
  toc,
  children,
  headerAction,
  relatedArticles = [],
  readerHref = null,
  apparatus = [],
  translationNotes = [],
}: Props) {
  const hubCopy = normsHubContent[locale];
  const prefix = locale === "es" ? "/es" : "";
  const normsHref = `${prefix}/clkr/norms`;

  const copy =
    locale === "es"
      ? {
          hub: "Todas las normas",
          contents: "Contenido",
          mobileContents: "Navegar secciones",
          mobileOpen: "Abrir",
          mobileClose: "Cerrar",
          officialSource: "Fuente oficial",
          disclaimer:
            "Solo referencia. La ley colombiana cambia; confirma el texto oficial vigente antes de actuar.",
          searchPlaceholder: "Filtrar artículos, títulos…",
          empty: "Sin coincidencias en esta norma.",
          expandAll: "Expandir",
          collapseAll: "Colapsar",
          sections: "secciones",
          structural:
            "Esta sección es un encabezado estructural. Selecciona una sección hija en la tabla de contenidos.",
        }
      : {
          hub: "All norms",
          contents: "Contents",
          mobileContents: "Browse sections",
          mobileOpen: "Open",
          mobileClose: "Close",
          officialSource: "Official source",
          disclaimer:
            "For reference only. Colombian law changes; confirm the current official text before acting.",
          searchPlaceholder: "Filter articles, titles…",
          empty: "No matches in this norm.",
          expandAll: "Expand",
          collapseAll: "Collapse",
          sections: "sections",
          structural:
            "This section is a structural heading. Select a child section in the table of contents.",
        };

  const rewrittenHtml = sectionHtml?.trim()
    ? rewriteDianHrefs(sectionHtml, locale, (file, anchor) =>
        resolveCitationHref({
          locale,
          dianFile: file,
          dianAnchor: anchor,
          authority: null,
        }).href,
      )
    : sectionHtml;
  const activeTitle = findActiveTitle(toc, sectionPath);
  const { prev, next } = findAdjacentContent(toc, sectionPath.join("/"));
  const tocCopy = {
    contents: copy.contents,
    searchPlaceholder: copy.searchPlaceholder,
    empty: copy.empty,
    expandAll: copy.expandAll,
    collapseAll: copy.collapseAll,
    sections: copy.sections,
  };

  return (
    <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
      {/* Compact norm chrome */}
      <section className="border-b border-[color:var(--moss)]/20 bg-[color:var(--forest)] text-[color:var(--parchment)]">
        <Container className="py-8 sm:py-10">
          <Link
            href={normsHref}
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-[color:var(--parchment)]/70 transition hover:text-[color:var(--parchment)]"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.75} aria-hidden />
            {copy.hub}
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="border border-[color:var(--parchment)]/30 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.12em] text-[color:var(--parchment)]/90">
              {normCategoryLabel(category, locale)}
            </span>
            <span className="font-[family-name:var(--font-ui)] text-[0.6875rem] text-[color:var(--parchment)]/55">
              {normTypeLabel(normType, locale)}
            </span>
          </div>

          <div className="mt-3 flex max-w-3xl items-start gap-2">
            <h1 className="min-w-0 flex-1 font-display text-[clamp(1.65rem,3.5vw,2.35rem)] font-normal leading-[1.1] tracking-tight">
              {title}
            </h1>
            {headerAction ? <div className="mt-1 shrink-0">{headerAction}</div> : null}
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--parchment)]/70 sm:text-base">
            {description}
          </p>
          {slugKey === "estatuto-tributario" ? (
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[color:var(--parchment)]/55">
              {etDeskTranslationNotice(locale)}
            </p>
          ) : null}
          {readerHref ? (
            <p className="mt-4">
              <Link
                href={readerHref}
                className="font-[family-name:var(--font-ui)] text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[color:var(--parchment)] underline-offset-4 hover:underline"
              >
                {hubCopy.readerMode} →
              </Link>
            </p>
          ) : null}

          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[color:var(--parchment)]/50">
              {copy.officialSource}
            </span>
            {officialSourceUrl ? (
              <a
                href={officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[color:var(--parchment)] underline-offset-4 hover:underline"
              >
                {officialReference}
                <ExternalLink className="size-3 opacity-70" aria-hidden />
              </a>
            ) : (
              <span className="text-[color:var(--parchment)]/85">{officialReference}</span>
            )}
          </p>

          {activeTitle && sectionPath.length > 0 ? (
            <p className="mt-5 border-t border-[color:var(--parchment)]/15 pt-4 font-[family-name:var(--font-ui)] text-[0.75rem] text-[color:var(--parchment)]/60">
              <span className="text-[color:var(--parchment)]/40">→ </span>
              {activeTitle}
            </p>
          ) : null}
        </Container>
      </section>

      <Container className="py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-[calc(4rem+2.75rem+0.5rem)]">
              {/* Desktop TOC */}
              <div className="hidden border border-[color:var(--moss)]/25 bg-[color:var(--card)] p-4 lg:block">
                <NormToc tree={toc} copy={tocCopy} />
              </div>

              {/* Mobile TOC */}
              <details className="group border border-[color:var(--moss)]/25 bg-[color:var(--card)] lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-[color:var(--forest)] [&::-webkit-details-marker]:hidden">
                  <span>{copy.mobileContents}</span>
                  <span className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[color:var(--moss)] transition group-open:hidden">
                    {copy.mobileOpen}
                  </span>
                  <span className="hidden font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[color:var(--moss)] group-open:inline">
                    {copy.mobileClose}
                  </span>
                </summary>
                <div className="border-t border-[color:var(--moss)]/20 px-4 pb-4 pt-3">
                  <NormToc tree={toc} copy={tocCopy} />
                </div>
              </details>
            </div>
          </aside>

          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-[color:var(--card)] p-5 sm:border sm:border-[color:var(--moss)]/25 sm:p-8 lg:p-10">
              <article>
                <header className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-[color:var(--moss)]/20 pb-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-2xl font-normal tracking-tight text-[color:var(--forest)]">
                      {sectionNumberLabel ?? sectionTitle}
                    </h2>
                  </div>
                  <NormCopyMarkdownButton
                    locale={locale}
                    title={sectionTitle}
                    numberLabel={sectionNumberLabel}
                    html={rewrittenHtml}
                    className="shrink-0"
                    disabled={!sectionHtml?.trim()}
                  />
                </header>

                <Prose>
                  {rewrittenHtml?.trim() ? (
                    <div dangerouslySetInnerHTML={{ __html: rewrittenHtml }} />
                  ) : (
                    <p className="text-sm text-muted-foreground">{copy.structural}</p>
                  )}
                </Prose>
                <NormApparatus boxes={apparatus} locale={locale} />
                <NormTranslationNotes notes={translationNotes} locale={locale} />
                {children}
              </article>

              {relatedArticles.length > 0 ? (
                <section className="mt-10 border-t border-[color:var(--moss)]/20 pt-8">
                  <h2 className="font-display text-lg text-[color:var(--forest)]">
                    {hubCopy.relatedArticles}
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {relatedArticles.map((article) => (
                      <li key={article.slug}>
                        <Link
                          href={article.slug}
                          className="block border border-[color:var(--moss)]/30 bg-[color:var(--card)] p-4 transition hover:border-[color:var(--moss)]/55"
                        >
                          <h3 className="text-sm font-semibold text-[color:var(--forest)]">
                            {article.title}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {article.description}
                          </p>
                          <span className="mt-2 inline-block text-xs font-bold text-[color:var(--forest)]">
                            {hubCopy.readArticle} →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <ClkrDisclaimer text={copy.disclaimer} className="mt-10" />
            </div>
          </div>
        </div>
      </Container>

      <NormReaderBar
        locale={locale}
        prev={prev}
        next={next}
        sectionTitle={sectionTitle}
        sectionNumberLabel={sectionNumberLabel}
        sectionHtml={sectionHtml}
      />
    </main>
  );
}

function findActiveTitle(toc: TocNode[], sectionPath: string[]): string | null {
  if (!sectionPath.length) return null;
  const key = sectionPath.join("/");
  const walk = (nodes: TocNode[]): string | null => {
    for (const node of nodes) {
      if (node.pathKey === key) {
        return node.numberLabel ?? node.title;
      }
      const child = walk(node.children);
      if (child) return child;
    }
    return null;
  };
  return walk(toc);
}
