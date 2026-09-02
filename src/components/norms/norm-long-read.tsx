import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";

import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { Container } from "@/components/container";
import { NormDoctrinalCommentaries } from "@/components/norms/norm-doctrinal-commentaries";
import { NormTranslationNotes } from "@/components/norms/norm-translation-notes";
import { NormReaderControls } from "@/components/norms/norm-reader-controls";
import { NormReaderSectionActions } from "@/components/norms/norm-reader-section-actions";
import { NormToc } from "@/components/norms/norm-toc";
import { Prose } from "@/components/prose";
import type { DoctrinalCommentaryRecord } from "@/lib/commentaries/types";
import type { TranslationNoteRecord } from "@/lib/norms/citations";
import {
  etDeskTranslationNotice,
  resolveCitationHref,
  rewriteDianHrefs,
} from "@/lib/norms/citations";
import { normReaderContent } from "@/lib/norms/reader-content";
import {
  readerSectionHeading,
  stripGazetteStructureBleed,
  structuralBleedLabels,
} from "@/lib/norms/reader-display";
import {
  flattenSectionTree,
  sectionAnchorId,
  type TocNode,
} from "@/lib/norms/tree";
import {
  normCategoryLabel,
  normPublicPath,
  type NormCatalogItem,
  type NormCategory,
  type NormSectionNode,
  type NormType,
  normTypeLabel,
} from "@/lib/norms/types";

type Props = {
  locale: "en" | "es";
  slugKey: string;
  title: string;
  description: string;
  category: NormCategory;
  normType: NormType;
  officialReference: string;
  officialSourceUrl?: string | null;
  tree: NormSectionNode[];
  toc: TocNode[];
  readerPath: string;
  commentariesBySection: Record<string, DoctrinalCommentaryRecord[]>;
  translationNotesBySection?: Record<string, TranslationNoteRecord[]>;
  apparatusCountBySection?: Record<string, number>;
  otherNorms: NormCatalogItem[];
};

function headingTag(depth: number): "h2" | "h3" | "h4" {
  if (depth <= 0) return "h2";
  if (depth === 1) return "h3";
  return "h4";
}

