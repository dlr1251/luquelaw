"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { LOCALE_COOKIE, type SiteLocale } from "@/lib/locale/constants";
import { localeFromPathname, toEnglishPath, toSpanishPath } from "@/lib/locale/paths";

type Props = {
  variant?: "surface" | "forest";
};

function persistLocale(locale: SiteLocale) {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? ";secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax${secure}`;
}

/**
 * Full-document navigation is intentional: App Router soft navigation can race
 * the locale cookie against middleware redirects (cookie still "es" → bounce
 * back to /es). Hard assign after writing the cookie avoids that.
 */
export function LanguageSwitch({ variant = "surface" }: Props) {
  const pathname = usePathname();
  const isSpanish = localeFromPathname(pathname) === "es";
  const nextLocale: SiteLocale = isSpanish ? "en" : "es";
  const href = isSpanish ? toEnglishPath(pathname) : toSpanishPath(pathname);
  const forest = variant === "forest";

  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        persistLocale(nextLocale);
        window.location.assign(href);
      }}
      className={cn(
        "inline-flex h-10 items-center justify-center border px-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        forest
          ? "border-transparent bg-transparent text-[color:var(--header-fg)]/70 hover:text-[color:var(--header-fg)] focus-visible:outline-[color:var(--header-fg)]/40"
          : "rounded-lg border-border bg-card text-foreground hover:bg-muted focus-visible:outline-ring",
      )}
      aria-label={isSpanish ? "Switch language to English" : "Cambiar idioma a español"}
      title={isSpanish ? "English" : "Español"}
    >
      {isSpanish ? "EN" : "ES"}
    </a>
  );
}
