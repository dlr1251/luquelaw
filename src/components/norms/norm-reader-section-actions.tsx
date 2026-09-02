"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

import { NormCopyMarkdownButton } from "@/components/norms/norm-copy-markdown-button";
import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "es";
  shareUrl: string;
  title: string;
  numberLabel: string | null;
  html: string | null;
};

export function NormReaderSectionActions({
  locale,
  shareUrl,
  title,
  numberLabel,
  html,
}: Props) {
  const [copied, setCopied] = useState(false);
  const labels =
    locale === "es"
      ? { copy: "Copiar enlace", copied: "Copiado", aria: "Copiar enlace de esta sección" }
      : { copy: "Copy link", copied: "Copied", aria: "Copy a link to this section" };

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can fail without permission; keep UI quiet.
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label={labels.aria}
        title={labels.aria}
        className={cn(
          "inline-flex items-center gap-1 px-1.5 py-1 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[color:var(--moss)] transition hover:text-[color:var(--forest)]",
        )}
      >
        {copied ? (
          <Check className="size-3.5" strokeWidth={1.75} aria-hidden />
        ) : (
          <Link2 className="size-3.5" strokeWidth={1.75} aria-hidden />
        )}
        <span className="hidden sm:inline">{copied ? labels.copied : labels.copy}</span>
      </button>
      <NormCopyMarkdownButton
        locale={locale}
        title={title}
        numberLabel={numberLabel}
        html={html}
        variant="icon"
        className="border-0 bg-transparent px-1.5 py-1 text-[color:var(--moss)] hover:bg-transparent hover:text-[color:var(--forest)]"
        disabled={!html?.trim()}
      />
    </div>
  );
}
