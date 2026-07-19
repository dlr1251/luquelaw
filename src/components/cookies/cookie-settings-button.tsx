"use client";

import { usePathname } from "next/navigation";

import { useCookieConsent } from "@/components/cookies/cookie-consent-provider";
import { localeFromPathname } from "@/lib/locale/paths";

export function CookieSettingsButton({ className }: { className?: string }) {
  const pathname = usePathname();
  const isSpanish = localeFromPathname(pathname) === "es";
  const { openSettings } = useCookieConsent();

  return (
    <button type="button" onClick={openSettings} className={className}>
      {isSpanish ? "Cookies" : "Cookies"}
    </button>
  );
}
