"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bot, Scale, Sparkles } from "lucide-react";

import { Container } from "@/components/container";
import { loginHref } from "@/lib/auth/safe-next";
import { cn } from "@/lib/utils";

type Locale = "en" | "es";

const links = (prefix: string, signedIn: boolean) =>
  [
    {
      href: `${prefix}/clkr`,
      match: (p: string) => p === `${prefix}/clkr` || p === "/clkr",
      label: { en: "Overview", es: "Inicio" },
      icon: Sparkles,
      exactHub: true,
    },
    {
      href: `${prefix}/clkr/norms`,
      match: (p: string) => p.includes("/clkr/norms"),
      label: { en: "Norms", es: "Normas" },
      icon: Scale,
    },
    {
      href: `${prefix}/clkr/guides`,
      match: (p: string) => p.includes("/clkr/guides"),
      label: { en: "Articles", es: "Artículos" },
      icon: BookOpen,
    },
    {
      href: `${prefix}/clkr/agents`,
      match: (p: string) => p.includes("/clkr/agents"),
      label: { en: "Agents", es: "Agentes" },
      icon: Bot,
    },
    {
      href: signedIn ? "/portal/lucy" : loginHref("/portal/lucy"),
      match: () => false,
      label: { en: "Torny", es: "Torny" },
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
          CLKR
        </Link>
        <div className="mx-1 hidden h-4 w-px shrink-0 bg-[color:var(--moss)]/25 sm:block" />
        {items.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          const accent = "accent" in item && item.accent;
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
            </Link>
          );
        })}
      </Container>
    </div>
  );
}
