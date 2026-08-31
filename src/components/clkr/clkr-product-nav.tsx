"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bot, Library, Scale, Sparkles } from "lucide-react";

import { Container } from "@/components/container";
import { loginHref } from "@/lib/auth/safe-next";
import { cn } from "@/lib/utils";

type Locale = "en" | "es";

const links = (prefix: string, signedIn: boolean) =>
  [
    {
      href: `${prefix}/clkr`,
      match: (p: string) => p === `${prefix}/clkr` || p === "/clkr",
      label: { en: "Home", es: "Inicio" },
      icon: Sparkles,
      exactHub: true,
    },
    {
      href: `${prefix}/clkr/guides`,
      match: (p: string) => p.includes("/clkr/guides"),
      label: { en: "CLKR", es: "CLKR" },
      icon: BookOpen,
    },
    {
      href: `${prefix}/clkr/norms`,
      match: (p: string) => p.includes("/clkr/norms"),
      label: { en: "Norms catalog", es: "Normograma" },
      icon: Scale,
    },
    {
      href: `${prefix}/clkr/library`,
      match: (p: string) => p.includes("/clkr/library"),
      label: { en: "Skills & prompts", es: "Skills y prompts" },
      icon: Library,
    },
    {
      href: `${prefix}/clkr/agents`,
      match: (p: string) => p.includes("/clkr/agents"),
      label: { en: "Agents", es: "Agentes" },
      icon: Bot,
      badge: { en: "Pro", es: "Pro" },
    },
    {
      href: signedIn ? "/portal/lucy" : loginHref("/portal/lucy", prefix === "/es" ? "es" : "en"),
      match: () => false,
      label: { en: "Lucy AI", es: "Lucy AI" },
      icon: Sparkles,
      accent: true,
    },
  ] as const;

export function ClkrProductNav({
  locale = "en",
  signedIn = false,
}: {
  locale?: Locale;
  signedIn?: boolean;
}) {
  const pathname = usePathname() || "";
  const prefix = locale === "es" ? "/es" : "";
  const items = links(prefix, signedIn);

  return (
    <div className="sticky top-16 z-40 border-b border-[color:var(--moss)]/20 bg-[color:var(--background)]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[color:var(--background)]/75">
      <Container className="flex items-center gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href={`${prefix}/clkr`}
          className="mr-2 shrink-0 font-[family-name:var(--font-ui)] text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--forest)]"
        >
          LegalAI
        </Link>
        <div className="mx-1 hidden h-4 w-px shrink-0 bg-[color:var(--moss)]/25 sm:block" />
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          const accent = "accent" in item && item.accent;
          const badge = "badge" in item ? item.badge[locale] : null;
          return (
            <Link
              key={item.href + item.label.en}
              href={item.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.08em] transition",
                active
                  ? "bg-[color:var(--forest)] text-[color:var(--parchment)]"
                  : accent
                    ? "text-[color:var(--moss)] hover:bg-[color:var(--moss)]/10"
                    : "text-muted-foreground hover:bg-[color:var(--surface)] hover:text-[color:var(--forest)]",
              )}
            >
              <Icon className="size-3.5 opacity-80" strokeWidth={1.75} aria-hidden />
              {item.label[locale]}
              {badge ? (
                <span className="rounded bg-[color:var(--moss)]/15 px-1 py-0.5 text-[0.5625rem] tracking-wider">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </Container>
    </div>
  );
}
