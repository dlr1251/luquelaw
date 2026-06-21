import Link from "next/link";

import type { HomeContent } from "@/lib/home/content";

type Props = {
  preview: HomeContent["clkrPreview"];
};

export function ClkrPreview({ preview }: Props) {
  return (
    <section className="border border-[color:var(--moss)]/20 bg-[color:var(--surface)] p-5 sm:p-7 lg:p-8">
      <p className="marketing-eyebrow">{preview.label}</p>
      <h2 className="marketing-title mt-3 text-[color:var(--forest)]">{preview.title}</h2>
      <p className="marketing-body mt-3 max-w-2xl">{preview.subtitle}</p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:gap-5">
        {preview.articles.map((article) => (
          <li key={article.href}>
            <Link
              href={article.href}
              className="group flex h-full flex-col border border-[color:var(--moss)]/25 bg-[color:var(--card)] p-5 transition hover:border-[color:var(--moss)]/45 hover:bg-white sm:p-6"
            >
              <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--moss)]">
                {article.category}
              </span>
              <span className="mt-2 font-display text-lg font-normal leading-snug tracking-tight text-[color:var(--forest)] group-hover:text-[color:var(--moss)]">
                {article.title}
              </span>
              <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.description}</span>
              <span className="mt-4 text-sm font-semibold text-[color:var(--moss)]">{preview.readLabel}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={preview.browseHref}
        className="mt-6 inline-block text-sm font-semibold text-[color:var(--forest)] hover:text-[color:var(--moss)] hover:underline"
      >
        {preview.browse}
      </Link>
    </section>
  );
}
