import type { ImmigrationLocale } from "./paths";
import { immigrationPath } from "./paths";

export type ContentSection = {
  id: string;
  title: string;
  body: string;
};

export type NationalityContent = {
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

const contentEn: NationalityContent = {
  eyebrow: "Immigration hub",
  title: "Nationality & Civil Registry",
  intro:
    "Colombian nationality and civil-registry records often sit underneath visa and residency strategy — especially for children born in Colombia, family reunification, and long-term plans.",
  sections: [
    {
      id: "birth",
      title: "Nationality by birth",
      body: "Colombia recognizes nationality by birth under constitutional and statutory rules — by soil (jus soli) and by blood (jus sanguinis), with conditions. A child born in Colombia to foreign parents may acquire Colombian nationality depending on domicile and registration facts. Getting the Registro Civil de Nacimiento right early avoids later migratory friction.",
    },
    {
      id: "adoption",
      title: "Nationality by adoption (naturalization)",
      body: "Foreigners may apply for Colombian nationality by adoption (naturalización) when they meet residence, conduct, and documentary requirements under the applicable nationality statute and implementing rules. Timelines and evidence vary; prior migratory regularity and clean records matter.",
    },
    {
      id: "registro",
      title: "Registro Civil",
      body: "Birth, marriage, and death records are maintained through the civil registry system (Notarías / Registraduría channels depending on the act). Apostilles, translations, and consistency across names and dates are frequent failure points when those records later support a visa or nationality file.",
    },
    {
      id: "intersection",
      title: "How this intersects with immigration",
      body: "Parent-of-Colombian-child M visas, spouse/partner M visas, and some R pathways depend on civil-status evidence. Nationality strategy and visa strategy should be sequenced together — not treated as separate silos.",
    },
  ],
  ctaTitle: "Need a case-specific read?",
  ctaBody:
    "Nationality and registry questions are fact-heavy. Book a consultation for a written concept before filing.",
  bookCta: "Book a consultation",
  bookHref: immigrationPath("", "en") + "#book",
  disclaimer:
    "Informational only — not legal advice. Nationality decisions rest with the competent Colombian authorities.",
};

const contentEs: NationalityContent = {
  eyebrow: "Hub migratorio",
  title: "Nacionalidad y Registro Civil",
  intro:
    "La nacionalidad colombiana y los registros civiles suelen estar debajo de la estrategia de visa y residencia — sobre todo con hijos nacidos en Colombia, reunificación familiar y planes de largo plazo.",
  sections: [
    {
      id: "birth",
      title: "Nacionalidad por nacimiento",
      body: "Colombia reconoce la nacionalidad por nacimiento bajo reglas constitucionales y legales (incluyendo vías de ius soli e ius sanguinis). Un hijo nacido en Colombia de padres extranjeros puede adquirir nacionalidad colombiana según domicilio y hechos de registro. Acertar el Registro Civil de Nacimiento temprano evita fricción migratoria después.",
    },
    {
      id: "adoption",
      title: "Nacionalidad por adopción (naturalización)",
      body: "Los extranjeros pueden solicitar nacionalidad colombiana por adopción (naturalización) cuando cumplen requisitos de residencia, conducta y documentación bajo la ley de nacionalidad y sus normas. Los plazos y la evidencia varían; la regularidad migratoria previa y los antecedentes importan.",
    },
    {
      id: "registro",
      title: "Registro Civil",
      body: "Nacimientos, matrimonios y defunciones se tramitan en el sistema de registro civil (Notarías / Registraduría según el acto). Apostillas, traducciones y consistencia de nombres y fechas son puntos frecuentes de falla cuando esos registros luego soportan un expediente de visa o nacionalidad.",
    },
    {
      id: "intersection",
      title: "Cómo se cruza con inmigración",
      body: "Las visas M de padre/madre de colombiano, cónyuge/compañero y algunas vías R dependen de prueba de estado civil. La estrategia de nacionalidad y de visa debe secuenciarse juntas — no como silos separados.",
    },
  ],
  ctaTitle: "¿Necesitas una lectura de tu caso?",
  ctaBody:
    "Nacionalidad y registro son muy factuales. Agenda una consulta para un concepto escrito antes de radicar.",
  bookCta: "Agendar consulta",
  bookHref: immigrationPath("", "es") + "#book",
  disclaimer:
    "Contenido informativo — no constituye asesoría jurídica. Las decisiones de nacionalidad corresponden a las autoridades colombianas competentes.",
};

export const nationalityContent: Record<ImmigrationLocale, NationalityContent> = {
  en: contentEn,
  es: contentEs,
};
