"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/container";
import { DlrMonogram } from "@/components/dlr-monogram";

export function SiteFooter() {
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const prefix = isSpanish ? "/es" : "";
  const copy = isSpanish
    ? {
        strap:
          "Derecho colombiano para clientes internacionales. Asesoría jurídica bilingüe (EN/ES) en Medellín, Colombia.",
        contact: "Contacto",
        explore: "Explorar",
        next: "Siguiente paso",
        book: "Agendar",
        contactBtn: "Mensaje",
        hub: "Repositorio CLKR",
        services: "Servicios",
        investor: "Visa de inversionista (M)",
        realEstate: "Transacciones inmobiliarias",
        note:
          "La consulta inicial es de 1 hora. Recibirás un concepto jurídico escrito y una cotización dentro de 3 días hábiles.",
        linkedin: "LinkedIn: próximamente",
        rights: "Todos los derechos reservados.",
        brand: "Luque Law",
      }
    : {
        strap:
          "Colombian law for international clients. Bilingual (EN/ES) legal counsel in Medellín, Colombia.",
        contact: "Contact",
        explore: "Explore",
        next: "Next step",
        book: "Book",
        contactBtn: "Message",
        hub: "CLKR hub",
        services: "Services",
        investor: "Investor Visa (M)",
        realEstate: "Real estate transactions",
        note:
          "Initial consultations are 1 hour. You’ll receive a written legal concept and a quotation within 3 business days.",
        linkedin: "LinkedIn: coming soon",
        rights: "All rights reserved.",
        brand: "Luque Law",
      };

  const labelClass =
    "text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--caramel)]";

  return (
    <footer className="mt-24 bg-[color:var(--ink)] text-[color:var(--cream)]">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="font-display text-lg leading-tight text-[color:var(--cream)]">
            {copy.brand}
          </div>
          <p className="text-sm leading-6 text-[color:var(--footer-fg)]">{copy.strap}</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className={labelClass}>{copy.contact}</div>
          <div className="space-y-2 text-[color:var(--footer-fg)]">
            <a
              className="block font-medium text-[color:var(--cream)]/85 hover:underline"
              href="mailto:daniel@luquelaw.co"
            >
              daniel@luquelaw.co
            </a>
            <a
              className="block font-medium text-[color:var(--cream)]/85 hover:underline"
              href="https://wa.me/573006791123"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp: +57 300 679 1123
            </a>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className={labelClass}>{copy.explore}</div>
          <div className="space-y-2 text-[color:var(--footer-fg)]">
            <Link
              className="block font-medium text-[color:var(--cream)]/85 hover:underline"
              href={`${prefix}/services`}
            >
              {copy.services}
            </Link>
            <Link
              className="block font-medium text-[color:var(--cream)]/85 hover:underline"
              href={`${prefix}/clkr`}
            >
              {copy.hub}
            </Link>
            <Link
              className="block font-medium text-[color:var(--cream)]/85 hover:underline"
              href={`${prefix}/clkr/investor-visa`}
            >
              {copy.investor}
            </Link>
            <Link
              className="block font-medium text-[color:var(--cream)]/85 hover:underline"
              href={`${prefix}/clkr/real-estate-transactions`}
            >
              {copy.realEstate}
            </Link>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className={labelClass}>{copy.next}</div>
          <p className="text-[color:var(--footer-fg)]">{copy.note}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`${prefix}/contact#consultation`} className="btn-primary btn-primary-sm">
              {copy.book}
            </Link>
            <Link href={`${prefix}/contact#contact`} className="btn-secondary btn-secondary-sm">
              {copy.contactBtn}
            </Link>
          </div>
          <div className="text-xs text-[color:var(--footer-fg)]">{copy.linkedin}</div>
        </div>
      </Container>

      <div className="border-t border-[color:var(--caramel)]/35">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[min(100%,52rem)] text-[9px] font-bold uppercase leading-relaxed tracking-[0.12em] text-[color:var(--footer-fg)]">
            © {new Date().getFullYear()} Luque Law · Abogado · Medellín ·{" "}
            {copy.rights}
          </p>
          <div className="flex shrink-0 items-center gap-3 sm:justify-end">
            <DlrMonogram size={40} />
          </div>
        </Container>
      </div>
    </footer>
  );
}
