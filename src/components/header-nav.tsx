"use client";

import { useEffect, useId, useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitch } from "@/components/language-switch";
import { PaletteSwitcher } from "@/components/palette-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { localeFromPathname } from "@/lib/locale/paths";

export function HeaderNav({
  signedIn,
  isAdmin = false,
}: {
  signedIn: boolean;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const mobilePanelId = useId();
  const isSpanish = localeFromPathname(pathname) === "es";
  const prefix = isSpanish ? "/es" : "";
  const homeHref = prefix || "/";
  const contactHref = `${homeHref}#contact`;
  const bookHref = `${homeHref}#book`;

  const copy = isSpanish
    ? {
        legalArticles: "CLKR",
        blog: "Blog",
        pricing: "Planes",
        contact: "Contacto",
        portal: "Portal",
        admin: "Admin",
        cta: "Agendar consulta",
        close: "Cerrar",
      }
    : {
        legalArticles: "CLKR",
        blog: "Blog",
        pricing: "Pricing",
        contact: "Contact",
        portal: "Portal",
        admin: "Admin",
        cta: "Book consultation",
        close: "Close",
      };

  const items = useMemo(
    () => [
      { href: `${prefix}/clkr`, label: copy.legalArticles },
      { href: `${prefix}/posts`, label: copy.blog },
      { href: `${prefix}/pricing`, label: copy.pricing },
      { href: contactHref, label: copy.contact },
      { href: signedIn ? "/portal" : "/login", label: copy.portal },
    ],
    [
      contactHref,
      copy.blog,
      copy.contact,
      copy.legalArticles,
      copy.portal,
      copy.pricing,
      prefix,
      signedIn,
    ],
  );

  const primaryLinks = items.slice(0, 4);
  const portalLink = items[4];

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [mobileOpen]);

  const navLinkClass =
    "inline-flex items-center whitespace-nowrap px-2.5 py-2 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-hero-foreground/75 transition duration-150 hover:text-hero-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-foreground/40";

  const iconButtonClass =
    "inline-flex h-10 w-10 items-center justify-center text-hero-foreground/70 transition hover:text-hero-foreground";

  return (
    <>
      <nav className="hidden items-center justify-end gap-1 lg:flex" aria-label="Primary">
        <div className="flex items-center">
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
          <Link href={portalLink.href} className={navLinkClass}>
            {portalLink.label}
          </Link>
          {signedIn && isAdmin ? (
            <Link href="/admin/clkr" className={navLinkClass}>
              {copy.admin}
            </Link>
          ) : null}
        </div>

        <div className="mx-2 h-4 w-px bg-[color:var(--parchment)]/15" />

        <div className="flex items-center gap-1">
          <LanguageSwitch variant="forest" />
          <PaletteSwitcher variant="forest" />
          <ThemeToggle variant="forest" />
        </div>

        <Link href={bookHref} className="btn-primary-inverted btn-primary-sm ml-3 whitespace-nowrap">
          {copy.cta}
        </Link>
      </nav>

      <div className="lg:hidden">
        <div className="flex items-center justify-end gap-1">
          <LanguageSwitch variant="forest" />
          <PaletteSwitcher variant="forest" />
          <ThemeToggle variant="forest" />
          <button
            type="button"
            className={iconButtonClass}
            aria-label="Open menu"
            aria-controls={mobilePanelId}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>

        {mobileOpen ? (
          <div
            className="fixed inset-0 z-[60]"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              aria-label={copy.close}
              onClick={() => setMobileOpen(false)}
            />
            <div
              id={mobilePanelId}
              className="absolute right-0 top-0 h-full w-[86vw] max-w-sm bg-[color:var(--forest)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[color:var(--parchment)]/10 p-4">
                <div className="flex items-center gap-[0.3em] font-display text-base font-normal text-[color:var(--parchment)]">
                  <span>Luque</span>
                  <span aria-hidden="true" className="brand-mark-dot text-[color:var(--parchment)]" />
                  <span>Law</span>
                </div>
                <button
                  type="button"
                  className={iconButtonClass}
                  aria-label={copy.close}
                  onClick={() => setMobileOpen(false)}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <nav className="p-3" aria-label="Mobile navigation">
                {[...primaryLinks, portalLink].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 font-[family-name:var(--font-ui)] text-sm font-medium uppercase tracking-[0.1em] text-[color:var(--parchment)]/75 transition hover:text-[color:var(--parchment)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--parchment)]/40"
                  >
                    {item.label}
                  </Link>
                ))}
                {signedIn && isAdmin ? (
                  <Link
                    href="/admin/clkr"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 font-[family-name:var(--font-ui)] text-sm font-medium uppercase tracking-[0.1em] text-[color:var(--parchment)]/75 transition hover:text-[color:var(--parchment)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--parchment)]/40"
                  >
                    {copy.admin}
                  </Link>
                ) : null}

                <div className="mt-3 border-t border-[color:var(--parchment)]/10 px-1 pt-4">
                  <Link
                    href={bookHref}
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary-inverted btn-primary-lg flex w-full justify-center"
                  >
                    {copy.cta}
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
