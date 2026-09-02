import { danielBioEn, danielBioEs } from "@/lib/about/content";

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
    icon:
      | "immigration"
      | "labour"
      | "realEstate"
      | "family"
      | "corporate"
      | "taxes";
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
  reading: {
    eyebrow: string;
    title: string;
    body: string;
    clkrLabel: string;
    clkrAll: string;
    blogLabel: string;
    blogAll: string;
    readLabel: string;
  };
};

const heroIntroEn =
  "Visas, property, and business in Colombia — explained in English and Spanish.";

const heroIntroEs =
  "Visas, propiedad y negocios en Colombia: en español y en inglés.";

const practiceAreasEn = [
  {
    icon: "immigration" as const,
    title: "Immigration Law",
    detail: "Visa strategy, stay compliance, nationality.",
    href: "/services/immigration",
  },
  {
    icon: "realEstate" as const,
    title: "Real Estate Law",
    detail: "Purchase, sale, leases, propiedad horizontal.",
    href: "/services/real-estate",
  },
  {
    icon: "corporate" as const,
    title: "Commercial and Company Law",
    detail: "Company setup, contracts, governance.",
    href: "/services/corporate-law",
  },
  {
    icon: "taxes" as const,
    title: "Tax and Foreign Exchange Law",
    detail: "Tax residency and cross-border orientation.",
    href: "/services/taxes",
  },
  {
    icon: "family" as const,
    title: "Civil and Family Law",
    detail: "Marriage, divorce, custody across borders.",
    href: "/services/family-law",
  },
  {
    icon: "labour" as const,
    title: "Labour Law",
    detail: "Hiring, contracts, terminations, HR risk.",
    href: "/services/labour-law",
  },
];

const practiceAreasEs = [
  {
    icon: "immigration" as const,
    title: "Derecho migratorio",
    detail: "Estrategia de visa, permanencia, nacionalidad.",
    href: "/es/servicios/migracion",
  },
  {
    icon: "realEstate" as const,
    title: "Derecho inmobiliario",
    detail: "Compraventa, arrendamientos, propiedad horizontal.",
    href: "/es/servicios/inmobiliario",
  },
  {
    icon: "corporate" as const,
    title: "Derecho comercial y de la empresa",
    detail: "Constitución, contratos, gobierno societario.",
    href: "/es/servicios/corporativo",
  },
  {
    icon: "taxes" as const,
    title: "Derecho tributario y cambiario",
    detail: "Residencia fiscal y orientación transfronteriza.",
    href: "/es/servicios/impuestos",
  },
  {
    icon: "family" as const,
    title: "Derecho civil y de familia",
    detail: "Matrimonio, divorcio, custodia transfronteriza.",
    href: "/es/servicios/familia",
  },
  {
    icon: "labour" as const,
    title: "Derecho laboral",
    detail: "Contratación, contratos, terminaciones, riesgo laboral.",
    href: "/es/servicios/laboral",
  },
];

export const homeContent: Record<HomeLocale, HomeContent> = {
  en: {
    eyebrow: "Immigration · Real Estate · Corporate",
    title: "Colombian Law for international clients.",
    intro: heroIntroEn,
    bookCta: "Book a consultation",
    clkrCta: "Explore CLKR",
    clkrHref: "/clkr",
    whatsappHref:
      "https://wa.me/573006791123?text=Hi%20Luque%20Law%2C%20I%20was%20visiting%20your%20website%20and%20have%20a%20question...",
    practiceAreasLabel: "Practice areas",
    practiceAreas: practiceAreasEn,
    credentialsLine: "Luque Law · Medellín, Colombia",
    process: {
      label: "Process",
      title: "How it works",
      body: "You get a clear question, a written answer, and a price — before you commit to ongoing work.",
      engagementLabel: "Engagement model",
      steps: [
        {
          icon: "chat",
          title: "Initial consultation",
          body: "45 minutes to map the facts, name the risks, and define the legal question.",
        },
        {
          icon: "doc",
          title: "Written concept + quotation",
          body: "A written legal concept (Concepto Jurídico) and a formal quotation within 3 business days.",
        },
        {
          icon: "plan",
          title: "Workplan (or retainer)",
          body: "A scoped workplan — or an hourly retainer if the matter keeps running.",
        },
      ],
      footer: "Deliverables within 3 business days after the consultation.",
    },
    about: {
      title: "We work where two legal cultures meet.",
      body: danielBioEn,
    },
    workWithMe: {
      label: "Work with us",
      title: "How it works",
      body: "You get a clear question, a written answer, and a price — before you commit to ongoing work.",
    },
    contactForm: {
      title: "Send a message",
      subtitle: "We’ll get back to you as soon as we can.",
    },
    reading: {
      eyebrow: "Reading",
      title: "CLKR guides and blog notes",
      body: "Longer guides on the rule. Shorter posts when the facts on the ground move.",
      clkrLabel: "CLKR",
      clkrAll: "All guides",
      blogLabel: "Blog",
      blogAll: "All posts",
      readLabel: "Read",
    },
  },
  es: {
    eyebrow: "Inmigración · Inmobiliario · Corporativo",
    title: "Derecho colombiano para clientes internacionales.",
    intro: heroIntroEs,
    bookCta: "Agendar consulta",
    clkrCta: "Explorar CLKR",
    clkrHref: "/es/clkr",
    whatsappHref:
      "https://wa.me/573006791123?text=Hola%20Luque%20Law%2C%20estuve%20en%20su%20sitio%20web%20y%20tengo%20una%20pregunta...",
    practiceAreasLabel: "Áreas de práctica",
    practiceAreas: practiceAreasEs,
    credentialsLine: "Luque Law · Medellín, Colombia",
    process: {
      label: "Proceso",
      title: "Cómo funciona",
      body: "Una pregunta clara, una respuesta escrita y un precio — antes de comprometerte con trabajo continuo.",
      engagementLabel: "Modelo de trabajo",
      steps: [
        {
          icon: "chat",
          title: "Consulta inicial",
          body: "45 minutos para ordenar hechos, nombrar riesgos y definir la pregunta jurídica.",
        },
        {
          icon: "doc",
          title: "Concepto + cotización",
          body: "Un concepto jurídico escrito y una cotización formal dentro de 3 días hábiles.",
        },
        {
          icon: "plan",
          title: "Plan de trabajo (o retainer)",
          body: "Un plan acotado — o retainer por hora si el asunto sigue abierto.",
        },
      ],
      footer: "Entrega dentro de 3 días hábiles después de la consulta.",
    },
    about: {
      title: "Trabajamos donde se cruzan dos culturas jurídicas.",
      body: danielBioEs,
    },
    workWithMe: {
      label: "Trabajar con nosotros",
      title: "Cómo funciona",
      body: "Una pregunta clara, una respuesta escrita y un precio — antes de comprometerte con trabajo continuo.",
    },
    contactForm: {
      title: "Enviar un mensaje",
      subtitle: "Te respondemos lo antes posible.",
    },
    reading: {
      eyebrow: "Lectura",
      title: "Guías CLKR y notas del blog",
      body: "Guías más largas sobre la norma. Textos más cortos cuando cambia lo que se ve en la práctica.",
      clkrLabel: "CLKR",
      clkrAll: "Todas las guías",
      blogLabel: "Blog",
      blogAll: "Todos los artículos",
      readLabel: "Leer",
    },
  },
};
