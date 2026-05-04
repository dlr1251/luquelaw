import Link from "next/link";

import { Container } from "@/components/container";
import { getHubArticles } from "@/lib/clkr/get-hub-articles";

import { ClkrBrowser } from "./ClkrBrowser";

export default async function ClkrHubPage() {
  const articles = await getHubArticles("en");
  return (
    <main className="flex-1">
      <section className="border-b-2 border-[color:var(--moss)] bg-[color:var(--hero)] text-[color:var(--hero-foreground)]">
        <Container className="py-14 sm:py-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
            CLKR
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--parchment)] sm:text-[2.6rem]">
            Colombian Legal Knowledge Repository
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[color:var(--hero-muted)] sm:text-lg">
            Colombian law, explained in English—precise, practical, and designed
            for expats and foreign investors operating in Colombia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact#consultation" className="btn-primary btn-primary-lg">
              Book a consultation
            </Link>
            <Link
              href="/contact"
              className="btn-secondary btn-secondary-lg border-[color:var(--moss)] text-[color:var(--moss)] hover:bg-[color:var(--parchment)]/10"
            >
              Contact
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
              Browse articles
            </h2>
            <p className="text-sm leading-6 text-[color:var(--muted)]">
              Start with immigration and real estate. More modules will be added
              over time.
            </p>
          </div>
        </div>

        <ClkrBrowser articles={articles} />
      </Container>
    </main>
  );
}

