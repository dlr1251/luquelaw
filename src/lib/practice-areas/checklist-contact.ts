import type { ImmigrationLocale } from "@/lib/practice-areas/paths";

export const FIRM_EMAIL = "daniel@luquelaw.co";
export const FIRM_WHATSAPP_DISPLAY = "+57 300 679 1123";
export const FIRM_WHATSAPP_E164 = "573006791123";
export const FIRM_SITE = "https://luquelaw.co";

export function visaChecklistWhatsappHref(
  locale: ImmigrationLocale,
  title: string,
): string {
  const text =
    locale === "es"
      ? `Hola Luque Law, estoy revisando la checklist de ${title} y tengo una pregunta.`
      : `Hi Luque Law, I was looking at the ${title} checklist and have a question.`;
  return `https://wa.me/${FIRM_WHATSAPP_E164}?text=${encodeURIComponent(text)}`;
}

export function visaChecklistMailto(title: string): string {
  return `mailto:${FIRM_EMAIL}?subject=${encodeURIComponent(`Checklist — ${title}`)}`;
}
