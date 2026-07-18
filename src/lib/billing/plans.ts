import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { PlanSlug } from "@/lib/billing/types";

export type PlanRow = {
  id: string;
  slug: PlanSlug;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  stripe_price_id: string | null;
  features: string[];
  sort_order: number;
};

/** Env fallback when plans.stripe_price_id is null (set in Vercel / .env.local). */
export function resolveStripePriceId(
  slug: string,
  dbPriceId: string | null | undefined,
): string | null {
  if (dbPriceId) return dbPriceId;
  const fromEnv: Record<string, string | undefined> = {
    student: process.env.STRIPE_PRICE_STUDENT,
    professional: process.env.STRIPE_PRICE_PROFESSIONAL,
    client: process.env.STRIPE_PRICE_CLIENT,
  };
  return fromEnv[slug]?.trim() || null;
}

const FALLBACK_PLANS: PlanRow[] = [
  {
    id: "fallback-student",
    slug: "student",
    name_en: "Student",
    name_es: "Estudiante",
    description_en: "Quizzes, norm annotations, and a subset of LegalAI agents.",
    description_es: "Quizzes, anotaciones normativas y un subconjunto de agentes LegalAI.",
    stripe_price_id: null,
    features: ["quizzes", "norm_annotations", "agents"],
    sort_order: 1,
  },
  {
    id: "fallback-professional",
    slug: "professional",
    name_en: "Professional",
    name_es: "Profesional",
    description_en: "Full agents, skills, prompts, and advanced normative study tools.",
    description_es: "Agentes, skills, prompts y herramientas avanzadas de estudio normativo.",
    stripe_price_id: null,
    features: ["agents", "norm_annotations"],
    sort_order: 2,
  },
  {
    id: "fallback-client",
    slug: "client",
    name_en: "Client",
    name_es: "Cliente",
    description_en: "Portal tickets and firm resources for Luque Law clients.",
    description_es: "Tickets del portal y recursos de la firma para clientes de Luque Law.",
    stripe_price_id: null,
    features: ["portal_tickets"],
    sort_order: 3,
  },
];

export async function getActivePlans(): Promise<PlanRow[]> {
  const withEnvPrices = (plans: PlanRow[]) =>
    plans.map((plan) => ({
      ...plan,
      stripe_price_id: resolveStripePriceId(plan.slug, plan.stripe_price_id),
    }));

  if (!isSupabaseConfigured()) return withEnvPrices(FALLBACK_PLANS);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plans")
    .select(
      "id, slug, name_en, name_es, description_en, description_es, stripe_price_id, features, sort_order",
    )
    .eq("active", true)
    .order("sort_order");

  if (error || !data?.length) return withEnvPrices(FALLBACK_PLANS);
  return withEnvPrices(data as PlanRow[]);
}
