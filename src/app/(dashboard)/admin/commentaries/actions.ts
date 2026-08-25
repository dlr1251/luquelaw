"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function requireAdminSupabase() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/commentaries?error=Supabase+not+configured");
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) {
    redirect("/portal");
  }
  return supabase;
}

async function revalidateNormPaths(normId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("norms")
    .select("slug_key, locale")
    .eq("id", normId)
    .maybeSingle();

  revalidatePath("/admin/commentaries");
  if (!data?.slug_key) return;

  const slug = String(data.slug_key);
  const locale = data.locale === "es" ? "es" : "en";
  if (locale === "es") {
    revalidatePath(`/es/clkr/norms/${slug}`);
    revalidatePath(`/es/clkr/norms/${slug}`, "layout");
  } else {
    revalidatePath(`/clkr/norms/${slug}`);
    revalidatePath(`/clkr/norms/${slug}`, "layout");
  }
}

export async function saveCommentary(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  const locale = String(formData.get("locale") ?? "");
  if (locale !== "en" && locale !== "es") {
    redirect("/admin/commentaries?error=Invalid+locale");
  }

  const norm_id = String(formData.get("norm_id") ?? "").trim();
  const section_id = String(formData.get("section_id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body_markdown = String(formData.get("body_markdown") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");
  const sortRaw = String(formData.get("sort_order") ?? "0");
  const sort_order = Number.parseInt(sortRaw, 10);

  if (!norm_id || !section_id || !title || !body_markdown) {
    redirect("/admin/commentaries?error=Missing+required+fields");
  }

  if (status !== "draft" && status !== "published" && status !== "archived") {
    redirect("/admin/commentaries?error=Invalid+status");
  }

  const payload: Record<string, unknown> = {
    norm_id,
    section_id,
    locale,
    title,
    body_markdown,
    status,
    sort_order: Number.isFinite(sort_order) ? sort_order : 0,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  if (id) {
    const { data: existing } = await supabase
      .from("norm_doctrinal_commentaries")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();

    if (status === "published") {
      payload.published_at = existing?.published_at ?? new Date().toISOString();
    } else {
      payload.published_at = null;
    }

    const { error: upError } = await supabase
      .from("norm_doctrinal_commentaries")
      .update(payload)
      .eq("id", id);

    if (upError) {
      redirect(
        `/admin/commentaries/${id}/edit?error=${encodeURIComponent(upError.message)}`,
      );
    }
    await revalidateNormPaths(norm_id);
    redirect(`/admin/commentaries/${id}/edit?saved=1`);
  }

  const { data, error: insError } = await supabase
    .from("norm_doctrinal_commentaries")
    .insert(payload)
    .select("id")
    .single();

  if (insError || !data) {
    redirect(
      `/admin/commentaries/new?locale=${locale}&error=${encodeURIComponent(insError?.message ?? "Insert failed")}`,
    );
  }

  await revalidateNormPaths(norm_id);
  redirect(`/admin/commentaries/${data.id}/edit?saved=1`);
}

export async function deleteCommentary(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin/commentaries?error=Missing+id");
  }

  const { data: row } = await supabase
    .from("norm_doctrinal_commentaries")
    .select("norm_id")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("norm_doctrinal_commentaries")
    .delete()
    .eq("id", id);

  if (error) {
    redirect(
      `/admin/commentaries/${id}/edit?error=${encodeURIComponent(error.message)}`,
    );
  }

  if (row?.norm_id) {
    await revalidateNormPaths(String(row.norm_id));
  } else {
    revalidatePath("/admin/commentaries");
  }

  redirect("/admin/commentaries?deleted=1");
}
