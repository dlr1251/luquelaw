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
    <header className="sticky top-0 z-50 border-b-2 border-[color:var(--caramel)] bg-[color:var(--forest)] text-[color:var(--cream)]">
      <Container className="flex min-h-16 items-center justify-between gap-3 py-3 sm:py-2">
        <Link
          href="/"
          className="group inline-block max-w-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--caramel)]"
          aria-label="Luque Law — home"
        >
          <div className="font-display text-xl leading-[1.1] tracking-tight text-[color:var(--cream)] sm:text-2xl">
            Luque Law
          </div>
          <p className="mt-1.5 font-sans text-[10px] font-bold uppercase leading-none tracking-[0.22em] text-[color:var(--caramel)]">
            Abogado
          </p>
        </Link>

        <HeaderNav signedIn={signedIn} isAdmin={isAdmin} />
      </Container>
    </header>
  );
}
