"use client";

import Link from "next/link";

import { Container } from "@/components/container";
import { useBookingModal } from "@/components/booking/BookingProvider";
import { ContactForm } from "@/components/contact/contact-form";
import { EngagementModel } from "@/components/engagement/EngagementModel";
import { ClkrPreview } from "@/components/home/clkr-preview";
import { ContactLinks } from "@/components/home/contact-links";
import { PracticeAreasPanel } from "@/components/home/practice-areas-panel";
import { ProfilePortrait } from "@/components/home/profile-portrait";
import { homeContent, type HomeLocale } from "@/lib/home/content";

type Props = {
  locale: HomeLocale;
};

export function HomePage({ locale }: Props) {
  const c = homeContent[locale];
  const booking = useBookingModal();
  const isEs = locale === "es";
  const engagementSteps = c.process.steps as [
    (typeof c.process.steps)[0],
    (typeof c.process.steps)[1],
    (typeof c.process.steps)[2],
  ];

  return (
    <main className="flex-1">
      {/* Hero — green */}
      <section className="bg-[color:var(--forest)] text-[color:var(--parchment)]">
        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="space-y-6 lg:col-span-7 lg:space-y-8">
              <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[color:var(--moss)]">
                {c.eyebrow}
              </p>

              <h1 className="font-display text-[clamp(2rem,5.5vw,3.25rem)] font-normal leading-[1.08] tracking-tight text-[color:var(--parchment)]">
                {c.title}
              </h1>

              <p className="max-w-2xl text-[15px] leading-7 text-[color:var(--hero-muted)] sm:text-base sm:leading-8">
                {c.intro}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={booking.open}
                  className={
                    isEs
                      ? "btn-primary btn-primary-lg"
                      : "btn-primary-inverted btn-primary-lg"
                  }
                >
                  {c.bookCta}
                </button>
                <Link
                  href={c.clkrPreview.browseHref}
                  className={
                    isEs
                      ? "btn-secondary btn-secondary-lg border-[color:var(--moss)] bg-transparent text-[color:var(--moss)] hover:bg-[color:var(--parchment)]/10"
                      : "btn-secondary btn-secondary-lg border-[color:var(--parchment)]/40 text-[color:var(--parchment)] hover:bg-[color:var(--parchment)]/10"
                  }
                >
                  {c.clkrCta}
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:col-span-5">
              <ProfilePortrait />

              <div
                id="contact"
                className="scroll-mt-28 border border-[color:var(--moss)]/40 bg-[color:var(--parchment)] p-5 text-[color:var(--ink)] shadow-[0_12px_40px_rgba(0,0,0,0.2)] sm:p-6"
              >
                <h2 className="font-display text-lg font-normal leading-tight tracking-tight text-[color:var(--forest)]">
                  {c.contactForm.title}
                </h2>
                <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{c.contactForm.subtitle}</p>
                <div className="mt-4">
                  <ContactForm locale={locale} variant="hero" whatsappHref={c.whatsappHref} />
                </div>
              </div>

              <ContactLinks whatsappHref={c.whatsappHref} />
            </div>
          </div>
        </Container>
      </section>

      {/* Practice areas — light */}
      <section className="bg-[color:var(--background)]">
        <Container className="py-16 sm:py-20">
          <PracticeAreasPanel
            id="practice-areas"
            theme="light"
            label={c.practiceAreasLabel}
            areas={c.practiceAreas}
            credentialsLine={c.credentialsLine}
          />
        </Container>
      </section>

      {/* Work with me — light */}
      <section className="bg-[color:var(--surface)]">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="space-y-5 lg:col-span-7">
              <p className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[color:var(--moss)]">
                {c.workWithMe.label}
              </p>
              <h2 className="font-display text-[1.65rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.8rem]">
                {c.workWithMe.title}
              </h2>
              <p className="text-[15px] leading-7 text-[color:var(--muted)] sm:text-base">{c.workWithMe.body}</p>

              <div className="hidden lg:block">
                <EngagementModel
                  label={c.process.engagementLabel}
                  steps={engagementSteps}
                  footer={c.process.footer}
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-[color:var(--moss)]/40 bg-[color:var(--card)] p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--moss)]">
                  {c.pricing.label}
                </div>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-6">
                    <dt className="text-[color:var(--muted)]">{c.pricing.consultation}</dt>
                    <dd className="text-right font-bold text-[color:var(--ink)]">{c.pricing.consultationPrice}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-6">
                    <dt className="text-[color:var(--muted)]">{c.pricing.retainer}</dt>
                    <dd className="text-right font-bold text-[color:var(--ink)]">
                      {c.pricing.retainerPrice}{" "}
                      <span className="block text-xs font-normal text-[color:var(--muted)]">
                        {c.pricing.retainerNote}
                      </span>
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs leading-5 text-[color:var(--muted)]">{c.pricing.footnote}</p>
                <button type="button" onClick={booking.open} className="btn-primary btn-primary-sm mt-6">
                  {c.pricing.book}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:hidden">
            <EngagementModel
              label={c.process.engagementLabel}
              steps={engagementSteps}
              footer={c.process.footer}
            />
          </div>
        </Container>
      </section>

      {/* About — light */}
      <section className="bg-[color:var(--background)]">
        <Container className="py-14 sm:py-16">
          <div className="max-w-3xl space-y-4">
            <h2 className="font-display text-[1.5rem] font-normal leading-tight tracking-tight text-[color:var(--forest)] sm:text-[1.65rem]">
              {c.about.title}
            </h2>
            <p className="text-[15px] leading-7 text-[color:var(--muted)] sm:text-base">{c.about.body}</p>
            <p className="text-[15px] leading-7 text-[color:var(--muted)] sm:text-base">
              <span className="font-bold text-[color:var(--ink)]">{c.about.credentialsPrefix}</span>{" "}
              <span className="border border-[color:var(--moss)]/35 bg-[color:var(--surface)] px-2 py-0.5 text-sm text-[color:var(--ink)]">
                {c.about.university}
              </span>
              . {c.about.formerPrefix}{" "}
              <span className="border border-[color:var(--moss)]/35 bg-[color:var(--surface)] px-2 py-0.5 text-sm text-[color:var(--ink)]">
                {c.about.formerFirm}
              </span>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* CLKR preview — light */}
      <section className="bg-[color:var(--background)]">
        <Container className="pb-16 sm:pb-20">
          <ClkrPreview preview={c.clkrPreview} />
        </Container>
      </section>
    </main>
  );
}
