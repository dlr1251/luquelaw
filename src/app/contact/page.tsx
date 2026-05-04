import Link from "next/link";

import { Container } from "@/components/container";

import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  return (
    <main className="flex-1">
      <section className="border-b-2 border-[color:var(--moss)] bg-[color:var(--hero)] text-[color:var(--hero-foreground)]">
        <Container className="py-14 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
            Contact & consultations
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--parchment)] sm:text-[2.6rem]">
            Book a consultation or send a message.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[color:var(--hero-muted)] sm:text-lg">
            Initial consultations are <strong className="text-[color:var(--parchment)]">1 hour</strong>. You’ll
            receive a written legal concept and a quotation within{" "}
            <strong className="text-[color:var(--parchment)]">3 business days</strong>. Use the form below for
            inquiries, or request a time slot by email.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#consultation" className="btn-primary btn-primary-lg">
              Consultation details
            </a>
            <a href="#contact" className="btn-secondary btn-secondary-lg border-[color:var(--moss)] text-[color:var(--moss)] hover:bg-[color:var(--parchment)]/10">
              Send an inquiry
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
            Consultations
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            Standard engagement flow and transparent pricing. After you reach out, we align on
            scheduling for the first hour.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="space-y-4">
                {[
                  {
                    title: "1) Initial consultation",
                    body: "A 1-hour session to clarify facts, define the legal question, and map risks and options.",
                  },
                  {
                    title: "2) Written legal concept + quotation",
                    body: "You receive a written legal concept (Concepto Jurídico) summarizing the legal position and a formal quotation for the next step.",
                  },
                  {
                    title: "3) Workplan execution (or retainer)",
                    body: "If you proceed, work is scoped to the quotation. For ongoing matters, a retainer can be used and adjusted to your needs.",
                  },
                ].map((s) => (
                  <div
                    key={s.title}
                    className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6"
                  >
                    <div className="font-display text-lg font-normal text-[color:var(--forest)]">
                      {s.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6">
                <h3 className="font-display text-[1.5rem] font-normal leading-tight tracking-tight text-[color:var(--forest)]">
                  Pricing
                </h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-6">
                    <dt className="text-[color:var(--muted)]">Initial consultation (1 hour)</dt>
                    <dd className="text-right font-bold text-[color:var(--ink)]">[set fee]</dd>
                  </div>
                  <div className="flex items-start justify-between gap-6">
                    <dt className="text-[color:var(--muted)]">Retainer</dt>
                    <dd className="text-right font-bold text-[color:var(--ink)]">
                      COP $450,000/hr{" "}
                      <span className="block text-xs font-normal text-[color:var(--muted)]">
                        (~USD 110/hr)
                      </span>
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs leading-5 text-[color:var(--muted)]">
                  Fees are adjustable based on matter complexity and client needs.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="mailto:daniel@luquelaw.co?subject=Consultation%20request%20(Luque%20Law)"
                    className="btn-primary btn-primary-sm"
                  >
                    Request a time slot
                  </a>
                  <a href="#contact" className="btn-secondary btn-secondary-sm">
                    Use the form
                  </a>
                </div>
              </div>

              <div className="mt-6 border border-[color:var(--moss)]/35 bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)]">
                <div className="font-bold text-[color:var(--ink)]">What to prepare</div>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>A short factual timeline (dates matter).</li>
                  <li>Key documents (PDFs) and parties involved.</li>
                  <li>Your goal (visa outcome, transaction objective, risk tolerance).</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 pt-14">
          <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
            Contact
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            The form opens your email client with a pre-filled message. For urgent matters, use
            WhatsApp.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="space-y-6 lg:col-span-7">
              <div className="border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6 sm:p-10">
                <div className="font-display text-[1.5rem] font-normal leading-tight tracking-tight text-[color:var(--forest)]">
                  Send an inquiry
                </div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  This form opens your email client with a pre-filled message.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-[color:var(--moss)]/35 bg-[color:var(--surface)] p-6 text-sm">
                <div className="font-bold text-[color:var(--ink)]">Direct contact</div>
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
                <div className="font-bold text-[color:var(--ink)]">What helps on the first message</div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[color:var(--muted)]">
                  <li>Your nationality and where you’re currently located.</li>
                  <li>A short timeline (dates matter).</li>
                  <li>Documents you already have (PDFs are ideal).</li>
                  <li>What outcome you want and your timeline.</li>
                </ul>
              </div>

              <div className="mt-6 border border-[color:var(--moss)]/35 bg-[color:var(--card)] p-6 text-sm text-[color:var(--muted)]">
                <div className="font-bold text-[color:var(--ink)]">Prefer CLKR first?</div>
                <p className="mt-2 leading-6">
                  Browse explainers before you write—especially for immigration and real estate.
                </p>
                <Link
                  href="/clkr"
                  className="mt-3 inline-block text-sm font-bold text-[color:var(--moss)] hover:underline"
                >
                  Open CLKR →
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </Container>
    </main>
  );
}
