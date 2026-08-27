"use client";

import Link from "next/link";

import { Container } from "@/components/container";
import { HeaderNav } from "@/components/header-nav";
import { SiteTopBar } from "@/components/site-top-bar";
import type { FxRates } from "@/lib/markets/fx";

export type SiteHeaderChromeProps = {
  rates: FxRates;
  signedIn: boolean;
  isAdmin: boolean;
};

export function SiteHeaderChrome({ rates, signedIn, isAdmin }: SiteHeaderChromeProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background text-foreground">
      <SiteTopBar rates={rates} />
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
