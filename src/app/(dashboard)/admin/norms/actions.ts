"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import {
  NORM_CATEGORIES,
  NORM_TYPES,
  sectionKeyFromInput,
  slugKeyFromInput,
} from "@/lib/norms/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type SectionInput = {
  section_key: string;
  title: string;
  number_label?: string | null;
  html?: string | null;
  parent_section_key?: string | null;
  sort_order?: number;
  depth?: number;
};

async function requireAdminSupabase() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/norms?error=Supabase+not+configured");
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) {
    redirect("/account");
  }
  return supabase;
}

function revalidateNormPaths(slugKey: string) {
  revalidatePath("/norms");
  revalidatePath("/es/norms");
  revalidatePath(`/norms/${slugKey}`);
  revalidatePath(`/es/norms/${slugKey}`);
  revalidatePath("/admin/norms");
}

function parseSectionsInput(raw: string): SectionInput[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    redirect("/admin/norms?error=Invalid+sections+JSON");
  }

  if (!Array.isArray(parsed) || !parsed.length) {
    redirect("/admin/norms?error=At+least+one+section+required");
  }

  return parsed.map((item, index) => {
    if (!item || typeof item !== "object") {
      redirect(`/admin/norms?error=Invalid+section+at+index+${index}`);
    }
    const o = item as Record<string, unknown>;
    const section_key = sectionKeyFromInput(String(o.section_key ?? ""));
    const title = String(o.title ?? "").trim();
    if (!section_key || !title) {
      redirect(`/admin/norms?error=Section+${index}+needs+section_key+and+title`);
    }
    return {
      section_key,
      title,
      number_label: o.number_label != null ? String(o.number_label) : null,
      html: o.html != null ? String(o.html) : null,
      parent_section_key: o.parent_section_key
        ? sectionKeyFromInput(String(o.parent_section_key))
        : null,
      sort_order: Number.isFinite(Number(o.sort_order)) ? Number(o.sort_order) : index,
      depth: Number.isFinite(Number(o.depth)) ? Number(o.depth) : 0,
    };
  });
}

async function replaceNormSections(
  supabase: Awaited<ReturnType<typeof requireAdminSupabase>>,
  normId: string,
  sections: SectionInput[],
) {
  const { error: delError } = await supabase.from("norm_sections").delete().eq("norm_id", normId);
  if (delError) {
    redirect(`/admin/norms/${normId}/edit?error=${encodeURIComponent(delError.message)}`);
  }

  const idByKey = new Map<string, string>();

  for (const section of sections) {
    const { data, error } = await supabase
      .from("norm_sections")
      .insert({
        norm_id: normId,
        parent_id: null,
        section_key: section.section_key,
        title: section.title,
        number_label: section.number_label,
        html: section.html,
        sort_order: section.sort_order ?? 0,
        depth: section.depth ?? 0,
      })
      .select("id, section_key")
      .single();

    if (error || !data) {
      redirect(`/admin/norms/${normId}/edit?error=${encodeURIComponent(error?.message ?? "Section insert failed")}`);
    }
    idByKey.set(String(data.section_key), String(data.id));
  }

  for (const section of sections) {
    if (!section.parent_section_key) continue;
    const sectionId = idByKey.get(section.section_key);
    const parentId = idByKey.get(section.parent_section_key);
    if (!sectionId || !parentId) {
      redirect(`/admin/norms/${normId}/edit?error=Unknown+parent+section+${section.parent_section_key}`);
    }

    const { error } = await supabase
      .from("norm_sections")
      .update({ parent_id: parentId })
      .eq("id", sectionId);

    if (error) {
      redirect(`/admin/norms/${normId}/edit?error=${encodeURIComponent(error.message)}`);
    }
  }
}

export async function saveNorm(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  const locale = String(formData.get("locale") ?? "");
  if (locale !== "en" && locale !== "es") {
    redirect("/admin/norms?error=Invalid+locale");
  }

  const slug_key = slugKeyFromInput(String(formData.get("slug_key") ?? ""));
  if (!slug_key) {
    redirect("/admin/norms?error=Invalid+slug");
  }

  const title = String(formData.get("title") ?? "").trim();
  const short_title = String(formData.get("short_title") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim();
  const norm_type = String(formData.get("norm_type") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const official_reference = String(formData.get("official_reference") ?? "").trim();
  const official_source_url = String(formData.get("official_source_url") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "draft");
  const sortRaw = String(formData.get("sort_order") ?? "0");
  const sort_order = Number.parseInt(sortRaw, 10);
  const sectionsJson = String(formData.get("sections_json") ?? "").trim();

  if (!title || !description || !official_reference) {
    redirect("/admin/norms?error=Missing+required+fields");
  }

  if (!NORM_TYPES.includes(norm_type as (typeof NORM_TYPES)[number])) {
    redirect("/admin/norms?error=Invalid+norm+type");
  }

  if (!NORM_CATEGORIES.includes(category as (typeof NORM_CATEGORIES)[number])) {
    redirect("/admin/norms?error=Invalid+category");
  }

  if (status !== "draft" && status !== "published" && status !== "archived") {
    redirect("/admin/norms?error=Invalid+status");
  }

  const sections = parseSectionsInput(sectionsJson);

  const payload: Record<string, unknown> = {
    slug_key,
    locale,
    title,
    short_title,
    description,
    norm_type,
    category,
    official_reference,
    official_source_url,
    status,
    sort_order: Number.isFinite(sort_order) ? sort_order : 0,
  };

  if (id) {
    if (status === "published") {
      const { data: existing } = await supabase
        .from("norms")
        .select("published_at")
        .eq("id", id)
        .maybeSingle();
      payload.published_at = existing?.published_at ?? new Date().toISOString();
    } else {
      payload.published_at = null;
    }

    const { error: upError } = await supabase.from("norms").update(payload).eq("id", id);
    if (upError) {
      redirect(`/admin/norms/${id}/edit?error=${encodeURIComponent(upError.message)}`);
    }

    await replaceNormSections(supabase, id, sections);
    revalidateNormPaths(slug_key);
    redirect(`/admin/norms/${id}/edit?saved=1`);
  }

  payload.published_at = status === "published" ? new Date().toISOString() : null;

  const { data, error: insError } = await supabase
    .from("norms")
    .insert(payload)
    .select("id")
    .single();

  if (insError || !data) {
    redirect(
      `/admin/norms/new?locale=${locale}&error=${encodeURIComponent(insError?.message ?? "Insert failed")}`,
    );
  }

  await replaceNormSections(supabase, String(data.id), sections);
  revalidateNormPaths(slug_key);
  redirect(`/admin/norms/${data.id}/edit?saved=1`);
}

export async function deleteNorm(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin/norms?error=Missing+id");
  }

  const { data: row } = await supabase.from("norms").select("slug_key").eq("id", id).maybeSingle();

  const { error } = await supabase.from("norms").delete().eq("id", id);

  if (error) {
    redirect(`/admin/norms/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  if (row?.slug_key) {
    revalidateNormPaths(String(row.slug_key));
  } else {
    revalidatePath("/norms");
    revalidatePath("/es/norms");
    revalidatePath("/admin/norms");
  }

  redirect("/admin/norms?deleted=1");
}
