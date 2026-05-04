import Link from "next/link";

import { ContactForm } from "@/app/contact/ContactForm";
import { Container } from "@/components/container";

export default function ContactEsPage() {
  return (
    <main className="flex-1">
      <section className="border-b-2 border-[color:var(--moss)] bg-[color:var(--hero)] text-[color:var(--hero-foreground)]">
        <Container className="py-14 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
            Contacto y consultas
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--parchment)] sm:text-[2.6rem]">
            Agenda una consulta o envía un mensaje.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[color:var(--hero-muted)] sm:text-lg">
            La consulta inicial es de{" "}
            <strong className="text-[color:var(--parchment)]">1 hora</strong>. Recibirás un concepto jurídico
            escrito y una cotización dentro de{" "}
            <strong className="text-[color:var(--parchment)]">3 días hábiles</strong>. Usa el formulario para
            consultas o solicita horario por correo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#consultation" className="btn-primary btn-primary-lg">
              Detalle de consultas
            </a>
            <a href="#contact" className="btn-secondary btn-secondary-lg border-[color:var(--moss)] text-[color:var(--moss)] hover:bg-[color:var(--parchment)]/10">
              Enviar consulta
            </a>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <section
          id="consultation"
          className="scroll-mt-28 border-b border-[color:var(--moss)]/25 pb-14"
        >
          <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
            Consultas
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            Flujo estándar y tarifas. Después de tu mensaje, coordinamos la primera hora.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="space-y-4">
                {[
                  [
                    "1) Consulta inicial",
                    "Sesión de 1 hora para aclarar hechos, definir la pregunta jurídica y mapear riesgos y opciones.",
                  ],
                  [
                    "2) Concepto jurídico + cotización",
                    "Recibes un concepto jurídico escrito y una cotización formal para la siguiente etapa.",
                  ],
                  [
                    "3) Ejecución o retainer",
                    "Si decides avanzar, el trabajo se delimita según la cotización. Para asuntos continuos, puede utilizarse un retainer ajustable.",
                  ],
                ].map(([title, body]) => (
                  <div
                    key={title}
                    className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6"
                  >
                    <div className="font-display text-lg font-normal text-[color:var(--forest)]">{title}</div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6">
                <h3 className="font-display text-[1.5rem] font-normal leading-tight tracking-tight text-[color:var(--forest)]">
                  Tarifas
                </h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-6">
                    <dt className="text-[color:var(--muted)]">Consulta inicial (1 hora)</dt>
                    <dd className="text-right font-bold text-[color:var(--ink)]">[definir tarifa]</dd>
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
                  <a
                    href="mailto:daniel@luquelaw.co?subject=Solicitud%20de%20consulta%20(Luque%20Law)"
                    className="btn-primary btn-primary-sm"
                  >
                    Solicitar horario
                  </a>
                  <a href="#contact" className="btn-secondary btn-secondary-sm">
                    Usar el formulario
                  </a>
                </div>
              </div>

              <div className="mt-6 border border-[color:var(--moss)]/35 bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)]">
                <div className="font-bold text-[color:var(--ink)]">Qué preparar</div>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>Una línea de tiempo breve (las fechas importan).</li>
                  <li>Documentos clave (PDF) y partes involucradas.</li>
                  <li>Tu objetivo (visa, transacción, tolerancia al riesgo).</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 pt-14">
          <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
            Contacto
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            El formulario abre tu correo con un mensaje prellenado. Para urgencias, WhatsApp.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="space-y-6 lg:col-span-7">
              <div className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6 sm:p-10">
                <div className="font-display text-[1.5rem] font-normal leading-tight tracking-tight text-[color:var(--forest)]">
                  Enviar consulta
                </div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Este formulario abre tu cliente de correo con un mensaje prellenado.
                </p>
                <div className="mt-6">
                  <ContactForm locale="es" />
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-[color:var(--moss)]/35 bg-[color:var(--surface)] p-6 text-sm">
                <div className="font-bold text-[color:var(--ink)]">Contacto directo</div>
                <div className="mt-3 space-y-2 text-[color:var(--muted)]">
                  <a
                    className="block font-medium text-[color:var(--moss)] hover:underline"
                    href="mailto:daniel@luquelaw.co"
                  >
                    daniel@luquelaw.co
                  </a>
                  <a
                    className="block font-medium text-[color:var(--moss)] hover:underline"
                    href="https://wa.me/573006791123"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp: +57 300 679 1123
                  </a>
                </div>
              </div>

              <div className="mt-6 border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6 text-sm">
                <div className="font-bold text-[color:var(--ink)]">Qué incluir en el primer mensaje</div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[color:var(--muted)]">
                  <li>Tu nacionalidad y ubicación actual.</li>
                  <li>Una línea de tiempo breve (las fechas importan).</li>
                  <li>Documentos que ya tengas (ideal en PDF).</li>
                  <li>El resultado que buscas y tu plazo.</li>
                </ul>
              </div>

              <div className="mt-6 border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6 text-sm text-[color:var(--muted)]">
                <div className="font-bold text-[color:var(--ink)]">¿Prefieres CLKR primero?</div>
                <p className="mt-2 leading-6">
                  Artículos explicados antes de escribir—especialmente inmigración e inmobiliario.
                </p>
                <Link
                  href="/es/clkr"
                  className="mt-3 inline-block text-sm font-bold text-[color:var(--moss)] hover:underline"
                >
                  Abrir CLKR →
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </Container>
    </main>
  );
}
