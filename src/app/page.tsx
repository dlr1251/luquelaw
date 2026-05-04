"use client";

import Link from "next/link";

import { Container } from "@/components/container";
import { useBookingModal } from "@/components/booking/BookingProvider";
import { EngagementModel } from "@/components/engagement/EngagementModel";

const practiceAreas = [
  {
    title: "Immigration law",
    detail: "Investor · Digital nomad · Residency · Naturalization",
  },
  {
    title: "Real estate",
    detail: "Purchases for foreigners · Due diligence · Title · Notarial",
  },
  {
    title: "Corporate",
    detail: "Company formation · Contracts · Compliance",
  },
  {
    title: "Legal advisory",
    detail: "Written concepts · Opinions · Strategy",
  },
];

export default function Home() {
  const booking = useBookingModal();

  return (
    <main className="flex-1">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-[color:var(--forest)] text-[color:var(--parchment)]">
        <Container className="py-24 md:py-32">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">

            {/* Copy */}
            <div className="space-y-8 lg:col-span-7">
              <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[color:var(--moss)]">
                Immigration · Real Estate · Corporate
              </p>

              <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-normal leading-[1.05] tracking-tight text-[color:var(--parchment)]">
                Legal counsel for foreigners in Colombia.
              </h1>

              <p className="max-w-xl font-[family-name:var(--font-body)] text-[1.125rem] italic leading-[1.75] text-[color:var(--parchment)]/75">
                Clear, bilingual guidance on visas, property, and business in Colombia.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={booking.open}
                  className="btn-primary-inverted btn-primary-lg"
                >
                  Book a consultation
                </button>
                <Link
                  href="/clkr"
                  className="btn-secondary btn-secondary-lg border-[color:var(--parchment)]/40 text-[color:var(--parchment)] hover:bg-[color:var(--parchment)]/10"
                >
                  Explore CLKR
                </Link>
              </div>
            </div>

            {/* Practice areas panel */}
            <div className="lg:col-span-5">
              <div className="border border-[color:var(--parchment)]/10 bg-[color:var(--parchment)]/[0.04] p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-block h-4 w-4 shrink-0 border border-[color:var(--parchment)]/30"
                  />
                  <span className="font-[family-name:var(--font-ui)] text-[0.625rem] uppercase tracking-[0.22em] text-[color:var(--parchment)]/45">
                    Practice areas
                  </span>
                </div>

                <ul className="divide-y divide-[color:var(--parchment)]/10">
                  {practiceAreas.map((area) => (
                    <li
                      key={area.title}
                      className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.45em] inline-block h-[0.4em] w-[0.4em] shrink-0 border border-[color:var(--parchment)]/40"
                      />
                      <div>
                        <p className="font-[family-name:var(--font-ui)] text-[0.8125rem] font-medium uppercase tracking-[0.07em] text-[color:var(--parchment)]/90">
                          {area.title}
                        </p>
                        <p className="mt-0.5 text-[0.75rem] leading-5 text-[color:var(--parchment)]/45">
                          {area.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-[color:var(--parchment)]/10 pt-5">
                  <p className="font-[family-name:var(--font-ui)] text-[0.5625rem] uppercase tracking-[0.18em] text-[color:var(--parchment)]/35">
                    Daniel Luque Restrepo · JD, UPB · Medellín, Colombia
                  </p>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section className="bg-[color:var(--background)]">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-5">
              <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[color:var(--moss)]">
                Process
              </p>
              <h2 className="text-[1.65rem] leading-tight tracking-tight sm:text-[1.8rem]">
                How it works
              </h2>
              <p className="text-[15px] leading-7 text-[color:var(--muted)] sm:text-base">
                Every engagement starts with a structured consultation, followed by a
                written legal concept and a clear workplan — so you know exactly what
                you need before committing.
              </p>
            </div>
            <EngagementModel
              label="Engagement model"
              steps={[
                {
                  icon: "chat",
                  title: "Initial consultation",
                  body: "1 hour to map the facts, identify risks, and define the legal question.",
                },
                {
                  icon: "doc",
                  title: "Written concept + quotation",
                  body: "You receive a written legal concept (Concepto Jurídico) and a formal quotation within 3 business days.",
                },
                {
                  icon: "plan",
                  title: "Workplan execution (or retainer)",
                  body: "Proceed with a scoped workplan, or switch to an hourly retainer for ongoing matters.",
                },
              ]}
              footer="Deliverables within 3 business days after the consultation."
            />
          </div>
        </Container>
      </section>

      {/* ── About + Pricing ────────────────────────────────────── */}
      <section className="bg-[color:var(--background)]">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
                Counsel built for international clients operating in Colombia.
              </h2>
              <p className="text-[15px] leading-7 text-[color:var(--muted)] sm:text-base">
                Daniel Luque Restrepo is a Colombian attorney based in Medellín,
                advising on immigration, real estate transactions, commercial matters,
                civil disputes, and labor issues. Bilingual (English/Spanish).
              </p>
              <p className="text-[15px] leading-7 text-[color:var(--muted)] sm:text-base">
                <span className="font-bold text-[color:var(--ink)]">Credentials:</span> JD from{" "}
                <span className="border border-[color:var(--moss)]/35 bg-[color:var(--surface)] px-2 py-0.5 text-sm text-[color:var(--ink)]">
                  Universidad Pontificia Bolivariana
                </span>
                . Former{" "}
                <span className="border border-[color:var(--moss)]/35 bg-[color:var(--surface)] px-2 py-0.5 text-sm text-[color:var(--ink)]">
                  Capital M Law
                </span>
                .
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-[color:var(--moss)]/40 bg-[color:var(--card)] p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
                  Transparent pricing
                </div>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-6">
                    <dt className="text-[color:var(--muted)]">Initial consultation (1 hour)</dt>
                    <dd className="text-right font-bold text-[color:var(--ink)]">$55 USD / $220,000 COP</dd>
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
                  Fees are adjustable based on complexity and scope.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/contact#consultation" className="btn-primary btn-primary-sm">
                    Book
                  </Link>
                  <Link href="/contact" className="btn-secondary btn-secondary-sm">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Services ───────────────────────────────────────────── */}
      <section className="bg-[color:var(--background)]">
        <Container className="py-16 sm:py-20">
          <div className="flex items-end justify-between gap-6">
            <div className="space-y-3">
              <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
                Services
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
                Focused coverage for the matters most common to expats and foreign
                investors in Colombia.
              </p>
            </div>
            <div className="hidden flex-col items-end gap-2 sm:flex">
              <Link
                href="/services"
                className="text-sm font-bold text-[color:var(--moss)] hover:underline"
              >
                All services →
              </Link>
              <Link
                href="/contact#contact"
                className="text-sm font-bold text-[color:var(--moss)] hover:underline"
              >
                Ask a question →
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Legal consulting & advisory",
                body: "Written legal concepts, opinions, and strategy on Colombian law matters.",
              },
              {
                title: "Immigration law",
                body: "Investor visas, digital nomad visas, pensioner visas, residency, and naturalization.",
              },
              {
                title: "Real estate transactions",
                body: "Purchase/sale for foreigners, due diligence, title review, notarial process, and registration.",
              },
              {
                title: "Commercial & corporate",
                body: "Company formation, contracts, disputes, and compliance.",
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
        </Container>
      </section>

      {/* ── CLKR CTA ───────────────────────────────────────────── */}
      <section className="border-y border-[color:var(--moss)]/25 bg-[color:var(--forest)] text-[color:var(--parchment)]">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="space-y-4 lg:col-span-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
                CLKR
              </p>
              <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--parchment)] sm:text-[1.8rem]">
                Colombian Legal Knowledge Repository
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[color:var(--hero-muted)] sm:text-base">
                A living, English-language repository designed to make Colombian law
                accessible to international clients—precise, practical, and cited.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Link href="/clkr" className="btn-primary-inverted btn-primary-lg">
                Browse articles
              </Link>
              <Link
                href="/clkr/investor-visa"
                className="btn-secondary btn-secondary-lg border-[color:var(--parchment)]/40 text-[color:var(--parchment)] hover:bg-[color:var(--parchment)]/10"
              >
                Start with Investor Visa
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </main>
  );
}
