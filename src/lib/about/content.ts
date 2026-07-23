export type AboutLocale = "en" | "es";

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photoSrc?: string;
  isFounder?: boolean;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  intro: string;
  body: string[];
  teamLabel: string;
  teamTitle: string;
  teamIntro: string;
  bookCta: string;
  openProfile: string;
  closeProfile: string;
  team: TeamMember[];
};

/** Shared bio used on Home and About founder card. Firm voice; concrete work. */
export const danielBioEn =
  "Attorney (UPB) and specialist in International Tax Management. For years we have guided foreigners through Colombian visas, property deals, company setup, and the paperwork that sits underneath — contracts in a language the client actually understands, filings with Migración Colombia, and the gap between common-law expectations and a civil-law system. Daniel leads the file; the team keeps the work moving.";

export const danielBioEs =
  "Abogado (UPB) y especialista en Gestión Tributaria Internacional. Desde hace años acompañamos a extranjeros en visas colombianas, compraventas, constitución de sociedades y el papeleo que viene debajo: contratos en un idioma que el cliente entiende, trámites ante Migración Colombia, y la distancia entre lo que espera quien viene del common law y lo que es un sistema de derecho continental. Daniel lidera el expediente; el equipo hace que el trabajo avance.";

export const aboutContent: Record<AboutLocale, AboutContent> = {
  en: {
    eyebrow: "About",
    title: "A Medellín firm for people building a life — or a business — in Colombia.",
    intro:
      "We are Luque Law: bilingual counsel for international clients who need to understand how this country actually works, not a brochure version of it.",
    body: [
      "Colombia is a civil-law country. That matters the day you buy property, sign a lease, hire someone, or file a visa — the documents, the guarantees, and the timelines are not the ones you grew up with. We start by mapping your facts, naming the real legal question, and writing it down so you can decide with your eyes open.",
      "Every matter begins the same way: a 45-minute consultation, then a written legal concept (Concepto Jurídico) and a quotation within three business days. After that, a scoped workplan — or an hourly retainer if the work is ongoing.",
      "We stay small on purpose. You know who is on your file. You know what comes next. If something is not worth paying for, we say so.",
    ],
    teamLabel: "Team",
    teamTitle: "Who you work with",
    teamIntro:
      "Founder-led counsel in Medellín, with associates and administrative support. Tap a profile to learn more.",
    bookCta: "Book a consultation",
    openProfile: "View profile",
    closeProfile: "Close",
    team: [
      {
        name: "Daniel Luque Restrepo",
        role: "Attorney · Founder",
        photoSrc: "/images/profile.png",
        isFounder: true,
        bio: danielBioEn,
      },
      {
        name: "Alina Restrepo",
        role: "Administrative Assistant",
        photoSrc: "/images/alina-restrepo.jpg",
        bio: "Alina runs intake, scheduling, and day-to-day operations so matters stay organized. She is often the first person you hear from, and she keeps communication clear from the first message through follow-up.",
      },
      {
        name: "Mateo Taborda",
        role: "Associate Attorney",
        photoSrc: "/images/mateo-taborda.jpg",
        bio: "Mateo handles research, drafting, and follow-through on core matters. He works with the founding attorney to keep filings, contracts, and procedural steps accurate and on schedule.",
      },
      {
        name: "Camilo Uribe",
        role: "Associate Attorney",
        photoSrc: "/images/camilo-uribe.jpg",
        bio: "Camilo works on legal analysis and client deliverables across our practice areas — structured workplans, clear written advice, and steady execution so international clients can move forward.",
      },
    ],
  },
  es: {
    eyebrow: "Nosotros",
    title: "Un despacho en Medellín para quien construye una vida — o un negocio — en Colombia.",
    intro:
      "Somos Luque Law: asesoría bilingüe para clientes internacionales que necesitan entender cómo funciona este país de verdad, no la versión de folleto.",
    body: [
      "Colombia es un país de derecho continental. Eso importa el día que compras un inmueble, firmas un arrendamiento, contratas a alguien o presentas una visa: los documentos, las garantías y los plazos no son los que traías de casa. Empezamos por ordenar los hechos, nombrar la pregunta jurídica real y dejarla por escrito para que decidas con los ojos abiertos.",
      "Todo encargo empieza igual: una consulta de 45 minutos y, dentro de tres días hábiles, un concepto jurídico escrito y una cotización. Después, un plan de trabajo acotado — o un retainer por hora si el asunto es continuo.",
      "Nos mantenemos pequeños a propósito. Sabes quién lleva tu expediente. Sabes qué sigue. Si algo no vale la pena pagarlo, lo decimos.",
    ],
    teamLabel: "Equipo",
    teamTitle: "Con quién trabajas",
    teamIntro:
      "Asesoría liderada por el fundador en Medellín, con abogados asociados y apoyo administrativo. Toca un perfil para conocer más.",
    bookCta: "Agendar consulta",
    openProfile: "Ver perfil",
    closeProfile: "Cerrar",
    team: [
      {
        name: "Daniel Luque Restrepo",
        role: "Abogado · Fundador",
        photoSrc: "/images/profile.png",
        isFounder: true,
        bio: danielBioEs,
      },
      {
        name: "Alina Restrepo",
        role: "Asistente administrativa",
        photoSrc: "/images/alina-restrepo.jpg",
        bio: "Alina coordina el intake, la agenda y la operación diaria para que los asuntos se mantengan ordenados. Suele ser la primera persona en responder, y mantiene la comunicación clara desde el primer mensaje hasta el seguimiento.",
      },
      {
        name: "Mateo Taborda",
        role: "Abogado asociado",
        photoSrc: "/images/mateo-taborda.jpg",
        bio: "Mateo se encarga de investigación, redacción y seguimiento en los asuntos centrales. Trabaja con el abogado fundador para mantener precisos y a tiempo memoriales, contratos y pasos procesales.",
      },
      {
        name: "Camilo Uribe",
        role: "Abogado asociado",
        photoSrc: "/images/camilo-uribe.jpg",
        bio: "Camilo trabaja en análisis jurídico y entregables al cliente en nuestras áreas de práctica: planes de trabajo claros, asesoría escrita y ejecución firme para que los clientes internacionales puedan avanzar.",
      },
    ],
  },
};
