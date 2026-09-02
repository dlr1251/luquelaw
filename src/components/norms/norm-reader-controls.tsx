"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { normReaderContent } from "@/lib/norms/reader-content";

export type ReaderTypeSize = "s" | "m" | "l";

const STORAGE_KEY = "ll-norm-reader-size";

const SIZE_CLASS: Record<ReaderTypeSize, string> = {
  s: "text-[15px] leading-7 sm:text-[16px] sm:leading-7",
  m: "text-[17px] leading-8 sm:text-[18px] sm:leading-[1.75]",
  l: "text-[19px] leading-8 sm:text-[20px] sm:leading-9",
};

type Props = {
  locale: "en" | "es";
  children: ReactNode;
};

function isTypeSize(value: string | null): value is ReaderTypeSize {
  return value === "s" || value === "m" || value === "l";
}

export function NormReaderControls({ locale, children }: Props) {
  const copy = normReaderContent[locale];
  const [size, setSize] = useState<ReaderTypeSize>("m");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isTypeSize(stored)) setSize(stored);
  }, []);

  function setTypeSize(next: ReaderTypeSize) {
    setSize(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  const sizes: ReaderTypeSize[] = ["s", "m", "l"];
  const sizeLabel: Record<ReaderTypeSize, string> = {
    s: copy.sizeS,
    m: copy.sizeM,
    l: copy.sizeL,
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--moss)]/20 pb-4">
        <div
          className="inline-flex items-center border border-[color:var(--moss)]/30 bg-[color:var(--surface)]"
          role="group"
          aria-label={copy.typeSize}
        >
          {sizes.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTypeSize(value)}
              aria-pressed={size === value}
              className={cn(
                "px-2.5 py-1.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.08em] transition",
                size === value
                  ? "bg-[color:var(--forest)] text-[color:var(--parchment)]"
                  : "text-[color:var(--forest)] hover:bg-[color:var(--surface-strong)]",
              )}
            >
              {sizeLabel[value]}
            </button>
          ))}
        </div>
      </div>
      <div className={SIZE_CLASS[size]}>{children}</div>
    </div>
  );
}
