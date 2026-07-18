import Link from "next/link";

import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { ClkrModuleHero } from "@/components/clkr/clkr-module-hero";
import { ClkrProductNav } from "@/components/clkr/clkr-product-nav";
import { Container } from "@/components/container";
import { loginHref } from "@/lib/auth/safe-next";
import type { ClkrHubLocale } from "@/lib/clkr/hub-content";

const copy = {
  en: {
    eyebrow: "CLKR · Agents",
    title: "Agents, skills & prompts",
    body: "A curated toolkit of LegalAI agents, skills, and prompts for day-to-day legal work. Sign in with an active Professional subscription to unlock the library.",
    ctaLogin: "Sign in",
    ctaPricing: "View plans",
    contactCta: "Need a guided consultation?",
    contactLink: "Meet Lucy",
    disclaimer:
      "Informational tools only. Not legal advice. You remain responsible for professional judgment and verification.",
  },
  es: {
    eyebrow: "CLKR · Agentes",
    title: "Agentes, skills y prompts",
    body: "Kit curado de agentes LegalAI, skills y prompts para el trabajo jurídico diario. Inicia sesión con una suscripción Profesional activa para desbloquear la biblioteca.",
    ctaLogin: "Iniciar sesión",
    ctaPricing: "Ver planes",
    contactCta: "¿Consulta guiada?",
    contactLink: "Conoce a Lucy",
    disclaimer:
      "Solo herramientas informativas. No es asesoría jurídica. Tú respondes por el criterio profesional y la verificación.",
  },
} as const;

type Props = {
  locale?: ClkrHubLocale;
  lockedReason?: "auth" | "entitlement";
};

export function ClkrModuleGate({ locale = "en", lockedReason = "auth" }: Props) {
  const t = copy[locale];
  const prefix = locale === "es" ? "/es" : "";
  const pricingHref = `${prefix}/pricing`;
  const modulePath = `${prefix}/clkr/agents`;

  return (
    <main className="flex-1">
      <ClkrProductNav locale={locale} signedIn={lockedReason !== "auth"} />
      <ClkrModuleHero
        locale={locale}
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.body}
        contactCta={t.contactCta}
        contactLink={t.contactLink}
        contactHref="/portal/lucy"
      />
      <Container className="py-10 sm:py-12">
        <div className="flex flex-wrap gap-3">
          {lockedReason === "auth" ? (
            <Link href={loginHref(modulePath)} className="btn-primary">
              {t.ctaLogin}
            </Link>
          ) : null}
          <Link href={pricingHref} className="btn-secondary">
            {t.ctaPricing}
          </Link>
        </div>
        <ClkrDisclaimer text={t.disclaimer} className="mt-10" />
      </Container>
    </main>
  );
}
