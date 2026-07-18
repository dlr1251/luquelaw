"use client";

import Link from "next/link";

import { BookingCalendarEmbed } from "@/components/booking/booking-calendar-embed";
import { Container } from "@/components/container";
import { EngagementModel } from "@/components/engagement/EngagementModel";
import { HeroEngagementPanel } from "@/components/home/hero-engagement-panel";
import { PracticeAreasPanel } from "@/components/home/practice-areas-panel";
import { ProfilePortrait } from "@/components/home/profile-portrait";
import { homeContent, type HomeLocale } from "@/lib/home/content";

type Props = {
  locale: HomeLocale;
};

export function HomePage({ locale }: Props) {
  const c = homeContent[locale];

  const engagementSteps = c.process.steps as [
    (typeof c.process.steps)[0],
    (typeof c.process.steps)[1],
    (typeof c.process.steps)[2],
  ];

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-hero text-hero-foreground">
        <Container className="marketing-section">
          <div className="grid items-start gap-10 md:grid-cols-12 md:gap-10 lg:gap-12 xl:gap-16">
            <div className="md:col-span-7">
              <div className="grid gap-6 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-start sm:gap-7">
                <ProfilePortrait size="sm" align="center" className="shrink-0 sm:pt-1" />

                <div className="min-w-0 space-y-6 sm:space-y-7">
                  <p className="marketing-eyebrow marketing-eyebrow-on-hero">{c.eyebrow}</p>

                  <h1 className="marketing-display text-hero-foreground">{c.title}</h1>

                  <p className="marketing-lead max-w-2xl italic text-hero-muted">{c.intro}</p>
                </div>

                <div className="flex flex-wrap gap-3 sm:col-start-2">
                  <Link href="#book" className="btn-primary-inverted btn-primary-lg w-full sm:w-auto">
                    {c.bookCta}
                  </Link>
                  <Link
                    href={c.clkrHref}
                    className="btn-secondary btn-secondary-lg w-full border-hero-foreground/35 !text-white hover:bg-hero-foreground/10 sm:w-auto"
                  >
                    {c.clkrCta}
                  </Link>
                </div>
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

      {/* Booking */}
      <section id="book" className="scroll-mt-28 border-b border-border bg-surface">
        <Container className="py-10 sm:py-12 lg:py-14">
          <div className="mx-auto max-w-4xl space-y-5">
            <p className="marketing-eyebrow">{c.booking.eyebrow}</p>
            <h2 className="marketing-title">{c.booking.title}</h2>
            <p className="marketing-body max-w-2xl">{c.booking.subtitle}</p>
            <BookingCalendarEmbed title={c.booking.title} locale={locale} />
          </div>
        </Container>
      </section>

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

      {/* Work with me */}
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
