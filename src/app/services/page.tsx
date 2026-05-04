import Link from "next/link";

import { Container } from "@/components/container";

export default function ServicesPage() {
  return (
    <main className="flex-1">
      <section className="border-b-2 border-[color:var(--moss)] bg-[color:var(--hero)] text-[color:var(--hero-foreground)]">
        <Container className="py-14 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
            Services
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--parchment)] sm:text-[2.6rem]">
            Counsel for international clients in Colombia.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[color:var(--hero-muted)] sm:text-lg">
            Focused coverage for the matters most common to expats and foreign investors. For a
            scoped plan after the first call, use{" "}
            <Link className="font-bold text-[color:var(--parchment)] underline" href="/contact#consultation">
              consultations & contact
            </Link>
            .
          </p>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="mt-12 border border-[color:var(--moss)]/35 bg-[color:var(--surface)] p-6 text-center">
          <p className="text-sm text-[color:var(--muted)]">
            Ready to move forward?{" "}
            <Link href="/contact#contact" className="font-bold text-[color:var(--moss)] hover:underline">
              Send an inquiry
            </Link>{" "}
            or{" "}
            <Link
              href="/contact#consultation"
              className="font-bold text-[color:var(--moss)] hover:underline"
            >
              review consultation details
            </Link>
            .
          </p>
        </div>
      </Container>
    </main>
  );
}
