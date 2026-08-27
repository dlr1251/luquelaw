import { normPublicPath } from "@/lib/norms/types";
import type { ImmigrationLocale } from "@/lib/practice-areas/paths";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const VISA_NORM_SLUG = "resolucion-5477-2022";

export type VisaNormCommentTarget = {
  normId: string;
  sectionId: string;
  currentPath: string;
};

/** Resolve the Resolución 5477 article section for visa-page discussion comments. */
export async function getVisaNormCommentTarget(
  articleNum: number,
  locale: ImmigrationLocale,
): Promise<VisaNormCommentTarget | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const sectionKey = `art-${articleNum}`;

  const { data: norm } = await supabase
    .from("norms")
    .select("id, slug_key")
    .eq("slug_key", VISA_NORM_SLUG)
    .eq("locale", locale)
    .eq("status", "published")
    .maybeSingle();

  if (!norm) return null;

  const { data: section } = await supabase
    .from("norm_sections")
    .select("id, section_key, parent_id")
    .eq("norm_id", norm.id)
    .eq("section_key", sectionKey)
    .maybeSingle();

  if (!section) return null;

  const pathKeys: string[] = [section.section_key];
  let parentId = section.parent_id as string | null;
  while (parentId) {
    const { data: parent } = await supabase
      .from("norm_sections")
      .select("id, section_key, parent_id")
      .eq("id", parentId)
      .maybeSingle();
    if (!parent) break;
    pathKeys.unshift(parent.section_key);
    parentId = parent.parent_id;
  }

  return {
    normId: norm.id,
    sectionId: section.id,
    currentPath: normPublicPath(VISA_NORM_SLUG, locale, pathKeys),
  };
}
