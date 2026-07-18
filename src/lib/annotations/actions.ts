"use server";

import { revalidatePath } from "next/cache";

import { requireEntitlement } from "@/lib/billing/entitlements";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function saveNormAnnotation(input: {
  normId: string;
  sectionId: string;
  body: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const access = await requireEntitlement("norm_annotations");
  if (!access.ok) return { ok: false, error: access.reason };
  if (!isSupabaseConfigured()) return { ok: false, error: "not_configured" };

  const body = input.body.trim();
  if (!body) return { ok: false, error: "empty" };

  const supabase = await createClient();
  const { error } = await supabase.from("norm_annotations").insert({
    user_id: access.userId,
    norm_id: input.normId,
    section_id: input.sectionId,
    body,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/clkr/norms");
  return { ok: true };
}
