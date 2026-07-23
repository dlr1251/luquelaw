import Link from "next/link";

import { Container } from "@/components/container";

type Props = {
  locale: "en" | "es";
  eyebrow: string;
  title: string;
  subtitle: string;
  contactCta: string;
  contactLink: string;
  /** Override default #contact link (e.g. Torny). */
  contactHref?: string;
};

export function ClkrModuleHero({
  locale,
  eyebrow,
  title,
  subtitle,
  contactCta,
  contactLink,
  contactHref: contactHrefProp,
}: Props) {
  const hubHref = locale === "es" ? "/es/clkr" : "/clkr";
  const contactHref =
    contactHrefProp ?? (locale === "es" ? "/es#contact" : "/#contact");

  return (
    <section className="relative overflow-hidden border-b border-[color:var(--moss)]/20 bg-[color:var(--forest)] text-[color:var(--parchment)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 80% 0%, color-mix(in srgb, var(--moss) 40%, transparent), transparent 55%)",
        }}
      />
      <Container className="relative py-12 sm:py-14 lg:py-16">
        <p className="marketing-eyebrow !text-[color:var(--parchment)]/70">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-[clamp(1.85rem,4vw,2.6rem)] leading-[1.1] tracking-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--parchment)]/75 sm:text-lg">
          {subtitle}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link
            href={hubHref}
            className="font-semibold text-[color:var(--parchment)] underline-offset-4 hover:underline"
          >
            ← CLKR
          </Link>
          <Link
            href={contactHref}
            className="text-[color:var(--parchment)]/80 underline-offset-4 hover:text-[color:var(--parchment)] hover:underline"
          >
            {contactCta} {contactLink} →
          </Link>
        </div>
      </Container>
    </section>
  );
}
