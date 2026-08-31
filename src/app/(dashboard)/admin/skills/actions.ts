"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/skills?error=Supabase+not+configured");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) redirect("/portal");
  return supabase;
}

function revalidateLibrary() {
  revalidatePath("/clkr/library");
  revalidatePath("/es/clkr/library");
}

export async function saveSkill(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const locale = String(formData.get("locale") ?? "");
  if (locale !== "en" && locale !== "es") redirect("/admin/skills?error=Invalid+locale");

  const articleSlug = String(formData.get("article_slug_key") ?? "").trim();
  const payload = {
    slug_key: String(formData.get("slug_key") ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    locale,
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    body: String(formData.get("body") ?? ""),
    category: String(formData.get("category") ?? "general").trim() || "general",
    article_slug_key: articleSlug || null,
    access_tier: "professional",
    status: String(formData.get("status") ?? "draft"),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };

  if (!payload.slug_key || !payload.title || !payload.body) {
    redirect("/admin/skills?error=Missing+fields");
  }

  if (id) {
    const { error } = await supabase.from("clkr_skills").update(payload).eq("id", id);
    if (error) redirect(`/admin/skills?error=${encodeURIComponent(error.message)}`);
  } else {
    const { error } = await supabase.from("clkr_skills").insert(payload);
    if (error) redirect(`/admin/skills?error=${encodeURIComponent(error.message)}`);
  }

  revalidateLibrary();
  revalidatePath("/admin/skills");
  redirect("/admin/skills?saved=1");
}

export async function deleteSkill(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/skills?error=Missing+id");
  await supabase.from("clkr_skills").delete().eq("id", id);
  revalidateLibrary();
  revalidatePath("/admin/skills");
  redirect("/admin/skills?deleted=1");
}
