"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCookieConsent } from "@/components/cookies/cookie-consent-provider";
import { localeFromPathname } from "@/lib/locale/paths";

export function CookieBanner() {
  const pathname = usePathname();
  const isSpanish = localeFromPathname(pathname) === "es";
  const { showBanner, acceptAll, essentialOnly } = useCookieConsent();

  if (!showBanner) return null;

  const privacyHref = isSpanish ? "/es/privacidad" : "/privacy";
  const copy = isSpanish
    ? {
        body: "Usamos cookies esenciales para que el sitio funcione, y opcionales de analítica para mejorar la experiencia.",
        privacy: "Política de datos",
        accept: "Aceptar",
        essential: "Solo esenciales",
      }
    : {
        body: "We use essential cookies to run the site, and optional analytics cookies to improve the experience.",
        privacy: "Privacy policy",
        accept: "Accept",
        essential: "Essential only",
      };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isSpanish ? "Preferencias de cookies" : "Cookie preferences"}
      className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-3 border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
          {copy.body}{" "}
          <Link
            href={privacyHref}
            className="font-medium text-foreground underline underline-offset-2 hover:text-[color:var(--moss)]"
          >
            {copy.privacy}
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={essentialOnly}
            className="inline-flex h-9 items-center justify-center px-3 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--forest)]/40"
          >
            {copy.essential}
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="btn-primary btn-primary-sm"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
