export type HomeLocale = "en" | "es";

export type HomeContent = {
  eyebrow: string;
  title: string;
  intro: string;
  bookCta: string;
  clkrCta: string;
  clkrHref: string;
  whatsappHref: string;
  practiceAreasLabel: string;
  practiceAreas: {
    icon: "immigration" | "realEstate" | "corporate" | "advisory";
    title: string;
    detail: string;
    href?: string;
  }[];
  credentialsLine: string;
  process: {
    label: string;
    title: string;
    body: string;
    engagementLabel: string;
    steps: { icon: "chat" | "doc" | "plan"; title: string; body: string }[];
    footer: string;
  };
  about: {
    title: string;
    body: string;
  };
  workWithMe: {
    label: string;
    title: string;
    body: string;
  };
  contactForm: {
    title: string;
    subtitle: string;
  };
  booking: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
};

const heroIntroEn =
  "Clear, bilingual guidance on visas, property, and business in Colombia.";

const heroIntroEs =
  "Orientación clara y bilingüe sobre visas, propiedad y negocios en Colombia.";

const bioEn =
  "UPB graduate and specialist in International Tax Management. Daniel has advised and represented hundreds of foreign clients in real estate transactions, estate planning, immigration matters, business, and more. Through his network of allies, he delivers high-value legal counsel that is clear and easy to understand.";

const bioEs =
  "Abogado egresado de la UPB y especialista en Gestión Tributaria Internacional. Daniel ha asesorado y representado a cientos de clientes extranjeros en transacciones inmobiliarias, planeación patrimonial, asuntos migratorios, negocios, entre otros. A través de su red de aliados, busca brindar asesoría legal de alto valor, clara y fácil de entender.";

const practiceAreasEn = [
  {
    icon: "immigration" as const,
    title: "Immigration Law",
    detail: "Permits, Visas, Citizenship.",
    href: "/immigration",
  },
  { icon: "realEstate" as const, title: "Real Estate", detail: "Purchase and Sales, Rents, HOA" },
  { icon: "corporate" as const, title: "Corporate", detail: "Incorporation, contracts, employee management." },
  { icon: "advisory" as const, title: "Legal Advisory", detail: "Private & Public Law" },
];

const practiceAreasEs = [
  {
    icon: "immigration" as const,
    title: "Derecho migratorio",
    detail: "Permisos, visas, nacionalidad.",
    href: "/es/migracion",
  },
  { icon: "realEstate" as const, title: "Inmobiliario", detail: "Compraventa, arrendamientos, propiedad horizontal." },
  { icon: "corporate" as const, title: "Corporativo", detail: "Constitución de sociedades, contratos, gestión de empleados." },
  { icon: "advisory" as const, title: "Asesoría legal", detail: "Derecho privado y público." },
];

export const homeContent: Record<HomeLocale, HomeContent> = {
  en: {
    eyebrow: "Immigration · Real Estate · Corporate",
    title: "Legal Counsel for international clients in Colombia.",
    intro: heroIntroEn,
    bookCta: "Book a consultation",
    clkrCta: "Explore CLKR",
    clkrHref: "/clkr",
    whatsappHref:
      "https://wa.me/573006791123?text=Hi%20Daniel%2C%20I%20was%20just%20visiting%20your%20website%20and%20want%20to%20ask%20you%20something...",
    practiceAreasLabel: "Practice areas",
    practiceAreas: practiceAreasEn,
    credentialsLine: "Daniel Luque Restrepo · attorney · Medellín, Colombia",
    process: {
      label: "Process",
      title: "How it works",
      body: "Every engagement starts with a structured consultation, followed by a written legal concept and a clear workplan — so you know exactly what you need before committing.",
      engagementLabel: "Engagement model",
      steps: [
        {
          icon: "chat",
          title: "Initial consultation",
          body: "1 hour to map the facts, identify risks, and define the legal question.",
        },
        {
          icon: "doc",
          title: "Written concept + quotation",
          body: "You receive a written legal concept (Concepto Jurídico) and a formal quotation within 3 business days.",
        },
        {
          icon: "plan",
          title: "Workplan execution (or retainer)",
          body: "Proceed with a scoped workplan, or switch to an hourly retainer for ongoing matters.",
        },
      ],
      footer: "Deliverables within 3 business days after the consultation.",
    },
    about: {
      title: "Counsel built for international clients operating in Colombia.",
      body: bioEn,
    },
    workWithMe: {
      label: "Work with me",
      title: "How it works",
      body: "Every engagement starts with a structured consultation, followed by a written legal concept and a clear workplan — so you know exactly what you need before committing.",
    },
    contactForm: {
      title: "Send a message",
      subtitle: "I'll respond as soon as possible. For urgent matters, use WhatsApp below.",
    },
    booking: {
      eyebrow: "Schedule",
      title: "Book a consultation",
      subtitle:
        "Choose a time for a one-hour initial consultation. You'll receive a written legal concept and quotation within 3 business days.",
    },
  },
  es: {
    eyebrow: "Inmigración · Inmobiliario · Corporativo",
    title: "Asesoría legal para clientes internacionales en Colombia.",
    intro: heroIntroEs,
    bookCta: "Agendar consulta",
    clkrCta: "Explorar CLKR",
    clkrHref: "/es/clkr",
    whatsappHref:
      "https://wa.me/573006791123?text=Hola%20Daniel%2C%20acabo%20de%20visitar%20tu%20sitio%20web%20y%20quiero%20preguntarte%20algo...",
    practiceAreasLabel: "Áreas de práctica",
    practiceAreas: practiceAreasEs,
    credentialsLine: "Daniel Luque Restrepo · attorney · Medellín, Colombia",
    process: {
      label: "Proceso",
      title: "Cómo funciona",
      body: "Cada encargo comienza con una consulta estructurada, seguida de un concepto jurídico escrito y un plan de trabajo claro — para que sepas exactamente qué necesitas antes de comprometerte.",
      engagementLabel: "Modelo de trabajo",
      steps: [
        {
          icon: "chat",
          title: "Consulta inicial",
          body: "1 hora para ordenar hechos, identificar riesgos y definir la pregunta jurídica.",
        },
        {
          icon: "doc",
          title: "Concepto + cotización",
          body: "Recibes un concepto jurídico escrito y una cotización formal dentro de 3 días hábiles.",
        },
        {
          icon: "plan",
          title: "Ejecución (o retainer)",
          body: "Avanzamos con un plan acotado, o pasamos a retainer por hora para asuntos continuos.",
        },
      ],
      footer: "Entrega dentro de 3 días hábiles después de la consulta.",
    },
    about: {
      title: "Asesoría pensada para clientes internacionales en Colombia.",
      body: bioEs,
    },
    workWithMe: {
      label: "Trabajar conmigo",
      title: "Cómo funciona",
      body: "Cada encargo comienza con una consulta estructurada, seguida de un concepto jurídico escrito y un plan de trabajo claro — para que sepas exactamente qué necesitas antes de comprometerte.",
    },
    contactForm: {
      title: "Enviar un mensaje",
      subtitle: "Responderé lo antes posible. Para asuntos urgentes, usa WhatsApp abajo.",
    },
    booking: {
      eyebrow: "Agenda",
      title: "Agendar consulta",
      subtitle:
        "Elige un horario para la consulta inicial de una hora. Recibirás un concepto jurídico escrito y una cotización dentro de 3 días hábiles.",
    },
  },
};
