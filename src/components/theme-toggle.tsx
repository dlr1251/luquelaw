"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

type Theme = "light" | "dark";

function getStoredTheme(): Theme | null {
  try {
    const t = window.localStorage.getItem("theme");
    return t === "dark" || t === "light" ? t : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
}

type Props = {
  variant?: "surface" | "forest";
};

export function ThemeToggle({ variant = "surface" }: Props) {
  const [theme, setTheme] = useState<Theme>("light");
  const forest = variant === "forest";

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
      return;
    }
    setTheme("light");
    applyTheme("light");
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
        try {
          window.localStorage.setItem("theme", next);
        } catch {
          // ignore
        }
      }}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center transition",
        forest
          ? "border border-[color:var(--caramel)] bg-transparent text-[color:var(--cream)] hover:bg-[color:var(--cream)]/10"
          : "rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--foreground)] hover:bg-[color:var(--surface)]",
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.5" />
          <path d="M12 19v2.5" />
          <path d="M4.93 4.93l1.77 1.77" />
          <path d="M17.3 17.3l1.77 1.77" />
          <path d="M2.5 12H5" />
          <path d="M19 12h2.5" />
          <path d="M4.93 19.07 6.7 17.3" />
          <path d="M17.3 6.7l1.77-1.77" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M20.2 14.1A8.5 8.5 0 0 1 9.9 3.8a.75.75 0 0 0-.95-.95A9.75 9.75 0 1 0 21.15 15a.75.75 0 0 0-.95-.95Z" />
        </svg>
      )}
    </button>
  );
}
