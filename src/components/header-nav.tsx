"use client";

import { useEffect, useId, useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { useBookingModal } from "@/components/booking/BookingProvider";

export function HeaderNav({
  signedIn,
  isAdmin = false,
}: {
  signedIn: boolean;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const mobilePanelId = useId();
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const prefix = isSpanish ? "/es" : "";
  const booking = useBookingModal();
  const copy = isSpanish
    ? {
        services: "Servicios",
        clkr: "CLKR",
        contact: "Contacto",
        portal: "Portal cliente",
        admin: "Admin",
        cta: "Agendar consulta",
        menu: "Menú",
        close: "Cerrar",
      }
    : {
        services: "Services",
        clkr: "CLKR",
        contact: "Contact",
        portal: "Client portal",
        admin: "Admin",
        cta: "Book consultation",
        menu: "Menu",
        close: "Close",
      };

  const items = useMemo(
    () => [
      { href: `${prefix}/services`, label: copy.services },
      { href: `${prefix}/clkr`, label: copy.clkr },
      { href: `${prefix}/contact`, label: copy.contact },
      { href: signedIn ? "/account" : "/login", label: copy.portal },
    ],
    [copy.clkr, copy.contact, copy.portal, copy.services, prefix, signedIn],
  );

  const primaryLinks = items.slice(0, 3);
  const portalLink = items[3];

  const ctaHref = `${prefix}/contact#consultation`;
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
    "inline-flex items-center whitespace-nowrap px-2 py-2 text-sm font-bold text-[color:var(--header-fg-muted)] underline-offset-4 decoration-2 decoration-[color:var(--caramel)] transition hover:text-[color:var(--cream)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--caramel)]";
  const utilityButtonClass =
    "inline-flex h-10 items-center justify-center border border-[color:var(--caramel)] bg-transparent px-3 text-sm font-bold text-[color:var(--cream)] transition hover:bg-[color:var(--cream)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--caramel)]";

  return (
    <>
      <nav className="hidden items-center justify-end gap-1 sm:flex" aria-label="Primary">
        <div className="flex items-center gap-1">
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

        <div className="mx-2 h-5 w-px bg-[color:var(--caramel)]/50" />

        <div className="flex items-center gap-2">
          <LanguageSwitch variant="forest" />
          <ThemeToggle variant="forest" />
        </div>

        <button
          type="button"
          onClick={booking.open}
          className="btn-primary btn-primary-sm ml-2 whitespace-nowrap"
        >
          {copy.cta}
        </button>
      </nav>

      <div className="sm:hidden">
        <div className="flex items-center justify-end gap-2">
          <LanguageSwitch variant="forest" />
          <ThemeToggle variant="forest" />
          <button
            type="button"
            className={utilityButtonClass}
            aria-label={copy.menu}
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
          <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={copy.menu}>
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label={copy.close}
              onClick={() => setMobileOpen(false)}
            />
            <div
              id={mobilePanelId}
              className="absolute right-0 top-0 h-full w-[86vw] max-w-sm border-l-2 border-[color:var(--caramel)] bg-[color:var(--forest)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[color:var(--caramel)]/35 p-4">
                <div className="text-sm font-bold tracking-wide text-[color:var(--cream)]">{copy.menu}</div>
                <button
                  type="button"
                  className={utilityButtonClass}
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

              <div className="p-2">
                {[...primaryLinks, portalLink].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-none px-4 py-3 text-base font-bold text-[color:var(--cream)] hover:bg-[color:var(--cream)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--caramel)]"
                  >
                    {item.label}
                  </Link>
                ))}
                {signedIn && isAdmin ? (
                  <Link
                    href="/admin/clkr"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-none px-4 py-3 text-base font-bold text-[color:var(--cream)] hover:bg-[color:var(--cream)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--caramel)]"
                  >
                    {copy.admin}
                  </Link>
                ) : null}

                <div className="mt-2 border-t border-[color:var(--caramel)]/35 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      booking.open();
                    }}
                    className="btn-primary btn-primary-lg flex w-full justify-center"
                  >
                    {copy.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
