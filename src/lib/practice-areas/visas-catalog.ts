import { clkrPublicPath } from "@/lib/clkr/types";
import { normPublicPath } from "@/lib/norms/types";

import type { ImmigrationLocale } from "./paths";
import { immigrationPath } from "./paths";

export type VisaCategory = "V" | "M" | "R";

export type VisaCatalogEntry = {
  slug: string;
  category: VisaCategory;
  articleNum: number;
  name: Record<ImmigrationLocale, string>;
  summary: Record<ImmigrationLocale, string>;
  whoFor: Record<ImmigrationLocale, string>;
  keyRequirements: Record<ImmigrationLocale, string[]>;
  durationNotes: Record<ImmigrationLocale, string>;
  workPermit: boolean | string;
  beneficiaries: string;
  relatedGuideSlug: string | null;
};

export const VISAS_CATALOG: VisaCatalogEntry[] = [
  {
    "slug": "transito-aeroportuario",
    "category": "V",
    "articleNum": 33,
    "name": {
      "en": "V Visa — Tránsito Aeroportuario",
      "es": "Visa V Tránsito Aeroportuario"
    },
    "summary": {
      "en": "Under Resolución 5477: Para extranjeros de nacionalidades establecidas mediante Resolución que aspiren a realizar tránsito directo en alguno de los aeropuertos del territorio nacional y con destino a un tercer Estado. La permanencia autorizada en el aeropuerto será de máximo veinticuatro (24) horas, restringida estrictamente a zonas estériles o de tránsito directo en un solo aeropuerto con operación internacional. La llegada y la permanenc",
      "es": "Para extranjeros de nacionalidades establecidas mediante Resolución que aspiren a realizar tránsito directo en alguno de los aeropuertos del territorio nacional y con destino a un tercer Estado. La permanencia autorizada en el aeropuerto será de máximo veinticuatro (24) horas, restringida estrictamente a zonas estériles o de tránsito directo en un solo aeropuerto con operación internacional. La llegada y la permanenc"
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "turismo",
    "category": "V",
    "articleNum": 34,
    "name": {
      "en": "V Visa — Tourism",
      "es": "Visa V Turismo"
    },
    "summary": {
      "en": "For leisure, tourism, or cultural interest only. Often used when a short-stay exemption does not cover the planned stay length.",
      "es": "Exclusivamente para ocio, turismo o interés cultural. Útil cuando la exención de corta estancia no cubre la permanencia planeada."
    },
    "whoFor": {
      "en": "Visitors whose nationality requires a tourism visa, or exempt nationals needing a longer documented stay.",
      "es": "Visitantes cuya nacionalidad exige visa de turismo, o nacionales exentos que necesitan una permanencia documentada más larga."
    },
    "keyRequirements": {
      "en": [
        "General visitor requirements (art. 31)",
        "Proof of purpose and means for the stay"
      ],
      "es": [
        "Requisitos generales de visitante (art. 31)",
        "Prueba del propósito y medios para la permanencia"
      ]
    },
    "durationNotes": {
      "en": "Subject to Cancillería authorization; tourism days under a permit are tracked separately from visa stays.",
      "es": "Sujeto a autorización de Cancillería; los días de turismo bajo permiso se contabilizan aparte de la permanencia con visa."
    },
    "workPermit": false,
    "beneficiaries": "Usually not for dependents as primary purpose.",
    "relatedGuideSlug": "last-legal-day"
  },
  {
    "slug": "negocios",
    "category": "V",
    "articleNum": 35,
    "name": {
      "en": "V Visa — Business",
      "es": "Visa V Negocios"
    },
    "summary": {
      "en": "For business dealings, market studies, investment planning, company formation, negotiation, contracts, or commercial representation.",
      "es": "Para gestiones de negocios, estudios de mercado, planes de inversión, constitución de sociedad, negociación, contratos o representación comercial."
    },
    "whoFor": {
      "en": "Foreign nationals needing business stay beyond short-visit exemptions.",
      "es": "Extranjeros que necesitan permanencia de negocios más allá de las exenciones de corta visita."
    },
    "keyRequirements": {
      "en": [
        "Purpose and sponsor documentation",
        "General/corporate support as applicable"
      ],
      "es": [
        "Documentación de propósito y respaldo",
        "Soporte general/corporativo según aplique"
      ]
    },
    "durationNotes": {
      "en": "Duration set by Cancillería for the specific filing.",
      "es": "Duración fijada por Cancillería según el expediente."
    },
    "workPermit": false,
    "beneficiaries": "Case-specific; check category rules.",
    "relatedGuideSlug": null
  },
  {
    "slug": "estudiante",
    "category": "V",
    "articleNum": 36,
    "name": {
      "en": "V Visa — Student",
      "es": "Visa V Estudiante"
    },
    "summary": {
      "en": "For in-person, virtual, or distance studies (arts/trade, K–12, higher education), student practice, or academic exchange under higher-education agreements.",
      "es": "Para estudios presenciales, virtuales o a distancia, prácticas estudiantiles o intercambio académico por convenio entre instituciones de educación superior."
    },
    "whoFor": {
      "en": "Foreign students enrolled in recognized Colombian programs.",
      "es": "Estudiantes extranjeros matriculados en programas reconocidos en Colombia."
    },
    "keyRequirements": {
      "en": [
        "Admission/enrollment proof",
        "Means of support"
      ],
      "es": [
        "Prueba de admisión/matrícula",
        "Medios de sustentación"
      ]
    },
    "durationNotes": {
      "en": "Typically aligned to the academic program period authorized.",
      "es": "Generalmente alineada al periodo del programa académico autorizado."
    },
    "workPermit": "Limited — verify student work rules for the category.",
    "beneficiaries": "May allow certain dependents subject to category rules.",
    "relatedGuideSlug": null
  },
  {
    "slug": "tratamiento-medico",
    "category": "V",
    "articleNum": 37,
    "name": {
      "en": "V Visa — Tratamiento médico",
      "es": "Visa V Tratamiento médico"
    },
    "summary": {
      "en": "Under Resolución 5477: Para asistir en calidad de paciente o de acompañante de este a consulta, intervención o tratamiento médico y odontológico. Esta visa será otorgada para tratamientos específicos, priorizando aquellos de duración concreta, que hagan parte de la oferta exportable de servicios médicos para extranjeros.",
      "es": "Para asistir en calidad de paciente o de acompañante de este a consulta, intervención o tratamiento médico y odontológico. Esta visa será otorgada para tratamientos específicos, priorizando aquellos de duración concreta, que hagan parte de la oferta exportable de servicios médicos para extranjeros."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "tramites-administrativos-y-o-judiciales",
    "category": "V",
    "articleNum": 38,
    "name": {
      "en": "V Visa — Trámites administrativos y/o judiciales",
      "es": "Visa V Trámites administrativos y/o judiciales"
    },
    "summary": {
      "en": "Under Resolución 5477: Para adelantar trámites de carácter administrativo o judicial ante entidades o autoridades en Colombia.",
      "es": "Para adelantar trámites de carácter administrativo o judicial ante entidades o autoridades en Colombia."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "tripulante",
    "category": "V",
    "articleNum": 39,
    "name": {
      "en": "V Visa — Tripulante",
      "es": "Visa V Tripulante"
    },
    "summary": {
      "en": "Under Resolución 5477: Para trabajar en aguas jurisdiccionales colombianas como tripulante de embarcación, draga o en plataforma costa afuera.",
      "es": "Para trabajar en aguas jurisdiccionales colombianas como tripulante de embarcación, draga o en plataforma costa afuera."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "trabajador-agricola-de-temporada",
    "category": "V",
    "articleNum": 40,
    "name": {
      "en": "V Visa — Trabajador agrícola de temporada",
      "es": "Visa V Trabajador agrícola de temporada"
    },
    "summary": {
      "en": "Under Resolución 5477: Para desarrollar labores agrícolas de temporada bajo programas establecidos por el Ministerio de Agricultura y Desarrollo Rural, o las Gobernaciones en concertación con el sector agrícola, el Ministerio del Trabajo y el Ministerio de Salud y Protección Social, en los que se señalarán los cupos estimados disponibles y las labores en las que se requiere apoyo de mano de obra.",
      "es": "Para desarrollar labores agrícolas de temporada bajo programas establecidos por el Ministerio de Agricultura y Desarrollo Rural, o las Gobernaciones en concertación con el sector agrícola, el Ministerio del Trabajo y el Ministerio de Salud y Protección Social, en los que se señalarán los cupos estimados disponibles y las labores en las que se requiere apoyo de mano de obra."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "eventos",
    "category": "V",
    "articleNum": 41,
    "name": {
      "en": "V Visa — Eventos",
      "es": "Visa V Eventos"
    },
    "summary": {
      "en": "Under Resolución 5477: Para asistir a convenciones y actividades empresariales, culturales o académicas como conferencista, expositor, participante, artista, deportista, jurado, concursante, organizador o personal logístico. No permite trabajar en el territorio colombiano. Los portadores de pasaporte de países o territorios exentos de visa, determinados mediante Resolución, estarán exentos del trámite de este tipo de visa siempre que su pe",
      "es": "Para asistir a convenciones y actividades empresariales, culturales o académicas como conferencista, expositor, participante, artista, deportista, jurado, concursante, organizador o personal logístico. No permite trabajar en el territorio colombiano. Los portadores de pasaporte de países o territorios exentos de visa, determinados mediante Resolución, estarán exentos del trámite de este tipo de visa siempre que su pe"
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "religioso",
    "category": "V",
    "articleNum": 42,
    "name": {
      "en": "V Visa — Religioso",
      "es": "Visa V Religioso"
    },
    "summary": {
      "en": "Under Resolución 5477: Para trabajar en el ejercicio del ministerio religioso o para ejercer como misionero de una entidad religiosa, debidamente reconocida por el Estado colombiano.",
      "es": "Para trabajar en el ejercicio del ministerio religioso o para ejercer como misionero de una entidad religiosa, debidamente reconocida por el Estado colombiano."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "para-estudiantes-voluntarios-entidades-religiosas",
    "category": "V",
    "articleNum": 43,
    "name": {
      "en": "V Visa — para estudiantes/voluntarios entidades religiosas",
      "es": "Visa V para estudiantes/voluntarios entidades religiosas"
    },
    "summary": {
      "en": "Under Resolución 5477: Para ingresar y permanecer en el país como voluntario o estudiante en formación religiosa o para llevar a cabo estudios teológicos en instituto u organización de una iglesia o confesión religiosa, debidamente reconocida por el Estado colombiano.",
      "es": "Para ingresar y permanecer en el país como voluntario o estudiante en formación religiosa o para llevar a cabo estudios teológicos en instituto u organización de una iglesia o confesión religiosa, debidamente reconocida por el Estado colombiano."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "voluntario-o-cooperante",
    "category": "V",
    "articleNum": 44,
    "name": {
      "en": "V Visa — Voluntario o Cooperante",
      "es": "Visa V Voluntario o Cooperante"
    },
    "summary": {
      "en": "Under Resolución 5477: Para realizar voluntariado de carácter social o de cooperación para el desarrollo.",
      "es": "Para realizar voluntariado de carácter social o de cooperación para el desarrollo."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "produccion-cinematografica-o-audiovisual",
    "category": "V",
    "articleNum": 45,
    "name": {
      "en": "V Visa — Producción cinematográfica o audiovisual",
      "es": "Visa V Producción cinematográfica o audiovisual"
    },
    "summary": {
      "en": "Under Resolución 5477: Para participar en producciones cinematográficas o documentales de gran formato.",
      "es": "Para participar en producciones cinematográficas o documentales de gran formato."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "nomadas-digitales",
    "category": "V",
    "articleNum": 46,
    "name": {
      "en": "V Visa — Digital nomads",
      "es": "Visa V Nómadas digitales"
    },
    "summary": {
      "en": "For remote work/telework from Colombia exclusively for foreign companies, or to start a digital/tech venture of interest to Colombia.",
      "es": "Para trabajo remoto o teletrabajo desde Colombia exclusivamente para empresas extranjeras, o para iniciar un emprendimiento digital/tecnológico de interés para el país."
    },
    "whoFor": {
      "en": "Passport holders from short-stay visa-exempt countries/territories meeting income and activity rules.",
      "es": "Titulares de pasaporte de países/territorios exentos de visa de corta estancia que cumplan reglas de ingresos y actividad."
    },
    "keyRequirements": {
      "en": [
        "Exempt short-stay passport",
        "Proof of remote employment or digital venture",
        "Income thresholds as required"
      ],
      "es": [
        "Pasaporte de país exento de corta estancia",
        "Prueba de empleo remoto o emprendimiento digital",
        "Umbrales de ingresos exigidos"
      ]
    },
    "durationNotes": {
      "en": "Often up to multi-year authorization subject to Cancillería.",
      "es": "Con frecuencia autorización plurianual sujeta a Cancillería."
    },
    "workPermit": "Remote work for foreign employers / digital venture as defined — not local employment by default.",
    "beneficiaries": "Check category for dependents.",
    "relatedGuideSlug": null
  },
  {
    "slug": "cubrimiento-periodistico",
    "category": "V",
    "articleNum": 47,
    "name": {
      "en": "V Visa — Cubrimiento periodístico",
      "es": "Visa V Cubrimiento periodístico"
    },
    "summary": {
      "en": "Under Resolución 5477: Para efectuar cubrimiento periodístico de corta duración en el país.",
      "es": "Para efectuar cubrimiento periodístico de corta duración en el país."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "corresponsal-permanente",
    "category": "V",
    "articleNum": 48,
    "name": {
      "en": "V Visa — Corresponsal permanente",
      "es": "Visa V Corresponsal permanente"
    },
    "summary": {
      "en": "Under Resolución 5477: Para desempeñarse en Colombia como corresponsal de prensa permanente de un medio extranjero.",
      "es": "Para desempeñarse en Colombia como corresponsal de prensa permanente de un medio extranjero."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "asistencia-tecnica",
    "category": "V",
    "articleNum": 49,
    "name": {
      "en": "V Visa — Asistencia Técnica",
      "es": "Visa V Asistencia Técnica"
    },
    "summary": {
      "en": "Under Resolución 5477: Para prestar asistencia técnica a persona jurídica en Colombia.",
      "es": "Para prestar asistencia técnica a persona jurídica en Colombia."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "empresarios-tlc",
    "category": "V",
    "articleNum": 50,
    "name": {
      "en": "V Visa — Empresarios TLC",
      "es": "Visa V Empresarios TLC"
    },
    "summary": {
      "en": "Under Resolución 5477: Para facilitar la movilidad de empresarios o personas de negocios, en aplicación de compromisos adquiridos por Colombia en el marco de Tratados de Libre Comercio suscritos y en vigor con otros Estados.",
      "es": "Para facilitar la movilidad de empresarios o personas de negocios, en aplicación de compromisos adquiridos por Colombia en el marco de Tratados de Libre Comercio suscritos y en vigor con otros Estados."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "oficiales-no-acreditados",
    "category": "V",
    "articleNum": 51,
    "name": {
      "en": "V Visa — Oficiales no acreditados",
      "es": "Visa V Oficiales no acreditados"
    },
    "summary": {
      "en": "Under Resolución 5477: Para desempeñarse como oficial representante comercial de gobierno de Estado o territorio extranjero, o de agencia gubernamental especializada, en misión que no implique acreditación ante el Ministerio de Relaciones Exteriores.",
      "es": "Para desempeñarse como oficial representante comercial de gobierno de Estado o territorio extranjero, o de agencia gubernamental especializada, en misión que no implique acreditación ante el Ministerio de Relaciones Exteriores."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "vacaciones-y-trabajo",
    "category": "V",
    "articleNum": 52,
    "name": {
      "en": "V Visa — Vacaciones y Trabajo",
      "es": "Visa V Vacaciones y Trabajo"
    },
    "summary": {
      "en": "Under Resolución 5477: Para visitar el territorio nacional bajo Acuerdos de Vacaciones y Trabajo suscritos por Colombia que se encuentren vigentes.",
      "es": "Para visitar el territorio nacional bajo Acuerdos de Vacaciones y Trabajo suscritos por Colombia que se encuentren vigentes."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "practica-laboral",
    "category": "V",
    "articleNum": 53,
    "name": {
      "en": "V Visa — Práctica laboral",
      "es": "Visa V Práctica laboral"
    },
    "summary": {
      "en": "Under Resolución 5477: Para actividades de práctica laboral en empresas establecidas en Colombia. Destinatarios: Titulares de nacionalidades exentas de visa para corta estancia, establecidas mediante Resolución.",
      "es": "Para actividades de práctica laboral en empresas establecidas en Colombia. Destinatarios: Titulares de nacionalidades exentas de visa para corta estancia, establecidas mediante Resolución."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "prestador-de-servicios-obra-o-labor",
    "category": "V",
    "articleNum": 54,
    "name": {
      "en": "V Visa — Prestador de Servicios, Obra o labor",
      "es": "Visa V Prestador de Servicios, Obra o labor"
    },
    "summary": {
      "en": "Under Resolución 5477: Para desempeñar labores temporalmente en Colombia bajo contrato de Prestación de servicios, obra o labor.",
      "es": "Para desempeñar labores temporalmente en Colombia bajo contrato de Prestación de servicios, obra o labor."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "fomento-a-la-internacionalizacion",
    "category": "V",
    "articleNum": 55,
    "name": {
      "en": "V Visa — Fomento a la Internacionalización",
      "es": "Visa V Fomento a la Internacionalización"
    },
    "summary": {
      "en": "Under Resolución 5477: Para actividades productivas, de innovación o investigación orientadas a la adopción o adaptación de tecnologías que complementen o desarrollen productos. procesos o servicios que contribuyan a fortalecer la competitividad del país; para actividades que contribuyan a incorporar el conocimiento a las prioridades de los planes de desarrollo nacional, regional y territorial; o para actividades o profesiones preestableci",
      "es": "Para actividades productivas, de innovación o investigación orientadas a la adopción o adaptación de tecnologías que complementen o desarrollen productos. procesos o servicios que contribuyan a fortalecer la competitividad del país; para actividades que contribuyan a incorporar el conocimiento a las prioridades de los planes de desarrollo nacional, regional y territorial; o para actividades o profesiones preestableci"
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "rentista",
    "category": "V",
    "articleNum": 56,
    "name": {
      "en": "V Visa — Rentista",
      "es": "Visa V Rentista"
    },
    "summary": {
      "en": "Under Resolución 5477: Para extranjeros que reciben una renta periódica y variable de fuente lícita acreditable.",
      "es": "Para extranjeros que reciben una renta periódica y variable de fuente lícita acreditable."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "casos-no-previstos",
    "category": "V",
    "articleNum": 57,
    "name": {
      "en": "V Visa — Casos no previstos",
      "es": "Visa V Casos no previstos"
    },
    "summary": {
      "en": "Under Resolución 5477: Esta visa se otorgará para casos y circunstancias no previstas en la presente resolución, de manera excepcional y previa valoración de la Autoridad de Visas e Inmigración.",
      "es": "Esta visa se otorgará para casos y circunstancias no previstas en la presente resolución, de manera excepcional y previa valoración de la Autoridad de Visas e Inmigración."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "cortesia-diplomaticos-visitantes",
    "category": "V",
    "articleNum": 58,
    "name": {
      "en": "V Visa — Cortesía Diplomáticos Visitantes",
      "es": "Visa V Cortesía Diplomáticos Visitantes"
    },
    "summary": {
      "en": "Under Resolución 5477: En aplicación del principio de reciprocidad diplomática, para el titular de pasaporte diplomático u oficial de un Estado reconocido por Colombia, que ingresa al país de manera temporal a desarrollar actividades diferentes a las diplomáticas y que no impliquen remuneración económica en el país; o para cónyuge o compañero(a) permanente de funcionario activo de Carrera Diplomática y Consular de Colombia.",
      "es": "En aplicación del principio de reciprocidad diplomática, para el titular de pasaporte diplomático u oficial de un Estado reconocido por Colombia, que ingresa al país de manera temporal a desarrollar actividades diferentes a las diplomáticas y que no impliquen remuneración económica en el país; o para cónyuge o compañero(a) permanente de funcionario activo de Carrera Diplomática y Consular de Colombia."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "programa-icetex",
    "category": "V",
    "articleNum": 59,
    "name": {
      "en": "V Visa — Programa ICETEX",
      "es": "Visa V Programa ICETEX"
    },
    "summary": {
      "en": "Under Resolución 5477: Para participar en programas académicos o eventos del Instituto Colombiano de Crédito Educativo y Estudios Técnicos en el Exterior “Mariano Ospina Pérez” ICETEX.",
      "es": "Para participar en programas académicos o eventos del Instituto Colombiano de Crédito Educativo y Estudios Técnicos en el Exterior “Mariano Ospina Pérez” ICETEX."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "cortesia-compromisos-internacionales",
    "category": "V",
    "articleNum": 60,
    "name": {
      "en": "V Visa — Cortesía Compromisos internacionales",
      "es": "Visa V Cortesía Compromisos internacionales"
    },
    "summary": {
      "en": "Under Resolución 5477: para casos contemplados por la Ley, o en cumplimiento de convenios o tratados internacionales de cooperación en vigor, que contemplen la expedición de esta clase de visa.",
      "es": "para casos contemplados por la Ley, o en cumplimiento de convenios o tratados internacionales de cooperación en vigor, que contemplen la expedición de esta clase de visa."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "cortesia-ley-de-cine",
    "category": "V",
    "articleNum": 61,
    "name": {
      "en": "V Visa — Cortesía Ley de Cine",
      "es": "Visa V Cortesía Ley de Cine"
    },
    "summary": {
      "en": "Under Resolución 5477: Para personal artístico, técnico y de producción extranjera que ingrese al país con el objeto de realizar o participar en proyectos de producción audiovisual o rodaje de obras cinematográficas extranjeras al amparo de la Ley de Cine.",
      "es": "Para personal artístico, técnico y de producción extranjera que ingrese al país con el objeto de realizar o participar en proyectos de producción audiovisual o rodaje de obras cinematográficas extranjeras al amparo de la Ley de Cine."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "medida-complementaria-al-refugio",
    "category": "V",
    "articleNum": 62,
    "name": {
      "en": "V Visa — Medida Complementaria al Refugio",
      "es": "Visa V Medida Complementaria al Refugio"
    },
    "summary": {
      "en": "Under Resolución 5477: Para extranjeros a quienes la Comisión Asesora para la Determinación de la Condición de Refugiado (CONARE) solicite medida complementaria al Refugio.",
      "es": "Para extranjeros a quienes la Comisión Asesora para la Determinación de la Condición de Refugiado (CONARE) solicite medida complementaria al Refugio."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "conyuge",
    "category": "M",
    "articleNum": 67,
    "name": {
      "en": "M Visa — Spouse",
      "es": "Visa M Cónyuge"
    },
    "summary": {
      "en": "For foreigners married to a Colombian national who intend to live together in Colombia. Time can count toward residency (R).",
      "es": "Para extranjeros casados con nacional colombiano que aspiren a convivir efectivamente en el país. Puede acumular tiempo para residencia (R)."
    },
    "whoFor": {
      "en": "Foreign spouses of Colombian citizens.",
      "es": "Cónyuges extranjeros de ciudadanos colombianos."
    },
    "keyRequirements": {
      "en": [
        "Marriage evidence",
        "Cohabitation intent/proof as required",
        "Identity documents"
      ],
      "es": [
        "Prueba de matrimonio",
        "Intención/prueba de convivencia según se exija",
        "Documentos de identidad"
      ]
    },
    "durationNotes": {
      "en": "Typically accumulates toward R after the minimum M period (often 3 years for spouse).",
      "es": "Generalmente acumula hacia R tras el mínimo en M (a menudo 3 años para cónyuge)."
    },
    "workPermit": true,
    "beneficiaries": "Primary applicant is the spouse; children may file separately as allowed.",
    "relatedGuideSlug": null
  },
  {
    "slug": "companero-a-permanente-de-nacional-colombiano",
    "category": "M",
    "articleNum": 68,
    "name": {
      "en": "M Visa — Compañero(a) permanente de nacional colombiano",
      "es": "Visa M Compañero(a) permanente de nacional colombiano"
    },
    "summary": {
      "en": "Under Resolución 5477: Para extranjeros que tengan unión de hecho con ciudadanos colombianos. Esta visa permite acumular tiempo para la Visa de Residente en los términos del Artículo 90 de la presente Resolución.",
      "es": "Para extranjeros que tengan unión de hecho con ciudadanos colombianos. Esta visa permite acumular tiempo para la Visa de Residente en los términos del Artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "madre-o-padre-o-hijo-a-de-nacional-colombiano-por-adopcion",
    "category": "M",
    "articleNum": 69,
    "name": {
      "en": "M Visa — Madre o Padre o hijo(a) de nacional colombiano por adopción",
      "es": "Visa M Madre o Padre o hijo(a) de nacional colombiano por adopción"
    },
    "summary": {
      "en": "Under Resolución 5477: Para los extranjeros que sean padres o hijos de un ciudadano que sea colombiano por adopción. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución.",
      "es": "Para los extranjeros que sean padres o hijos de un ciudadano que sea colombiano por adopción. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "padre-o-madre-de-nacional-colombiano-por-nacimiento",
    "category": "M",
    "articleNum": 70,
    "name": {
      "en": "M Visa — padre o madre de nacional colombiano por nacimiento",
      "es": "Visa M padre o madre de nacional colombiano por nacimiento"
    },
    "summary": {
      "en": "Under Resolución 5477: Para los extranjeros que sean padres de un ciudadano que sea colombiano por nacimiento. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución.",
      "es": "Para los extranjeros que sean padres de un ciudadano que sea colombiano por nacimiento. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "migrante-mercosur",
    "category": "M",
    "articleNum": 71,
    "name": {
      "en": "M Visa — Migrante Mercosur",
      "es": "Visa M Migrante Mercosur"
    },
    "summary": {
      "en": "Under Resolución 5477: Para nacionales de los Estados partes del “Acuerdo sobre Residencia para nacionales de los Estados Partes del Mercosur, Bolivia y Chile”, en aplicación del principio de la reciprocidad. Esta visa equivale a la visa de Residente Temporal establecida en dicho instrumento. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución.",
      "es": "Para nacionales de los Estados partes del “Acuerdo sobre Residencia para nacionales de los Estados Partes del Mercosur, Bolivia y Chile”, en aplicación del principio de la reciprocidad. Esta visa equivale a la visa de Residente Temporal establecida en dicho instrumento. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "migrante-andino",
    "category": "M",
    "articleNum": 72,
    "name": {
      "en": "M Visa — Migrante Andino",
      "es": "Visa M Migrante Andino"
    },
    "summary": {
      "en": "Under Resolución 5477: Para nacionales de alguno de los Estados partes del “Estatuto Migratorio Andino”, en aplicación del principio de la reciprocidad. Esta visa permite acumular tiempo para la Visa de Residente en los términos del Artículo 90 de la presente Resolución.",
      "es": "Para nacionales de alguno de los Estados partes del “Estatuto Migratorio Andino”, en aplicación del principio de la reciprocidad. Esta visa permite acumular tiempo para la Visa de Residente en los términos del Artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "refugiado",
    "category": "M",
    "articleNum": 73,
    "name": {
      "en": "M Visa — refugiado",
      "es": "Visa M refugiado"
    },
    "summary": {
      "en": "Under Resolución 5477: Para extranjeros a quienes el Estado colombiano les haya reconocido la condición de Refugiado. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución.",
      "es": "Para extranjeros a quienes el Estado colombiano les haya reconocido la condición de Refugiado. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "trabajador",
    "category": "M",
    "articleNum": 74,
    "name": {
      "en": "M Visa — Worker",
      "es": "Visa M trabajador"
    },
    "summary": {
      "en": "For foreigners seeking to work in Colombia for a legal entity under an employment contract. Time can count toward residency (R).",
      "es": "Para extranjeros que aspiran a trabajar en Colombia con persona jurídica mediante contrato de trabajo. Puede acumular tiempo para residencia (R)."
    },
    "whoFor": {
      "en": "Employees hired by Colombian legal entities.",
      "es": "Empleados contratados por personas jurídicas colombianas."
    },
    "keyRequirements": {
      "en": [
        "Employment contract",
        "Employer sponsorship documents",
        "General M requirements"
      ],
      "es": [
        "Contrato de trabajo",
        "Documentos de respaldo del empleador",
        "Requisitos generales M"
      ]
    },
    "durationNotes": {
      "en": "Aligned to contract and Cancillería authorization.",
      "es": "Alineada al contrato y a la autorización de Cancillería."
    },
    "workPermit": true,
    "beneficiaries": "Often available for spouse/children subject to rules.",
    "relatedGuideSlug": null
  },
  {
    "slug": "socio-o-propietario",
    "category": "M",
    "articleNum": 75,
    "name": {
      "en": "M Visa — Partner or owner",
      "es": "Visa M Socio o Propietario"
    },
    "summary": {
      "en": "For foreigners who formed a company or acquired participation in a going Colombian commercial company. Time can count toward residency (R).",
      "es": "Para extranjeros que constituyeron empresa o adquirieron participación en sociedad comercial en funcionamiento. Puede acumular tiempo para residencia (R)."
    },
    "whoFor": {
      "en": "Company founders and equity holders meeting capital/participation rules.",
      "es": "Fundadores y socios que cumplan reglas de capital/participación."
    },
    "keyRequirements": {
      "en": [
        "Corporate documents",
        "Proof of participation/capital",
        "Company in operation"
      ],
      "es": [
        "Documentos societarios",
        "Prueba de participación/capital",
        "Sociedad en funcionamiento"
      ]
    },
    "durationNotes": {
      "en": "M-category; may accumulate toward R.",
      "es": "Categoría M; puede acumular hacia R."
    },
    "workPermit": "Tied to company role — confirm with counsel.",
    "beneficiaries": "Case-specific.",
    "relatedGuideSlug": null
  },
  {
    "slug": "profesional-independiente",
    "category": "M",
    "articleNum": 76,
    "name": {
      "en": "M Visa — Profesional independiente",
      "es": "Visa M Profesional independiente"
    },
    "summary": {
      "en": "Under Resolución 5477: Para el extranjero que aspira a ejercer una profesión regulada o, de manera excepcional, una actividad no regulada, siempre que la actividad sea de interés para el país. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución.",
      "es": "Para el extranjero que aspira a ejercer una profesión regulada o, de manera excepcional, una actividad no regulada, siempre que la actividad sea de interés para el país. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "pensionado",
    "category": "M",
    "articleNum": 77,
    "name": {
      "en": "M Visa — Pensioner",
      "es": "Visa M Pensionado"
    },
    "summary": {
      "en": "For foreigners with stable monthly pension income from a state or private pension fund. Time can count toward residency (R).",
      "es": "Para extranjeros con ingresos mensuales constantes de pensión estatal o fondo privado. Puede acumular tiempo para residencia (R)."
    },
    "whoFor": {
      "en": "Retirees meeting minimum pension income thresholds.",
      "es": "Pensionados que cumplan umbrales mínimos de ingreso pensional."
    },
    "keyRequirements": {
      "en": [
        "Proof of pension and amount",
        "Means of support documentation"
      ],
      "es": [
        "Prueba de pensión y monto",
        "Documentación de medios de sustentación"
      ]
    },
    "durationNotes": {
      "en": "M-category with path toward R under art. 90.",
      "es": "Categoría M con vía hacia R bajo art. 90."
    },
    "workPermit": "Limited — confirm whether local employment is allowed.",
    "beneficiaries": "Often available subject to income and category rules.",
    "relatedGuideSlug": null
  },
  {
    "slug": "fomento-a-la-internacionalizacion",
    "category": "M",
    "articleNum": 78,
    "name": {
      "en": "M Visa — Fomento a la internacionalización",
      "es": "Visa M Fomento a la internacionalización"
    },
    "summary": {
      "en": "Under Resolución 5477: Para extranjeros con formación a nivel de maestría, doctorado o postdoctorado en ciencias básicas o aplicadas, ingeniería, matemáticas y afines, cuyos perfiles se ajusten a las prioridades requeridas por el país en sus planes de internacionalización públicos y privados; o para profesionales de áreas preestablecidas por la Dirección de Asuntos Migratorios, Consulares y Atención al Ciudadano, cuyo ejercicio aporte a la",
      "es": "Para extranjeros con formación a nivel de maestría, doctorado o postdoctorado en ciencias básicas o aplicadas, ingeniería, matemáticas y afines, cuyos perfiles se ajusten a las prioridades requeridas por el país en sus planes de internacionalización públicos y privados; o para profesionales de áreas preestablecidas por la Dirección de Asuntos Migratorios, Consulares y Atención al Ciudadano, cuyo ejercicio aporte a la"
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "inversionista",
    "category": "M",
    "articleNum": 79,
    "name": {
      "en": "M Visa — Investor",
      "es": "Visa M Inversionista"
    },
    "summary": {
      "en": "For foreign direct investment or acquiring real estate in your name and maintaining that investment during the visa term. Time can count toward residency (R).",
      "es": "Para inversión extranjera directa o adquisición de inmueble a nombre propio, manteniendo la inversión durante la vigencia. Puede acumular tiempo para residencia (R)."
    },
    "whoFor": {
      "en": "Investors meeting the legal investment thresholds and registration requirements (e.g. FIEM).",
      "es": "Inversionistas que cumplan umbrales legales y registro (p. ej. FIEM)."
    },
    "keyRequirements": {
      "en": [
        "Documented qualifying investment",
        "Foreign investment registration where required",
        "Maintenance of investment"
      ],
      "es": [
        "Inversión calificada documentada",
        "Registro de inversión extranjera cuando aplique",
        "Mantenimiento de la inversión"
      ]
    },
    "durationNotes": {
      "en": "M-category; may accumulate toward R under art. 90 rules.",
      "es": "Categoría M; puede acumular hacia R bajo reglas del art. 90."
    },
    "workPermit": "Linked to investment activity — confirm scope with counsel.",
    "beneficiaries": "Often available subject to requirements.",
    "relatedGuideSlug": "investor-visa"
  },
  {
    "slug": "renuncia-a-nacionalidad-colombiana",
    "category": "R",
    "articleNum": 89,
    "name": {
      "en": "R Visa — Renuncia a nacionalidad colombiana",
      "es": "Visa R Renuncia a nacionalidad colombiana"
    },
    "summary": {
      "en": "Under Resolución 5477: Para extranjeros que, habiendo sido colombianos por nacimiento o por adopción, renunciaron a la nacionalidad colombiana.",
      "es": "Para extranjeros que, habiendo sido colombianos por nacimiento o por adopción, renunciaron a la nacionalidad colombiana."
    },
    "whoFor": {
      "en": "Applicants who meet the specific category purpose in Resolución 5477.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for the visa type (V/M/R)",
        "Category-specific evidence under the governing article",
        "Identity and migratory documentation"
      ],
      "es": [
        "Requisitos generales del tipo de visa (V/M/R)",
        "Evidencia específica de la categoría según el artículo",
        "Documentación de identidad y migratoria"
      ]
    },
    "durationNotes": {
      "en": "Validity and stay are set by Cancillería for each authorization.",
      "es": "Vigencia y permanencia las fija Cancillería en cada autorización."
    },
    "workPermit": "See category rules in Resolución 5477.",
    "beneficiaries": "Depends on category — verify before planning a family filing.",
    "relatedGuideSlug": null
  },
  {
    "slug": "por-tiempo-acumulado",
    "category": "R",
    "articleNum": 90,
    "name": {
      "en": "R Visa — Accumulated time",
      "es": "Visa R Por tiempo acumulado"
    },
    "summary": {
      "en": "Permanent resident visa for foreigners who held qualifying M visas for the minimum periods set in Resolución 5477 (varies by M subcategory).",
      "es": "Visa de residente permanente para extranjeros que titularon visas M calificadas durante los mínimos de la Resolución 5477 (varía por subcategoría M)."
    },
    "whoFor": {
      "en": "Long-term M holders ready to apply for permanent residency.",
      "es": "Titulares M de largo plazo listos para residencia permanente."
    },
    "keyRequirements": {
      "en": [
        "Proof of qualifying M periods",
        "Identity and migratory history",
        "Category-specific evidence"
      ],
      "es": [
        "Prueba de periodos M calificados",
        "Identidad e historial migratorio",
        "Evidencia específica de la categoría"
      ]
    },
    "durationNotes": {
      "en": "Resident (R) status — review cancellation/termination rules carefully.",
      "es": "Estatus de residente (R) — revisar con cuidado reglas de cancelación/terminación."
    },
    "workPermit": true,
    "beneficiaries": "Family members may have separate pathways — verify.",
    "relatedGuideSlug": null
  }
];

export function getVisaBySlug(slug: string): VisaCatalogEntry | undefined {
  return VISAS_CATALOG.find((v) => v.slug === slug);
}

export function visasByCategory(category: VisaCategory | "all"): VisaCatalogEntry[] {
  if (category === "all") return VISAS_CATALOG;
  return VISAS_CATALOG.filter((v) => v.category === category);
}

export function visaDetailPath(slug: string, locale: ImmigrationLocale): string {
  return immigrationPath(`/visas/${slug}`, locale);
}

export function visaNormHref(locale: ImmigrationLocale): string {
  return normPublicPath("resolucion-5477-2022", locale);
}

export function visaGuideHref(slugKey: string, locale: ImmigrationLocale): string {
  return clkrPublicPath(slugKey, locale);
}

export function formatWorkPermit(
  value: boolean | string,
  locale: ImmigrationLocale,
): string {
  if (typeof value === "string") return value;
  if (locale === "es") return value ? "Sí (según alcance de la categoría)" : "No por defecto";
  return value ? "Yes (within category scope)" : "Not by default";
}
