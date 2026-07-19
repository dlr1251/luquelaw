"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { sectionToMarkdown } from "@/lib/norms/html-to-markdown";

type Props = {
  locale: "en" | "es";
  title: string;
  numberLabel: string | null;
  html: string | null;
  variant?: "icon" | "bar";
  className?: string;
  disabled?: boolean;
};

export function NormCopyMarkdownButton({
  locale,
  title,
  numberLabel,
  html,
  variant = "icon",
  className,
  disabled = false,
}: Props) {
  const [copied, setCopied] = useState(false);

  const labels =
    locale === "es"
      ? { copy: "Copiar MD", copied: "Copiado", aria: "Copiar sección como Markdown" }
      : { copy: "Copy MD", copied: "Copied", aria: "Copy section as Markdown" };

  async function handleCopy() {
    if (disabled) return;
    const markdown = sectionToMarkdown({ numberLabel, title, html });
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can fail without permission; keep UI quiet.
    }
  }

  if (variant === "bar") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        aria-label={labels.aria}
        title={labels.aria}
        className={cn(
          "inline-flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 text-[color:var(--forest)] transition enabled:active:scale-[0.98] disabled:opacity-40",
          className,
        )}
      >
        {copied ? (
          <Check className="size-4" strokeWidth={1.75} aria-hidden />
        ) : (
          <Copy className="size-4" strokeWidth={1.75} aria-hidden />
        )}
        <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.08em]">
          {copied ? labels.copied : labels.copy}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      aria-label={labels.aria}
      title={labels.aria}
      className={cn(
        "inline-flex items-center gap-1.5 border border-[color:var(--moss)]/30 bg-[color:var(--surface)] px-2.5 py-1.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[color:var(--forest)] transition hover:border-[color:var(--moss)]/50 hover:bg-[color:var(--surface-strong)] disabled:opacity-40",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3.5" strokeWidth={1.75} aria-hidden />
      ) : (
        <Copy className="size-3.5" strokeWidth={1.75} aria-hidden />
      )}
      {copied ? labels.copied : labels.copy}
    </button>
  );
}
