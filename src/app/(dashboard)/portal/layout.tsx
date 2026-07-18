import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  portalNavGroups,
  resolvePortalPageMeta,
} from "@/components/dashboard/dashboard-nav";
import { LucyWalletChip } from "@/components/lucy/lucy-wallet-chip";
import { isAppAdmin } from "@/lib/auth/is-admin";
import { loginHref } from "@/lib/auth/safe-next";
import { getSessionUserId } from "@/lib/billing/entitlements";
import { getLucyBalance } from "@/lib/lucy/wallet";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") || "/portal";

  if (!isSupabaseConfigured()) {
    redirect(loginHref(pathname));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(loginHref(pathname));
  }

  const email = typeof data.claims.email === "string" ? data.claims.email : null;
  const admin = isAppAdmin(data.claims);
  const page = resolvePortalPageMeta(pathname);

  const onLucy = pathname.startsWith("/portal/lucy") || pathname.startsWith("/portal/chat");
  let headerAction: React.ReactNode;
  if (onLucy) {
    const userId = await getSessionUserId();
    const balance = userId ? await getLucyBalance(userId) : 0;
    headerAction = <LucyWalletChip balanceCents={balance} />;
  }

  return (
    <DashboardShell
      email={email}
      productName="Portal"
      productTagline="Workspace"
      pageTitle={page.title}
      pageDescription={page.description}
      groups={portalNavGroups(admin)}
      headerAction={headerAction}
    >
      {children}
    </DashboardShell>
  );
}
