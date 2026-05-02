import { redirect } from "next/navigation";

import { AccountPortalShell } from "@/components/account/portal-shell";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { createClient } from "@/lib/supabase/server";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const email = typeof data.claims.email === "string" ? data.claims.email : null;
  const admin = isAppAdmin(data.claims);

  return (
    <AccountPortalShell email={email} isAdmin={admin}>
      {children}
    </AccountPortalShell>
  );
}
