"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  title: string;
  description: string;
  body: string;
  locale: "en" | "es";
  articleHref?: string | null;
  articleLabel?: string;
  backHref: string;
  backLabel: string;
  kind: "prompt" | "skill";
};

export function LibraryDetailView({
  title,
  description,
  body,
  locale,
  articleHref,
  articleLabel,
  backHref,
  backLabel,
  kind,
}: Props) {
  const [copied, setCopied] = useState(false);
  const copyLabel = locale === "es" ? "Copiar" : "Copy";
  const copiedLabel = locale === "es" ? "Copiado" : "Copied";

  async function copy() {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link href={backHref} className="text-sm font-semibold text-[color:var(--forest)] hover:underline">
        ← {backLabel}
      </Link>
      <div>
        <p className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.14em] text-[color:var(--moss)]">
          {kind === "prompt" ? "Prompt" : "Skill"}
        </p>
        <h1 className="mt-2 font-display text-3xl text-[color:var(--forest)]">{title}</h1>
        <p className="mt-3 text-base text-muted-foreground">{description}</p>
      </div>
      {articleHref && articleLabel ? (
        <Link href={articleHref} className="inline-flex text-sm font-semibold text-[color:var(--forest)] hover:underline">
          {articleLabel} →
        </Link>
      ) : null}
      <pre className="overflow-x-auto whitespace-pre-wrap border border-[color:var(--moss)]/25 bg-[color:var(--surface)] p-5 text-sm leading-relaxed">
        {body}
      </pre>
      <button type="button" onClick={copy} className="btn-primary">
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
