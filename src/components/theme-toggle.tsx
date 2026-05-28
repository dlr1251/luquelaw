"use client";

import { useEffect, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  resolveTheme,
  type Theme,
} from "@/lib/theme/preferences";

type Props = {
  variant?: "surface" | "forest";
};

const THEME_CHANGE_EVENT = "luquelaw-theme-change";

function subscribeToTheme(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => onStoreChange();

  media.addEventListener("change", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getClientTheme(): Theme {
  const stored = getStoredTheme();
  return resolveTheme(stored, getSystemTheme());
}

function getServerTheme(): Theme {
  return "light";
}

export function ThemeToggle({ variant = "surface" }: Props) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getClientTheme,
    getServerTheme,
  );
  const forest = variant === "forest";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          window.localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
          // ignore
        }
        window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
      }}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center transition",
        forest
          ? "border-transparent bg-transparent text-[color:var(--header-fg)]/70 hover:text-[color:var(--header-fg)]"
          : "rounded-lg border border-border bg-card text-foreground hover:bg-muted",
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
