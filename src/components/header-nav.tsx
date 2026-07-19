"use client";

import { useEffect, useId, useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useBookingModal } from "@/components/booking/BookingProvider";
import { SiteSearchTrigger } from "@/components/search/site-search-trigger";
import { LanguageSwitch } from "@/components/language-switch";
import { PaletteSwitcher } from "@/components/palette-switcher";
import { loginHref } from "@/lib/auth/safe-next";
import { clkrGuidesHubPath } from "@/lib/clkr/types";
import { localeFromPathname } from "@/lib/locale/paths";
import { normsHubPath } from "@/lib/norms/types";
import { getServiceAreas } from "@/lib/services/content";

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

export function HeaderNav({
  signedIn,
  isAdmin = false,
}: {
  signedIn: boolean;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const mobilePanelId = useId();
  const servicesMenuId = useId();
  const resourcesMenuId = useId();
  const { open: openBooking } = useBookingModal();
  const isSpanish = localeFromPathname(pathname) === "es";
  const locale = isSpanish ? "es" : "en";
  const prefix = isSpanish ? "/es" : "";

  const copy = isSpanish
    ? {
        about: "Nosotros",
        services: "Servicios",
        allServices: "Todos los servicios",
        resources: "Recursos",
        norms: "Normas",
        articles: "Artículos",
        blog: "Blog",
        torny: "Torny",
        admin: "Admin",
        cta: "Agendar consulta",
        close: "Cerrar",
        search: "Buscar",
      }
    : {
        about: "About",
        services: "Services",
        allServices: "All services",
        resources: "Resources",
        norms: "Norms",
        articles: "Articles",
        blog: "Blog",
        torny: "Torny",
        admin: "Admin",
        cta: "Book consultation",
        close: "Close",
        search: "Search",
      };

  const aboutHref = isSpanish ? "/es/nosotros" : "/about";
  const servicesHref = isSpanish ? "/es/servicios" : "/services";
  const postsHref = `${prefix}/posts`;
  const tornyHref = signedIn ? "/portal/lucy" : loginHref("/portal/lucy");
  const serviceAreas = useMemo(() => getServiceAreas(locale), [locale]);

  const resourceItems = useMemo(
    () => [
      { href: normsHubPath(locale), label: copy.norms },
      { href: clkrGuidesHubPath(locale), label: copy.articles },
      { href: postsHref, label: copy.blog },
      { href: tornyHref, label: copy.torny },
    ],
    [copy.articles, copy.blog, copy.norms, copy.torny, locale, postsHref, tornyHref],
  );

  const servicesActive =
    pathname === servicesHref ||
    pathname.startsWith(`${servicesHref}/`) ||
    (isSpanish
      ? pathname.startsWith("/es/servicios")
      : pathname === "/services" || pathname.startsWith("/services/"));

  const resourcesActive =
    pathname === `${prefix}/clkr` ||
    pathname.startsWith(`${prefix}/clkr/`) ||
    pathname === postsHref ||
    pathname.startsWith(`${postsHref}/`) ||
    pathname.startsWith("/portal/lucy");

  const activeNavClass =
    "text-[color:var(--forest)] after:absolute after:inset-x-2.5 after:bottom-1 after:h-px after:bg-[color:var(--forest)]/50";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setServicesOpen(false);
    setResourcesOpen(false);
    setMobileServicesOpen(false);
    setMobileResourcesOpen(false);
    setMobileOpen(false);
  }

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
    "relative inline-flex items-center whitespace-nowrap px-2.5 py-2 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-[color:var(--forest)]/70 transition duration-150 hover:text-[color:var(--forest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--forest)]/40";

  const iconButtonClass =
    "inline-flex h-10 w-10 items-center justify-center text-[color:var(--forest)]/65 transition hover:text-[color:var(--forest)]";

  const menuItemClass =
    "block px-4 py-2.5 font-[family-name:var(--font-ui)] text-[0.75rem] text-foreground/80 transition hover:bg-muted hover:text-foreground";

  const mobileLinkClass = (active: boolean) =>
    `block px-4 py-3 font-[family-name:var(--font-ui)] text-sm font-medium uppercase tracking-[0.1em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--parchment)]/40 ${
      active
        ? "text-[color:var(--parchment)]"
        : "text-[color:var(--parchment)]/75 hover:text-[color:var(--parchment)]"
    }`;

  return (
    <>
      <nav className="hidden items-center justify-end gap-1 lg:flex" aria-label="Primary">
        <div className="flex items-center">
          <Link
            href={aboutHref}
            className={`${navLinkClass}${pathname === aboutHref ? ` ${activeNavClass}` : ""}`}
            aria-current={pathname === aboutHref ? "page" : undefined}
          >
            {copy.about}
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className={`${navLinkClass}${servicesActive ? ` ${activeNavClass}` : ""}`}
              aria-expanded={servicesOpen}
              aria-controls={servicesMenuId}
              aria-haspopup="true"
              onClick={() => setServicesOpen((open) => !open)}
              onFocus={() => setServicesOpen(true)}
            >
              {copy.services}
              <Chevron className="ml-1 h-2.5 w-2.5" />
            </button>

            {servicesOpen ? (
              <div
                id={servicesMenuId}
                className="absolute left-0 top-full z-50 min-w-[14rem] border border-border bg-card py-2 shadow-lg"
                role="menu"
              >
                <Link
                  href={servicesHref}
                  role="menuitem"
                  className="block px-4 py-2.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[color:var(--forest)]/80 transition hover:bg-muted hover:text-[color:var(--forest)]"
                  onClick={() => setServicesOpen(false)}
                >
                  {copy.allServices}
                </Link>
                <div className="my-1 h-px bg-border" />
                {serviceAreas.map((area) => (
                  <Link
                    key={area.id}
                    href={area.href}
                    role="menuitem"
                    className={menuItemClass}
                    onClick={() => setServicesOpen(false)}
                  >
                    {area.shortTitle}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              type="button"
              className={`${navLinkClass}${resourcesActive ? ` ${activeNavClass}` : ""}`}
              aria-expanded={resourcesOpen}
              aria-controls={resourcesMenuId}
              aria-haspopup="true"
              onClick={() => setResourcesOpen((open) => !open)}
              onFocus={() => setResourcesOpen(true)}
            >
              {copy.resources}
              <Chevron className="ml-1 h-2.5 w-2.5" />
            </button>

            {resourcesOpen ? (
              <div
                id={resourcesMenuId}
                className="absolute left-0 top-full z-50 min-w-[12rem] border border-border bg-card py-2 shadow-lg"
                role="menu"
              >
                {resourceItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    role="menuitem"
                    className={menuItemClass}
                    onClick={() => setResourcesOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {signedIn && isAdmin ? (
            <Link href="/admin/clkr" className={navLinkClass}>
              {copy.admin}
            </Link>
          ) : null}
        </div>

        <div className="mx-2 h-4 w-px bg-[color:var(--parchment)]/15" />

        <div className="flex items-center gap-1">
          <SiteSearchTrigger label={copy.search} />
          <LanguageSwitch variant="surface" />
          <PaletteSwitcher variant="surface" />
        </div>

        <button
          type="button"
          onClick={openBooking}
          className="btn-primary btn-primary-sm ml-3 whitespace-nowrap"
        >
          {copy.cta}
        </button>
      </nav>

      <div className="lg:hidden">
        <div className="flex items-center justify-end gap-1">
          <SiteSearchTrigger showShortcut={false} label={copy.search} />
          <LanguageSwitch variant="surface" />
          <PaletteSwitcher variant="surface" />
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
              className="absolute right-0 top-0 h-full w-[86vw] max-w-sm overflow-y-auto bg-[color:var(--forest)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[color:var(--parchment)]/10 p-4">
                <div className="flex items-center gap-[0.3em] font-display text-base font-normal text-[color:var(--parchment)]">
                  <span>Luque</span>
                  <span aria-hidden="true" className="brand-mark-dot text-[color:var(--parchment)]" />
                  <span>Law</span>
                </div>
                <button
                  type="button"
                  className={`${iconButtonClass} text-[color:var(--parchment)]/75 hover:text-[color:var(--parchment)]`}
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
                <Link
                  href={aboutHref}
                  onClick={() => setMobileOpen(false)}
                  aria-current={pathname === aboutHref ? "page" : undefined}
                  className={mobileLinkClass(pathname === aboutHref)}
                >
                  {copy.about}
                </Link>

                <div>
                  <button
                    type="button"
                    className={`${mobileLinkClass(servicesActive)} flex w-full items-center justify-between`}
                    aria-expanded={mobileServicesOpen}
                    onClick={() => setMobileServicesOpen((open) => !open)}
                  >
                    {copy.services}
                    <Chevron
                      className={`h-3 w-3 transition ${mobileServicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileServicesOpen ? (
                    <div className="pb-2 pl-2">
                      <Link
                        href={servicesHref}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2.5 font-[family-name:var(--font-ui)] text-xs font-medium uppercase tracking-[0.1em] text-[color:var(--parchment)]/70 transition hover:text-[color:var(--parchment)]"
                      >
                        {copy.allServices}
                      </Link>
                      {serviceAreas.map((area) => (
                        <Link
                          key={area.id}
                          href={area.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 font-[family-name:var(--font-ui)] text-sm text-[color:var(--parchment)]/70 transition hover:text-[color:var(--parchment)]"
                        >
                          {area.shortTitle}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div>
                  <button
                    type="button"
                    className={`${mobileLinkClass(resourcesActive)} flex w-full items-center justify-between`}
                    aria-expanded={mobileResourcesOpen}
                    onClick={() => setMobileResourcesOpen((open) => !open)}
                  >
                    {copy.resources}
                    <Chevron
                      className={`h-3 w-3 transition ${mobileResourcesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileResourcesOpen ? (
                    <div className="pb-2 pl-2">
                      {resourceItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 font-[family-name:var(--font-ui)] text-sm text-[color:var(--parchment)]/70 transition hover:text-[color:var(--parchment)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>

                {signedIn && isAdmin ? (
                  <Link
                    href="/admin/clkr"
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClass(false)}
                  >
                    {copy.admin}
                  </Link>
                ) : null}

                <div className="mt-3 border-t border-[color:var(--parchment)]/10 px-1 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      openBooking();
                    }}
                    className="btn-primary-inverted btn-primary-lg flex w-full justify-center"
                  >
                    {copy.cta}
                  </button>
                </div>
              </nav>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
