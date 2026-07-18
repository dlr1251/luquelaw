import type { ImmigrationLocale } from "./paths";
import { immigrationPath } from "./paths";

export type ContentSection = {
  id: string;
  title: string;
  body: string;
};

export type ExtranjeriaContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: ContentSection[];
  ctaTitle: string;
  ctaBody: string;
  bookCta: string;
  bookHref: string;
  disclaimer: string;
};

const contentEn: ExtranjeriaContent = {
  eyebrow: "Immigration hub",
  title: "Extranjería procedures",
  intro:
    "After admission or visa issuance, Migración Colombia procedures keep your stay regular — extensions, ID cards, minors registration, sanctions, appointments, and movement certificates.",
  sections: [
    {
      id: "extension",
      title: "Stay extensions (prórroga)",
      body: "Tourism and certain permits may be extended through Migración Colombia before expiry, subject to the annual quota and officer discretion. File early; last-minute extensions are a common overstay trigger.",
    },
    {
      id: "cedula",
      title: "Cédula de extranjería",
      body: "Many visa holders must register with Migración Colombia and obtain a cédula de extranjería within the deadline notified after visa issuance (often referenced as about 15 calendar days). Banks and local contracts frequently require this ID.",
    },
    {
      id: "minors",
      title: "Minors registration",
      body: "Children may need separate migratory registration, parental consent, and civil-registry evidence. Rules differ by visa category and by whether the minor is a beneficiary or a principal.",
    },
    {
      id: "sanctions",
      title: "Sanctions & safe-conduct",
      body: "Overstay can trigger administrative sanctions (commonly referenced via Resolución 2357 de 2020 and related rules). Regularization may require paying a fine and obtaining a salvoconducto before exit or a new visa filing.",
    },
    {
      id: "appointments",
      title: "Appointments & migratory movements",
      body: "Many trámites require scheduled appointments and proof of entries/exits (certificado de movimientos migratorios). Keep a personal log of stamps — it speeds both DIY filings and counsel review.",
    },
  ],
  ctaTitle: "Near an expiry or overstay?",
  ctaBody:
    "Rush and standard regularization tiers are available on the practice page. Book a consultation for a staged plan.",
  bookCta: "Book a consultation",
  bookHref: immigrationPath("", "en") + "#book",
  disclaimer:
    "Informational only — not legal advice. Migración Colombia procedures and fees change; verify current channels before filing.",
};

const contentEs: ExtranjeriaContent = {
  eyebrow: "Hub migratorio",
  title: "Trámites de extranjería",
  intro:
    "Después del ingreso o de la visa, los trámites ante Migración Colombia mantienen tu permanencia regular — prórrogas, cédula, registro de menores, sanciones, citas y certificados de movimientos.",
  sections: [
    {
      id: "extension",
      title: "Prórroga de permanencia",
      body: "El turismo y ciertos permisos pueden prorrogarse ante Migración Colombia antes del vencimiento, sujetos a la cuota anual y a la discrecionalidad del funcionario. Radica con tiempo; las prórrogas de última hora son un disparador frecuente de sobreestadía.",
    },
    {
      id: "cedula",
      title: "Cédula de extranjería",
      body: "Muchos titulares de visa deben registrarse ante Migración Colombia y obtener cédula de extranjería dentro del plazo notificado tras la expedición (a menudo referido como unos 15 días calendario). Bancos y contratos locales suelen exigir esa identificación.",
    },
    {
      id: "minors",
      title: "Registro de menores",
      body: "Los menores pueden requerir registro migratorio aparte, consentimiento parental y prueba de registro civil. Las reglas varían por categoría de visa y según si el menor es beneficiario o principal.",
    },
    {
      id: "sanctions",
      title: "Sanciones y salvoconducto",
      body: "La sobreestadía puede generar sanción administrativa (con frecuencia referenciada vía Resolución 2357 de 2020 y normas relacionadas). La regulación puede exigir pago de multa y salvoconducto antes de salir o de radicar una nueva visa.",
    },
    {
      id: "appointments",
      title: "Citas y movimientos migratorios",
      body: "Muchos trámites exigen cita y prueba de entradas/salidas (certificado de movimientos migratorios). Lleva un registro personal de sellos — acelera radicaciones DIY y la revisión con abogado.",
    },
  ],
  ctaTitle: "¿Cerca de un vencimiento o sobreestadía?",
  ctaBody:
    "En la página del área hay niveles rush y standard de regulación. Agenda una consulta para un plan por etapas.",
  bookCta: "Agendar consulta",
  bookHref: immigrationPath("", "es") + "#book",
  disclaimer:
    "Contenido informativo — no constituye asesoría jurídica. Los procedimientos y tarifas de Migración Colombia cambian; verifica los canales vigentes antes de radicar.",
};

export const extranjeriaContent: Record<ImmigrationLocale, ExtranjeriaContent> = {
  en: contentEn,
  es: contentEs,
};
