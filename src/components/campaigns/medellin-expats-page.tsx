"use client";

import Link from "next/link";

import { useBookingModal } from "@/components/booking/BookingProvider";
import { Container } from "@/components/container";
import {
  medellinExpatsContent,
  type CampaignLocale,
} from "@/lib/campaigns/medellin-expats";

export function MedellinExpatsPage({ locale }: { locale: CampaignLocale }) {
  const c = medellinExpatsContent(locale);
  const { open: openBooking } = useBookingModal();

  return (
    <main>
      <section className="bg-hero text-hero-foreground">
        <Container className="marketing-section">
          <div className="max-w-3xl space-y-6">
            <p className="marketing-eyebrow marketing-eyebrow-on-hero">{c.eyebrow}</p>
            <h1 className="marketing-display text-hero-foreground">{c.title}</h1>
            <p className="marketing-lead max-w-2xl italic text-hero-muted">{c.intro}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openBooking}
                className="btn-primary-inverted btn-primary-lg"
              >
                {c.bookCta}
              </button>
              <Link
                href={c.guideHref}
                className="btn-secondary btn-secondary-lg border-hero-foreground/35 !text-white hover:bg-hero-foreground/10"
              >
                {c.guideCta}
              </Link>
            </div>
            <p className="text-sm text-hero-muted">{c.bookNote}</p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background">
        <Container className="marketing-section">
          <p className="marketing-body max-w-3xl">{c.lead}</p>
        </Container>
      </section>

      <section className="border-b border-border bg-surface">
        <Container className="marketing-section">
          <p className="marketing-eyebrow">{c.filesLabel}</p>
          <ol className="mt-8 grid gap-6">
            {c.files.map((file, i) => (
              <li
                key={file.id}
                className="border border-border bg-card p-6 sm:p-8"
              >
                <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--moss)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-2xl font-normal tracking-tight text-[color:var(--forest)]">
                  {file.title}
                </h2>
                <p className="marketing-body mt-3 max-w-3xl">{file.body}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={file.href} className="btn-secondary btn-secondary-sm">
                    {c.read}: {file.readLabel}
                  </Link>
                  <a
                    href={file.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary btn-primary-sm"
                  >
                    {c.whatsapp}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-background">
        <Container className="marketing-section">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{c.disclaimer}</p>
          <div className="mt-8">
            <button type="button" onClick={openBooking} className="btn-primary">
              {c.bookCta}
            </button>
          </div>
        </Container>
      </section>
    </main>
  );
}
