import Link from "next/link";

import { Container } from "@/components/container";
import { getHubArticles } from "@/lib/clkr/get-hub-articles";

import { ClkrBrowser } from "./ClkrBrowser";

export default async function ClkrHubPage() {
  const articles = await getHubArticles("en");
  const homeContact = "/#contact";

  return (
    <main className="flex-1">
      <section className="border-b border-[color:var(--moss)]/25 bg-[color:var(--background)]">
        <Container className="py-14 sm:py-16">
          <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[color:var(--moss)]">
            CLKR
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[2.25rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[2.6rem]">
            Colombian Legal Knowledge Repository
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
            Colombian law, explained in English—precise, practical, and designed for expats and
            foreign investors operating in Colombia.
          </p>
          <p className="mt-6">
            <Link
              href={homeContact}
              className="text-sm font-bold text-[color:var(--forest)] underline-offset-2 hover:text-[color:var(--moss)] hover:underline"
            >
              Questions about your situation? Get in touch →
            </Link>
          </p>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <div className="mb-10 space-y-2">
          <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
            Browse articles
          </h2>
          <p className="text-sm leading-6 text-[color:var(--muted)]">
            Start with immigration and real estate. More modules will be added over time.
          </p>
        </div>

        <ClkrBrowser articles={articles} />
      </Container>
    </main>
  );
}
