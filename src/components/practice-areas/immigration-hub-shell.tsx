"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/container";
import { cn } from "@/lib/cn";
import type { ImmigrationLocale } from "@/lib/practice-areas/immigration";
import {
  immigrationPath,
  immigrationSectionFromPath,
  type ImmigrationHubSection,
} from "@/lib/practice-areas/paths";

type Props = {
  locale: ImmigrationLocale;
  children: React.ReactNode;
  /** Hide the sticky subnav (rarely needed). */
  hideNav?: boolean;
};

const NAV: {
  id: ImmigrationHubSection;
  hrefSuffix: string;
  en: string;
  es: string;
}[] = [
  { id: "overview", hrefSuffix: "", en: "Overview", es: "Inicio" },
  { id: "visas", hrefSuffix: "/visas", en: "Visas", es: "Visas" },
  {
    id: "nationality",
    hrefSuffix: "/nationality",
    en: "Nationality",
    es: "Nacionalidad",
  },
  {
    id: "extranjeria",
    hrefSuffix: "/extranjeria",
    en: "Extranjería",
    es: "Extranjería",
  },
  {
    id: "calculator",
    hrefSuffix: "/calculator",
    en: "Calculator",
    es: "Calculadora",
  },
];

export function ImmigrationHubShell({ locale, children, hideNav }: Props) {
  const pathname = usePathname();
  const active = immigrationSectionFromPath(pathname);
  const hubHome = immigrationPath("", locale);
  const label = locale === "es" ? "Derecho migratorio" : "Immigration";

  return (
    <div className="flex-1">
      {!hideNav ? (
        <div className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
          <Container className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0 sm:h-12">
            <Link
              href={hubHome}
              className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground transition hover:text-foreground"
            >
              {label}
            </Link>
            <nav
              className="-mx-1 flex gap-0.5 overflow-x-auto px-1 pb-0.5 sm:pb-0"
              aria-label={locale === "es" ? "Secciones migratorias" : "Immigration sections"}
            >
              {NAV.map((item) => {
                const href = immigrationPath(item.hrefSuffix, locale);
                const isActive = active === item.id;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "shrink-0 px-2.5 py-2 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] transition",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {locale === "es" ? item.es : item.en}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      ) : null}
      {children}
    </div>
  );
}
