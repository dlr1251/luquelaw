"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdminClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims || !isAppAdmin(data.claims)) {
    redirect("/account");
  }
  return supabase;
}

export async function saveClkrArticleSettings(formData: FormData) {
  const supabase = await requireAdminClaims();

  const slug_key = String(formData.get("slug_key") ?? "").trim();
  const loc = String(formData.get("locale") ?? "");
  if (!slug_key || (loc !== "en" && loc !== "es")) {
    redirect("/admin/clkr?error=Invalid+payload");
  }
  const locale = loc as "en" | "es";

  const sortRaw = String(formData.get("sort_order") ?? "0");
  const sort_order = Number.parseInt(sortRaw, 10);
  const is_hidden = String(formData.get("visibility") ?? "visible") === "hidden";
  const title_override = String(formData.get("title_override") ?? "").trim() || null;
  const description_override = String(formData.get("description_override") ?? "").trim() || null;

  const { error: upError } = await supabase.from("clkr_article_settings").upsert(
    {
      slug_key,
      locale,
      sort_order: Number.isFinite(sort_order) ? sort_order : 0,
      is_hidden,
      title_override,
      description_override,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug_key,locale" },
  );

  if (upError) {
    redirect(`/admin/clkr?error=${encodeURIComponent(upError.message)}`);
  }

  revalidatePath("/clkr");
  revalidatePath("/es/clkr");
  revalidatePath("/admin/clkr");
  redirect("/admin/clkr?saved=1");
}

export async function clearClkrArticleSettings(formData: FormData) {
  const supabase = await requireAdminClaims();

  const slug_key = String(formData.get("slug_key") ?? "").trim();
  const loc = String(formData.get("locale") ?? "");
  if (!slug_key || (loc !== "en" && loc !== "es")) {
    redirect("/admin/clkr?error=Invalid+payload");
  }

  const { error: delError } = await supabase
    .from("clkr_article_settings")
    .delete()
    .eq("slug_key", slug_key)
    .eq("locale", loc);

  if (delError) {
    redirect(`/admin/clkr?error=${encodeURIComponent(delError.message)}`);
  }

  revalidatePath("/clkr");
  revalidatePath("/es/clkr");
  revalidatePath("/admin/clkr");
  redirect("/admin/clkr?cleared=1");
}
