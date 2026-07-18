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

/* ── Brand palette (light-mode color scheme) ───────────────────── */

export const PALETTE_STORAGE_KEY = "palette";

export type Palette = "forest" | "navy" | "burgundy" | "slate" | "terracotta";

export const PALETTES: Palette[] = [
  "forest",
  "navy",
  "burgundy",
  "slate",
  "terracotta",
];

export const DEFAULT_PALETTE: Palette = "forest";

const PALETTE_CLASS_PREFIX = "palette-";

function isPalette(value: string | null): value is Palette {
  return value !== null && (PALETTES as string[]).includes(value);
}

export function getStoredPalette(): Palette | null {
  try {
    return isPalette(window.localStorage.getItem(PALETTE_STORAGE_KEY))
      ? (window.localStorage.getItem(PALETTE_STORAGE_KEY) as Palette)
      : null;
  } catch {
    return null;
  }
}

export function applyPalette(palette: Palette) {
  const root = document.documentElement;
  for (const p of PALETTES) {
    root.classList.remove(`${PALETTE_CLASS_PREFIX}${p}`);
  }
  if (palette !== DEFAULT_PALETTE) {
    root.classList.add(`${PALETTE_CLASS_PREFIX}${palette}`);
  }
}

export const paletteInitScript = `(function(){try{var k=${JSON.stringify(PALETTE_STORAGE_KEY)};var p=localStorage.getItem(k);var valid=${JSON.stringify(PALETTES)};if(p&&p!==${JSON.stringify(DEFAULT_PALETTE)}&&valid.indexOf(p)!==-1){document.documentElement.classList.add("${PALETTE_CLASS_PREFIX}"+p);}}catch(e){}})();`;
