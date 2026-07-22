export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

export function resolveTheme(stored: Theme | null, system: Theme): Theme {
  return stored ?? system;
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

/* ── Brand palette (locked to slate) ───────────────────────────── */

export const PALETTE_STORAGE_KEY = "palette";

export type Palette = "slate";

export const PALETTES: Palette[] = ["slate"];

export const DEFAULT_PALETTE: Palette = "slate";

const PALETTE_CLASS_PREFIX = "palette-";
const LEGACY_PALETTES = ["forest", "navy", "burgundy", "terracotta"] as const;

/** Strip legacy palette-* classes; site brand is slate defaults on :root. */
export function applyPalette(_palette: Palette = DEFAULT_PALETTE) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const p of LEGACY_PALETTES) {
    root.classList.remove(`${PALETTE_CLASS_PREFIX}${p}`);
  }
  root.classList.remove(`${PALETTE_CLASS_PREFIX}slate`);
}

/** Clear stored palette preference and legacy classes before paint. */
export const paletteInitScript = `(function(){try{var k=${JSON.stringify(PALETTE_STORAGE_KEY)};localStorage.removeItem(k);var root=document.documentElement;[${LEGACY_PALETTES.map((p) => JSON.stringify(p)).join(",")}, "slate"].forEach(function(p){root.classList.remove(${JSON.stringify(PALETTE_CLASS_PREFIX)}+p);});}catch(e){}})();`;
