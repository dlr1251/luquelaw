import { getPublishedCommentariesForNorm } from "@/lib/commentaries/get-commentaries";
import type { DoctrinalCommentaryRecord } from "@/lib/commentaries/types";
import { getHubNorms } from "@/lib/norms/get-norms";
import {
  getApparatusSummaryForSections,
  getPublishedTranslationNotes,
} from "@/lib/norms/get-apparatus";
import type { TranslationNoteRecord } from "@/lib/norms/citations";
import {
  type NormCatalogItem,
  type NormCategory,
  normPublicPath,
  normReaderPath,
} from "@/lib/norms/types";
import { SITE_URL } from "@/lib/seo/config";

function groupCommentaries(
  rows: DoctrinalCommentaryRecord[],
): Record<string, DoctrinalCommentaryRecord[]> {
  const map: Record<string, DoctrinalCommentaryRecord[]> = {};
  for (const row of rows) {
    const list = map[row.section_id] ?? [];
    list.push(row);
    map[row.section_id] = list;
  }
  return map;
}

export async function loadNormReaderExtras(
  slugKey: string,
  locale: "en" | "es",
  normId: string,
  category: NormCategory,
  sectionIds: string[] = [],
): Promise<{
  readerPath: string;
  commentariesBySection: Record<string, DoctrinalCommentaryRecord[]>;
  translationNotesBySection: Record<string, TranslationNoteRecord[]>;
  apparatusCountBySection: Record<string, number>;
  otherNorms: NormCatalogItem[];
}> {
  const [commentaries, hub, notes, apparatusCounts] = await Promise.all([
    getPublishedCommentariesForNorm(normId),
    getHubNorms(locale),
    locale === "en" ? getPublishedTranslationNotes(sectionIds) : Promise.resolve({}),
    getApparatusSummaryForSections(sectionIds),
  ]);

  const currentSlug = normPublicPath(slugKey, locale);
  const rest = hub.filter((item) => item.slug !== currentSlug);
  const same = rest.filter((item) => item.category === category);
  const other = rest.filter((item) => item.category !== category);

  return {
    readerPath: `${SITE_URL}${normReaderPath(slugKey, locale)}`,
    commentariesBySection: groupCommentaries(commentaries),
    translationNotesBySection: notes,
    apparatusCountBySection: apparatusCounts,
    otherNorms: [...same, ...other].slice(0, 8),
  };
}
