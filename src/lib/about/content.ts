export type AboutLocale = "en" | "es";

export type TeamMember = {
  name: string;
  role: string;
  photoSrc?: string;
  isFounder?: boolean;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  intro: string;
  bioTitle: string;
  bio: string;
  teamLabel: string;
  teamTitle: string;
  teamIntro: string;
  bookCta: string;
  team: TeamMember[];
};

export const danielBioEn =
  "UPB graduate and specialist in International Tax Management. Daniel has advised and represented hundreds of foreign clients in real estate transactions, estate planning, immigration matters, business, and more. Through his network of allies, he delivers high-value legal counsel that is clear and easy to understand.";

export const danielBioEs =
  "Abogado egresado de la UPB y especialista en Gestión Tributaria Internacional. Daniel ha asesorado y representado a cientos de clientes extranjeros en transacciones inmobiliarias, planeación patrimonial, asuntos migratorios, negocios, entre otros. A través de su red de aliados, busca brindar asesoría legal de alto valor, clara y fácil de entender.";

export const aboutContent: Record<AboutLocale, AboutContent> = {
  en: {
    eyebrow: "About",
    title: "A bilingual firm built for international clients in Colombia.",
    intro:
      "Luque Law combines clear counsel with a small, trusted team — so you always know who is handling your matter.",
    bioTitle: "Daniel Luque Restrepo",
    bio: danielBioEn,
    teamLabel: "Team",
    teamTitle: "Who you work with",
    teamIntro:
      "Founder-led counsel backed by associates and administrative support in Medellín.",
    bookCta: "Book a consultation",
    team: [
      {
        name: "Daniel Luque Restrepo",
        role: "Attorney · Founder",
        photoSrc: "/images/profile.png",
        isFounder: true,
      },
      {
        name: "Alina Restrepo",
        role: "Administrative Assistant",
      },
      {
        name: "Mateo Taborda",
        role: "Associate Attorney",
      },
      {
        name: "Camilo Uribe",
        role: "Associate Attorney",
      },
    ],
  },
  es: {
    eyebrow: "Nosotros",
    title: "Un despacho bilingüe para clientes internacionales en Colombia.",
    intro:
      "Luque Law combina asesoría clara con un equipo pequeño y de confianza — para que siempre sepas quién lleva tu asunto.",
    bioTitle: "Daniel Luque Restrepo",
    bio: danielBioEs,
    teamLabel: "Equipo",
    teamTitle: "Con quién trabajas",
    teamIntro:
      "Asesoría liderada por el fundador, con abogados asociados y apoyo administrativo en Medellín.",
    bookCta: "Agendar consulta",
    team: [
      {
        name: "Daniel Luque Restrepo",
        role: "Abogado · Fundador",
        photoSrc: "/images/profile.png",
        isFounder: true,
      },
      {
        name: "Alina Restrepo",
        role: "Asistente administrativa",
      },
      {
        name: "Mateo Taborda",
        role: "Abogado asociado",
      },
      {
        name: "Camilo Uribe",
        role: "Abogado asociado",
      },
    ],
  },
};
