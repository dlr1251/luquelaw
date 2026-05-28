import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { portalNavItems } from "@/components/dashboard/dashboard-nav";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AccountLayout({
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

  const email = typeof data.claims.email === "string" ? data.claims.email : null;
  const admin = isAppAdmin(data.claims);

  return (
    <DashboardShell
      email={email}
      title="Client portal"
      subtitle="Account & resources"
      pageTitle="Overview"
      pageDescription="Your hub for consultations and legal resources"
      items={portalNavItems(admin)}
    >
      {children}
    </DashboardShell>
  );
}
