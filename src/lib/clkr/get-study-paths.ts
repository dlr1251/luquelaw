import { createClient } from "@/lib/supabase/server";
import type {
  StudyPath,
  StudyPathRecord,
  StudyPathStep,
  StudyPathWithSteps,
  ClkrArticleRecord,
} from "./types";
import { recordToStudyPath, recordToHubArticle } from "./types";

/**
 * Get all published study paths for the hub
 */
export async function getStudyPaths(locale: "en" | "es"): Promise<StudyPath[]> {
  const supabase = await createClient();

  const { data: paths, error } = await supabase
    .from("clkr_study_paths")
    .select(
      `
      *,
      steps:clkr_study_path_steps(count)
    `
    )
    .eq("locale", locale)
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getStudyPaths] Supabase error:", error);
    return [];
  }

  if (!paths) return [];

  return paths.map((row) => {
    const articleCount = Array.isArray(row.steps) ? row.steps.length : 0;
    return recordToStudyPath(row as StudyPathRecord, articleCount);
  });
}

/**
 * Get a single study path with its steps and articles
 */
export async function getStudyPathWithSteps(
  slugKey: string,
  locale: "en" | "es"
): Promise<StudyPathWithSteps | null> {
  const supabase = await createClient();

  // Get the study path
  const { data: pathData, error: pathError } = await supabase
    .from("clkr_study_paths")
    .select("*")
    .eq("slug_key", slugKey)
    .eq("locale", locale)
    .eq("status", "published")
    .single();

  if (pathError || !pathData) {
    console.error("[getStudyPathWithSteps] Path not found:", pathError);
    return null;
  }

  // Get the steps with articles
  const { data: stepsData, error: stepsError } = await supabase
    .from("clkr_study_path_steps")
    .select(
      `
      *,
      article:clkr_articles!clkr_study_path_steps_article_id_fkey(*)
    `
    )
    .eq("study_path_id", pathData.id)
    .order("step_order", { ascending: true });

  if (stepsError) {
    console.error("[getStudyPathWithSteps] Steps error:", stepsError);
    return null;
  }

  const steps = (stepsData || [])
    .filter((step) => step.article && (step.article as ClkrArticleRecord).status === "published")
    .map((step) => {
      const article = step.article as ClkrArticleRecord;
      return {
        stepOrder: step.step_order,
        description: step.description,
        article: {
          ...recordToHubArticle(article),
          id: article.id,
        },
      };
    });

  return {
    ...recordToStudyPath(pathData as StudyPathRecord, steps.length),
    steps,
  };
}

/**
 * Get article relations (prerequisites, next steps, related)
 */
export async function getArticleRelations(
  articleId: string,
  relationType?: "prerequisite" | "next_step" | "related"
) {
  const supabase = await createClient();

  let query = supabase
    .from("clkr_article_relations")
    .select(
      `
      *,
      to_article:clkr_articles!clkr_article_relations_to_article_id_fkey(*)
    `
    )
    .eq("from_article_id", articleId);

  if (relationType) {
    query = query.eq("relation_type", relationType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getArticleRelations] Error:", error);
    return [];
  }

  return (
    data
      ?.filter((rel) => rel.to_article && (rel.to_article as ClkrArticleRecord).status === "published")
      .map((rel) => ({
        ...rel,
        to_article: recordToHubArticle(rel.to_article as ClkrArticleRecord),
      })) || []
  );
}

/**
 * Get study paths that contain a specific article
 */
export async function getArticleStudyPaths(articleId: string, locale: "en" | "es") {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clkr_study_path_steps")
    .select(
      `
      study_path:clkr_study_paths!clkr_study_path_steps_study_path_id_fkey(*)
    `
    )
    .eq("article_id", articleId);

  if (error) {
    console.error("[getArticleStudyPaths] Error:", error);
    return [];
  }

  if (!data) return [];

  const paths: StudyPath[] = [];
  for (const item of data) {
    const path = item.study_path as unknown;
    if (
      path &&
      typeof path === "object" &&
      !Array.isArray(path) &&
      "locale" in path &&
      "status" in path
    ) {
      const typedPath = path as StudyPathRecord;
      if (typedPath.locale === locale && typedPath.status === "published") {
        paths.push(recordToStudyPath(typedPath, 0));
      }
    }
  }
  return paths;
}
