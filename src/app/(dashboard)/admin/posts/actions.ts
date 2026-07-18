"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { markdownToSections } from "@/lib/clkr/markdown";
import { parseSections, slugKeyFromInput } from "@/lib/posts/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function requireAdminSupabase() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/posts?error=Supabase+not+configured");
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) {
    redirect("/portal");
  }
  return supabase;
}

function revalidatePostPaths(slugKey: string) {
  revalidatePath("/posts");
  revalidatePath("/es/posts");
  revalidatePath(`/posts/${slugKey}`);
  revalidatePath(`/es/posts/${slugKey}`);
  revalidatePath("/admin/posts");
}

export async function savePost(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  const locale = String(formData.get("locale") ?? "");
  if (locale !== "en" && locale !== "es") {
    redirect("/admin/posts?error=Invalid+locale");
  }

  const slug_key = slugKeyFromInput(String(formData.get("slug_key") ?? ""));
  if (!slug_key) {
    redirect("/admin/posts?error=Invalid+slug");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const reading_time = String(formData.get("reading_time") ?? "5 min").trim();
  const status = String(formData.get("status") ?? "draft");
  const sortRaw = String(formData.get("sort_order") ?? "0");
  const sort_order = Number.parseInt(sortRaw, 10);

  if (!title || !description || !category) {
    redirect("/admin/posts?error=Missing+required+fields");
  }

  if (status !== "draft" && status !== "published" && status !== "archived") {
    redirect("/admin/posts?error=Invalid+status");
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
      redirect("/admin/posts?error=Invalid+sections+JSON");
    }
  } else {
    redirect("/admin/posts?error=Missing+article+content");
  }

  if (!sections.length) {
    redirect("/admin/posts?error=At+least+one+section+required");
  }

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
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  if (id) {
    const { data: existing } = await supabase
      .from("posts")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();

    if (status === "published") {
      payload.published_at = existing?.published_at ?? new Date().toISOString();
    } else {
      payload.published_at = null;
    }

    const { error: upError } = await supabase.from("posts").update(payload).eq("id", id);
    if (upError) {
      redirect(`/admin/posts/${id}/edit?error=${encodeURIComponent(upError.message)}`);
    }
    revalidatePostPaths(slug_key);
    redirect(`/admin/posts/${id}/edit?saved=1`);
  }

  const { data, error: insError } = await supabase
    .from("posts")
    .insert(payload)
    .select("id")
    .single();

  if (insError || !data) {
    redirect(`/admin/posts/new?locale=${locale}&error=${encodeURIComponent(insError?.message ?? "Insert failed")}`);
  }

  revalidatePostPaths(slug_key);
  redirect(`/admin/posts/${data.id}/edit?saved=1`);
}

export async function deletePost(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin/posts?error=Missing+id");
  }

  const { data: row } = await supabase
    .from("posts")
    .select("slug_key")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    redirect(`/admin/posts/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  if (row?.slug_key) {
    revalidatePostPaths(String(row.slug_key));
  } else {
    revalidatePath("/posts");
    revalidatePath("/es/posts");
    revalidatePath("/admin/posts");
  }

  redirect("/admin/posts?deleted=1");
}
