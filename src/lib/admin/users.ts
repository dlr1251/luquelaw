import type { User } from "@supabase/supabase-js";

import { envAdminEmails } from "@/lib/admin/session";
import { createServiceClient } from "@/lib/supabase/service";

export type AdminUserRoleFilter = "all" | "admin" | "client";

export type AdminUserRow = {
  id: string;
  email: string;
  displayName: string;
  locale: "en" | "es";
  isClient: boolean;
  isSubscriber: boolean;
  isAllowlistAdmin: boolean;
  isJwtAdmin: boolean;
  isEnvAdmin: boolean;
  cmsAdmin: boolean;
  walletCents: number | null;
  planSlugs: string[];
  createdAt: string | null;
  lastSignInAt: string | null;
};

function roleFromAppMetadata(user: User): string {
  const role = user.app_metadata?.role;
  return typeof role === "string" ? role : "";
}

async function listAuthUsers() {
  const admin = createServiceClient();
  const perPage = 200;
  const users: User[] = [];
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const batch = data.users ?? [];
    users.push(...batch);
    if (batch.length < perPage) break;
  }
  return users;
}

export async function listAdminUsers(opts?: {
  q?: string;
  role?: AdminUserRoleFilter;
}): Promise<AdminUserRow[]> {
  const admin = createServiceClient();
  const [authUsers, profilesRes, walletsRes, allowRes, subsRes] = await Promise.all([
    listAuthUsers(),
    admin.from("profiles").select("id, display_name, locale, is_client, is_subscriber"),
    admin.from("lucy_wallets").select("user_id, balance_cents"),
    admin.from("admin_allowlist").select("email"),
    admin
      .from("subscriptions")
      .select("user_id, status, plans(slug)")
      .in("status", ["active", "trialing"]),
  ]);

  const allowlist = new Set(
    (allowRes.data ?? []).map((row) => String(row.email ?? "").trim().toLowerCase()).filter(Boolean),
  );
  const envAdmins = envAdminEmails();
  const profiles = new Map(
    (profilesRes.data ?? []).map((row) => [
      row.id as string,
      {
        displayName: String(row.display_name ?? "").trim(),
        locale: row.locale === "es" ? ("es" as const) : ("en" as const),
        isClient: Boolean(row.is_client),
        isSubscriber: Boolean(row.is_subscriber),
      },
    ]),
  );
  const wallets = new Map(
    (walletsRes.data ?? []).map((row) => [row.user_id as string, Number(row.balance_cents ?? 0)]),
  );
  const plansByUser = new Map<string, string[]>();
  for (const row of subsRes.data ?? []) {
    const plan = row.plans as { slug?: string } | { slug?: string }[] | null;
    const slug = Array.isArray(plan) ? plan[0]?.slug : plan?.slug;
    if (!slug) continue;
    const list = plansByUser.get(row.user_id) ?? [];
    list.push(slug);
    plansByUser.set(row.user_id, list);
  }

  const query = (opts?.q ?? "").trim().toLowerCase();
  const role = opts?.role ?? "all";

  const rows = authUsers.map((user) => {
    const email = (user.email ?? "").trim().toLowerCase();
    const profile = profiles.get(user.id);
    const isAllowlistAdmin = allowlist.has(email);
    const isJwtAdmin = roleFromAppMetadata(user) === "admin";
    const isEnvAdmin = envAdmins.has(email);
    const row: AdminUserRow = {
      id: user.id,
      email,
      displayName: profile?.displayName || email.split("@")[0] || "User",
      locale: profile?.locale ?? "en",
      isClient: profile?.isClient ?? false,
      isSubscriber: profile?.isSubscriber ?? false,
      isAllowlistAdmin,
      isJwtAdmin,
      isEnvAdmin,
      cmsAdmin: isAllowlistAdmin || isJwtAdmin || isEnvAdmin,
      walletCents: wallets.has(user.id) ? (wallets.get(user.id) ?? 0) : null,
      planSlugs: plansByUser.get(user.id) ?? [],
      createdAt: user.created_at ?? null,
      lastSignInAt: user.last_sign_in_at ?? null,
    };
    return row;
  });

  return rows
    .filter((row) => {
      if (role === "admin" && !row.cmsAdmin) return false;
      if (role === "client" && !row.isClient) return false;
      if (!query) return true;
      return [row.email, row.displayName, row.id].join(" ").toLowerCase().includes(query);
    })
    .sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return bTime - aTime;
    });
}

export async function getAdminUser(id: string): Promise<AdminUserRow | null> {
  const admin = createServiceClient();
  const { data, error } = await admin.auth.admin.getUserById(id);
  if (error || !data.user) return null;

  const user = data.user;
  const email = (user.email ?? "").trim().toLowerCase();
  const [profileRes, walletRes, allowRes, subsRes] = await Promise.all([
    admin
      .from("profiles")
      .select("display_name, locale, is_client, is_subscriber")
      .eq("id", id)
      .maybeSingle(),
    admin.from("lucy_wallets").select("balance_cents").eq("user_id", id).maybeSingle(),
    admin.from("admin_allowlist").select("email"),
    admin
      .from("subscriptions")
      .select("status, plans(slug)")
      .eq("user_id", id)
      .in("status", ["active", "trialing"]),
  ]);

  const profile = profileRes.data;
  const isAllowlistAdmin = (allowRes.data ?? []).some(
    (row) => String(row.email ?? "").trim().toLowerCase() === email,
  );
  const isJwtAdmin = roleFromAppMetadata(user) === "admin";
  const isEnvAdmin = envAdminEmails().has(email);
  const planSlugs = (subsRes.data ?? [])
    .map((row) => {
      const plan = row.plans as { slug?: string } | { slug?: string }[] | null;
      return Array.isArray(plan) ? plan[0]?.slug : plan?.slug;
    })
    .filter((slug): slug is string => Boolean(slug));

  return {
    id: user.id,
    email,
    displayName: String(profile?.display_name ?? "").trim() || email.split("@")[0] || "User",
    locale: profile?.locale === "es" ? "es" : "en",
    isClient: Boolean(profile?.is_client),
    isSubscriber: Boolean(profile?.is_subscriber),
    isAllowlistAdmin,
    isJwtAdmin,
    isEnvAdmin,
    cmsAdmin: isAllowlistAdmin || isJwtAdmin || isEnvAdmin,
    walletCents: walletRes.data ? Number(walletRes.data.balance_cents ?? 0) : null,
    planSlugs,
    createdAt: user.created_at ?? null,
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}

export async function ensureProfileRow(userId: string, email: string) {
  const admin = createServiceClient();
  const { data } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (data?.id) return;
  await admin.from("profiles").insert({
    id: userId,
    display_name: email.split("@")[0] || "User",
    locale: "en",
  });
}
