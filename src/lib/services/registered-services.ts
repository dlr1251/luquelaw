import { FIRM_WHATSAPP_E164 } from "@/lib/practice-areas/checklist-contact";
import type { ServiceAreaId, ServicesLocale } from "@/lib/services/content";

export type RegisteredServiceBrand = {
  /** Which brand mark to render. */
  mark: "sunday" | "h-legal";
  /** Logo image (for image-based marks like Sunday). */
  logoSrc?: string;
  logoAlt?: string;
  /** Card background + foreground. */
  background: string;
  foreground: string;
  /** Muted foreground on the branded background. */
  muted: string;
  /** Accent color (arc / stroke / links). */
  accent: string;
  /** Hairline/border color on the branded background. */
  border: string;
  /** Perk tile background. */
  tile: string;
  /** Primary button background + text. */
  buttonBg: string;
  buttonText: string;
};

export type RegisteredServiceContent = {
  areaId: ServiceAreaId;
  eyebrow: string;
  name: string;
  kicker: string;
  body: string;
  perks: string[];
  href: string;
  cta: string;
  whatsappHref: string;
  whatsappLabel: string;
  disclosure: string;
  brand: RegisteredServiceBrand;
};

function wa(text: string) {
  return `https://wa.me/${FIRM_WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}

// Sunday Properties palette: navy #1a2441, sky #2f8ac0, gold #f0a80d / #f5d15a.
const sundayBrand: RegisteredServiceBrand = {
  mark: "sunday",
  logoSrc: "/brand/sunday-properties-white.png",
  logoAlt: "Sunday Properties",
  background: "#1a2441",
  foreground: "#ffffff",
  muted: "rgb(255 255 255 / 0.72)",
  accent: "#f0a80d",
  border: "rgb(255 255 255 / 0.16)",
  tile: "rgb(255 255 255 / 0.06)",
  buttonBg: "#f0a80d",
  buttonText: "#1a2441",
};

// H Legal palette: ink #0D1117, red #E63946, blue #00A3FF, slate #64748B.
const hLegalBrand: RegisteredServiceBrand = {
  mark: "h-legal",
  logoAlt: "H Legal",
  background: "#0D1117",
  foreground: "#ffffff",
  muted: "rgb(255 255 255 / 0.68)",
  accent: "#E63946",
  border: "rgb(255 255 255 / 0.14)",
  tile: "rgb(255 255 255 / 0.05)",
  buttonBg: "#E63946",
  buttonText: "#ffffff",
};

const sundayEn: Omit<RegisteredServiceContent, "areaId"> = {
  eyebrow: "Registered service",
  name: "Sunday Properties",
  kicker: "Rent and sale, with the file on the table before you decide.",
  body: "Sunday Properties is our registered real-estate service. Lease or buy through the same app. The certificado de tradición (CLYT), tax clearances, and the contract you would actually sign sit in the listing before the visit. Identity is checked. Visits are paid and run under an NDA. Offers and counter-offers stay in the thread, with a chat to the owner and the assigned lawyer through closing or the lease.",
  perks: [
    "Lease and sale on one platform",
    "CLYT and tax clearances before the visit",
    "Paid visits under NDA, with identity checks",
    "Offers, counter-offers, and chat with owner + lawyer",
  ],
  href: "https://sundayproperties.co",
  cta: "Open Sunday Properties",
  whatsappHref: wa(
    "Hi Luque Law, I saw Sunday Properties on the real estate page and have a question.",
  ),
  whatsappLabel: "Ask about a listing",
  disclosure: "Registered real-estate service of Luque Law.",
  brand: sundayBrand,
};

const sundayEs: Omit<RegisteredServiceContent, "areaId"> = {
  eyebrow: "Servicio registrado",
  name: "Sunday Properties",
  kicker: "Arriendo y venta, con el expediente a la vista antes de decidir.",
  body: "Sunday Properties es nuestro servicio inmobiliario registrado. Arriendas o compras por la misma aplicación. El certificado de tradición (CLYT), los paz y salvos y el contrato que de verdad se firmaría están en el aviso antes de la visita. Se verifica identidad. Las visitas son pagas y van con NDA. Ofertas y contraofertas quedan en el hilo, con chat al propietario y al abogado asignado hasta el cierre o durante el arriendo.",
  perks: [
    "Arriendo y venta en la misma plataforma",
    "CLYT y paz y salvos antes de la visita",
    "Visitas pagas con NDA y verificación de identidad",
    "Ofertas, contraofertas y chat con propietario + abogado",
  ],
  href: "https://sundayproperties.co",
  cta: "Abrir Sunday Properties",
  whatsappHref: wa(
    "Hola Luque Law, vi Sunday Properties en la página de inmobiliario y tengo una pregunta.",
  ),
  whatsappLabel: "Preguntar por un inmueble",
  disclosure: "Servicio inmobiliario registrado de Luque Law.",
  brand: sundayBrand,
};

const hLegalEn: Omit<RegisteredServiceContent, "areaId"> = {
  eyebrow: "Commercial service",
  name: "H Legal",
  kicker:
    "Compliance for companies that operate in Colombia — born here or arrived from elsewhere.",
  body: "H Legal is our registered commercial service. National and international companies use it to keep legal obligations current: what the company must do, what counterparties owe, and the path when those duties are not met.",
  perks: [
    "Built for Colombian companies and foreign groups operating here",
    "What the company must comply with — and what counterparties owe",
    "A dedicated commercial desk; the same bilingual firm",
  ],
  href: "https://hlegal.co",
  cta: "Open H Legal",
  whatsappHref: wa(
    "Hi Luque Law, I saw H Legal on the commercial services page and have a question about compliance.",
  ),
  whatsappLabel: "Ask about compliance",
  disclosure: "Registered commercial service of Luque Law.",
  brand: hLegalBrand,
};

const hLegalEs: Omit<RegisteredServiceContent, "areaId"> = {
  eyebrow: "Servicio comercial",
  name: "H Legal",
  kicker:
    "Cumplimiento para empresas que operan en Colombia — nacidas aquí o llegadas de afuera.",
  body: "H Legal es nuestro servicio comercial registrado. Lo usan empresas nacionales e internacionales para tener al día las obligaciones: qué debe cumplir la compañía, qué le deben las contrapartes y qué vía queda cuando eso no ocurre.",
  perks: [
    "Para empresas colombianas y grupos extranjeros que operan aquí",
    "Qué debe cumplir la compañía — y qué le deben las contrapartes",
    "Mesa comercial propia; la misma firma bilingüe",
  ],
  href: "https://hlegal.co",
  cta: "Abrir H Legal",
  whatsappHref: wa(
    "Hola Luque Law, vi H Legal en la página de derecho comercial y tengo una pregunta sobre cumplimiento.",
  ),
  whatsappLabel: "Preguntar por cumplimiento",
  disclosure: "Servicio comercial registrado de Luque Law.",
  brand: hLegalBrand,
};

const catalog: Partial<
  Record<ServiceAreaId, Record<ServicesLocale, Omit<RegisteredServiceContent, "areaId">>>
> = {
  "real-estate": { en: sundayEn, es: sundayEs },
  "corporate-law": { en: hLegalEn, es: hLegalEs },
};

export function getRegisteredService(
  areaId: ServiceAreaId,
  locale: ServicesLocale,
): RegisteredServiceContent | undefined {
  const entry = catalog[areaId];
  if (!entry) return undefined;
  return { areaId, ...entry[locale] };
}
