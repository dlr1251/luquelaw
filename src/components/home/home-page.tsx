"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { Container } from "@/components/container";
import { EngagementModel } from "@/components/engagement/EngagementModel";
import { ClkrPreview } from "@/components/home/clkr-preview";
import { HeroEngagementPanel, type HeroEngagementTab } from "@/components/home/hero-engagement-panel";
import { PracticeAreasPanel } from "@/components/home/practice-areas-panel";
import { ProfilePortrait } from "@/components/home/profile-portrait";
import { homeContent, type HomeLocale } from "@/lib/home/content";

type Props = {
  locale: HomeLocale;
};

export function HomePage({ locale }: Props) {
  const c = homeContent[locale];
  const [heroTab, setHeroTab] = useState<HeroEngagementTab>("book");

  const openBookingTab = useCallback(() => {
    setHeroTab("book");
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
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

                <div className="sm:col-start-2">
                  <Link
                    href={c.clkrPreview.browseHref}
                    className="btn-secondary btn-secondary-lg w-full border-hero-foreground/35 text-hero-foreground hover:bg-hero-foreground/10 sm:w-auto"
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
                activeTab={heroTab}
                onTabChange={setHeroTab}
              />
            </div>
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
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="space-y-5 lg:col-span-7">
              <p className="marketing-eyebrow">{c.workWithMe.label}</p>
              <h2 className="marketing-title">{c.workWithMe.title}</h2>
              <p className="marketing-body max-w-2xl">{c.workWithMe.body}</p>

              <div className="hidden pt-2 lg:block">
                <EngagementModel
                  label={c.process.engagementLabel}
                  steps={engagementSteps}
                  footer={c.process.footer}
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full border border-border bg-card p-6 sm:p-7">
                <div className="marketing-eyebrow text-[0.625rem] tracking-[0.2em]">{c.pricing.label}</div>
                <dl className="mt-5 space-y-5">
                  <div className="flex flex-col gap-1 border-b border-[color:var(--moss)]/15 pb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <dt className="text-sm text-[color:var(--muted)]">{c.pricing.consultation}</dt>
                    <dd className="font-semibold text-foreground sm:text-right">
                      {c.pricing.consultationPrice}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-sm text-[color:var(--muted)]">{c.pricing.retainer}</dt>
                    <dd className="font-semibold text-foreground sm:text-right">
                      {c.pricing.retainerPrice}
                      <span className="mt-1 block text-sm font-normal text-[color:var(--muted)]">
                        {c.pricing.retainerNote}
                      </span>
                    </dd>
                  </div>
                </dl>
                <p className="mt-5 text-sm leading-relaxed text-[color:var(--muted)]">{c.pricing.footnote}</p>
                <button type="button" onClick={openBookingTab} className="btn-primary btn-primary-sm mt-6 w-full sm:w-auto">
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

      {/* About */}
      <section className="bg-background">
        <Container className="marketing-section">
          <div className="max-w-3xl space-y-5">
            <h2 className="marketing-title">{c.about.title}</h2>
            <p className="marketing-body">{c.about.body}</p>
            <p className="marketing-body">
              <span className="font-semibold text-foreground">{c.about.credentialsPrefix}</span>{" "}
              <span className="inline-block border border-border bg-surface px-2.5 py-1 text-sm font-medium text-foreground">
                {c.about.university}
              </span>
              . {c.about.formerPrefix}{" "}
              <span className="inline-block border border-border bg-surface px-2.5 py-1 text-sm font-medium text-foreground">
                {c.about.formerFirm}
              </span>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* CLKR preview */}
      <section className="bg-background">
        <Container className="pb-14 sm:pb-16 lg:pb-20">
          <ClkrPreview preview={c.clkrPreview} />
        </Container>
      </section>
    </main>
  );
}
