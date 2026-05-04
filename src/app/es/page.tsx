"use client";

import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/container";
import { useBookingModal } from "@/components/booking/BookingProvider";
import { EngagementModel } from "@/components/engagement/EngagementModel";

export default function HomeEs() {
  const booking = useBookingModal();

  return (
    <main className="flex-1">
      <section className="bg-[color:var(--forest)] text-[color:var(--parchment)]">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="space-y-6 lg:col-span-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
                Asesoría legal bilingüe en Colombia
              </p>
              <h1 className="max-w-3xl font-display text-[2.25rem] font-normal leading-[1.08] tracking-tight text-[color:var(--parchment)] sm:text-[2.6rem]">
                Daniel Luque Restrepo
              </h1>
              <p className="max-w-2xl text-base font-medium leading-7 text-[color:var(--hero-muted)] sm:text-lg">
                Abogado egresado de la UPB y especialista en Gestión Tributaria Internacional. Daniel ha asesorado y
                representado a cientos de clientes extranjeros en transacciones inmobiliarias, planeación patrimonial,
                asuntos migratorios, negocios, entre otros. A través de su red de aliados, busca brindar asesoría legal
                de alto valor, clara y fácil de entender.
              </p>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="order-1 w-full max-w-[240px] sm:order-2 sm:w-[240px]">
                  <div className="mx-auto flex w-full flex-col items-center gap-3 sm:mx-0 sm:items-end">
                    <div className="relative h-[210px] w-[210px] overflow-hidden rounded-full border border-[color:var(--moss)]/35 bg-[color:var(--parchment)]/5 sm:h-[220px] sm:w-[220px]">
                      <Image
                        src="/images/profile.png"
                        alt="Daniel Luque Restrepo"
                        fill
                        sizes="220px"
                        className="object-contain grayscale"
                        priority
                      />
                    </div>
                    <div className="w-full text-center text-sm leading-6 text-[color:var(--header-fg-muted)] sm:text-right">
                      <a className="font-bold text-[color:var(--parchment)] hover:underline" href="mailto:daniel@luquelaw.co">
                        daniel@luquelaw.co
                      </a>
                      <div className="mt-1">
                        <a
                          className="font-bold text-[color:var(--parchment)] hover:underline"
                          href="https://wa.me/573006791123?text=Hola%20Daniel%2C%20acabo%20de%20visitar%20tu%20sitio%20web%20y%20quiero%20preguntarte%20algo..."
                          target="_blank"
                          rel="noreferrer"
                        >
                          WhatsApp: +57 300 6791123
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-2 flex flex-wrap gap-3 sm:order-1">
                <button type="button" onClick={booking.open} className="btn-primary btn-primary-lg">
                  Agendar consulta
                </button>
                <Link
                  href="/es/clkr"
                  className="btn-secondary border-[color:var(--moss)] bg-transparent text-[color:var(--moss)] hover:bg-[color:var(--parchment)]/10 btn-secondary-lg"
                >
                  Explorar temas legales
                </Link>
                </div>
              </div>
            </div>

            <EngagementModel
              className="lg:col-span-4"
              label="Modelo de trabajo"
              steps={[
                {
                  icon: "chat",
                  title: "Consulta inicial",
                  body: "1 hora para ordenar hechos, identificar riesgos y definir la pregunta jurídica.",
                },
                {
                  icon: "doc",
                  title: "Concepto + cotización",
                  body: "Recibes un concepto jurídico escrito y una cotización formal dentro de 3 días hábiles.",
                },
                {
                  icon: "plan",
                  title: "Ejecución (o retainer)",
                  body: "Avanzamos con un plan acotado, o pasamos a retainer por hora para asuntos continuos.",
                },
              ]}
              footer="Entrega dentro de 3 días hábiles después de la consulta."
            />
          </div>
        </Container>
      </section>

      <section className="bg-[color:var(--background)]">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
                Asesoría pensada para clientes internacionales en Colombia.
              </h2>
              <p className="text-[15px] leading-7 text-[color:var(--muted)] sm:text-base">
                Daniel Luque Restrepo es un abogado colombiano con base en Medellín,
                enfocado en inmigración, transacciones inmobiliarias, asuntos
                comerciales, controversias civiles y temas laborales.
              </p>
              <p className="text-[15px] leading-7 text-[color:var(--muted)] sm:text-base">
                <span className="font-bold text-[color:var(--ink)]">Credenciales:</span> JD de{" "}
                <span className="border border-[color:var(--moss)]/35 bg-[color:var(--surface)] px-2 py-0.5 text-sm text-[color:var(--ink)]">
                  Universidad Pontificia Bolivariana
                </span>
                . Experiencia previa en{" "}
                <span className="border border-[color:var(--moss)]/35 bg-[color:var(--surface)] px-2 py-0.5 text-sm text-[color:var(--ink)]">
                  Capital M Law
                </span>
                .
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-[color:var(--moss)]/40 bg-[color:var(--card)] p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
                  Tarifas transparentes
                </div>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-6">
                    <dt className="text-[color:var(--muted)]">Consulta inicial (1 hora)</dt>
                    <dd className="text-right font-bold text-[color:var(--ink)]">$55 USD / $220,000 COP</dd>
                  </div>
                  <div className="flex items-start justify-between gap-6">
                    <dt className="text-[color:var(--muted)]">Retainer</dt>
                    <dd className="text-right font-bold text-[color:var(--ink)]">
                      COP $450.000/hora
                      <span className="block text-xs font-normal text-[color:var(--muted)]">
                        (~USD 110/hora)
                      </span>
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/es/contact#consultation" className="btn-primary btn-primary-sm">
                    Agendar
                  </Link>
                  <Link href="/es/contact" className="btn-secondary btn-secondary-sm">
                    Contacto
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-[color:var(--moss)]/25 bg-[color:var(--forest)] text-[color:var(--parchment)]">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="space-y-4 lg:col-span-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
                CLKR
              </p>
              <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--parchment)] sm:text-[1.8rem]">
                Repositorio de conocimiento jurídico colombiano
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[color:var(--hero-muted)] sm:text-base">
                Artículos en inglés para hacer accesible el derecho colombiano a
                clientes internacionales.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Link href="/es/clkr" className="btn-primary btn-primary-lg">
                Ver artículos
              </Link>
              <Link
                href="/es/clkr/investor-visa"
                className="btn-secondary btn-secondary-lg border-[color:var(--moss)] text-[color:var(--moss)] hover:bg-[color:var(--parchment)]/10"
              >
                Visa de inversionista
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
