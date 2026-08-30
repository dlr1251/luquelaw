"use client";

import { useState } from "react";

import { Container } from "@/components/container";
import {
  medellinExpatsContent,
  type CampaignLocale,
} from "@/lib/campaigns/medellin-expats";

export function MedellinExpatsSocial({ locale }: { locale: CampaignLocale }) {
  const c = medellinExpatsContent(locale);
  const [copied, setCopied] = useState<number | null>(null);
  const copyLabel = locale === "es" ? "Copiar" : "Copy";
  const copiedLabel = locale === "es" ? "Copiado" : "Copied";
  const title =
    locale === "es" ? "Posts para Facebook y Threads" : "Posts for Facebook and Threads";
  const intro =
    locale === "es"
      ? "Cuatro piezas. Una por semana. Misma CTA: luquelaw.co/es/medellin."
      : "Four pieces. One a week. Same CTA: luquelaw.co/medellin.";

  async function copy(i: number, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(i);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <main>
      <Container className="marketing-section">
        <p className="marketing-eyebrow">{c.eyebrow}</p>
        <h1 className="marketing-display mt-3 max-w-3xl text-[color:var(--forest)]">{title}</h1>
        <p className="marketing-body mt-4 max-w-2xl">{intro}</p>
        <ol className="mt-10 grid gap-6">
          {c.social.map((post, i) => (
            <li key={post.title} className="border border-border bg-card p-6">
              <h2 className="font-display text-xl text-[color:var(--forest)]">{post.title}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[color:var(--ink)]">
                {post.body}
              </p>
              <button
                type="button"
                className="btn-secondary btn-secondary-sm mt-4"
                onClick={() => copy(i, post.body)}
              >
                {copied === i ? copiedLabel : copyLabel}
              </button>
            </li>
          ))}
        </ol>
      </Container>
    </main>
  );
}
