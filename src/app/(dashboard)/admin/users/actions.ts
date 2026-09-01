"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCmsAdminSession } from "@/lib/admin/session";
import { ensureProfileRow } from "@/lib/admin/users";
import { isServiceRoleConfigured, createServiceClient } from "@/lib/supabase/service";

function revalidateUser(id: string) {
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
}

function bounce(id: string, error: string): never {
  redirect(`/admin/users/${id}?error=${encodeURIComponent(error)}`);
}

async function requireAdminActor() {
  const session = await getCmsAdminSession();
  if (!session) redirect("/portal");
  if (!isServiceRoleConfigured()) {
    redirect("/admin/users?error=Service+role+not+configured");
  }
  return session;
}

export async function updateAdminUserProfile(formData: FormData) {
  const actor = await requireAdminActor();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/users?error=Missing+user");

  const displayName = String(formData.get("display_name") ?? "").trim().slice(0, 80);
  const locale = String(formData.get("locale") ?? "en") === "es" ? "es" : "en";
  const isClient = formData.get("is_client") === "on";
  const isSubscriber = formData.get("is_subscriber") === "on";

  if (!displayName) bounce(id, "Display name is required");

  const admin = createServiceClient();
  const { data: userData, error: userError } = await admin.auth.admin.getUserById(id);
  if (userError || !userData.user) bounce(id, "User not found");

  await ensureProfileRow(id, userData.user.email ?? actor.email);

  const { error } = await admin
    .from("profiles")
    .update({
      display_name: displayName,
      locale,
      is_client: isClient,
      is_subscriber: isSubscriber,
    })
    .eq("id", id);

  if (error) bounce(id, error.message);
  revalidateUser(id);
  redirect(`/admin/users/${id}?saved=1`);
}

export async function setCmsAllowlist(formData: FormData) {
  const actor = await requireAdminActor();
  const id = String(formData.get("id") ?? "").trim();
  const grant = String(formData.get("grant") ?? "") === "1";
  if (!id) redirect("/admin/users?error=Missing+user");

  const admin = createServiceClient();
  const { data: userData, error: userError } = await admin.auth.admin.getUserById(id);
  if (userError || !userData.user?.email) bounce(id, "User has no email");

  const email = userData.user.email.trim().toLowerCase();
  if (!grant && email === actor.email) {
    bounce(id, "You cannot remove your own CMS access");
  }

  const { data: allowRows, error: allowReadError } = await admin.from("admin_allowlist").select("email");
  if (allowReadError) bounce(id, allowReadError.message);
  const existing = (allowRows ?? []).find(
    (row) => String(row.email ?? "").trim().toLowerCase() === email,
  );

  if (grant) {
    if (!existing) {
      const { error } = await admin.from("admin_allowlist").insert({ email });
      if (error) bounce(id, error.message);
    }
  } else if (existing?.email) {
    const { error } = await admin.from("admin_allowlist").delete().eq("email", existing.email);
    if (error) bounce(id, error.message);
  }

  revalidateUser(id);
  redirect(`/admin/users/${id}?saved=1`);
}
