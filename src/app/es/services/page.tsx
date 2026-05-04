import Link from "next/link";

import { Container } from "@/components/container";

export default function ServicesEsPage() {
  return (
    <main className="flex-1">
      <section className="border-b-2 border-[color:var(--moss)] bg-[color:var(--hero)] text-[color:var(--hero-foreground)]">
        <Container className="py-14 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
            Servicios
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--parchment)] sm:text-[2.6rem]">
            Asesoría para clientes internacionales en Colombia.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[color:var(--hero-muted)] sm:text-lg">
            Cobertura enfocada en lo más frecuente para expatriados e inversionistas. Para un plan
            acotado después de la primera llamada, ve{" "}
            <Link className="font-bold text-[color:var(--parchment)] underline" href="/es/contact#consultation">
              consultas y contacto
            </Link>
            .
          </p>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Asesoría jurídica",
              body: "Conceptos jurídicos escritos, opiniones y estrategia en derecho colombiano.",
            },
            {
              title: "Inmigración",
              body: "Visas de inversionista, nómada digital, pensionado, residencia y naturalización.",
            },
            {
              title: "Inmobiliario",
              body: "Compraventa para extranjeros, debida diligencia, notaría, registro y cumplimiento.",
            },
            {
              title: "Comercial y societario",
              body: "Constitución de empresas, contratos, controversias y cumplimiento.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6"
            >
              <div className="font-display text-lg font-normal tracking-tight text-[color:var(--forest)]">
                {c.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 border border-[color:var(--moss)]/35 bg-[color:var(--surface)] p-6 text-center">
          <p className="text-sm text-[color:var(--muted)]">
            ¿Siguiente paso?{" "}
            <Link href="/es/contact#contact" className="font-bold text-[color:var(--moss)] hover:underline">
              Enviar consulta
            </Link>{" "}
            o{" "}
            <Link
              href="/es/contact#consultation"
              className="font-bold text-[color:var(--moss)] hover:underline"
            >
              ver detalle de consultas
            </Link>
            .
          </p>
        </div>
      </Container>
    </main>
  );
}
