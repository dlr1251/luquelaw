"use client";

import Link from "next/link";

import { useBookingModal } from "@/components/booking/BookingProvider";
import { BookingSection } from "@/components/booking/booking-section";
import { Container } from "@/components/container";
import { EngagementModel } from "@/components/engagement/EngagementModel";
import { HeroEngagementPanel } from "@/components/home/hero-engagement-panel";
import { PracticeAreasPanel } from "@/components/home/practice-areas-panel";
import { homeContent, type HomeLocale } from "@/lib/home/content";

type Props = {
  locale: HomeLocale;
};

export function HomePage({ locale }: Props) {
  const c = homeContent[locale];
  const { open: openBooking } = useBookingModal();

  const engagementSteps = c.process.steps as [
    (typeof c.process.steps)[0],
    (typeof c.process.steps)[1],
    (typeof c.process.steps)[2],
  ];

  return (
    <main className="flex-1">
      {/* Hero — inverted: clear ground, forest type */}
      <section className="bg-background text-foreground">
        <Container className="marketing-section">
          <div className="grid items-start gap-10 md:grid-cols-12 md:gap-10 lg:gap-12 xl:gap-16">
            <div className="md:col-span-7 space-y-6 sm:space-y-7">
              <div className="min-w-0 space-y-6 sm:space-y-7">
                <p className="marketing-eyebrow">{c.eyebrow}</p>

                <h1 className="marketing-display text-[color:var(--forest)]">{c.title}</h1>

                <p className="marketing-lead max-w-2xl italic text-muted-foreground">{c.intro}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openBooking}
                  className="btn-primary btn-primary-lg w-full sm:w-auto"
                >
                  {c.bookCta}
                </button>
                <Link href={c.clkrHref} className="btn-secondary btn-secondary-lg w-full sm:w-auto">
                  {c.clkrCta}
                </Link>
              </div>
            </div>

            <div className="md:col-span-5">
              <HeroEngagementPanel
                locale={locale}
                whatsappHref={c.whatsappHref}
                contactTitle={c.contactForm.title}
                contactSubtitle={c.contactForm.subtitle}
              />
            </div>
          </div>
        </Container>
      </section>

      <BookingSection buttonLabel={c.booking.buttonLabel} />

      {/* Practice areas */}
      <section className="bg-background">
        <Container className="py-14 sm:py-16 lg:py-20">
          <PracticeAreasPanel
            id="practice-areas"
            label={c.practiceAreasLabel}
            areas={c.practiceAreas}
            credentialsLine={c.credentialsLine}
          />
        </Container>
      </section>

      {/* Work with us */}
      <section className="bg-surface">
        <Container className="marketing-section">
          <div className="space-y-5">
            <p className="marketing-eyebrow">{c.workWithMe.label}</p>
            <h2 className="marketing-title">{c.workWithMe.title}</h2>
            <p className="marketing-body max-w-2xl">{c.workWithMe.body}</p>
          </div>

          <div className="mt-10">
            <EngagementModel
              label={c.process.engagementLabel}
              steps={engagementSteps}
              footer={c.process.footer}
            />
          </div>
        </Container>
      </section>

      {/* About */}
      <section className="bg-background">
        <Container className="marketing-section">
          <div className="max-w-3xl space-y-5">
            <h2 className="marketing-title">{c.about.title}</h2>
            <p className="marketing-body">{c.about.body}</p>
          </div>
        </Container>
      </section>
    </main>
  );
}
