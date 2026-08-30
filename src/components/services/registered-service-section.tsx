import Image from "next/image";

import { Container } from "@/components/container";
import { HLegalLogo } from "@/components/icons/h-legal-logo";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import type { RegisteredServiceContent } from "@/lib/services/registered-services";

type Props = {
  service: RegisteredServiceContent;
};

export function RegisteredServiceSection({ service }: Props) {
  const { brand } = service;

  return (
    <section className="border-b border-border bg-surface">
      <Container className="marketing-section">
        <article
          className="overflow-hidden rounded-xl p-8 sm:p-10"
          style={{
            backgroundColor: brand.background,
            color: brand.foreground,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-6">
            <BrandLockup service={service} />
            <p
              className="font-[family-name:var(--font-ui)] text-[0.6875rem] font-semibold uppercase tracking-[0.16em]"
              style={{ color: brand.accent }}
            >
              {service.eyebrow}
            </p>
          </div>

          <div className="mt-8 max-w-3xl">
            <p
              className="font-[family-name:var(--font-display)] text-xl italic leading-snug sm:text-2xl"
              style={{ color: brand.foreground }}
            >
              {service.kicker}
            </p>
            <p
              className="mt-4 text-[0.9375rem] leading-relaxed"
              style={{ color: brand.muted }}
            >
              {service.body}
            </p>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {service.perks.map((perk) => (
              <li
                key={perk}
                className="rounded-lg px-5 py-4 text-sm leading-relaxed"
                style={{
                  backgroundColor: brand.tile,
                  border: `1px solid ${brand.border}`,
                  color: brand.foreground,
                }}
              >
                {perk}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={service.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 font-[family-name:var(--font-ui)] text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: brand.buttonBg,
                color: brand.buttonText,
              }}
            >
              {service.cta}
            </a>
            <a
              href={service.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 font-[family-name:var(--font-ui)] text-sm font-semibold transition-colors"
              style={{
                border: `1px solid ${brand.border}`,
                color: brand.foreground,
              }}
            >
              <WhatsappIcon className="size-4" />
              {service.whatsappLabel}
            </a>
          </div>

          <p
            className="mt-7 border-t pt-5 text-xs leading-relaxed"
            style={{ borderColor: brand.border, color: brand.muted }}
          >
            {service.disclosure}
          </p>
        </article>
      </Container>
    </section>
  );
}

function BrandLockup({ service }: { service: RegisteredServiceContent }) {
  const { brand } = service;

  if (brand.mark === "sunday" && brand.logoSrc) {
    return (
      <Image
        src={brand.logoSrc}
        alt={brand.logoAlt ?? service.name}
        width={132}
        height={132}
        className="h-20 w-auto sm:h-24"
        priority={false}
      />
    );
  }

  if (brand.mark === "h-legal") {
    return (
      <div className="flex items-center gap-3">
        <HLegalLogo className="h-12 w-12 sm:h-14 sm:w-14" ink={brand.foreground} red={brand.accent} />
        <span className="font-[family-name:var(--font-ui)] text-2xl font-extrabold tracking-[0.02em] sm:text-[1.75rem]">
          H&nbsp;Legal
        </span>
      </div>
    );
  }

  return (
    <span className="font-[family-name:var(--font-display)] text-2xl">{service.name}</span>
  );
}
