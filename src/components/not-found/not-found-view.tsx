import Link from "next/link";

import { Container } from "@/components/container";

const copy = {
  en: {
    eyebrow: "Page not found",
    title: "This page doesn\u2019t exist.",
    description:
      "The link may be outdated, or the page may have moved. You can return home or reach out if you need legal guidance in Colombia.",
    home: "Back to home",
    contact: "Contact us",
    linksLabel: "Helpful links",
    links: [
      { href: "/services", label: "Services" },
      { href: "/clkr", label: "CLKR" },
      { href: "/posts", label: "Blog" },
      { href: "/book", label: "Book a consultation" },
    ],
  },
  es: {
    eyebrow: "Página no encontrada",
    title: "Esta página no existe.",
    description:
      "El enlace puede estar desactualizado o la página pudo haberse movido. Puedes volver al inicio o escribirnos si necesitas asesoría legal en Colombia.",
    home: "Volver al inicio",
    contact: "Contáctanos",
    linksLabel: "Enlaces útiles",
    links: [
      { href: "/es/services", label: "Servicios" },
      { href: "/es/clkr", label: "CLKR" },
      { href: "/es/posts", label: "Blog" },
      { href: "/es/book", label: "Agendar consulta" },
    ],
  },
} as const;

export type NotFoundLocale = keyof typeof copy;

export function NotFoundView({ locale }: { locale: NotFoundLocale }) {
  const t = copy[locale];

  return (
    <main className="flex-1">
      <section className="border-b-2 border-[color:var(--moss)] bg-[color:var(--hero)] text-[color:var(--hero-foreground)]">
        <Container className="marketing-section">
          <p className="marketing-eyebrow text-[color:var(--moss)]">{t.eyebrow}</p>

          <p
            aria-hidden="true"
            className="mt-6 font-display text-[clamp(5rem,18vw,9rem)] font-normal leading-none tracking-tight text-[color:var(--parchment)]/15"
          >
            404
          </p>

          <h1 className="marketing-display mt-2 max-w-3xl text-[color:var(--parchment)]">{t.title}</h1>

          <p className="marketing-lead mt-5 max-w-2xl italic text-[color:var(--hero-muted)]">
            {t.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={locale === "es" ? "/es" : "/"}
              className="btn-primary-inverted btn-primary-lg"
            >
              {t.home}
            </Link>
            <Link
              href={locale === "es" ? "/es#contact" : "/#contact"}
              className="btn-secondary btn-secondary-lg border-[color:var(--parchment)]/40 text-[color:var(--parchment)] hover:bg-[color:var(--parchment)]/10"
            >
              {t.contact}
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <p className="marketing-eyebrow text-muted-foreground">{t.linksLabel}</p>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {t.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-[family-name:var(--font-ui)] text-sm font-medium uppercase tracking-[0.08em] text-[color:var(--forest)] underline decoration-[color:var(--moss)]/35 underline-offset-4 transition hover:text-[color:var(--moss)] hover:decoration-[color:var(--moss)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
