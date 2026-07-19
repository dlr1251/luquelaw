"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

import { useBookingModal } from "@/components/booking/BookingProvider";
import { Container } from "@/components/container";
import {
  aboutContent,
  type AboutLocale,
  type TeamMember,
} from "@/lib/about/content";

type Props = {
  locale: AboutLocale;
};

export function AboutPage({ locale }: Props) {
  const c = aboutContent[locale];
  const { open: openBooking } = useBookingModal();
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!activeMember) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveMember(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMember]);

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
          <div className="max-w-3xl space-y-5">
            {c.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="marketing-body">
                {paragraph}
              </p>
            ))}
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
              <li key={member.name}>
                <button
                  type="button"
                  onClick={() => setActiveMember(member)}
                  className="flex h-full w-full flex-col border border-border bg-card p-5 text-left transition-colors hover:border-foreground/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--moss)]"
                  aria-haspopup="dialog"
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
                  <span className="mt-3 font-[family-name:var(--font-ui)] text-[0.625rem] font-medium uppercase tracking-[0.12em] text-[color:var(--moss)]">
                    {c.openProfile}
                  </span>
                </button>
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

      {activeMember ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[color:var(--ink)]/60"
            aria-label={c.closeProfile}
            onClick={() => setActiveMember(null)}
          />

          <div className="relative flex max-h-[min(100dvh-2rem,36rem)] w-full max-w-lg flex-col overflow-hidden border border-border bg-card text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border bg-surface p-4 sm:p-5">
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="font-display text-xl font-normal leading-tight tracking-tight text-[color:var(--forest)]"
                >
                  {activeMember.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{activeMember.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMember(null)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[color:var(--forest)] bg-background text-[color:var(--forest)] transition hover:bg-[color:var(--forest)] hover:text-[color:var(--parchment)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--moss)]"
                aria-label={c.closeProfile}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-5">
              {activeMember.photoSrc ? (
                <div className="relative mb-5 aspect-[4/5] max-w-[14rem] overflow-hidden border border-border bg-surface">
                  <Image
                    src={activeMember.photoSrc}
                    alt={activeMember.name}
                    fill
                    className="object-cover object-top"
                    sizes="224px"
                  />
                </div>
              ) : null}
              <p className="marketing-body text-[0.95rem] leading-relaxed">
                {activeMember.bio}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
