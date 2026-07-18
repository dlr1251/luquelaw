"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";
import {
  DEFAULT_PALETTE,
  PALETTE_STORAGE_KEY,
  PALETTES,
  applyPalette,
  getStoredPalette,
  type Palette,
} from "@/lib/theme/preferences";

type Props = {
  variant?: "surface" | "forest";
};

const PALETTE_CHANGE_EVENT = "luquelaw-palette-change";

const PALETTE_META: Record<Palette, { label: string; primary: string; accent: string }> = {
  forest: { label: "Forest", primary: "#152919", accent: "#2a5c32" },
  navy: { label: "Navy & Brass", primary: "#14233b", accent: "#9a7b3f" },
  burgundy: { label: "Burgundy", primary: "#3a1620", accent: "#9c5563" },
  slate: { label: "Slate", primary: "#1c1f24", accent: "#45617d" },
  terracotta: { label: "Terracotta", primary: "#2a1f18", accent: "#b0613f" },
};

function subscribeToPalette(onStoreChange: () => void) {
  const onChange = () => onStoreChange();
  window.addEventListener(PALETTE_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PALETTE_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getClientPalette(): Palette {
  return getStoredPalette() ?? DEFAULT_PALETTE;
}

function getServerPalette(): Palette {
  return DEFAULT_PALETTE;
}

export function PaletteSwitcher({ variant = "surface" }: Props) {
  const palette = useSyncExternalStore(
    subscribeToPalette,
    getClientPalette,
    getServerPalette,
  );
  const forest = variant === "forest";
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyPalette(palette);
  }, [palette]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selectPalette = (next: Palette) => {
    applyPalette(next);
    try {
      window.localStorage.setItem(PALETTE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(PALETTE_CHANGE_EVENT));
    setOpen(false);
  };

  const active = PALETTE_META[palette];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center transition",
          forest
            ? "border-transparent bg-transparent text-[color:var(--header-fg)]/70 hover:text-[color:var(--header-fg)]"
            : "rounded-lg border border-border bg-card text-foreground hover:bg-muted",
        )}
        aria-label="Change color palette"
        title="Change color palette"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
      >
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full ring-1 ring-current/30"
          style={{
            background: `conic-gradient(from 220deg, ${active.primary} 0deg 180deg, ${active.accent} 180deg 360deg)`,
          }}
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Color palette"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card p-1 shadow-lg"
        >
          {PALETTES.map((p) => {
            const meta = PALETTE_META[p];
            const selected = p === palette;
            return (
              <button
                key={p}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => selectPalette(p)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-card-foreground transition hover:bg-muted",
                  selected && "bg-muted font-medium",
                )}
              >
                <span
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                  style={{
                    background: `conic-gradient(from 220deg, ${meta.primary} 0deg 180deg, ${meta.accent} 180deg 360deg)`,
                  }}
                />
                <span className="flex-1">{meta.label}</span>
                {selected ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
