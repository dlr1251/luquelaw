import Link from "next/link";
import { redirect } from "next/navigation";

import { isAppAdmin } from "@/lib/auth/is-admin";
import { Container } from "@/components/container";
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

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[color:var(--background)]">
      <div className="border-b-2 border-[color:var(--moss)] bg-[color:var(--ink)] text-[color:var(--parchment)]">
        <Container className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
              Administration
            </p>
            <h1 className="font-display text-xl font-normal tracking-tight text-[color:var(--parchment)]">
              Site & CLKR
            </h1>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm font-bold">
            <Link
              className="text-[color:var(--parchment)]/80 underline-offset-4 decoration-[color:var(--moss)] hover:text-[color:var(--parchment)] hover:underline"
              href="/admin/clkr"
            >
              CLKR posts
            </Link>
            <Link
              className="text-[color:var(--parchment)]/80 underline-offset-4 decoration-[color:var(--moss)] hover:text-[color:var(--parchment)] hover:underline"
              href="/account"
            >
              Client portal
            </Link>
            <Link
              className="text-[color:var(--parchment)]/80 underline-offset-4 decoration-[color:var(--moss)] hover:text-[color:var(--parchment)] hover:underline"
              href="/"
            >
              Public site
            </Link>
          </nav>
        </Container>
      </div>
      {children}
    </div>
  );
}
