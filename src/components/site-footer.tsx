"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { usePathname } from "next/navigation";

import { Container } from "@/components/container";
import { DlrMonogram } from "@/components/dlr-monogram";

export function SiteFooter() {
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const prefix = isSpanish ? "/es" : "";

  const tagline = isSpanish
    ? "Asesoría jurídica para extranjeros en Colombia."
    : "Legal counsel for foreigners in Colombia.";

  const disclaimer = isSpanish
    ? "Este contenido es solo para fines informativos y no constituye asesoría jurídica. Cada caso es único."
    : "This content is for informational purposes only and does not constitute legal advice. Every case is unique.";

  const homeHref = prefix || "/";
  const navLinks = isSpanish
    ? [
        { href: `${prefix}/clkr`, label: "CLKR" },
        { href: `${homeHref}#contact`, label: "Contacto" },
        { href: "/login", label: "Portal cliente" },
      ]
    : [
        { href: `${prefix}/clkr`, label: "CLKR" },
        { href: `${homeHref}#contact`, label: "Contact" },
        { href: "/login", label: "Client portal" },
      ];

  const sectionLabel =
    "font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.22em] text-[color:var(--parchment)]/45";

  const navLinkClass =
    "block font-[family-name:var(--font-ui)] text-[0.8125rem] font-medium text-[color:var(--parchment)]/70 transition hover:text-[color:var(--parchment)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--parchment)]/40";

  return (
    <footer className="border-t border-[color:var(--parchment)]/10 bg-[color:var(--forest)] text-[color:var(--parchment)]">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[5fr_3fr_4fr]">

          {/* Col 1 — Brand + contact */}
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--parchment)]/50"
            >
              <div className="flex items-center gap-[0.3em] font-display text-xl leading-[1.1] tracking-tight text-[color:var(--parchment)]">
                <span>Luque</span>
                <span
                  aria-hidden="true"
                  className="inline-block h-[0.5em] w-[0.5em] shrink-0 border border-[color:var(--parchment)]"
                />
                <span>Law</span>
              </div>
            </Link>

            <p className="max-w-xs font-[family-name:var(--font-body)] text-sm italic leading-[1.75] text-[color:var(--parchment)]/60">
              {tagline}
            </p>

            <div className="space-y-3">
              <a
                href="mailto:daniel@luquelaw.co"
                className="flex items-center gap-2.5 text-sm text-[color:var(--parchment)]/70 transition hover:text-[color:var(--parchment)]"
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
                className="flex items-center gap-2.5 text-sm text-[color:var(--parchment)]/70 transition hover:text-[color:var(--parchment)]"
              >
                <WhatsappIcon className="h-3.5 w-3.5 shrink-0" />
                +57 300 679 1123
              </a>
            </div>
          </div>

          {/* Col 2 — Navigation */}
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

          {/* Col 3 — Legal disclaimer */}
          <div className="space-y-5">
            <p className={sectionLabel}>{isSpanish ? "Aviso legal" : "Legal notice"}</p>
            <p className="font-[family-name:var(--font-body)] text-[0.75rem] leading-[1.8] text-[color:var(--parchment)]/40">
              {disclaimer}
            </p>
          </div>

        </div>
      </Container>

      {/* Copyright bar */}
      <div className="border-t border-[color:var(--parchment)]/10">
        <Container className="flex flex-col items-center gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="min-w-0 text-center font-[family-name:var(--font-ui)] text-[0.6875rem] leading-relaxed text-[color:var(--parchment)]/30 sm:text-left">
            © {new Date().getFullYear()} Luque Law · Daniel Luque Restrepo · Medellín, Colombia
          </p>
          <DlrMonogram size={32} className="shrink-0" />
        </Container>
      </div>
    </footer>
  );
}
