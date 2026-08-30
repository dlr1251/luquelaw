import { FIRM_WHATSAPP_E164 } from "@/lib/practice-areas/checklist-contact";

export type CampaignLocale = "en" | "es";

export type CampaignFile = {
  id: "visa" | "tax" | "lease" | "buy" | "company";
  title: string;
  body: string;
  readLabel: string;
  href: string;
  whatsappHref: string;
};

function wa(text: string) {
  return `https://wa.me/${FIRM_WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}

export const medellinExpatsPath = {
  en: "/medellin",
  es: "/es/medellin",
  socialEn: "/medellin/social",
  socialEs: "/es/medellin/social",
} as const;

export function medellinExpatsContent(locale: CampaignLocale) {
  const prefix = locale === "es" ? "/es" : "";

  if (locale === "es") {
    return {
      eyebrow: "Medellín",
      title: "Ya estás acá. Estos son los cinco expedientes que abre la ley colombiana.",
      intro:
        "Visa, arriendo, compraventa, residencia fiscal, sociedad. No es un kit de bienvenida. Es el mapa de lo que vemos cuando alguien ya aterrizó.",
      lead: "Trabajamos desde Medellín con quien está armando una vida o un negocio aquí. La primera conversación dura 45 minutos. Después, un concepto jurídico escrito y una cotización en tres días hábiles.",
      filesLabel: "Los cinco archivos",
      files: [
        {
          id: "visa",
          title: "Estatus migratorio",
          body: "La visa y los días de permanencia no son lo mismo que “ya vivo aquí”. Migración Colombia cuenta el estatus; el contrato de arriendo no lo reemplaza.",
          readLabel: "Migración",
          href: `${prefix}/servicios/migracion`,
          whatsappHref: wa(
            "Hola Luque Law, leí la nota de Medellín sobre estatus migratorio y tengo una pregunta.",
          ),
        },
        {
          id: "tax",
          title: "Residencia fiscal",
          body: "El artículo 10 del Estatuto Tributario cuenta 183 días en un periodo de 365. Una visa M no decide eso por sí sola. El texto está en Normas.",
          readLabel: "Artículo 10 ET",
          href: `${prefix}/clkr/norms/estatuto-tributario/libro-i/art-10`,
          whatsappHref: wa(
            "Hola Luque Law, leí la nota de los 183 días y la residencia fiscal, y tengo una pregunta.",
          ),
        },
        {
          id: "lease",
          title: "Contrato de arriendo",
          body: "No es el lease del common law. Canon, depósito, restitución y lo que pasa si se va antes: eso está en el Código Civil y en el contrato, no en el grupo de Facebook.",
          readLabel: "Inmobiliario",
          href: `${prefix}/servicios/inmobiliario`,
          whatsappHref: wa(
            "Hola Luque Law, leí la nota de Medellín sobre el contrato de arriendo y tengo una pregunta.",
          ),
        },
        {
          id: "buy",
          title: "Comprar inmueble",
          body: "Promesa, tradición, certificado de tradición y libertad, y el registro de la inversión ante el Banco de la República si el dinero viene de afuera. El checklist está en el blog.",
          readLabel: "Checklist de compraventa",
          href: `${prefix}/posts/property-due-diligence-medellin`,
          whatsappHref: wa(
            "Hola Luque Law, leí la nota de Medellín sobre comprar inmueble y tengo una pregunta.",
          ),
        },
        {
          id: "company",
          title: "Contratar o constituir",
          body: "Inscribirse en Cámara no es una SAS. Contratar a alguien “por prestación de servicios” cuando hay subordinación es otro expediente. La sociedad y el contrato son dos cosas.",
          readLabel: "Corporativo",
          href: `${prefix}/servicios/corporativo`,
          whatsappHref: wa(
            "Hola Luque Law, leí la nota de Medellín sobre constituir o contratar y tengo una pregunta.",
          ),
        },
      ] satisfies CampaignFile[],
      read: "Leer",
      whatsapp: "WhatsApp",
      bookCta: "Agendar consulta",
      bookNote: "45 min / USD 55, por Google Meet. Luego el concepto jurídico escrito.",
      guideCta: "Guía de residencia fiscal",
      guideHref: `${prefix}/clkr/guides/tax-residency-in-colombia`,
      disclaimer:
        "Solo informativo. La ley colombiana cambia; confirma las reglas vigentes para tu caso.",
      social: [
        {
          title: "Visa y residencia fiscal",
          body: "En Medellín se confunden dos relojes. Migración Colombia mira la visa y los días de permanencia. La DIAN, si llegas a 183 días en un periodo de 365, mira el artículo 10 del Estatuto Tributario. Una no decide la otra. El texto del artículo está en luquelaw.co/es/clkr/norms/estatuto-tributario/libro-i/art-10",
        },
        {
          title: "El arriendo no es un lease",
          body: "El contrato de arrendamiento colombiano no es el lease que trajiste en la cabeza. Canon, depósito, restitución: eso se escribe. El grupo del barrio no es el contrato. Mapa: luquelaw.co/es/medellin",
        },
        {
          title: "Comprar sin el registro cambiario",
          body: "La promesa y la escritura no cierran el asunto si el dinero vino de afuera y no pasó por el canal que el Banco de la República pide. Tradición, gravámenes, y el registro de la inversión. Checklist: luquelaw.co/es/posts/property-due-diligence-medellin",
        },
        {
          title: "Cámara no es una SAS",
          body: "Inscribir un establecimiento en Cámara de Comercio no constituye una sociedad por acciones simplificada. Contratar “por prestación de servicios” cuando hay subordinación abre otro expediente. Si vas a operar acá, nombra el vehículo. luquelaw.co/es/medellin",
        },
      ],
    };
  }

  return {
    eyebrow: "Medellín",
    title: "You're already here. These are the five files Colombian law actually opens.",
    intro:
      "Visa, lease, purchase, tax residency, company. Not a welcome kit. A map of what we see once someone has landed.",
    lead: "We work from Medellín with people building a life or a business here. The first conversation is 45 minutes. Then a written legal concept (Concepto Jurídico) and a quotation within three business days.",
    filesLabel: "The five files",
    files: [
      {
        id: "visa",
        title: "Immigration status",
        body: "A visa and your days of stay are not the same as “I live here now.” Migración Colombia counts status. A lease does not replace it.",
        readLabel: "Immigration",
        href: `${prefix}/services/immigration`,
        whatsappHref: wa(
          "Hi Luque Law, I read the Medellín note on immigration status and have a question.",
        ),
      },
      {
        id: "tax",
        title: "Tax residency",
        body: "Article 10 of the Estatuto Tributario counts 183 days in any 365-day stretch. An M visa does not decide that by itself. The statute text is in Normas.",
        readLabel: "Article 10 ET",
        href: `${prefix}/clkr/norms/estatuto-tributario/libro-i/art-10`,
        whatsappHref: wa(
          "Hi Luque Law, I read the note on the 183-day rule and tax residency, and have a question.",
        ),
      },
      {
        id: "lease",
        title: "The lease",
        body: "It is not the common-law lease you brought in your head. Rent, deposit, restitution, and what happens if you leave early live in the Civil Code and in the contract — not in the neighborhood group.",
        readLabel: "Real estate",
        href: `${prefix}/services/real-estate`,
        whatsappHref: wa(
          "Hi Luque Law, I read the Medellín note on residential leases and have a question.",
        ),
      },
      {
        id: "buy",
        title: "Buying property",
        body: "Promise, transfer (tradición), the certificate of tradition and liens, and Banco de la República registration if the money came from abroad. The buyer checklist is on the blog.",
        readLabel: "Buyer checklist",
        href: `${prefix}/posts/property-due-diligence-medellin`,
        whatsappHref: wa(
          "Hi Luque Law, I read the Medellín note on buying property and have a question.",
        ),
      },
      {
        id: "company",
        title: "Hiring or incorporating",
        body: "A Chamber of Commerce registration is not a SAS. Paying someone “as a contractor” when there is subordination is a different file. The company and the labor relationship are two things.",
        readLabel: "Corporate",
        href: `${prefix}/services/corporate-law`,
        whatsappHref: wa(
          "Hi Luque Law, I read the Medellín note on hiring or incorporating and have a question.",
        ),
      },
    ] satisfies CampaignFile[],
    read: "Read",
    whatsapp: "WhatsApp",
    bookCta: "Book a consultation",
    bookNote: "45 min / USD 55, on Google Meet. Then the written Concepto Jurídico.",
    guideCta: "Tax residency guide",
    guideHref: `${prefix}/clkr/guides/tax-residency-in-colombia`,
    disclaimer:
      "Informational only. Colombian law changes; confirm the current rules for your case.",
    social: [
      {
        title: "Visa vs tax residency",
        body: "In Medellín people mix two clocks. Migración Colombia looks at the visa and the days of stay. DIAN, if you hit 183 days in a 365-day stretch, looks at article 10 of the Estatuto Tributario. One does not decide the other. The article: luquelaw.co/clkr/norms/estatuto-tributario/libro-i/art-10",
      },
      {
        title: "The lease is not a lease",
        body: "A Colombian residential lease is not the common-law lease you packed. Rent, deposit, restitution: that gets written down. The Facebook group is not the contract. Map: luquelaw.co/medellin",
      },
      {
        title: "Buying without the FX registration",
        body: "The promise and the deed do not close the file if the money came from abroad and never went through the channel Banco de la República asks for. Transfer, liens, and the investment registration. Checklist: luquelaw.co/posts/property-due-diligence-medellin",
      },
      {
        title: "Chamber is not a SAS",
        body: "Registering an establishment at the Chamber of Commerce does not create a simplified stock company. Paying someone “as a contractor” when there is subordination opens another file. If you are going to operate here, name the vehicle. luquelaw.co/medellin",
      },
    ],
  };
}
