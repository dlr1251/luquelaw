"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import type { ClkrArticleStatus, ClkrCategory } from "@/lib/clkr/types";
import { clkrPublicPath } from "@/lib/clkr/types";
import { cn } from "@/lib/utils";

export type AdminClkrLocaleView = {
  id: string;
  title: string;
  excerpt: string;
  status: ClkrArticleStatus;
  slug_key: string;
};

export type AdminClkrPairView = {
  key: string;
  category: ClkrCategory;
  addEnHref: string;
  addEsHref: string;
  en: AdminClkrLocaleView | null;
  es: AdminClkrLocaleView | null;
};

function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "published") return "default";
  if (status === "draft") return "secondary";
  return "outline";
}

export function AdminClkrArticleList({ pairs }: { pairs: AdminClkrPairView[] }) {
  return (
    <ul className="divide-y divide-border">
      {pairs.map((pair) => (
        <li key={pair.key} className="py-5 first:pt-0 last:pb-0">
          <AdminClkrArticleRow pair={pair} />
        </li>
      ))}
    </ul>
  );
}

function AdminClkrArticleRow({ pair }: { pair: AdminClkrPairView }) {
  const [locale, setLocale] = useState<"en" | "es">(pair.en ? "en" : "es");
  const article = locale === "es" ? pair.es : pair.en;

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {pair.category}
      </p>
      <div className="rounded-md border border-border p-3">
        <div className="flex items-start justify-between gap-2">
          <LocaleSwitch
            value={locale}
            onChange={setLocale}
            missingEn={!pair.en}
            missingEs={!pair.es}
          />
          {article ? (
            <Badge variant={statusVariant(article.status)}>{article.status}</Badge>
          ) : null}
        </div>

        {article ? (
          <>
            <p className="mt-2 text-sm font-medium leading-snug">{article.title}</p>
            {article.excerpt ? (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <ButtonLink href={`/admin/clkr/${article.id}/edit`} size="sm" variant="ghost">
                Edit
              </ButtonLink>
              {article.status === "published" ? (
                <ButtonLink
                  href={clkrPublicPath(article.slug_key, locale)}
                  size="sm"
                  variant="outline"
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </ButtonLink>
              ) : null}
            </div>
          </>
        ) : (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              {locale === "es" ? "Sin versión en español" : "No English version yet"}
            </p>
            <div className="mt-3">
              <ButtonLink
                href={locale === "es" ? pair.addEsHref : pair.addEnHref}
                size="sm"
                variant="outline"
              >
                {locale === "es" ? "Add Spanish" : "Add English"}
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LocaleSwitch({
  value,
  onChange,
  missingEn,
  missingEs,
}: {
  value: "en" | "es";
  onChange: (locale: "en" | "es") => void;
  missingEn: boolean;
  missingEs: boolean;
}) {
  return (
    <div
      className="inline-flex rounded-md border border-input p-0.5"
      role="tablist"
      aria-label="Article language"
    >
      {(["en", "es"] as const).map((loc) => {
        const missing = loc === "en" ? missingEn : missingEs;
        const selected = value === loc;
        return (
          <button
            key={loc}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(loc)}
            className={cn(
              "rounded px-2 py-0.5 text-xs font-semibold tracking-wide transition",
              selected
                ? "bg-primary text-primary-foreground"
                : missing
                  ? "text-muted-foreground/50 hover:text-foreground"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
