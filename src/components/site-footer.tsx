"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { usePathname } from "next/navigation";

import { Container } from "@/components/container";
import { DlrMonogram } from "@/components/dlr-monogram";
import { localeFromPathname } from "@/lib/locale/paths";

export function SiteFooter({ signedIn = false }: { signedIn?: boolean }) {
  const pathname = usePathname();
  const isSpanish = localeFromPathname(pathname) === "es";
  const prefix = isSpanish ? "/es" : "";

  const tagline = isSpanish
    ? "Asesoría jurídica para extranjeros en Colombia."
    : "Legal counsel for foreigners in Colombia.";

  const disclaimer = isSpanish
    ? "Este contenido es solo para fines informativos y no constituye asesoría jurídica. Cada caso es único."
    : "This content is for informational purposes only and does not constitute legal advice. Every case is unique.";

  const homeHref = prefix || "/";
  const portalHref = signedIn ? "/portal" : "/login";
  const navLinks = isSpanish
    ? [
        { href: `${prefix}/clkr`, label: "CLKR" },
        { href: `${prefix}/posts`, label: "Blog" },
        { href: `${prefix}/pricing`, label: "Planes" },
        { href: `${homeHref}#contact`, label: "Contacto" },
        { href: portalHref, label: "Portal" },
      ]
    : [
        { href: `${prefix}/clkr`, label: "CLKR" },
        { href: `${prefix}/posts`, label: "Blog" },
        { href: `${prefix}/pricing`, label: "Pricing" },
        { href: `${homeHref}#contact`, label: "Contact" },
        { href: portalHref, label: "Portal" },
      ];

  const sectionLabel =
    "font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.22em] text-hero-foreground/50";

  const navLinkClass =
    "block font-[family-name:var(--font-ui)] text-[0.8125rem] font-medium text-hero-foreground/72 transition hover:text-hero-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-foreground/40";

  return (
    <footer className="border-t border-hero-foreground/12 bg-hero text-hero-foreground">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,4fr)] lg:gap-12">
          <div className="space-y-6">
            <Link
              href={homeHref}
              className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-foreground/50"
            >
              <div className="flex items-center gap-[0.3em] font-display text-lg font-normal leading-none tracking-tight">
                <span>Luque</span>
                <span aria-hidden="true" className="brand-mark-dot" />
                <span>Law</span>
              </div>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-hero-muted">{tagline}</p>

            <div className="space-y-3">
              <a
                href="mailto:daniel@luquelaw.co"
                className="flex items-center gap-2.5 text-sm text-hero-foreground/72 transition hover:text-hero-foreground"
              >
                <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                daniel@luquelaw.co
              </a>
              <a
                href={
                  isSpanish
                    ? "https://wa.me/573006791123?text=Hola%20Daniel%2C%20acabo%20de%20visitar%20tu%20sitio%20web%20y%20quiero%20preguntarte%20algo..."
                    : "https://wa.me/573006791123?text=Hi%20Daniel%2C%20I%20was%20just%20visiting%20your%20website%20and%20want%20to%20ask%20you%20something..."
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-sm text-hero-foreground/72 transition hover:text-hero-foreground"
              >
                <WhatsappIcon className="h-4 w-4 shrink-0" />
                +57 300 679 1123
              </a>
            </div>
          </div>

          <div className="space-y-5">
            <p className={sectionLabel}>{isSpanish ? "Explorar" : "Explore"}</p>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={navLinkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="space-y-5">
            <p className={sectionLabel}>{isSpanish ? "Aviso legal" : "Legal notice"}</p>
            <p className="text-sm leading-relaxed text-hero-foreground/52">{disclaimer}</p>
          </div>
        </div>
      </Container>

      <div className="border-t border-hero-foreground/12">
        <Container className="flex flex-col items-center gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="min-w-0 text-center font-[family-name:var(--font-ui)] text-[0.6875rem] leading-relaxed text-hero-foreground/38 sm:text-left">
            © {new Date().getFullYear()} Luque Law · Daniel Luque Restrepo · Medellín, Colombia
          </p>
          <DlrMonogram size={32} className="shrink-0" />
        </Container>
      </div>
    </footer>
  );
}
