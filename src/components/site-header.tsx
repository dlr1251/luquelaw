import Link from "next/link";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Container } from "@/components/container";
import { HeaderNav } from "@/components/header-nav";
import { isAppAdmin } from "@/lib/auth/is-admin";

export async function SiteHeader() {
  let signedIn = false;
  let isAdmin = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getClaims();
      signedIn = Boolean(data?.claims);
      isAdmin = isAppAdmin(data?.claims);
    } catch {
      signedIn = false;
      isAdmin = false;
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background text-foreground">
      <Container className="flex min-h-16 items-center justify-between gap-3 py-3 sm:py-2">
        <Link
          href="/"
          className="group inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--forest)]/40"
          aria-label="Luque Law — home"
        >
          <div className="flex items-center gap-[0.3em] font-display text-lg font-normal leading-none tracking-tight text-[color:var(--forest)] sm:text-xl">
            <span>Luque</span>
            <span aria-hidden="true" className="brand-mark-dot text-[color:var(--forest)]" />
            <span>Law</span>
          </div>
        </Link>

        <HeaderNav signedIn={signedIn} isAdmin={isAdmin} />
      </Container>
    </header>
  );
}
