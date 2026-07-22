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

export const danielBioEn =
  "UPB graduate and specialist in International Tax Management. Daniel has advised and represented hundreds of foreign clients in real estate transactions, estate planning, immigration matters, business, and more. Through his network of allies, he delivers high-value legal counsel that is clear and easy to understand.";

export const danielBioEs =
  "Abogado egresado de la UPB y especialista en Gestión Tributaria Internacional. Daniel ha asesorado y representado a cientos de clientes extranjeros en transacciones inmobiliarias, planeación patrimonial, asuntos migratorios, negocios, entre otros. A través de su red de aliados, busca brindar asesoría legal de alto valor, clara y fácil de entender.";

export const aboutContent: Record<AboutLocale, AboutContent> = {
  en: {
    eyebrow: "About",
    title: "A boutique firm for international clients in Colombia.",
    intro:
      "Based in Medellín, Luque Law is built for people and businesses who need clear, bilingual counsel with a strategic edge — not a one-size-fits-all practice.",
    body: [
      "We focus on high-quality legal work and practical strategy: every engagement starts with understanding your goals, mapping the legal path, and explaining options in plain language so you can decide with confidence.",
      "As a small boutique team, we stay close to the matter. You know who is handling your file, how the work is sequenced, and what to expect at each step — from immigration and real estate to corporate and tax orientation.",
      "Whether you are relocating, investing, or structuring a cross-border project, we combine local execution in Colombia with an international client mindset.",
    ],
    teamLabel: "Team",
    teamTitle: "Who you work with",
    teamIntro:
      "A focused Medellín team — founder-led counsel with associates and administrative support. Tap a profile to learn more.",
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
        bio: "Alina coordinates client intake, scheduling, and day-to-day firm operations so matters stay organized and responsive. She is often the first point of contact and helps keep communication clear from the first message through follow-up.",
      },
      {
        name: "Mateo Taborda",
        role: "Associate Attorney",
        photoSrc: "/images/mateo-taborda.jpg",
        bio: "Mateo supports clients across core practice matters with careful research, drafting, and case follow-through. He works closely with the founding attorney to keep filings, contracts, and procedural steps accurate and on schedule.",
      },
      {
        name: "Camilo Uribe",
        role: "Associate Attorney",
        photoSrc: "/images/camilo-uribe.jpg",
        bio: "Camilo assists with legal analysis and client deliverables across the firm’s practice areas. He focuses on structured workplans, clear written advice, and reliable execution so international clients can move forward with confidence.",
      },
    ],
  },
  es: {
    eyebrow: "Nosotros",
    title: "Un despacho boutique para clientes internacionales en Colombia.",
    intro:
      "Con sede en Medellín, Luque Law está pensado para personas y empresas que necesitan asesoría bilingüe, clara y con enfoque estratégico — no una práctica genérica.",
    body: [
      "Apostamos por trabajo jurídico de alta calidad y estrategia práctica: cada encargo empieza por entender tus objetivos, trazar la ruta legal y explicar las opciones en lenguaje sencillo para que decidas con seguridad.",
      "Como equipo boutique y compacto, nos mantenemos cerca del asunto. Sabes quién lleva tu caso, cómo se ordena el trabajo y qué esperar en cada etapa — desde migración e inmobiliario hasta corporate y orientación tributaria.",
      "Ya sea que te estés mudando, invirtiendo o estructurando un proyecto transfronterizo, combinamos ejecución local en Colombia con una mentalidad de cliente internacional.",
    ],
    teamLabel: "Equipo",
    teamTitle: "Con quién trabajas",
    teamIntro:
      "Un equipo enfocado en Medellín — asesoría liderada por el fundador, con abogados asociados y apoyo administrativo. Toca un perfil para conocer más.",
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
        bio: "Alina coordina el intake de clientes, la agenda y la operación diaria del despacho para que los asuntos se mantengan organizados y con respuesta ágil. Suele ser el primer punto de contacto y ayuda a que la comunicación sea clara desde el primer mensaje hasta el seguimiento.",
      },
      {
        name: "Mateo Taborda",
        role: "Abogado asociado",
        photoSrc: "/images/mateo-taborda.jpg",
        bio: "Mateo acompaña a los clientes en los asuntos centrales del despacho con investigación cuidadosa, redacción y seguimiento del caso. Trabaja de cerca con el abogado fundador para mantener precisos y a tiempo memoriales, contratos y pasos procesales.",
      },
      {
        name: "Camilo Uribe",
        role: "Abogado asociado",
        photoSrc: "/images/camilo-uribe.jpg",
        bio: "Camilo apoya el análisis jurídico y los entregables al cliente en las áreas de práctica del despacho. Se enfoca en planes de trabajo estructurados, asesoría escrita clara y ejecución confiable para que los clientes internacionales avancen con seguridad.",
      },
    ],
  },
};
