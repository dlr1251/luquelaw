"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { markdownToSections } from "@/lib/clkr/markdown";
import { parseSections, slugKeyFromInput } from "@/lib/clkr/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function requireAdminSupabase() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/clkr?error=Supabase+not+configured");
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) {
    redirect("/portal");
  }
  return supabase;
}

function revalidateClkrPaths(slugKey: string) {
  revalidatePath("/clkr");
  revalidatePath("/es/clkr");
  revalidatePath("/clkr/guides");
  revalidatePath("/es/clkr/guides");
  revalidatePath(`/clkr/guides/${slugKey}`);
  revalidatePath(`/es/clkr/guides/${slugKey}`);
  revalidatePath("/admin/clkr");
}

export async function saveClkrArticle(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  const locale = String(formData.get("locale") ?? "");
  if (locale !== "en" && locale !== "es") {
    redirect("/admin/clkr?error=Invalid+locale");
  }

  const slug_key = slugKeyFromInput(String(formData.get("slug_key") ?? ""));
  if (!slug_key) {
    redirect("/admin/clkr?error=Invalid+slug");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const reading_time = String(formData.get("reading_time") ?? "10 min").trim();
  const status = String(formData.get("status") ?? "draft");
  const sortRaw = String(formData.get("sort_order") ?? "0");
  const sort_order = Number.parseInt(sortRaw, 10);

  if (!title || !description || !category) {
    redirect("/admin/clkr?error=Missing+required+fields");
  }

  if (status !== "draft" && status !== "published" && status !== "archived") {
    redirect("/admin/clkr?error=Invalid+status");
  }

  let sections;
  const bodyMarkdown = String(formData.get("body_markdown") ?? "").trim();
  const sectionsJson = String(formData.get("sections_json") ?? "").trim();

  if (bodyMarkdown) {
    sections = markdownToSections(bodyMarkdown);
  } else if (sectionsJson) {
    try {
      sections = parseSections(JSON.parse(sectionsJson));
    } catch {
      redirect("/admin/clkr?error=Invalid+sections+JSON");
    }
  } else {
    redirect("/admin/clkr?error=Missing+article+content");
  }

  if (!sections.length) {
    redirect("/admin/clkr?error=At+least+one+section+required");
  }

  const published_at =
    status === "published" ? new Date().toISOString() : null;

  const payload: Record<string, unknown> = {
    slug_key,
    locale,
    title,
    description,
    category,
    reading_time,
    sections,
    status,
    sort_order: Number.isFinite(sort_order) ? sort_order : 0,
    published_at,
  };

  if (id) {
    const { data: existing } = await supabase
      .from("clkr_articles")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();

    if (status === "published") {
      payload.published_at = existing?.published_at ?? new Date().toISOString();
    } else {
      payload.published_at = null;
    }

    const { error: upError } = await supabase.from("clkr_articles").update(payload).eq("id", id);
    if (upError) {
      redirect(`/admin/clkr/${id}/edit?error=${encodeURIComponent(upError.message)}`);
    }
    revalidateClkrPaths(slug_key);
    redirect(`/admin/clkr/${id}/edit?saved=1`);
  }

  const { data, error: insError } = await supabase
    .from("clkr_articles")
    .insert(payload)
    .select("id")
    .single();

  if (insError || !data) {
    redirect(`/admin/clkr/new?locale=${locale}&error=${encodeURIComponent(insError?.message ?? "Insert failed")}`);
  }

  revalidateClkrPaths(slug_key);
  redirect(`/admin/clkr/${data.id}/edit?saved=1`);
}

export async function deleteClkrArticle(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin/clkr?error=Missing+id");
  }

  const { data: row } = await supabase
    .from("clkr_articles")
    .select("slug_key")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("clkr_articles").delete().eq("id", id);

  if (error) {
    redirect(`/admin/clkr/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  if (row?.slug_key) {
    revalidateClkrPaths(String(row.slug_key));
  } else {
    revalidatePath("/clkr");
    revalidatePath("/es/clkr");
    revalidatePath("/admin/clkr");
  }

  redirect("/admin/clkr?deleted=1");
}
