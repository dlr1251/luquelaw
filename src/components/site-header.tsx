import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/container";
import { HeaderNav } from "@/components/header-nav";
import { isAppAdmin } from "@/lib/auth/is-admin";

export async function SiteHeader() {
  let signedIn = false;
  let isAdmin = false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    signedIn = Boolean(data?.claims);
    isAdmin = isAppAdmin(data?.claims);
  } catch {
    signedIn = false;
    isAdmin = false;
  }

  return (
    <header className="sticky top-0 z-50 bg-[color:var(--forest)]">
      <Container className="flex min-h-16 items-center justify-between gap-3 py-3 sm:py-2">
        <Link
          href="/"
          className="group inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--parchment)]/50"
          aria-label="Luque Law — home"
        >
          <div className="flex items-center gap-[0.3em] font-display text-xl leading-[1.1] tracking-tight text-[color:var(--parchment)] sm:text-2xl">
            <span>Luque</span>
            <span
              aria-hidden="true"
              className="inline-block h-[0.5em] w-[0.5em] shrink-0 border border-[color:var(--parchment)]"
            />
            <span>Law</span>
          </div>
          <p className="mt-1 hidden font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.28em] text-[color:var(--parchment)]/50 min-[381px]:block sm:text-[9px]">
            Legal counsel · Medellín
          </p>
        </Link>

        <HeaderNav signedIn={signedIn} isAdmin={isAdmin} />
      </Container>
    </header>
  );
}
