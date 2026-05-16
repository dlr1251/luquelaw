import Link from "next/link";

import type { HomeContent } from "@/lib/home/content";

type Props = {
  preview: HomeContent["clkrPreview"];
};

export function ClkrPreview({ preview }: Props) {
  return (
    <section className="border border-[color:var(--moss)]/25 bg-[color:var(--surface)] p-6 sm:p-8">
      <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[color:var(--moss)]">
        {preview.label}
      </p>
      <h2 className="mt-3 font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
        {preview.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">{preview.subtitle}</p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {preview.articles.map((article) => (
          <li key={article.href}>
            <Link
              href={article.href}
              className="group flex h-full flex-col border border-[color:var(--moss)]/30 bg-[color:var(--card)] p-5 transition hover:border-[color:var(--moss)]/55 hover:bg-white"
            >
              <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
                {article.category}
              </span>
              <span className="mt-2 font-display text-lg font-normal leading-snug tracking-tight text-[color:var(--forest)] group-hover:text-[color:var(--moss)]">
                {article.title}
              </span>
              <span className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{article.description}</span>
              <span className="mt-4 text-sm font-bold text-[color:var(--moss)]">{preview.readLabel}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={preview.browseHref}
        className="mt-6 inline-block text-sm font-bold text-[color:var(--forest)] hover:text-[color:var(--moss)] hover:underline"
      >
        {preview.browse}
      </Link>
    </section>
  );
}
