import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { ClkrDisclaimer } from "@/components/clkr/clkr-disclaimer";
import { Container } from "@/components/container";
import { Prose } from "@/components/prose";
import {
  authorityKindLabel,
  resolveCitationHref,
  rewriteDianHrefs,
  type LegalAuthorityRecord,
} from "@/lib/norms/citations";
import { normsHubPath } from "@/lib/norms/types";

type Props = {
  locale: "en" | "es";
  authority: LegalAuthorityRecord;
  citedFrom: Array<{ href: string; label: string }>;
};

export function AuthorityRecord({ locale, authority, citedFrom }: Props) {
  const copy =
    locale === "es"
      ? {
          back: "Normas",
          stub: "Ficha interna. El texto completo aún no está en Luque Law; la fuente oficial está al final.",
          ingested: "Texto ingerido de la Compilación Jurídica DIAN. Confirma la fuente oficial.",
          official: "Fuente oficial",
          cited: "Citado desde el Estatuto Tributario",
          status: {
            stub: "Ficha",
            ingested: "Texto",
            published: "Publicado",
          },
          disclaimer:
            "Solo referencia. No sustituye el Diario Oficial, la relatoría ni el concepto DIAN original.",
        }
      : {
          back: "Norms",
          stub: "Internal record. Full text is not in Luque Law yet; the official source is at the bottom.",
          ingested: "Text ingested from the DIAN Legal Compilation. Confirm the official source.",
          official: "Official source",
          cited: "Cited from the Tax Statute",
          status: {
            stub: "Record",
            ingested: "Text",
            published: "Published",
          },
          disclaimer:
            "Reference only. This does not replace the Official Gazette, the court report, or the original DIAN ruling.",
        };

  const title = locale === "en" && authority.title_en ? authority.title_en : authority.title;
  const body =
    locale === "en" ? authority.html_en || authority.html_es : authority.html_es;
  const rewritten = body
    ? rewriteDianHrefs(body, locale, (file, anchor) =>
        resolveCitationHref({
          locale,
          dianFile: file,
          dianAnchor: anchor,
          authority: null,
        }).href,
      )
    : null;

  return (
    <main className="flex-1 pb-16">
      <section className="border-b border-[color:var(--moss)]/20 bg-[color:var(--forest)] text-[color:var(--parchment)]">
        <Container className="py-8 sm:py-10">
          <Link
            href={normsHubPath(locale)}
            className="inline-flex items-center gap-1.5 font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-[color:var(--parchment)]/70 transition hover:text-[color:var(--parchment)]"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.75} aria-hidden />
            {copy.back}
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="border border-[color:var(--parchment)]/30 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.12em]">
              {authorityKindLabel(authority.kind, locale)}
            </span>
            <span className="font-[family-name:var(--font-ui)] text-[0.6875rem] text-[color:var(--parchment)]/55">
              {copy.status[authority.ingest_status]}
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(1.5rem,3vw,2.2rem)] font-normal leading-[1.15] tracking-tight">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[color:var(--parchment)]/70">
            {authority.citation_label}
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-12">
        <div className="max-w-3xl bg-[color:var(--card)] p-5 sm:border sm:border-[color:var(--moss)]/25 sm:p-8">
          {authority.ingest_status === "stub" || !rewritten ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{copy.stub}</p>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted-foreground">{copy.ingested}</p>
              <Prose>
                <div dangerouslySetInnerHTML={{ __html: rewritten }} />
              </Prose>
            </>
          )}

          {citedFrom.length > 0 ? (
            <nav className="mt-10 border-t border-[color:var(--moss)]/20 pt-6">
              <h2 className="font-display text-lg text-[color:var(--forest)]">{copy.cited}</h2>
              <ul className="mt-3 space-y-1.5 text-sm">
                {citedFrom.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[color:var(--forest)] underline-offset-2 hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {authority.official_source_url ? (
            <p className="mt-8 text-sm">
              <span className="font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[color:var(--moss)]">
                {copy.official}
              </span>{" "}
              <a
                href={authority.official_source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[color:var(--forest)] underline-offset-2 hover:underline"
              >
                {authority.dian_file || authority.official_source_url}
                <ExternalLink className="size-3 opacity-70" aria-hidden />
              </a>
            </p>
          ) : null}

          <ClkrDisclaimer text={copy.disclaimer} className="mt-10" />
        </div>
      </Container>
    </main>
  );
}
