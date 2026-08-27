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
  /** General eligibility notes (nationality lists, exemptions, fit). */
  eligibility?: Record<ImmigrationLocale, string>;
  /** What the visa authorizes (rights / scope of stay). */
  rights?: Record<ImmigrationLocale, string[]>;
  /** Explicit limits (no work, no beneficiaries, zone limits, etc.). */
  restrictions?: Record<ImmigrationLocale, string[]>;
  /** Filing checklist: general + category-specific documents. */
  applicationChecklist?: Record<ImmigrationLocale, string[]>;
  keyRequirements: Record<ImmigrationLocale, string[]>;
  durationNotes: Record<ImmigrationLocale, string>;
  workPermit: boolean | string;
  /** Optional bilingual override for work authorization copy. */
  workPermitNotes?: Record<ImmigrationLocale, string>;
  beneficiaries: string;
  /** Prefer this over `beneficiaries` when both locales are filled. */
  beneficiaryNotes?: Record<ImmigrationLocale, string>;
  relatedGuideSlug: string | null;
  /** When true, visa detail loads discussion comments for art. N of Resolución 5477. */
  enableNormComments?: boolean;
};

export const VISAS_CATALOG: VisaCatalogEntry[] = [
  {
    slug: "transito-aeroportuario",
    category: "V",
    articleNum: 33,
    name: {
      en: "V Visa — Airport Transit",
      es: "Visa V Tránsito Aeroportuario",
    },
    summary: {
      en: "For foreign nationals of nationalities listed by resolution who need a direct airport transit in Colombia en route to a third country. Authorized stay is up to 24 hours, strictly in sterile or direct-transit zones of a single international airport. Presence in those zones is not an entry into Colombian territory for immigration purposes.",
      es: "Para extranjeros de nacionalidades establecidas mediante Resolución que aspiren a realizar tránsito directo en alguno de los aeropuertos del territorio nacional y con destino a un tercer Estado. La permanencia autorizada es de máximo veinticuatro (24) horas, restringida a zonas estériles o de tránsito directo en un solo aeropuerto con operación internacional. La llegada y permanencia en esas zonas no se consideran ingreso al territorio nacional, en términos migratorios.",
    },
    whoFor: {
      en: "Travelers who must change flights in Colombia without entering the country, and whose nationality requires an airport-transit visa under the list published by Cancillería (Resolución 5488 de 2022, art. 8, as amended — notably by Resolución 3717 de 2023).",
      es: "Viajeros que deben hacer conexión en Colombia sin ingresar al país, y cuya nacionalidad exige visa de tránsito aeroportuario según el listado de Cancillería (Resolución 5488 de 2022, art. 8, modificado — en particular por la Resolución 3717 de 2023).",
    },
    eligibility: {
      en: "Only nationals of States or territories that Cancillería lists as requiring this visa. Stateless persons with a travel document issued by a State recognized by Colombia also need it (Res. 5488 art. 8, as amended). Nationals not on that list are exempt from the airport-transit visa for a direct connection to a third State. Confirm the current list before filing — it can change by resolution. Countries commonly listed as requiring it include Afghanistan, Angola, Bangladesh, Burkina Faso, Cameroon, Cote d'Ivoire, Egypt, Ethiopia, Eritrea, Gambia, Ghana, Haiti, India, Iran, Kenya, Lebanon, Mali, Nepal, Nigeria, Pakistan, Sierra Leone, Syria, Somalia, Sri Lanka, Sudan, Tajikistan, and Uzbekistan.",
      es: "Solo nacionales de Estados o territorios que Cancillería liste como obligados a esta visa. Los apátridas con documento de viaje de un Estado reconocido por Colombia también la requieren (Res. 5488 art. 8, modificado). Quienes no estén en ese listado están exentos de la visa de tránsito aeroportuario directo hacia un tercer Estado. Confirme el listado vigente antes de solicitar — puede cambiar por resolución. Países que suelen figurar como obligados incluyen Afganistán, Angola, Bangladesh, Burkina Faso, Camerún, Costa de Marfil, Egipto, Etiopía, Eritrea, Gambia, Ghana, Haití, India, Irán, Kenia, Líbano, Malí, Nepal, Nigeria, Pakistán, Sierra Leona, Siria, Somalia, Sri Lanka, Sudán, Tayikistán y Uzbekistán.",
    },
    rights: {
      en: [
        "Direct transit through the international/sterile zone of one Colombian airport with international operations, onward to a third country.",
        "Authorized presence in that zone for up to 24 hours per transit.",
        "Visa validity of up to 30 days for multiple transits (as authorized).",
        "Multiple entries/transits are generally allowed under the visa framework (art. 27), within the authorization granted.",
        "Time spent in the international transit zone is not treated as entry into Colombian territory for immigration purposes — without limiting Migración Colombia’s control of those zones.",
      ],
      es: [
        "Tránsito directo por la zona internacional/estéril de un aeropuerto colombiano con operación internacional, con destino a un tercer país.",
        "Permanencia autorizada en esa zona hasta por 24 horas por tránsito.",
        "Vigencia de la visa de hasta 30 días para múltiples tránsitos (según autorización).",
        "Entradas/tránsitos múltiples están en principio permitidos en el régimen de visas (art. 27), dentro de lo autorizado.",
        "La permanencia en la zona de tránsito internacional no se considera ingreso al territorio nacional en términos migratorios — sin menoscabo del control que Migración Colombia ejerce sobre esas zonas.",
      ],
    },
    restrictions: {
      en: [
        "No work authorization in Colombia.",
        "No exit from the sterile/direct-transit zone; no change of airport.",
        "Maximum 24 hours in the transit zone per connection.",
        "Does not authorize entry into Colombian national territory beyond the transit zone (art. 14).",
        "Does not allow applications as a beneficiary (dependents).",
        "Does not carry the study permission that other longer visitor visas may allow (art. 28 excludes airport transit).",
        "Obtain it before the connection, through the Colombian consulate covering your legal residence — not as a filing from inside Colombia for this transit purpose.",
      ],
      es: [
        "No otorga permiso de trabajo en Colombia.",
        "No permite salir de la zona estéril/de tránsito directo ni cambiar de aeropuerto.",
        "Máximo 24 horas en la zona de tránsito por conexión.",
        "No autoriza el ingreso al territorio nacional más allá de la zona de tránsito (art. 14).",
        "No admite solicitudes en calidad de beneficiario.",
        "No incluye el permiso de estudio que otras visas de visitante más largas pueden permitir (el art. 28 exceptúa el tránsito aeroportuario).",
        "Obténgala antes de la conexión, ante el consulado colombiano de su residencia legal — no como trámite pensado para radicar desde dentro de Colombia para este tránsito.",
      ],
    },
    applicationChecklist: {
      en: [
        "Complete the online visa application (SITAC / Cancillería) for category V — Airport Transit, filed with the Colombian consulate whose jurisdiction covers your legal residence — before travel.",
        "Recent digital color photo on a white background (neutral expression; max 300 KB; face fully visible).",
        "Passport or accepted travel document valid at least six (6) months from the application date, in good condition, with a blank page if a sticker may be needed — plus a copy of the bio page.",
        "Airline ticket showing entry into and exit from Colombia to a third country.",
        "Proof of admissibility to the final destination — mainly the visa for that third State when required.",
        "Pay the study fee within the calendar deadline Cancillería sets after filing; if approved, pay the issuance fee within its deadline.",
      ],
      es: [
        "Diligenciar la solicitud en línea (SITAC / Cancillería) en categoría V — Tránsito Aeroportuario, ante el consulado colombiano de la circunscripción de su residencia legal — antes del viaje.",
        "Fotografía digital reciente a color con fondo blanco (expresión neutra; máximo 300 KB; rostro completo y visible).",
        "Pasaporte o documento de viaje aceptado con vigencia mínima de seis (6) meses al momento de la solicitud, en buen estado y con hojas libres si se requiere etiqueta — más copia de la página de datos.",
        "Tiquete aéreo de entrada y salida de Colombia con destino a un tercer país.",
        "Prueba de admisibilidad al destino final — principalmente la visa del tercer Estado cuando la exija.",
        "Pagar la tasa de estudio dentro del plazo calendario que fije Cancillería tras el radicado; si aprueban, pagar la tasa de expedición en su plazo.",
      ],
    },
    keyRequirements: {
      en: [
        "General filing formalities under art. 24 (form, photo, passport).",
        "Air ticket into and out of Colombia to a third country (art. 33).",
        "Proof of admissibility to the final destination, mainly a visa if required (art. 33).",
      ],
      es: [
        "Formalidades generales de solicitud del art. 24 (formulario, foto, pasaporte).",
        "Tiquete aéreo de entrada y salida de Colombia hacia un tercer país (art. 33).",
        "Demostrar admisibilidad al destino final, principalmente visa si se requiere (art. 33).",
      ],
    },
    durationNotes: {
      en: "Visa validity: up to thirty (30) days for multiple transits. Stay in the airport transit zone: maximum twenty-four (24) hours per transit.",
      es: "Vigencia de la visa: hasta treinta (30) días para múltiples tránsitos. Permanencia en la zona de tránsito: máximo veinticuatro (24) horas por tránsito.",
    },
    workPermit: false,
    beneficiaries: "Not allowed.",
    beneficiaryNotes: {
      en: "This visa does not allow applications as a beneficiary.",
      es: "Esta visa no permite solicitudes en calidad de beneficiario.",
    },
    relatedGuideSlug: null,
    enableNormComments: true,
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
        "en": "For business dealings, market studies, direct-investment plans or filings, company formation, negotiation, contracts, or commercial representation. It is for nationalities that need a visa for short visits — and also for nationalities that are exempt from a short-stay visa when they need a longer stay in the country.",
        "es": "Para gestiones de negocios, estudios de mercado, planes o trámites de inversión directa y constitución de sociedad comercial, negociación, celebración de contratos o representación comercial. Está destinada a nacionalidades que no están exentas de visa para visitas cortas — y también a quienes, estando eximidos de visa de corta duración, precisan de una mayor permanencia en el país."
      },
      "whoFor": {
        "en": "Two doors, same visa. Nationals who are not on Cancillería’s short-stay visa-exemption list, and need to come for business. And nationals who are on that list, but whose business stay will not fit inside the exemption (they need more time, documented as a V Negocios).",
        "es": "Dos puertas, la misma visa. Nacionales que no están en el listado de exención de visa de corta estancia de Cancillería, y vienen por negocios. Y nacionales que sí están en ese listado, pero cuya permanencia de negocios no cabe en la exención (necesitan más tiempo, documentado como V Negocios)."
      },
      "eligibility": {
        "en": "Confirm the current short-stay exemption list (Resolución 5488 de 2022 and its amendments) before you decide between entering as a visitor without a visa and filing V Negocios. The list changes. If you are exempt and the trip fits inside the permitted stay, you typically do not need this visa. If you need more time, or your nationality is not exempt, this is the category.",
        "es": "Confirme el listado vigente de exención de visa de corta estancia (Resolución 5488 de 2022 y sus modificaciones) antes de decidir entre ingresar como visitante sin visa y radicar V Negocios. El listado cambia. Si está exento y el viaje cabe en la permanencia permitida, por regla no necesita esta visa. Si necesita más tiempo, o su nacionalidad no está exenta, esta es la categoría."
      },
      "rights": {
        "en": [
          "Carry out the business activities authorized in the visa: dealings, market studies, direct-investment plans or filings, company formation, negotiation, contracts, or commercial representation (art. 35).",
          "Visa validity: up to two (2) years, with multiple entries (art. 27).",
          "Authorized stay in Colombia: up to 180 calendar days, continuous or discontinuous, in each 365-calendar-day period counted from the date the visa is issued — not extendable.",
        ],
        "es": [
          "Adelantar las actividades de negocios autorizadas en la visa: gestiones, estudios de mercado, planes o trámites de inversión directa y constitución de sociedad, negociación, contratos o representación comercial (art. 35).",
          "Vigencia de la visa: hasta dos (2) años, con entradas múltiples (art. 27).",
          "Permanencia autorizada en Colombia: máximo 180 días calendario, continuos o discontinuos, en cada periodo de 365 días calendario contados desde la expedición de la visa — improrrogable.",
        ]
      },
      "restrictions": {
        "en": [
          "Does not grant a work permit or affiliation to the Colombian social-security system. That is not a ban on the business activities art. 35 authorizes — market studies, investment plans, forming a company, negotiating, signing contracts, or commercial representation — within what the visa records. It does not cover taking a job or subordinate work in Colombia.",
          "Does not allow applications as a beneficiary (dependents).",
        ],
        "es": [
          "No otorga permiso de trabajo ni permite vincularse al Sistema de Seguridad Social. Eso no impide las gestiones de negocios que autoriza el art. 35 — estudios de mercado, planes de inversión, constituir sociedad, negociar, firmar contratos o representación comercial — dentro de lo que quede registrado en la visa. Lo que no cubre es emplearse o prestar trabajo subordinado en Colombia.",
          "No admite solicitudes en calidad de beneficiario.",
        ]
      },
      "keyRequirements": {
        "en": [
          "General filing formalities under art. 24 (form, photo, passport).",
          "Then art. 31 (personal filing) or art. 32 (legal-entity sponsor), whichever applies — including the schedule of activities.",
        ],
        "es": [
          "Formalidades generales de solicitud del art. 24 (formulario, foto, pasaporte).",
          "Luego art. 31 (título personal) o art. 32 (respaldo de persona jurídica), según proceda — incluido el cronograma de actividades.",
        ]
      },
      "durationNotes": {
        "en": "Validity: up to two (2) years. Stay: maximum 180 calendar days, continuous or discontinuous, non-extendable in each 365-calendar-day period from the date the visa is issued.",
        "es": "Vigencia: hasta dos (2) años. Permanencia: máximo 180 días calendario, continuos o discontinuos, improrrogables en cada periodo de 365 días calendario contados a partir de la expedición de la visa."
      },
      "workPermit": false,
      "workPermitNotes": {
        "en": "No work permit, and no affiliation to Colombian social security. You may still carry out the business activities art. 35 names — you may not take a job here.",
        "es": "No hay permiso de trabajo ni afiliación al Sistema de Seguridad Social. Sí puede adelantar las gestiones de negocios del art. 35 — no puede emplearse aquí."
      },
      "beneficiaries": "Not allowed.",
      "beneficiaryNotes": {
        "en": "This visa does not allow applications as a beneficiary.",
        "es": "Esta visa no permite solicitudes en calidad de beneficiario."
      },
      "relatedGuideSlug": null,
      "enableNormComments": true
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
      "en": "For in-person, virtual, or distance study (arts and trades, preschool through secondary, work-and-human-development programs, and higher education), student internships, or academic exchange under a higher-education agreement. Passport holders from visa-exempt countries or territories do not need this visa if their stay in Colombia will not exceed 180 calendar days.",
      "es": "Para estudios presenciales, virtuales o a distancia (arte u oficio, preescolar a media, educación para el trabajo y el desarrollo humano, y educación superior), prácticas estudiantiles o intercambio académico por convenio entre instituciones de educación superior. Quienes porten pasaporte de país o territorio exento de visa no necesitan este trámite si su permanencia en Colombia no supera 180 días calendario."
    },
    "whoFor": {
      "en": "Foreign students who will study in Colombia beyond a short visa-exempt visit — or whose nationality is not on the short-stay exemption list. The program must match art. 36: study, a student internship, or an academic exchange.",
      "es": "Estudiantes extranjeros que van a estudiar en Colombia más allá de una visita corta exenta de visa — o cuya nacionalidad no está en el listado de exención de corta estancia. El programa tiene que caber en el art. 36: estudio, prácticas estudiantiles o intercambio académico."
    },
    "eligibility": {
      "en": "Confirm the current short-stay exemption list (Resolución 5488 de 2022 and its amendments). If you are exempt and the stay will not exceed 180 calendar days, you typically do not file this visa. If you need more time, or your nationality is not exempt, this is the category. A second or later student visa also needs proof that you attended and finished the prior course, studies, or internship.",
      "es": "Confirme el listado vigente de exención de visa de corta estancia (Resolución 5488 de 2022 y sus modificaciones). Si está exento y la permanencia no supera 180 días calendario, por regla no radica esta visa. Si necesita más tiempo, o su nacionalidad no está exenta, esta es la categoría. Una segunda visa de estudiante y las siguientes también piden prueba de asistencia y terminación del curso, estudios o prácticas anteriores."
    },
    "rights": {
      "en": [
        "Carry out the studies, student internship, or academic exchange authorized in the visa (art. 36).",
        "Visa validity: up to two (2) years, with multiple entries (art. 27).",
        "Stay: the visa itself authorizes presence in Colombia while it is valid (art. 15). Unlike V Negocios or V Turismo, art. 36 does not cap stay at 180 days per year.",
        "University postgraduate students may work up to twenty (20) hours a week if the employer reports it to Migración Colombia and the Ministry of Labour.",
      ],
      "es": [
        "Adelantar los estudios, las prácticas estudiantiles o el intercambio académico autorizados en la visa (art. 36).",
        "Vigencia de la visa: hasta dos (2) años, con entradas múltiples (art. 27).",
        "Permanencia: la visa autoriza estar en Colombia mientras esté vigente (art. 15). A diferencia de V Negocios o V Turismo, el art. 36 no pone un tope de 180 días por año.",
        "El estudiante universitario de posgrado puede trabajar hasta veinte (20) horas semanales si el empleador lo reporta a Migración Colombia y al Ministerio del Trabajo.",
      ]
    },
    "restrictions": {
      "en": [
        "For in-person programs, absence from Colombia of more than ninety (90) calendar days automatically ends the visa. That absence rule does not apply to virtual or distance study.",
        "Work is not open. Only university postgraduate students get the 20-hour weekly permit, after the employer’s report. A program internship (paid or unpaid) is part of the study activity, with the school’s letter — it is not a general work permit.",
        "Does not allow applications as a beneficiary, except when the principal is a postgraduate student.",
      ],
      "es": [
        "En formación presencial, la ausencia del país por más de noventa (90) días calendario termina la visa de forma automática. Esa regla de ausencia no aplica a formación virtual o a distancia.",
        "El trabajo no es abierto. Solo el estudiante universitario de posgrado tiene el permiso de veinte (20) horas semanales, previo reporte del empleador. Las prácticas del programa (remuneradas o no) van con el aval de la institución — no son un permiso de trabajo general.",
        "No admite solicitudes en calidad de beneficiario, salvo cuando el titular es estudiante de posgrado.",
      ]
    },
    "keyRequirements": {
      "en": [
        "Art. 31 (personal filing) or art. 32 (legal-entity sponsor), whichever applies.",
        "Admission or enrollment certificate stating the grade or program and its duration; for a student internship, the school’s letter and duration.",
        "Health policy covering Colombia for the planned stay.",
      ],
      "es": [
        "Art. 31 (título personal) o art. 32 (respaldo de persona jurídica), según proceda.",
        "Certificado de admisión o matrícula con el grado o programa y su duración; si son prácticas, comunicación de la institución y la duración.",
        "Póliza de salud con cobertura en Colombia por el tiempo de permanencia previsto.",
      ]
    },
    "durationNotes": {
      "en": "Validity: up to two (2) years. Stay: while the visa is valid (art. 15) — not the 180-day yearly cap used in V Negocios or V Turismo. For in-person study, more than 90 calendar days outside Colombia ends the visa automatically; virtual or distance study is excepted from that absence rule.",
      "es": "Vigencia: hasta dos (2) años. Permanencia: mientras la visa esté vigente (art. 15) — no el tope de 180 días por año de V Negocios o V Turismo. En formación presencial, más de 90 días calendario fuera de Colombia termina la visa de forma automática; esa regla no aplica a formación virtual o a distancia."
    },
    "workPermit": false,
    "workPermitNotes": {
      "en": "Not a general work permit. University postgraduate students may work up to 20 hours a week if the employer reports it to Migración Colombia and the Ministry of Labour. Other programs in this category do not get that permit. A school-endorsed internship is study activity under art. 36, not open employment.",
      "es": "No es un permiso de trabajo general. El estudiante universitario de posgrado puede trabajar hasta 20 horas semanales si el empleador lo reporta a Migración Colombia y al Ministerio del Trabajo. Los demás programas de esta categoría no traen ese permiso. Las prácticas con aval de la institución son actividad de estudio del art. 36, no empleo abierto."
    },
    "beneficiaries": "Not allowed, except for postgraduate students.",
    "beneficiaryNotes": {
      "en": "As a rule, this visa does not allow applications as a beneficiary. The exception is when the principal is a postgraduate student.",
      "es": "Por regla no admite solicitudes en calidad de beneficiario. La excepción es cuando el titular es estudiante de posgrado."
    },
    "relatedGuideSlug": null,
    "enableNormComments": true
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
      "en": "For medical or dental treatment in Colombia as a patient or accompanying person — typically for defined treatment courses, including exportable medical services for foreigners.",
      "es": "Para asistir en calidad de paciente o de acompañante de este a consulta, intervención o tratamiento médico y odontológico. Esta visa será otorgada para tratamientos específicos, priorizando aquellos de duración concreta, que hagan parte de la oferta exportable de servicios médicos para extranjeros."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "To pursue administrative or judicial proceedings before Colombian authorities.",
      "es": "Para adelantar trámites de carácter administrativo o judicial ante entidades o autoridades en Colombia."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "To work in Colombian jurisdictional waters as crew on a vessel, dredge, or offshore platform.",
      "es": "Para trabajar en aguas jurisdiccionales colombianas como tripulante de embarcación, draga o en plataforma costa afuera."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Seasonal agricultural work under programs set by the Ministry of Agriculture and related authorities, within published quotas and roles.",
      "es": "Para desarrollar labores agrícolas de temporada bajo programas establecidos por el Ministerio de Agricultura y Desarrollo Rural, o las Gobernaciones en concertación con el sector agrícola, el Ministerio del Trabajo y el Ministerio de Salud y Protección Social, en los que se señalarán los cupos estimados disponibles y las labores en las que se requiere apoyo de mano de obra."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "To attend conventions and business, cultural, or academic events as a speaker, exhibitor, participant, artist, athlete, juror, contestant, organizer, or logistics staff. Does not authorize work in Colombia beyond the event purpose.",
      "es": "Para asistir a convenciones y actividades empresariales, culturales o académicas como conferencista, expositor, participante, artista, deportista, jurado, concursante, organizador o personal logístico. No permite trabajar en el territorio colombiano. Los portadores de pasaporte de países o territorios exentos de visa, determinados mediante Resolución, estarán exentos del trámite de este tipo de visa siempre que su pe"
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Religious ministry or missionary work for a religious entity duly recognized by the Colombian State.",
      "es": "Para trabajar en el ejercicio del ministerio religioso o para ejercer como misionero de una entidad religiosa, debidamente reconocida por el Estado colombiano."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Religious volunteering, formation, or theological studies with a recognized church or religious institute.",
      "es": "Para ingresar y permanecer en el país como voluntario o estudiante en formación religiosa o para llevar a cabo estudios teológicos en instituto u organización de una iglesia o confesión religiosa, debidamente reconocida por el Estado colombiano."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Social volunteering or development cooperation work.",
      "es": "Para realizar voluntariado de carácter social o de cooperación para el desarrollo."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Participation in large-format film or documentary productions.",
      "es": "Para participar en producciones cinematográficas o documentales de gran formato."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Short-duration journalistic coverage in Colombia.",
      "es": "Para efectuar cubrimiento periodístico de corta duración en el país."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Permanent press correspondent for a foreign media outlet based in Colombia.",
      "es": "Para desempeñarse en Colombia como corresponsal de prensa permanente de un medio extranjero."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Technical assistance to a legal entity in Colombia.",
      "es": "Para prestar asistencia técnica a persona jurídica en Colombia."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Businessperson mobility under Colombia’s free-trade commitments currently in force.",
      "es": "Para facilitar la movilidad de empresarios o personas de negocios, en aplicación de compromisos adquiridos por Colombia en el marco de Tratados de Libre Comercio suscritos y en vigor con otros Estados."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Commercial government representatives or specialized agencies on a mission that does not imply diplomatic accreditation.",
      "es": "Para desempeñarse como oficial representante comercial de gobierno de Estado o territorio extranjero, o de agencia gubernamental especializada, en misión que no implique acreditación ante el Ministerio de Relaciones Exteriores."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Entry under a Working Holiday agreement currently in force between Colombia and the visitor’s country.",
      "es": "Para visitar el territorio nacional bajo Acuerdos de Vacaciones y Trabajo suscritos por Colombia que se encuentren vigentes."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Internship or workplace practice with companies in Colombia — typically for short-stay visa-exempt nationalities under the governing resolution.",
      "es": "Para actividades de práctica laboral en empresas establecidas en Colombia. Destinatarios: Titulares de nacionalidades exentas de visa para corta estancia, establecidas mediante Resolución."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Temporary service, obra, or labor contracts in Colombia.",
      "es": "Para desempeñar labores temporalmente en Colombia bajo contrato de Prestación de servicios, obra o labor."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Productive, innovation, or research activities aimed at adopting or adapting technologies that develop products, processes, or services — under the internationalization pathway.",
      "es": "Para actividades productivas, de innovación o investigación orientadas a la adopción o adaptación de tecnologías que complementen o desarrollen productos. procesos o servicios que contribuyan a fortalecer la competitividad del país; para actividades que contribuyan a incorporar el conocimiento a las prioridades de los planes de desarrollo nacional, regional y territorial; o para actividades o profesiones preestableci"
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "For foreigners who receive a periodic, variable income from a lawful, documentable source.",
      "es": "Para extranjeros que reciben una renta periódica y variable de fuente lícita acreditable."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Exceptional cases not otherwise covered in the resolution, after assessment by the visa authority.",
      "es": "Esta visa se otorgará para casos y circunstancias no previstas en la presente resolución, de manera excepcional y previa valoración de la Autoridad de Visas e Inmigración."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Courtesy entry for diplomatic or official passport holders of a State recognized by Colombia, under reciprocity, for a temporary visit.",
      "es": "En aplicación del principio de reciprocidad diplomática, para el titular de pasaporte diplomático u oficial de un Estado reconocido por Colombia, que ingresa al país de manera temporal a desarrollar actividades diferentes a las diplomáticas y que no impliquen remuneración económica en el país; o para cónyuge o compañero(a) permanente de funcionario activo de Carrera Diplomática y Consular de Colombia."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Academic programs or events with ICETEX (Instituto Colombiano de Crédito Educativo y Estudios Técnicos en el Exterior).",
      "es": "Para participar en programas académicos o eventos del Instituto Colombiano de Crédito Educativo y Estudios Técnicos en el Exterior “Mariano Ospina Pérez” ICETEX."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Courtesy visa where law or international cooperation treaties in force provide for this class of visa.",
      "es": "para casos contemplados por la Ley, o en cumplimiento de convenios o tratados internacionales de cooperación en vigor, que contemplen la expedición de esta clase de visa."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Foreign artistic, technical, and production personnel entering for audiovisual projects or film shoots under the cinema framework.",
      "es": "Para personal artístico, técnico y de producción extranjera que ingrese al país con el objeto de realizar o participar en proyectos de producción audiovisual o rodaje de obras cinematográficas extranjeras al amparo de la Ley de Cine."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Complementary measure to refugee status when requested by CONARE (Comisión Asesora para la Determinación de la Condición de Refugiado).",
      "es": "Para extranjeros a quienes la Comisión Asesora para la Determinación de la Condición de Refugiado (CONARE) solicite medida complementaria al Refugio."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "De facto union (unión de hecho) with a Colombian national. Time on this visa may count toward a Residente visa under art. 90 of Resolución 5477.",
      "es": "Para extranjeros que tengan unión de hecho con ciudadanos colombianos. Esta visa permite acumular tiempo para la Visa de Residente en los términos del Artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Parent or child of a Colombian national by adoption. Time may count toward Residente under art. 90.",
      "es": "Para los extranjeros que sean padres o hijos de un ciudadano que sea colombiano por adopción. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Parent of a Colombian national by birth. Time may count toward Residente under art. 90.",
      "es": "Para los extranjeros que sean padres de un ciudadano que sea colombiano por nacimiento. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Nationals of MERCOSUR Residence Agreement states (plus Bolivia and Chile as applicable), under reciprocity. Time may count toward Residente.",
      "es": "Para nacionales de los Estados partes del “Acuerdo sobre Residencia para nacionales de los Estados Partes del Mercosur, Bolivia y Chile”, en aplicación del principio de la reciprocidad. Esta visa equivale a la visa de Residente Temporal establecida en dicho instrumento. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Nationals of Andean Migratory Statute states, under reciprocity. Time may count toward Residente.",
      "es": "Para nacionales de alguno de los Estados partes del “Estatuto Migratorio Andino”, en aplicación del principio de la reciprocidad. Esta visa permite acumular tiempo para la Visa de Residente en los términos del Artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Foreigners recognized as refugees by the Colombian State. Time may count toward Residente under art. 90.",
      "es": "Para extranjeros a quienes el Estado colombiano les haya reconocido la condición de Refugiado. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "To practice a regulated profession — or, exceptionally, a non-regulated activity of interest to the country. Time may count toward Residente.",
      "es": "Para el extranjero que aspira a ejercer una profesión regulada o, de manera excepcional, una actividad no regulada, siempre que la actividad sea de interés para el país. Esta visa permite acumular tiempo para la Visa de Residente en los términos del artículo 90 de la presente Resolución."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
    "slug": "fomento-a-la-internacionalizacion-migrante",
    "category": "M",
    "articleNum": 78,
    "name": {
      "en": "M Visa — Fomento a la internacionalización",
      "es": "Visa M Fomento a la internacionalización"
    },
    "summary": {
      "en": "Foreigners with a master’s, doctorate, or postdoctorate in basic or applied sciences, engineering, mathematics, or related fields whose profile matches national priority areas.",
      "es": "Para extranjeros con formación a nivel de maestría, doctorado o postdoctorado en ciencias básicas o aplicadas, ingeniería, matemáticas y afines, cuyos perfiles se ajusten a las prioridades requeridas por el país en sus planes de internacionalización públicos y privados; o para profesionales de áreas preestablecidas por la Dirección de Asuntos Migratorios, Consulares y Atención al Ciudadano, cuyo ejercicio aporte a la"
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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
      "en": "Former Colombian nationals (by birth or adoption) who renounced Colombian nationality.",
      "es": "Para extranjeros que, habiendo sido colombianos por nacimiento o por adopción, renunciaron a la nacionalidad colombiana."
    },
    "whoFor": {
      "en": "Applicants whose purpose matches this category in Resolución 5477 — confirm fit before filing.",
      "es": "Solicitantes que cumplan el propósito específico de la categoría en la Resolución 5477."
    },
    "keyRequirements": {
      "en": [
        "General requirements for this visa type (V, M, or R) under Resolución 5477",
        "Evidence required by the governing article for this category",
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

export type VisaNavItem = {
  slug: string;
  category: VisaCategory;
  articleNum: number;
  name: Record<ImmigrationLocale, string>;
};

export function toVisaNavItems(visas: VisaCatalogEntry[]): VisaNavItem[] {
  return visas.map((v) => ({
    slug: v.slug,
    category: v.category,
    articleNum: v.articleNum,
    name: v.name,
  }));
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
  notes?: Record<ImmigrationLocale, string> | null,
): string {
  if (notes?.[locale]?.trim()) return notes[locale].trim();
  if (typeof value === "string") {
    if (locale === "es") {
      return "Según las reglas de la categoría en la Resolución 5477.";
    }
    return value;
  }
  if (locale === "es") return value ? "Sí (según alcance de la categoría)" : "No por defecto";
  return value ? "Yes (within category scope)" : "Not by default";
}

export function formatBeneficiaries(
  visa: VisaCatalogEntry,
  locale: ImmigrationLocale,
): string {
  const notes = visa.beneficiaryNotes?.[locale]?.trim();
  if (notes) return notes;
  if (locale === "es") {
    return "Según las reglas de la categoría — verifique antes de una radicación familiar.";
  }
  return visa.beneficiaries;
}
