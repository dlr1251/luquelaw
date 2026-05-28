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
    <header className="sticky top-0 z-50 bg-hero text-hero-foreground">
      <Container className="flex min-h-16 items-center justify-between gap-3 py-3 sm:py-2">
        <Link
          href="/"
          className="group inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--parchment)]/50"
          aria-label="Luque Law — home"
        >
          <div className="flex items-center gap-[0.3em] font-display text-lg font-normal leading-none tracking-tight text-hero-foreground sm:text-xl">
            <span>Luque</span>
            <span aria-hidden="true" className="brand-mark-dot text-hero-foreground" />
            <span>Law</span>
          </div>
          <p className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.22em] text-hero-foreground/55 sm:block">
            Legal counsel · Medellín
          </p>
        </Link>

        <HeaderNav signedIn={signedIn} isAdmin={isAdmin} />
      </Container>
    </header>
  );
}
