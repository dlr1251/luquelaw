"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/prompts?error=Supabase+not+configured");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) redirect("/portal");
  return supabase;
}

export async function savePrompt(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const locale = String(formData.get("locale") ?? "");
  if (locale !== "en" && locale !== "es") redirect("/admin/prompts?error=Invalid+locale");

  const payload = {
    slug_key: String(formData.get("slug_key") ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    locale,
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? "general").trim() || "general",
    prompt_text: String(formData.get("prompt_text") ?? ""),
    access_tier: "professional",
    status: String(formData.get("status") ?? "draft"),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };

  if (!payload.slug_key || !payload.title || !payload.prompt_text) {
    redirect("/admin/prompts?error=Missing+fields");
  }

  if (id) {
    const { error } = await supabase.from("clkr_prompts").update(payload).eq("id", id);
    if (error) redirect(`/admin/prompts?error=${encodeURIComponent(error.message)}`);
  } else {
    const { error } = await supabase.from("clkr_prompts").insert(payload);
    if (error) redirect(`/admin/prompts?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/clkr/agents");
  revalidatePath("/es/clkr/agents");
  revalidatePath("/admin/prompts");
  redirect("/admin/prompts?saved=1");
}

export async function deletePrompt(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/prompts?error=Missing+id");
  await supabase.from("clkr_prompts").delete().eq("id", id);
  revalidatePath("/clkr/agents");
  revalidatePath("/es/clkr/agents");
  revalidatePath("/admin/prompts");
  redirect("/admin/prompts?deleted=1");
}
