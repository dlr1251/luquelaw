import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ClkrCategory } from "@/lib/clkr/types";

export type AgentRecord = {
  id: string;
  slug_key: string;
  locale: "en" | "es";
  title: string;
  description: string;
  category: string;
  system_prompt: string;
  instructions: string;
  access_tier: "professional";
  status: string;
  sort_order: number;
};

export type PromptRecord = {
  id: string;
  slug_key: string;
  locale: "en" | "es";
  title: string;
  description: string;
  prompt_text: string;
  category: string;
  article_slug_key: string | null;
  use_case: string | null;
  access_tier: "professional";
  status: string;
  sort_order: number;
};

export type SkillRecord = {
  id: string;
  slug_key: string;
  locale: "en" | "es";
  title: string;
  description: string;
  body: string;
  category: string;
  article_slug_key: string | null;
  access_tier: "professional";
  status: string;
  sort_order: number;
};

export type LibraryPrompt = {
  slugKey: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  articleSlugKey: string | null;
  useCase: string | null;
};

export type LibrarySkill = {
  slugKey: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  articleSlugKey: string | null;
};

function mapPrompt(row: PromptRecord, locale: "en" | "es"): LibraryPrompt {
  const prefix = locale === "es" ? "/es" : "";
  return {
    slugKey: row.slug_key,
    slug: `${prefix}/clkr/library/prompts/${row.slug_key}`,
    title: row.title,
    description: row.description,
    category: row.category,
    articleSlugKey: row.article_slug_key,
    useCase: row.use_case,
  };
}

function mapSkill(row: SkillRecord, locale: "en" | "es"): LibrarySkill {
  const prefix = locale === "es" ? "/es" : "";
  return {
    slugKey: row.slug_key,
    slug: `${prefix}/clkr/library/skills/${row.slug_key}`,
    title: row.title,
    description: row.description,
    category: row.category,
    articleSlugKey: row.article_slug_key,
  };
}

export async function getPublishedAgents(locale: "en" | "es"): Promise<AgentRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("clkr_agents")
    .select("*")
    .eq("locale", locale)
    .eq("status", "published")
    .order("sort_order");
  return (data as AgentRecord[]) ?? [];
}

export async function getPublishedPrompts(locale: "en" | "es"): Promise<PromptRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("clkr_prompts")
    .select("*")
    .eq("locale", locale)
    .eq("status", "published")
    .order("sort_order");
  return (data as PromptRecord[]) ?? [];
}

export async function getPublishedSkills(locale: "en" | "es"): Promise<SkillRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("clkr_skills")
    .select("*")
    .eq("locale", locale)
    .eq("status", "published")
    .order("sort_order");
  return (data as SkillRecord[]) ?? [];
}

export async function getPublishedPromptBySlug(
  slugKey: string,
  locale: "en" | "es",
): Promise<PromptRecord | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("clkr_prompts")
    .select("*")
    .eq("slug_key", slugKey)
    .eq("locale", locale)
    .eq("status", "published")
    .maybeSingle();
  return (data as PromptRecord) ?? null;
}

export async function getPublishedSkillBySlug(
  slugKey: string,
  locale: "en" | "es",
): Promise<SkillRecord | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("clkr_skills")
    .select("*")
    .eq("slug_key", slugKey)
    .eq("locale", locale)
    .eq("status", "published")
    .maybeSingle();
  return (data as SkillRecord) ?? null;
}

export async function getPublishedPromptsByArticle(
  articleSlugKey: string,
  locale: "en" | "es",
  limit = 6,
): Promise<LibraryPrompt[]> {
  const rows = await getPublishedPrompts(locale);
  return rows
    .filter((p) => p.article_slug_key === articleSlugKey)
    .slice(0, limit)
    .map((p) => mapPrompt(p, locale));
}

export async function getPublishedSkillsByArticle(
  articleSlugKey: string,
  locale: "en" | "es",
  limit = 4,
): Promise<LibrarySkill[]> {
  const rows = await getPublishedSkills(locale);
  return rows
    .filter((s) => s.article_slug_key === articleSlugKey)
    .slice(0, limit)
    .map((s) => mapSkill(s, locale));
}

export async function getPublishedPromptsByCategory(
  category: ClkrCategory | string,
  locale: "en" | "es",
  limit = 6,
): Promise<LibraryPrompt[]> {
  const rows = await getPublishedPrompts(locale);
  return rows
    .filter((p) => p.category === category)
    .slice(0, limit)
    .map((p) => mapPrompt(p, locale));
}

export async function getLibraryPrompts(locale: "en" | "es"): Promise<LibraryPrompt[]> {
  const rows = await getPublishedPrompts(locale);
  return rows.map((p) => mapPrompt(p, locale));
}

export async function getLibrarySkills(locale: "en" | "es"): Promise<LibrarySkill[]> {
  const rows = await getPublishedSkills(locale);
  return rows.map((s) => mapSkill(s, locale));
}

export async function getAllAgentsForAdmin(): Promise<AgentRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("clkr_agents").select("*").order("sort_order");
  return (data as AgentRecord[]) ?? [];
}

export async function getAllPromptsForAdmin(): Promise<PromptRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("clkr_prompts").select("*").order("sort_order");
  return (data as PromptRecord[]) ?? [];
}

export async function getAllSkillsForAdmin(): Promise<SkillRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("clkr_skills").select("*").order("sort_order");
  return (data as SkillRecord[]) ?? [];
}
