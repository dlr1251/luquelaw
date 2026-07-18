import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  adminNavGroups,
  resolveAdminPageMeta,
} from "@/components/dashboard/dashboard-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { loginHref } from "@/lib/auth/safe-next";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") || "/admin/clkr";

  if (!isSupabaseConfigured()) {
    redirect(loginHref(pathname));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(loginHref(pathname));
  }

  if (!isAppAdmin(data.claims)) {
    redirect("/portal");
  }

  const email = typeof data.claims.email === "string" ? data.claims.email : null;
  const page = resolveAdminPageMeta(pathname);

  return (
    <DashboardShell
      email={email}
      productName="Admin"
      productTagline="CMS & operations"
      pageTitle={page.title}
      pageDescription={page.description}
      groups={adminNavGroups}
    >
      {children}
    </DashboardShell>
  );
}
