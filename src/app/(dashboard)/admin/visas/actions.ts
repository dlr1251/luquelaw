"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { immigrationPath } from "@/lib/practice-areas/paths";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  linesToList,
  slugFromInput,
  type LocaleStringList,
  type LocaleText,
} from "@/lib/visas/types";

async function requireAdminSupabase() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/visas?error=Supabase+not+configured");
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) {
    redirect("/portal");
  }
  return supabase;
}

function revalidateVisaPaths(slug: string) {
  revalidatePath("/admin/visas");
  revalidatePath("/services/immigration/visas");
  revalidatePath("/es/servicios/migracion/visas");
  revalidatePath(immigrationPath(`/visas/${slug}`, "en"));
  revalidatePath(immigrationPath(`/visas/${slug}`, "es"));
}

function bilingualText(formData: FormData, base: string): LocaleText {
  return {
    en: String(formData.get(`${base}_en`) ?? "").trim(),
    es: String(formData.get(`${base}_es`) ?? "").trim(),
  };
}

function bilingualList(formData: FormData, base: string): LocaleStringList {
  return {
    en: linesToList(String(formData.get(`${base}_en`) ?? "")),
    es: linesToList(String(formData.get(`${base}_es`) ?? "")),
  };
}

function optionalBilingualText(formData: FormData, base: string): LocaleText | null {
  const t = bilingualText(formData, base);
  if (!t.en && !t.es) return null;
  return t;
}

function optionalBilingualList(formData: FormData, base: string): LocaleStringList | null {
  const t = bilingualList(formData, base);
  if (!t.en.length && !t.es.length) return null;
  return t;
}

export async function saveVisaCategory(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  const slug = slugFromInput(String(formData.get("slug") ?? ""));
  if (!slug) redirect("/admin/visas?error=Invalid+slug");

  const category = String(formData.get("category") ?? "");
  if (category !== "V" && category !== "M" && category !== "R") {
    redirect("/admin/visas?error=Invalid+category");
  }

  const article_num = Number.parseInt(String(formData.get("article_num") ?? ""), 10);
  if (!Number.isFinite(article_num) || article_num < 1) {
    redirect("/admin/visas?error=Invalid+article+number");
  }

  const status = String(formData.get("status") ?? "draft");
  if (status !== "draft" && status !== "published" && status !== "archived") {
    redirect("/admin/visas?error=Invalid+status");
  }

  const name = bilingualText(formData, "name");
  const summary = bilingualText(formData, "summary");
  const who_for = bilingualText(formData, "who_for");
  const duration_notes = bilingualText(formData, "duration_notes");
  const beneficiary_notes = bilingualText(formData, "beneficiary_notes");
  const key_requirements = bilingualList(formData, "key_requirements");

  if (!name.en || !name.es || !summary.en || !summary.es) {
    const dest = id ? `/admin/visas/${id}` : "/admin/visas/new";
    redirect(`${dest}?error=${encodeURIComponent("Name and summary required in EN and ES")}`);
  }
  if (!who_for.en || !who_for.es || !duration_notes.en || !duration_notes.es) {
    const dest = id ? `/admin/visas/${id}` : "/admin/visas/new";
    redirect(`${dest}?error=${encodeURIComponent("Who-for and duration required in EN and ES")}`);
  }
  if (!beneficiary_notes.en || !beneficiary_notes.es) {
    const dest = id ? `/admin/visas/${id}` : "/admin/visas/new";
    redirect(`${dest}?error=${encodeURIComponent("Beneficiary notes required in EN and ES")}`);
  }
  if (!key_requirements.en.length || !key_requirements.es.length) {
    const dest = id ? `/admin/visas/${id}` : "/admin/visas/new";
    redirect(`${dest}?error=${encodeURIComponent("Key requirements required in EN and ES")}`);
  }

  const workMode = String(formData.get("work_permit_mode") ?? "no");
  let work_permit: boolean | null = false;
  let work_permit_notes: LocaleText | null = null;
  if (workMode === "yes") work_permit = true;
  else if (workMode === "no") work_permit = false;
  else {
    work_permit = null;
    work_permit_notes = bilingualText(formData, "work_permit_notes");
    if (!work_permit_notes.en && !work_permit_notes.es) {
      const dest = id ? `/admin/visas/${id}` : "/admin/visas/new";
      redirect(`${dest}?error=${encodeURIComponent("Custom work-permit notes required")}`);
    }
  }

  const sort_order = Number.parseInt(String(formData.get("sort_order") ?? article_num), 10);
  const related_raw = String(formData.get("related_guide_slug") ?? "").trim();
  const enable_norm_comments = formData.get("enable_norm_comments") === "on";

  const payload: Record<string, unknown> = {
    slug,
    category,
    article_num,
    name,
    summary,
    who_for,
    eligibility: optionalBilingualText(formData, "eligibility"),
    rights: optionalBilingualList(formData, "rights"),
    restrictions: optionalBilingualList(formData, "restrictions"),
    application_checklist: optionalBilingualList(formData, "application_checklist"),
    key_requirements,
    duration_notes,
    work_permit,
    work_permit_notes,
    beneficiary_notes,
    related_guide_slug: related_raw || null,
    enable_norm_comments,
    status,
    sort_order: Number.isFinite(sort_order) ? sort_order : article_num,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  if (id) {
    const { data: existing } = await supabase
      .from("visa_categories")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();

    if (status === "published") {
      payload.published_at = existing?.published_at ?? new Date().toISOString();
    } else {
      payload.published_at = null;
    }

    const { error } = await supabase.from("visa_categories").update(payload).eq("id", id);
    if (error) {
      redirect(`/admin/visas/${id}?error=${encodeURIComponent(error.message)}`);
    }
    revalidateVisaPaths(slug);
    redirect(`/admin/visas/${id}?saved=1`);
  }

  const { data, error } = await supabase
    .from("visa_categories")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/admin/visas/new?error=${encodeURIComponent(error?.message ?? "Insert failed")}`);
  }

  revalidateVisaPaths(slug);
  redirect(`/admin/visas/${data.id}?saved=1`);
}

export async function deleteVisaCategory(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/visas?error=Missing+id");

  const { data: row } = await supabase
    .from("visa_categories")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("visa_categories").delete().eq("id", id);
  if (error) {
    redirect(`/admin/visas/${id}?error=${encodeURIComponent(error.message)}`);
  }

  if (row?.slug) revalidateVisaPaths(String(row.slug));
  redirect("/admin/visas?deleted=1");
}
