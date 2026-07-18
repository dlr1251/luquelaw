import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

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
  access_tier: "professional";
  status: string;
  sort_order: number;
};

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

export async function getAllAgentsForAdmin(): Promise<AgentRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("clkr_agents").select("*").order("sort_order");
  return (data as AgentRecord[]) ?? [];
}
