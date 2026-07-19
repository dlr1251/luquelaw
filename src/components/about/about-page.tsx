"use client";

import Image from "next/image";

import { useBookingModal } from "@/components/booking/BookingProvider";
import { Container } from "@/components/container";
import { aboutContent, type AboutLocale } from "@/lib/about/content";

type Props = {
  locale: AboutLocale;
};

export function AboutPage({ locale }: Props) {
  const c = aboutContent[locale];
  const { open: openBooking } = useBookingModal();

  return (
    <main>
      <section className="bg-hero text-hero-foreground">
        <Container className="marketing-section">
          <div className="max-w-3xl space-y-6">
            <p className="marketing-eyebrow marketing-eyebrow-on-hero">{c.eyebrow}</p>
            <h1 className="marketing-display text-hero-foreground">{c.title}</h1>
            <p className="marketing-lead max-w-2xl italic text-hero-muted">{c.intro}</p>
            <button
              type="button"
              onClick={openBooking}
              className="btn-primary-inverted btn-primary-lg"
            >
              {c.bookCta}
            </button>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-background">
        <Container className="marketing-section">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14">
            <div className="relative aspect-[4/5] max-w-sm overflow-hidden border border-border bg-surface">
              <Image
                src="/images/profile.png"
                alt={c.bioTitle}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 360px"
                priority
              />
            </div>
            <div className="space-y-4">
              <p className="marketing-eyebrow">
                {locale === "es" ? "Fundador" : "Founder"}
              </p>
              <h2 className="marketing-title">{c.bioTitle}</h2>
              <p className="marketing-body max-w-2xl">{c.bio}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface">
        <Container className="marketing-section">
          <div className="max-w-2xl space-y-3">
            <p className="marketing-eyebrow">{c.teamLabel}</p>
            <h2 className="marketing-title">{c.teamTitle}</h2>
            <p className="marketing-body">{c.teamIntro}</p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.team.map((member) => (
              <li
                key={member.name}
                className="flex flex-col border border-border bg-card p-5"
              >
                {member.photoSrc ? (
                  <div className="relative mb-4 aspect-square overflow-hidden bg-surface">
                    <Image
                      src={member.photoSrc}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="200px"
                    />
                  </div>
                ) : (
                  <div
                    className="mb-4 flex aspect-square items-center justify-center bg-surface font-[family-name:var(--font-ui)] text-2xl font-medium text-muted-foreground"
                    aria-hidden="true"
                  >
                    {member.name
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </div>
                )}
                <h3 className="font-[family-name:var(--font-ui)] text-[0.875rem] font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <button
              type="button"
              onClick={openBooking}
              className="btn-primary btn-primary-lg"
            >
              {c.bookCta}
            </button>
          </div>
        </Container>
      </section>
    </main>
  );
}
