"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

const supportedPaths = new Set([
  "/",
  "/contact",
  "/clkr",
  "/clkr/investor-visa",
  "/clkr/real-estate-transactions",
]);

function toSpanishPath(pathname: string) {
  if (!supportedPaths.has(pathname)) return "/es";
  return pathname === "/" ? "/es" : `/es${pathname}`;
}

function toEnglishPath(pathname: string) {
  if (pathname === "/es") return "/";
  const stripped = pathname.replace(/^\/es/, "") || "/";
  return supportedPaths.has(stripped) ? stripped : "/";
}

type Props = {
  variant?: "surface" | "forest";
};

export function LanguageSwitch({ variant = "surface" }: Props) {
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");

  const href = isSpanish ? toEnglishPath(pathname) : toSpanishPath(pathname);

  const forest = variant === "forest";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 items-center justify-center border px-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        forest
          ? "border-transparent bg-transparent text-[color:var(--parchment)]/70 hover:text-[color:var(--parchment)] focus-visible:outline-[color:var(--parchment)]/40"
          : "rounded-lg border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--foreground)] hover:bg-[color:var(--surface)] focus-visible:outline-[color:var(--accent)]",
      )}
      aria-label={isSpanish ? "Switch language to English" : "Switch language to Spanish"}
      title={isSpanish ? "English" : "Español"}
    >
      {isSpanish ? "EN" : "ES"}
    </Link>
  );
}
