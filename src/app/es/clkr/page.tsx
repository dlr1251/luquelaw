import Link from "next/link";

import { ClkrBrowser } from "@/app/clkr/ClkrBrowser";
import { Container } from "@/components/container";
import { getHubArticles } from "@/lib/clkr/get-hub-articles";

export default async function ClkrHubEsPage() {
  const articles = await getHubArticles("es");
  return (
    <main className="flex-1">
      <section className="border-b-2 border-[color:var(--caramel)] bg-[color:var(--hero)] text-[color:var(--hero-foreground)]">
        <Container className="py-14 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--caramel)]">
            CLKR
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--cream)] sm:text-[2.6rem]">
            Repositorio Colombiano de Conocimiento Jurídico
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[color:var(--hero-muted)] sm:text-lg">
            Derecho colombiano explicado con claridad, en inglés y español, para
            expatriados e inversionistas extranjeros que operan en Colombia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/es/contact#consultation" className="btn-primary btn-primary-lg">
              Agendar consulta
            </Link>
            <Link
              href="/es/contact"
              className="btn-secondary btn-secondary-lg border-[color:var(--caramel)] text-[color:var(--caramel)] hover:bg-[color:var(--cream)]/10"
            >
              Contacto
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
              Explorar artículos
            </h2>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Comienza con inmigración y bienes raíces. Se sumarán más módulos con el tiempo.
            </p>
          </div>
        </div>

        <ClkrBrowser articles={articles} locale="es" />
      </Container>
    </main>
  );
}

