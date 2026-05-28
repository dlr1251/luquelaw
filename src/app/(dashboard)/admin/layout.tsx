import Link from "next/link";
import { redirect } from "next/navigation";

import { adminNavItems } from "@/components/dashboard/dashboard-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  if (!isAppAdmin(data.claims)) {
    redirect("/account");
  }

  const email = typeof data.claims.email === "string" ? data.claims.email : null;

  return (
    <DashboardShell
      email={email}
      title="Administration"
      subtitle="Site & content CMS"
      pageTitle="Administration"
      pageDescription="Manage legal articles, norms, blog posts, and site content"
      items={adminNavItems}
    >
      {children}
    </DashboardShell>
  );
}