export function NormLongRead({
  locale,
  slugKey,
  title,
  description,
  category,
  normType,
  officialReference,
  officialSourceUrl,
  tree,
  toc,
  readerPath,
  commentariesBySection,
  translationNotesBySection = {},
  apparatusCountBySection = {},
  otherNorms,
}: Props) {
  const copy = normReaderContent[locale];
  const prefix = locale === "es" ? "/es" : "";
  const normsHref = `${prefix}/clkr/norms`;
  const articleHref = normPublicPath(slugKey, locale);
  const sections = flattenSectionTree(tree);
  const bleedLabels = structuralBleedLabels(sections.map(({ node }) => node));

  const tocCopy = {
    contents: copy.contents,
    searchPlaceholder: copy.searchPlaceholder,
    empty: copy.empty,
    expandAll: copy.expandAll,
    collapseAll: copy.collapseAll,
    sections: copy.sections,
  };

  return (
    <main className="flex-1">
      <section className="border-b border-[color:var(--moss)]/20 bg-[color:var(--forest)] text-[color:var(--parchment)]">
        <Container className="py-8 sm:py-10">
          <Link
            href={normsHref}
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-[color:var(--parchment)]/70 transition hover:text-[color:var(--parchment)]"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.75} aria-hidden />
            {locale === "es" ? "Todas las normas" : "All norms"}
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 border border-[color:var(--parchment)]/30 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.12em] text-[color:var(--parchment)]/90">
              <BookOpen className="size-3" strokeWidth={1.75} aria-hidden />
              {copy.modeLabel}
            </span>
            <span className="font-[family-name:var(--font-ui)] text-[0.6875rem] text-[color:var(--parchment)]/55">
              {normTypeLabel(normType, locale)}
            </span>
            <span className="font-[family-name:var(--font-ui)] text-[0.6875rem] text-[color:var(--parchment)]/40">
              {normCategoryLabel(category, locale)}
            </span>
          </div>

          <h1 className="mt-3 max-w-3xl font-display text-[clamp(1.65rem,3.5vw,2.35rem)] font-normal leading-[1.1] tracking-tight">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--parchment)]/70 sm:text-base">
            {copy.hint}
          </p>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--parchment)]/50">{description}</p>
          {slugKey === "estatuto-tributario" ? (
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[color:var(--parchment)]/55">
              {etDeskTranslationNotice(locale)}
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

          <p className="mt-5">
            <Link
              href={articleHref}
              className="font-[family-name:var(--font-ui)] text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[color:var(--parchment)] underline-offset-4 hover:underline"
            >
              {copy.backArticles} →
            </Link>
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-[calc(4rem+2.75rem+0.5rem)]">
              <div className="hidden border border-[color:var(--moss)]/25 bg-[color:var(--card)] p-4 lg:block">
                <NormToc tree={toc} copy={tocCopy} />
              </div>

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
              <NormReaderControls locale={locale}>
                <article>
                  <Prose className="text-[length:inherit] leading-[inherit] sm:text-[length:inherit]">
                    {sections.map(({ node, path }) => {
                      const pathKey = path.join("/");
                      const id = sectionAnchorId(pathKey);
                      const Heading = headingTag(node.depth);
                      const cleanedHtml = node.html?.trim()
                        ? stripGazetteStructureBleed(
                            rewriteDianHrefs(node.html, locale, (file, anchor) =>
                              resolveCitationHref({
                                locale,
                                dianFile: file,
                                dianAnchor: anchor,
                                authority: null,
                              }).href,
                            ),
                            bleedLabels,
                          )
                        : "";
                      const hasHtml = Boolean(cleanedHtml);
                      const { heading, sub } = readerSectionHeading(node);
                      const shareUrl = `${readerPath}#${id}`;
                      const notes = commentariesBySection[node.id] ?? [];
                      const translationNotes = translationNotesBySection[node.id] ?? [];
                      const apparatusCount = apparatusCountBySection[node.id] ?? 0;
                      const articlePageHref = `${articleHref}/${path.join("/")}`;

                      return (
                        <section
                          key={id}
                          id={id}
                          className="scroll-mt-28 border-b border-[color:var(--moss)]/12 py-8 last:border-b-0 last:pb-0 first:pt-0"
                        >
                          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                            <Heading className="!mt-0 min-w-0 flex-1 font-display font-normal tracking-tight text-[color:var(--forest)]">
                              <a href={`#${id}`} className="text-inherit no-underline hover:underline">
                                {heading}
                              </a>
                              {sub ? (
                                <span className="mt-1 block font-[family-name:var(--font-ui)] text-sm font-normal not-italic tracking-normal text-muted-foreground">
                                  {sub}
                                </span>
                              ) : null}
                            </Heading>
                            <NormReaderSectionActions
                              locale={locale}
                              shareUrl={shareUrl}
                              title={node.title}
                              numberLabel={node.number_label}
                              html={cleanedHtml || null}
                            />
                          </div>
                          {hasHtml ? (
                            <div dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
                          ) : null}
                          {apparatusCount > 0 ? (
                            <p className="mt-4">
                              <Link
                                href={articlePageHref}
                                className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[color:var(--moss)] underline-offset-2 hover:underline"
                              >
                                {locale === "es"
                                  ? "Vigencia, concordancias, jurisprudencia y doctrina"
                                  : "In-force notes, concordances, case law, and doctrine"}{" "}
                                →
                              </Link>
                            </p>
                          ) : null}
                          <NormTranslationNotes
                            notes={translationNotes}
                            locale={locale}
                            compact
                          />
                          {notes.length > 0 ? (
                            <NormDoctrinalCommentaries
                              commentaries={notes}
                              locale={locale}
                              compact
                            />
                          ) : null}
                        </section>
                      );
                    })}
                  </Prose>
                </article>
              </NormReaderControls>

              {otherNorms.length > 0 ? (
                <nav className="mt-10 border-t border-[color:var(--moss)]/20 pt-8" aria-label={copy.otherNorms}>
                  <h2 className="font-display text-lg text-[color:var(--forest)]">{copy.otherNorms}</h2>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {otherNorms.map((norm) => (
                      <li key={norm.slug}>
                        <Link
                          href={`${norm.slug}/read`}
                          className="block border border-[color:var(--moss)]/25 px-3 py-2.5 text-sm text-[color:var(--forest)] transition hover:border-[color:var(--moss)]/50"
                        >
                          <span className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.08em] text-[color:var(--moss)]">
                            {normTypeLabel(norm.normType, locale)}
                          </span>
                          <span className="mt-0.5 block font-medium">{norm.shortTitle || norm.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4">
                    <Link
                      href={normsHref}
                      className="font-[family-name:var(--font-ui)] text-[0.75rem] uppercase tracking-[0.08em] text-[color:var(--moss)] underline-offset-2 hover:underline"
                    >
                      {locale === "es" ? "Todas las normas" : "All norms"} →
                    </Link>
                  </p>
                </nav>
              ) : null}

              <ClkrDisclaimer text={copy.disclaimer} className="mt-10" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
