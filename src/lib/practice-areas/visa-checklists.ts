import type { ImmigrationLocale } from "@/lib/practice-areas/paths";
import type { VisaCatalogEntry } from "@/lib/practice-areas/visas-catalog";

type LocaleList = Record<ImmigrationLocale, string[]>;
type Pair = { en: string[]; es: string[] };

const PHOTO: Pair = {
  en: [
    "Recent digital color photo on a white background (neutral expression; max 300 KB; face fully visible, head centered).",
  ],
  es: [
    "Fotografía digital reciente a color con fondo blanco (expresión neutra; máximo 300 KB; rostro completo, cabeza centrada y visible).",
  ],
};

const PASSPORT: Pair = {
  en: [
    "Passport or accepted travel document valid at least six (6) months from the application date, in good condition, with a blank page if a sticker may be needed — plus a copy of the bio page.",
  ],
  es: [
    "Pasaporte o documento de viaje aceptado con vigencia mínima de seis (6) meses al momento de la solicitud, en buen estado y con hojas libres si se requiere etiqueta — más copia de la página de datos.",
  ],
};

const IN_COUNTRY: Pair = {
  en: [
    "If applying from inside Colombia: copy of the most recent entry stamp or equivalent Migración Colombia authorization / salvoconducto (art. 24.4).",
    "If applying from a country that is not your nationality: proof of regular stay there (short-stay-exempt nationalities) or resident status (nationalities that need a short-stay visa) — art. 24.5.",
  ],
  es: [
    "Si solicita estando en Colombia: copia del sello de entrada más reciente o autorización equivalente de Migración Colombia / salvoconducto (art. 24.4).",
    "Si solicita en un país distinto al de su nacionalidad: prueba de estancia regular allí (nacionalidades exentas de visa de corta estancia) o de residencia (nacionalidades que sí la requieren) — art. 24.5.",
  ],
};

const FEES: Pair = {
  en: [
    "Pay the study fee within the calendar deadline Cancillería sets after filing; if approved, pay the issuance fee within its deadline.",
  ],
  es: [
    "Pagar la tasa de estudio dentro del plazo calendario que fije Cancillería tras el radicado; si aprueban, pagar la tasa de expedición en su plazo.",
  ],
};

const HEALTH: Pair = {
  en: [
    "Health policy covering Colombia for accident, illness, maternity, disability, hospitalization, death, or repatriation for the planned stay.",
  ],
  es: [
    "Póliza de salud con cobertura en Colombia contra todo riesgo (accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación) por el tiempo previsto de permanencia.",
  ],
};

const ART31: Pair = {
  en: [
    "Written statement identifying you and explaining the activity in Colombia — details, participants, duration, calendar, location (art. 31).",
    "If invited: handwritten, fingerprinted invitation from a Colombian host or an R-visa principal, with contact details, relationship, and economic responsibility for travel and stay.",
    "Bank statements for the last six (6) months showing monthly income of at least ten (10) monthly legal minimum wages (SMLMV) for you and/or the inviting individual.",
  ],
  es: [
    "Comunicación escrita con su identificación plena y la actividad que se propone en Colombia — detalles, participantes, duración, cronograma, ubicación (art. 31).",
    "Si es invitado: solicitud manuscrita con huella del anfitrión colombiano o de un titular principal de visa R, con datos de contacto, vínculo y responsabilidad económica del viaje y la estadía.",
    "Extractos bancarios de los últimos seis (6) meses con ingresos mensuales no inferiores a diez (10) SMLMV del solicitante y/o de quien invita.",
  ],
};

const ART32: Pair = {
  en: [
    "Motivated letter from the legal representative of the responsible legal entity (art. 32): NIT/contact, your identification, activity and duration, relationship, who pays, other foreigners already sponsored, and a handwritten fingerprinted economic-responsibility declaration.",
    "If the sponsor is a private entity formed abroad: certificate of existence or incorporation with apostille or legalization.",
    "Legal-entity bank statements for the last three (3) months (public entities are exempt).",
  ],
  es: [
    "Comunicación motivada del representante legal de la persona jurídica responsable (art. 32): NIT/contacto, su identificación, actividad y duración, vínculo, quién asume los gastos, otros extranjeros ya respaldados y declaración de responsabilidad económica manuscrita con huella.",
    "Si el respaldo es una persona jurídica privada constituida en el exterior: certificado de existencia o incorporación con apostilla o legalización.",
    "Extractos bancarios de la persona jurídica de los últimos tres (3) meses (las entidades públicas están exentas).",
  ],
};

function sitac(enLabel: string, esLabel: string): Pair {
  return {
    en: [`Complete the online visa application (SITAC / Cancillería) for ${enLabel}.`],
    es: [`Diligenciar la solicitud en línea (SITAC / Cancillería) en ${esLabel}.`],
  };
}

function core(enLabel: string, esLabel: string): Pair {
  return join(sitac(enLabel, esLabel), PHOTO, PASSPORT, IN_COUNTRY);
}

function join(...parts: Pair[]): Pair {
  return {
    en: parts.flatMap((p) => p.en),
    es: parts.flatMap((p) => p.es),
  };
}

function pair(en: string[], es: string[]): Pair {
  return { en, es };
}

function checklist(...parts: Pair[]): LocaleList {
  const merged = join(...parts, FEES);
  return { en: merged.en, es: merged.es };
}

export type ChecklistGroupView = {
  heading?: string;
  items: string[];
};

type ChecklistGroupDef = {
  heading?: { en: string; es: string };
  items: Pair;
};

function flattenGroups(groups: ChecklistGroupDef[]): LocaleList {
  return {
    en: groups.flatMap((g) => g.items.en),
    es: groups.flatMap((g) => g.items.es),
  };
}

export function checklistGroupsFor(
  articleNum: number,
  locale: ImmigrationLocale,
): ChecklistGroupView[] | null {
  const def = STRUCTURED_CHECKLISTS[articleNum];
  if (!def?.length) return null;
  return def.map((g) => ({
    heading: g.heading?.[locale],
    items: g.items[locale],
  }));
}

/** Reviewed visas: headings split tracks (e.g. art. 31 vs 32). */
const STRUCTURED_CHECKLISTS: Partial<Record<number, ChecklistGroupDef[]>> = {
  35: [
    {
      heading: {
        en: "Every filing (art. 24)",
        es: "Todo radicado (art. 24)",
      },
      items: core("category V — Business", "categoría V — Negocios"),
    },
    {
      heading: {
        en: "Then choose one path — not both. Art. 35 points to art. 31 or art. 32, whichever fits.",
        es: "Luego elija una sola ruta — no las dos. El art. 35 remite al art. 31 o al art. 32, según proceda.",
      },
      items: pair([], []),
    },
    {
      heading: {
        en: "Path A — in your own name (art. 31)",
        es: "Ruta A — a título personal (art. 31)",
      },
      items: join(
        ART31,
        pair(
          [
            "The written statement must include the schedule (cronograma) of the business activities you expect to carry out — details, participants, duration, and location. A one-line purpose is not enough.",
          ],
          [
            "La comunicación escrita debe incluir el cronograma de las actividades de negocios que espera realizar — detalles, participantes, duración y ubicación. No basta un propósito de una línea.",
          ],
        ),
      ),
    },
    {
      heading: {
        en: "Path B — a legal entity sponsors you (art. 32)",
        es: "Ruta B — respaldo de persona jurídica (art. 32)",
      },
      items: ART32,
    },
    {
      heading: {
        en: "Fees",
        es: "Tasas",
      },
      items: FEES,
    },
  ],
};

/** Filing checklists keyed by Resolución 5477 article number. */
export const CHECKLISTS_BY_ARTICLE: Record<number, LocaleList> = {
  33: checklist(
    core("category V — Airport Transit", "categoría V — Tránsito Aeroportuario"),
    pair(
      [
        "File with the Colombian consulate whose jurisdiction covers your legal residence — before travel.",
        "Airline ticket showing entry into and exit from Colombia to a third country.",
        "Proof of admissibility to the final destination — mainly the visa for that third State when required.",
      ],
      [
        "Radicar ante el consulado colombiano de la circunscripción de su residencia legal — antes del viaje.",
        "Tiquete aéreo de entrada y salida de Colombia con destino a un tercer país.",
        "Prueba de admisibilidad al destino final — principalmente la visa del tercer Estado cuando la exija.",
      ],
    ),
  ),
  34: checklist(
    core("category V — Tourism", "categoría V — Turismo"),
    ART31,
    HEALTH,
    pair(
      [
        "Reservation of tickets for entry into and exit from Colombia (Migración will ask for the outbound ticket at admission).",
      ],
      [
        "Reservación de tiquetes de ingreso y salida de Colombia (Migración exigirá el tiquete de salida al ingreso).",
      ],
    ),
  ),
  35: flattenGroups(STRUCTURED_CHECKLISTS[35]!),
  36: checklist(
    core("category V — Student", "categoría V — Estudiante"),
    pair(
      [
        "Personal filing (art. 31) or legal-entity sponsor (art. 32), whichever applies.",
      ],
      [
        "Solicitud a título personal (art. 31) o con respaldo de persona jurídica (art. 32), según proceda.",
      ],
    ),
    pair(
      [
        "Admission or enrollment certificate stating the grade or program and its duration.",
        "For a student internship (paid or unpaid): letter from the educational institution endorsing it and stating the duration.",
      ],
      [
        "Certificado de admisión o matrícula con el grado o programa y su duración.",
        "Si son prácticas estudiantiles (remuneradas o no): comunicación de la institución educativa que las avale y señale la duración.",
      ],
    ),
    HEALTH,
    pair(
      [
        "For a second or later student visa: certificate that you attended and completed the prior course, studies, or internship.",
      ],
      [
        "Para segunda visa y siguientes: certificación de asistencia y terminación del curso, estudios o prácticas de la visa anterior.",
      ],
    ),
  ),
  37: checklist(
    core("category V — Medical treatment", "categoría V — Tratamiento médico"),
    ART31,
    pair(
      [
        "Letter from the health provider in Colombia stating the type of treatment and estimated recovery period.",
        "Letter stating that you (or the foreign entity backing you) will pay for treatment and stay, and that it will not generate charges against the Colombian health system.",
      ],
      [
        "Carta de la entidad de salud en Colombia con el tipo de tratamiento y la duración estimada de la recuperación.",
        "Carta señalando que usted (o la entidad extranjera que lo respalda) sufragará tratamiento y permanencia, sin generar servicios a cargo del sistema de salud colombiano.",
      ],
    ),
    HEALTH,
    pair(
      ["The companion, if any, needs the same health policy."],
      ["El acompañante, si lo hay, debe contar con la misma póliza de salud."],
    ),
  ),
  38: checklist(
    core(
      "category V — Administrative and/or judicial proceedings",
      "categoría V — Trámites administrativos y/o judiciales",
    ),
    ART31,
    pair(
      ["Official document supporting the proceeding before a Colombian authority."],
      ["Documento oficial que sustente el trámite ante la autoridad colombiana."],
    ),
    HEALTH,
  ),
  39: checklist(
    core("category V — Crew member", "categoría V — Tripulante"),
    ART32,
    pair(
      [
        "Copy of the crew member’s seaman’s book (libreta de tripulante).",
        "Permit from the competent Colombian maritime, port, or fisheries authority.",
      ],
      [
        "Copia de la libreta de tripulante.",
        "Permiso de la autoridad marítima, portuaria o pesquera colombiana, según corresponda.",
      ],
    ),
  ),
  40: checklist(
    core(
      "category V — Seasonal agricultural worker",
      "categoría V — Trabajador agrícola de temporada",
    ),
    pair(
      [
        "Complete the seasonal agricultural-worker form published on the Ministry of Foreign Affairs website.",
        "Written communication from the contracting party requesting the visa and stating fitness and experience for the posted agricultural work.",
        "Medical certificate from a health authority in the country of origin confirming psychophysical fitness for the posted work.",
        "The contracting company must obtain the health policy covering Colombia for the workers’ planned stay.",
      ],
      [
        "Diligenciar el formato para trabajador agrícola temporal publicado en la página del Ministerio de Relaciones Exteriores.",
        "Comunicación escrita del contratante solicitando la visa y señalando idoneidad y experiencia para las labores de la convocatoria.",
        "Certificado médico de autoridad de salud del país de origen sobre aptitud psicofísica para esas labores.",
        "La empresa contratante debe adquirir la póliza de salud con cobertura en Colombia por el tiempo de permanencia de los trabajadores.",
      ],
    ),
  ),
  41: checklist(
    core("category V — Events", "categoría V — Eventos"),
    ART32,
  ),
  42: checklist(
    core("category V — Religious", "categoría V — Religioso"),
    ART32,
    pair(
      [
        "Certificate of recognition and legal representation of the religious organization from the Ministry of the Interior or the competent diocese/archdiocese (other organizations: Cancillería may query the public registry and ask you to file it).",
        "Motivated letter from the legal representative: that you belong to its hierarchy, type of link or employment contract, purpose and activities in Colombia, and responsibility for social security and health coverage.",
        "The requesting organization must show economic solvency with bank statements averaging one hundred (100) SMLMV over the six (6) months before filing.",
      ],
      [
        "Certificado de reconocimiento y representación legal de la organización religiosa del Ministerio del Interior o de la diócesis/arquidiócesis competente (las demás: Cancillería puede consultar el registro público y requerir el documento).",
        "Carta motivada del representante legal: que usted pertenece a su jerarquía, tipo de vínculo o contrato, propósito y actividades en Colombia, y responsabilidad por seguridad social y cubrimiento en salud.",
        "La organización solicitante debe acreditar solvencia con extractos bancarios con promedio de cien (100) SMLMV de los seis (6) meses previos.",
      ],
    ),
  ),
  43: checklist(
    core(
      "category V — Religious students / volunteers",
      "categoría V — estudiantes/voluntarios de entidades religiosas",
    ),
    ART32,
    pair(
      [
        "Certificate of recognition and legal representation of the religious organization from the Ministry of the Interior or the competent diocese/archdiocese.",
        "Motivated letter from that organization stating purpose and activities in Colombia.",
        "Letter of support for your maintenance; the requesting entity must show bank statements averaging one hundred (100) monthly legal minimum wages over the six (6) months before filing.",
      ],
      [
        "Certificado de reconocimiento y representación legal de la organización religiosa del Ministerio del Interior o de la diócesis/arquidiócesis competente.",
        "Carta motivada de esa organización con el propósito y las actividades previstas en Colombia.",
        "Carta de respaldo para su sostenimiento; la entidad solicitante debe acreditar extractos bancarios con promedio de cien (100) SMLMV de los seis (6) meses previos.",
      ],
    ),
    HEALTH,
  ),
  44: checklist(
    core("category V — Volunteer or cooperant", "categoría V — Voluntario o cooperante"),
    pair(
      [
        "Letter from the legal representative stating the activity, program, places, and duration, and assuming all costs of stay and return to the country of origin or last residence.",
        "Document proving legal personality of the organization, constituted at least five (5) years ago (Colombian authority), or a foreign constitution document issued within the three (3) months before filing.",
        "The requesting organization must show bank statements averaging one hundred (100) SMLMV over the six (6) months before filing (public entities are exempt).",
      ],
      [
        "Carta del representante legal con la actividad, el programa, los lugares y la duración, asumiendo todos los gastos de permanencia y el regreso al país de origen o última residencia.",
        "Documento de personería jurídica de la entidad, constituida hace no menos de cinco (5) años (autoridad colombiana), o documento de constitución en el exterior expedido dentro de los tres (3) meses anteriores al radicado.",
        "La organización solicitante debe acreditar extractos bancarios con promedio de cien (100) SMLMV de los seis (6) meses previos (las entidades públicas están exentas).",
      ],
    ),
    HEALTH,
  ),
  45: checklist(
    core(
      "category V — Film or audiovisual production",
      "categoría V — Producción cinematográfica o audiovisual",
    ),
    ART32,
    HEALTH,
  ),
  46: checklist(
    core("category V — Digital nomads", "categoría V — Nómadas digitales"),
    pair(
      [
        "Hold a passport from a country or territory exempt from a short-stay visa, as listed by resolution.",
        "Letter in Spanish or English from the foreign company (or companies) stating the type of relationship and remuneration — plus the contract if you have one; or proof that you are a partner/co-owner of a foreign company and a letter that the work is remote.",
        "Entrepreneurs: motivated letter explaining the project and the financial and human resources you have or expect to have.",
        "Bank statements showing income of at least three (3) SMLMV for the last three (3) months.",
      ],
      [
        "Ser titular de pasaporte de un país o territorio exento de visa de corta estancia, según resolución.",
        "Carta en español o inglés de la empresa (o empresas) extranjera con el tipo de vínculo y la remuneración — más el contrato si lo hay; o prueba de que es socio/copropietario de una empresa en el exterior y carta de que el trabajo es remoto.",
        "Emprendedores: carta motivacional explicando el proyecto y los recursos financieros y humanos con que cuenta o aspira a contar.",
        "Extractos bancarios con ingresos mínimos equivalentes a tres (3) SMLMV de los últimos tres (3) meses.",
      ],
    ),
    HEALTH,
  ),
  47: checklist(
    core("category V — Short journalistic coverage", "categoría V — Cubrimiento periodístico"),
    ART32,
    HEALTH,
  ),
  48: checklist(
    core("category V — Permanent correspondent", "categoría V — Corresponsal permanente"),
    ART32,
    pair(
      [
        "The principal and any beneficiaries must hold a private insurance policy covering Colombia for accident, illness, maternity, disability, hospitalization, death, or repatriation for the planned stay.",
      ],
      [
        "El titular principal y sus beneficiarios deben acreditar seguro particular con cobertura en Colombia contra todo riesgo (accidente, enfermedad, maternidad, invalidez, hospitalización, muerte o repatriación) por el tiempo planeado de permanencia.",
      ],
    ),
  ),
  49: checklist(
    core("category V — Technical assistance", "categoría V — Asistencia técnica"),
    ART32,
    pair(
      [
        "Contract-summary form published by the Ministry of Foreign Affairs, signed by the requesting legal entity and by you (Cancillería may ask for the original contract).",
        "If the requester is a Colombian State body, an intergovernmental international organization, or an accredited diplomatic/consular mission: a visa-request letter from the legal representative is enough in place of the full art. 32 pack.",
      ],
      [
        "Formato resumen de contrato del Ministerio de Relaciones Exteriores, firmado por la persona jurídica requirente y por usted (Cancillería puede exigir el contrato original).",
        "Si el requirente es órgano del Estado colombiano, organismo internacional gubernamental o misión diplomática/consular acreditada: basta la carta de solicitud del representante legal, en lugar del paquete completo del art. 32.",
      ],
    ),
  ),
  50: checklist(
    core("category V — FTA business persons", "categoría V — Empresarios TLC"),
    ART32,
    pair(
      [
        "Documents required by the specific free-trade agreement in force that covers this mobility.",
      ],
      [
        "Documentos exigidos por el tratado de libre comercio vigente que cubre esta movilidad.",
      ],
    ),
  ),
  51: checklist(
    core("category V — Non-accredited officials", "categoría V — Oficiales no acreditados"),
    pair(
      [
        "Official communication signed by a senior official or legal representative of the entity of the represented country.",
      ],
      [
        "Comunicación oficial suscrita por el funcionario o representante legal de rango superior de la entidad del país representado.",
      ],
    ),
  ),
  52: checklist(
    core("category V — Holiday and work", "categoría V — Vacaciones y trabajo"),
    pair(
      [
        "File through the Colombian diplomatic or consular post with seat or jurisdiction in your country of nationality.",
        "Letter stating why you are applying, that you have not joined the program before, and that you meet the age in the Agreement (18 to 30 at filing).",
        "Complete the Ministry of Foreign Affairs commitment form (website).",
        "Copy or electronic record of the outbound ticket from Colombia.",
        "Bank certificate showing an average for the last three (3) months above five (5) SMLMV, or the ceiling in the Agreement.",
        "If you are a dependent or guest: letter from the person inviting or taking responsibility for stay and exit, plus their bank certificate.",
        "Police/criminal record certificate from the country where you spent the last three (3) years, with apostille or legalization and translation (art. 21).",
      ],
      [
        "Presentar la solicitud ante la representación diplomática o consular de Colombia con sede o circunscripción en su país de nacionalidad.",
        "Carta con las razones de la solicitud, que no ha participado antes en el Programa y que cumple la edad del Acuerdo (18 a 30 años al momento de solicitar).",
        "Diligenciar el formato de compromiso del Ministerio de Relaciones Exteriores (página web).",
        "Fotocopia o registro electrónico del pasaje de salida de Colombia.",
        "Certificación bancaria con promedio de los últimos tres (3) meses superior a cinco (5) SMLMV, o el tope que fije el Acuerdo.",
        "Si es dependiente o invitado: carta de quien invita o se responsabiliza de la permanencia y la salida, más su certificación bancaria.",
        "Certificado de antecedentes judiciales, penales o de policía del país donde permaneció los últimos tres (3) años, con apostilla o legalización y traducción (art. 21).",
      ],
    ),
    HEALTH,
  ),
  53: checklist(
    core("category V — Labor internship", "categoría V — Práctica laboral"),
    ART32,
    pair(
      [
        "Hold a passport of a nationality exempt from a short-stay visa.",
        "Apprenticeship or internship contract signed by the legal entity in Colombia.",
        "Letter from that legal representative requesting the visa, explaining the activities, and taking responsibility for social security and your departure at the end of the internship.",
      ],
      [
        "Ser portador de pasaporte de nacionalidad exenta de visa de corta estancia.",
        "Contrato de aprendizaje o pasantía laboral suscrito por la persona jurídica en Colombia.",
        "Carta del representante legal solicitando la visa, explicando las actividades y responsabilizándose de la seguridad social y de su salida al término de la pasantía.",
      ],
    ),
  ),
  54: checklist(
    core(
      "category V — Services, obra or labor contractor",
      "categoría V — Prestador de servicios, obra o labor",
    ),
    pair(
      [
        "Contract-summary form for services / obra or labor published by the Ministry of Foreign Affairs, with start and end dates.",
        "Employer’s motivation letter: fitness, work to be done, training, and why a Colombian national is not hired for that activity.",
        "Mining-energy sector: Cancillería will query the mining title; if it cannot, you must file it.",
        "Employer bank certificates for the last six (6) months showing average monthly income of one hundred (100) SMLMV.",
        "Apostilled (and translated) professional degree, or work/experience certificates that support fitness.",
      ],
      [
        "Formato resumen de contrato de prestación de servicios, obra o labor del Ministerio de Relaciones Exteriores, con fechas de inicio y finalización.",
        "Carta de motivación del empleador: idoneidad, labores, formación y las razones por las que no se contrata a un nacional colombiano para esa actividad.",
        "Sector minero-energético: Cancillería consultará el título minero; si no puede, usted deberá aportarlo.",
        "Certificaciones bancarias del empleador de los últimos seis (6) meses con ingresos promedio mensuales de cien (100) SMLMV.",
        "Copia del título profesional apostillado y traducido, o certificaciones laborales y de experiencia que sustenten la idoneidad.",
      ],
    ),
    HEALTH,
  ),
  55: checklist(
    core(
      "category V — Internationalization (fomento)",
      "categoría V — Fomento a la internacionalización",
    ),
    pair(
      [
        "Meet the professional profile set by the Dirección de Asuntos Migratorios, Consulares y Atención al Ciudadano under the Internationalization Mission recommendations.",
      ],
      [
        "Cumplir el perfil profesional que establezca la Dirección de Asuntos Migratorios, Consulares y Atención al Ciudadano, en aplicación de las recomendaciones de la Misión de Internacionalización.",
      ],
    ),
  ),
  56: checklist(
    core("category V — Rentista", "categoría V — Rentista"),
    pair(
      [
        "Visa-request letter declaring the lawful source of the income.",
        "Police/criminal record certificate from the country where you spent the last three (3) years, with apostille or legalization and translation (art. 21).",
        "Certificate from a public entity or private company recognized by the respective government stating the rent paid or remitted to you — or proof of Colombian assets that generate rent. Rent income may not be below ten (10) SMLMV.",
      ],
      [
        "Carta de solicitud de visa declarando el origen lícito de los ingresos.",
        "Certificado de antecedentes judiciales, penales o de policía del país donde permaneció los últimos tres (3) años, con apostilla o legalización y traducción (art. 21).",
        "Certificación de entidad pública o empresa privada reconocida por el gobierno respectivo, con la renta que paga o gira a su nombre — o prueba de bienes en Colombia de los que deriva renta. La cuantía no puede ser inferior a diez (10) SMLMV.",
      ],
    ),
    HEALTH,
  ),
  57: checklist(
    core("category V — Unforeseen cases", "categoría V — Casos no previstos"),
    pair(
      [
        "Cancillería sets the extra documents after reviewing the case. File the general pack and wait for the specific list.",
      ],
      [
        "Cancillería determina los documentos adicionales tras valorar el caso. Radique el paquete general y espere el listado específico.",
      ],
    ),
  ),
  58: checklist(
    core(
      "category V — Courtesy (visiting diplomats)",
      "categoría V — Cortesía diplomáticos visitantes",
    ),
    pair(
      [
        "Copy of a valid diplomatic or official passport.",
        "Official note from the competent authority of the issuing country requesting the visa — or, for a spouse or permanent partner of an active Colombian diplomatic-career officer: the legal document of the relationship plus that officer’s letter.",
      ],
      [
        "Copia de pasaporte diplomático u oficial vigente.",
        "Nota oficial de la autoridad competente del país emisor solicitando la visa — o, si es cónyuge o compañero(a) permanente de funcionario activo de carrera diplomática colombiana: el documento del vínculo y la carta del funcionario.",
      ],
    ),
  ),
  59: checklist(
    core("category V — ICETEX program", "categoría V — Programa ICETEX"),
    ART31,
    pair(
      [
        "ICETEX certificate stating the scholarship was granted.",
        "Letter from the person who will cover expenses not included in the scholarship during the stay.",
      ],
      [
        "Certificación del ICETEX en la que conste el otorgamiento de la beca.",
        "Carta de quien se hará cargo de los gastos no cubiertos por la beca durante la permanencia.",
      ],
    ),
    HEALTH,
  ),
  60: checklist(
    core(
      "category V — Courtesy (international commitments)",
      "categoría V — Cortesía compromisos internacionales",
    ),
    ART32,
    pair(
      [
        "Motivated letter specifying the international instrument or statute that supports the request.",
      ],
      [
        "Carta motivada especificando el instrumento internacional o la norma que sustenta la solicitud.",
      ],
    ),
  ),
  61: checklist(
    core("category V — Courtesy (film law)", "categoría V — Cortesía Ley de Cine"),
    ART32,
    pair(
      [
        "Communication from the Film Directorate of the Ministry of Culture (or successor) stating that the project is a foreign cinematographic work.",
      ],
      [
        "Comunicación de la Dirección de Cinematografía del Ministerio de Cultura (o quien haga sus veces) en la que conste que el proyecto es producción de obra cinematográfica extranjera.",
      ],
    ),
    HEALTH,
  ),
  62: checklist(
    core(
      "category V — Complementary measure to refugee status",
      "categoría V — Medida complementaria al refugio",
    ),
    pair(
      [
        "This visa may only be requested from inside Colombia, and only once.",
        "Internal communication from the refugee-status working group of the Ministry of Foreign Affairs to the visa authority, reporting the complementary measure (Decree 1067 de 2015, art. 2.2.3.1.6.21, or the rule that replaces it). CONARE drives this filing.",
      ],
      [
        "Esta visa solo puede pedirse dentro del territorio nacional, y por una sola vez.",
        "Comunicación interna del Grupo Interno de Trabajo para la Determinación de la Condición de Refugiado hacia la Autoridad de Visas, informando la medida complementaria (Decreto 1067 de 2015, art. 2.2.3.1.6.21, o la norma que lo sustituya). CONARE impulsa este trámite.",
      ],
    ),
  ),
  67: checklist(
    core("category M — Spouse", "categoría M — Cónyuge"),
    pair(
      [
        "Authentic copy of the Colombian civil marriage record, issued within the three (3) months before filing.",
        "Letter from the Colombian spouse requesting the visa and stating actual cohabitation, with phone, physical and email address, plus a simple copy of their cédula. Cancillería may ask for more proof or an interview.",
        "Special power, with notarized or consular acknowledgment of content and signature, for the foreign spouse to file this visa.",
        "Migratory-movement certificates from Migración Colombia for you and for the Colombian spouse.",
      ],
      [
        "Copia auténtica del registro civil de matrimonio colombiano, expedida dentro de los tres (3) meses previos a la solicitud.",
        "Carta del cónyuge colombiano pidiendo la visa y manifestando convivencia efectiva, con teléfono, dirección física y electrónica, más copia sencilla de la cédula. Cancillería puede pedir más pruebas o entrevista.",
        "Poder especial, con reconocimiento de contenido y firma ante notario o cónsul colombiano, para que la pareja extranjera solicite esta visa.",
        "Certificado de movimientos migratorios de Migración Colombia del extranjero y del cónyuge colombiano.",
      ],
    ),
  ),
  68: checklist(
    core(
      "category M — Permanent partner of a Colombian national",
      "categoría M — Compañero(a) permanente de nacional colombiano",
    ),
    pair(
      [
        "Authentic copy of the public deed, court decision, or conciliation record — or a validity certificate when required — issued no more than three (3) months earlier, declaring the de facto union. The union document must be more than one (1) year old at filing.",
        "If filing at a Colombian consulate: the document that proves the union under the law of the place where it was declared, with foreign-document formalities.",
        "Letter from the Colombian partner requesting the visa, stating unique, constant, persevering, and stable cohabitation, and committing to report any change — plus a simple copy of their cédula and contact details.",
        "Special power for you to file, with notarized or consular acknowledgment of content and signature.",
        "Migratory-movement certificates from Migración Colombia for you and for the Colombian partner.",
      ],
      [
        "Copia auténtica de la escritura pública, providencia judicial o acta de conciliación — o certificado de vigencia cuando corresponda — expedida con no más de tres (3) meses, declarando la unión marital de hecho. La formalización debe tener más de un (1) año al momento de solicitar.",
        "Si radica en consulado: el documento válido de la unión según la ley del lugar donde se declaró, con las formalidades de documentos extranjeros.",
        "Carta del compañero(a) colombiano pidiendo la visa, manifestando convivencia única, constante, perseverante y estable, y comprometiéndose a informar cualquier cambio — más fotocopia de la cédula y datos de contacto.",
        "Poder especial para solicitar la visa, con reconocimiento de contenido y firma ante notario o cónsul colombiano.",
        "Certificado de movimientos migratorios de Migración Colombia del extranjero y del compañero(a) permanente colombiano.",
      ],
    ),
  ),
  69: checklist(
    core(
      "category M — Parent or child of a Colombian national by adoption",
      "categoría M — Madre, padre o hijo(a) de nacional colombiano por adopción",
    ),
    pair(
      [
        "Cancillería will query the letter of nature or inscription of Colombian nationality by adoption; if it cannot, you must file it.",
        "If you are the child of the Colombian national by adoption: you must be under 25 and economically dependent on that Colombian.",
        "Authentic copy of the birth record that, under the issuing country’s law, proves first-degree kinship.",
        "Request letter signed by the Colombian national by adoption (if a minor: by those who hold parental authority or guardianship).",
        "Economic solvency: average bank statements for the last six (6) months, and the source of income.",
      ],
      [
        "Cancillería verificará la carta de naturaleza o la inscripción de nacionalidad colombiana por adopción; si no puede, usted deberá aportarla.",
        "Si solicita por ser hijo(a) del nacional colombiano por adopción: debe ser menor de 25 años y dependiente económico de ese colombiano.",
        "Copia auténtica del acta o registro civil de nacimiento que, según la ley del país emisor, acredite parentesco en primer grado de consanguinidad.",
        "Carta de solicitud suscrita por el nacional colombiano por adopción (si es menor: por quienes ostenten la patria potestad o tutoría).",
        "Solvencia económica: promedios en extractos bancarios de los últimos seis (6) meses, y fuente de ingresos.",
      ],
    ),
  ),
  70: checklist(
    core(
      "category M — Father or mother of a Colombian national by birth",
      "categoría M — Padre o madre de nacional colombiano por nacimiento",
    ),
    pair(
      [
        "Copy of the child’s Colombian birth record. If both parents are foreign: the record must note that it is valid to prove nationality and appear in the registry database; other annotations require the prior record.",
        "Visa-request letter: if the child is a minor, from the Colombian parent (or a family-authority certificate if that parent does not consent); if both parents are foreign, from both; if the child is of age, a handwritten letter with fingerprint from the child plus a copy of their cédula.",
        "The foreign parent’s visa that was in force at the child’s birth (Cancillería checks that it granted domicile).",
        "Migratory-movement certificates from Migración Colombia for the father and the mother.",
        "Economic solvency: average bank statements for the last six (6) months, and the source of income.",
      ],
      [
        "Copia del registro civil de nacimiento colombiano del hijo. Si ambos padres son extranjeros: debe anotar que es válido para demostrar nacionalidad y estar en la base registral; otras anotaciones exigen el registro antecedente.",
        "Carta de solicitud: si el hijo es menor, del padre o madre colombiano (o certificación de autoridad de familia si no hay consentimiento); si ambos padres son extranjeros, de ambos; si el hijo es mayor de edad, carta manuscrita con huella de él y fotocopia de la cédula.",
        "La visa del padre o madre extranjero vigente al nacimiento del menor (Cancillería verifica que otorgara domicilio).",
        "Certificado de movimientos migratorios de Migración Colombia del padre y de la madre.",
        "Solvencia económica: promedios en extractos bancarios de los últimos seis (6) meses, y fuente de ingresos.",
      ],
    ),
  ),
  71: checklist(
    core("category M — Mercosur migrant", "categoría M — Migrante Mercosur"),
    pair(
      [
        "Letter requesting temporary residence under the Mercosur Residence Agreement, explaining the activity in Colombia and the means of subsistence.",
        "Passport valid at least six (6) months.",
        "Police/criminal record certificate from the country where you spent the last three (3) years, with apostille or legalization and translation (art. 21).",
        "Image of the entry stamp into Colombia.",
      ],
      [
        "Carta de solicitud de residente temporal bajo el Acuerdo sobre Residencia del Mercosur, explicando la actividad en Colombia y los medios de subsistencia.",
        "Pasaporte con vigencia mínima de seis (6) meses.",
        "Certificado de antecedentes judiciales, penales o de policía del país donde permaneció los últimos tres (3) años, con apostilla o legalización y traducción (art. 21).",
        "Imagen del sello de ingreso al país.",
      ],
    ),
  ),
  72: checklist(
    core("category M — Andean migrant", "categoría M — Migrante andino"),
    pair(
      [
        "Passport valid at least six (6) months.",
        "Copy of the entry stamp or migratory card if you are in Colombia.",
        "Police/criminal record certificate from your Andean Member State of nationality or from countries where you resided in the five (5) years before filing, with apostille or legalization and translation (art. 21).",
        "Written statement of the purpose of establishing temporary residence and the means of subsistence.",
      ],
      [
        "Pasaporte con vigencia mínima de seis (6) meses.",
        "Copia del sello de ingreso o tarjeta migratoria si se encuentra en Colombia.",
        "Certificado de antecedentes judiciales, penales o de policía del Estado Miembro de su nacionalidad o de los países donde residió los cinco (5) años anteriores, con apostilla o legalización y traducción (art. 21).",
        "Manifestación escrita del propósito de establecer residencia temporal y de los medios de subsistencia.",
      ],
    ),
  ),
  73: checklist(
    core("category M — Refugee", "categoría M — Refugiado"),
    pair(
      [
        "Copy of the administrative act recognizing refugee status in Colombia.",
        "Visa-request letter signed by you.",
        "Valid passport or travel document.",
        "For a second or later visa in this category: Cancillería may verify that refugee status is still in force and ask for a Migración Colombia movement certificate.",
      ],
      [
        "Copia del acto administrativo que reconoce la condición de refugiado en Colombia.",
        "Carta de solicitud de visa suscrita por el extranjero.",
        "Pasaporte o documento de viaje vigente.",
        "Para segunda visa y siguientes: Cancillería puede verificar la vigencia de la condición de refugiado y pedir certificado de movimientos migratorios de Migración Colombia.",
      ],
    ),
  ),
  74: checklist(
    core("category M — Worker", "categoría M — Trabajador"),
    pair(
      [
        "Contract-summary form published by the Ministry of Foreign Affairs, signed by the contracting legal entity’s representative and by you.",
        "Employer’s motivation letter: fitness, duties, training, why a Colombian national is not hired, and how many direct jobs the company generates.",
        "Employer bank certificates or statements for the last four (4) months showing average monthly income of one hundred (100) SMLMV.",
        "If the profession is not regulated: apostilled or legalized (and translated) degree, or work/experience certificates.",
        "If the profession is regulated: the professional-council permit or license — required for a second or later visa in any event.",
      ],
      [
        "Formato resumen de contrato del Ministerio de Relaciones Exteriores, suscrito por el representante legal de la persona jurídica que contrata y por usted.",
        "Carta de motivación del empleador: idoneidad, funciones, formación, por qué no se contrata a un nacional colombiano y el número de empleos directos que genera la empresa.",
        "Certificaciones o extractos bancarios del empleador de los últimos cuatro (4) meses con ingresos promedio mensuales de cien (100) SMLMV.",
        "Si la profesión no está regulada: copia del título apostillado o legalizado y traducido, o certificaciones laborales y de experiencia.",
        "Si la profesión está regulada: el permiso o licencia del consejo profesional — en todo caso para segunda visa y siguientes.",
      ],
    ),
  ),
  75: checklist(
    core("category M — Partner or owner", "categoría M — Socio o propietario"),
    pair(
      [
        "Request letter with the company’s name, domicile, NIT, main activity, and number of direct jobs.",
        "Proof of incorporation, participation, or paid-in capital — or foreign-investment registration — of at least one hundred (100) SMLMV at filing, plus bank statements. Secondary-market share purchases do not qualify.",
        "For a second or later visa: proof the company remains active (bank statements of the last three months, tax return, social-security contributions, lease, and/or industry-and-commerce tax receipts).",
        "Joint-stock companies: share-composition certificate signed by a public accountant, with paid-in capital or assets of at least one hundred (100) SMLMV in your name.",
        "Mining-energy companies: the corresponding mining title.",
      ],
      [
        "Carta de solicitud con razón social, domicilio, NIT, actividad principal y cantidad de empleos directos.",
        "Acreditar constitución, participación o capital pagado — o registro de inversión extranjera — por un monto no inferior a cien (100) SMLMV a la fecha de radicado, más extractos bancarios. La compra de acciones en el mercado secundario no da lugar a esta visa.",
        "Para segunda visa y siguientes: demostrar que la empresa mantiene actividad (extractos de los últimos tres meses, declaración de renta, aportes a seguridad social, arrendamiento y/o ICA).",
        "Sociedades por acciones: certificado de composición accionaria suscrito por contador público, con capital o activo pagado a su nombre no inferior a cien (100) SMLMV.",
        "Empresas del sector minero-energético: el título minero que corresponda.",
      ],
    ),
  ),
  76: checklist(
    core("category M — Independent professional", "categoría M — Profesional independiente"),
    pair(
      [
        "Letter stating the occupation or activity you intend to carry out in the exercise of your profession.",
        "Copy of degree recognition (convalidación) and the other requirements to practice — professional card, license, or provisional permit from the corresponding professional council.",
        "Bank certificate in your name, not older than 30 days, with account-opening date, products, and average monthly balance/movement for the last six (6) months, showing income of at least five (5) SMLMV (later visas: a Colombian bank certificate).",
        "For activity based on professional experience rather than a degree: documents or certificates of fitness and experience.",
      ],
      [
        "Carta manifestando la ocupación o actividad que pretende desempeñar en ejercicio de su profesión.",
        "Copia de la convalidación del título y los demás requisitos para ejercer — tarjeta profesional, licencia o permiso provisional del colegio o consejo profesional.",
        "Certificación bancaria a su nombre, no mayor a 30 días, con fecha de apertura, productos y promedio de saldo y movimiento de los últimos seis (6) meses, con ingresos iguales o superiores a cinco (5) SMLMV (visas siguientes: certificación bancaria colombiana).",
        "Si la actividad se funda en experiencia profesional y no en título: documentos o certificaciones de idoneidad y experiencia.",
      ],
    ),
    HEALTH,
  ),
  77: checklist(
    core("category M — Pensioner", "categoría M — Pensionado"),
    pair(
      [
        "Certificate of a lifetime monthly pension of at least three (3) SMLMV, from a competent entity, apostilled and translated — or from the diplomatic/consular mission of the country that granted the pension.",
        "Police/criminal record certificate from the country where you spent the last three (3) years, with apostille or legalization and translation (art. 21).",
        "Medical certificate from a Colombian authority or from a health authority in the country of origin, confirming psychophysical fitness.",
      ],
      [
        "Certificación de pensión vitalicia mensual no inferior a tres (3) SMLMV, de entidad competente, apostillada y traducida — o de la misión diplomática o consular del país donde obtuvo la pensión.",
        "Certificado de antecedentes judiciales, penales o de policía del país donde permaneció los últimos tres (3) años, con apostilla o legalización y traducción (art. 21).",
        "Certificado médico de autoridad colombiana o de salud del país de origen, sobre aptitud psicofísica.",
      ],
    ),
    HEALTH,
  ),
  78: checklist(
    core(
      "category M — Internationalization (fomento)",
      "categoría M — Fomento a la internacionalización",
    ),
    pair(
      [
        "Apostilled or legalized (and translated) postgraduate degree.",
        "Motivation letter from the university, research center, or company in Colombia.",
        "Employment or affiliation contract with the academic institution, entity, or company.",
        "If a national internationalization program applies: meet the profile and requirements set in that program.",
      ],
      [
        "Título de posgrado apostillado o legalizado y traducido.",
        "Carta de motivación de la universidad, centro de investigación o empresa en Colombia.",
        "Contrato de vinculación con la institución académica, entidad o empresa.",
        "Si aplica un programa de internacionalización del Gobierno nacional: cumplir el perfil y los requisitos de ese programa.",
      ],
    ),
    HEALTH,
  ),
  79: checklist(
    core("category M — Investor", "categoría M — Inversionista"),
    pair(
      [
        "Direct foreign investment: communication from Banco de la República’s International Exchange Department registering FDI in your name above six hundred fifty (650) SMLMV at filing.",
        "Real-estate investment: certificate of tradition and freedom with title solely in your name for at least three hundred fifty (350) SMLMV, plus Banco de la República registration of the FDI used to buy the property.",
        "Bank statements for the last three (3) months showing solvency to remain in the country.",
        "For a second or later visa: proof you kept the investment or the property throughout the prior visa.",
      ],
      [
        "Inversión extranjera directa: comunicación del Departamento de Cambios Internacionales del Banco de la República con el registro de IED a su nombre por más de seiscientos cincuenta (650) SMLMV a la fecha de radicado.",
        "Inversión en inmueble: certificado de tradición y libertad con dominio exclusivamente a su nombre por un valor mínimo de trescientos cincuenta (350) SMLMV, más el registro del Banco de la República de la IED para la compra.",
        "Extractos bancarios de los últimos tres (3) meses que demuestren solvencia para permanecer en el país.",
        "Para segunda visa y siguientes: demostrar que mantuvo la inversión o la posesión del inmueble durante toda la visa anterior.",
      ],
    ),
    HEALTH,
  ),
  89: checklist(
    core(
      "category R — Renunciation of Colombian nationality",
      "categoría R — Renuncia a la nacionalidad colombiana",
    ),
    pair(
      [
        "Copy of the record of renunciation of Colombian nationality.",
        "If nationality was lost under article 9 of the 1886 Constitution: naturalization in a foreign country or proof of another nationality acquired before 1991.",
        "Letter requesting the R visa and explaining the means of subsistence for remaining in the country.",
      ],
      [
        "Copia del acta de renuncia a la nacionalidad colombiana.",
        "Quienes perdieron la nacionalidad por el artículo 9 de la Constitución de 1886: carta de naturalización en país extranjero o documento que acredite otra nacionalidad adquirida antes de 1991.",
        "Carta de solicitud de visa R explicando los medios de subsistencia para permanecer en el país.",
      ],
    ),
  ),
  90: checklist(
    core("category R — Accumulated time", "categoría R — Por tiempo acumulado"),
    pair(
      [
        "Hold the M (or R-beneficiary) visa that qualifies under art. 90 for the minimum time — continuity requires a new visa before the prior one expires; a salvoconducto does not count.",
        "Letter explaining the source of income for you and any beneficiaries, and how the circumstances of the prior time-qualifying visas still hold.",
        "Copy of the cédula de extranjería, so Cancillería can query criminal records.",
        "Spouses or permanent partners: letter from the Colombian spouse/partner who backed the M visa, stating the relationship and cohabitation continue, with address, email, and phone; simple copy of their cédula; special power granted before a notary for you to file.",
      ],
      [
        "Haber sido titular de la visa M (o R beneficiario) que califica en el art. 90 durante el tiempo mínimo — hay continuidad si la nueva visa se otorga antes de que expire la anterior; el salvoconducto no cuenta.",
        "Carta explicando la fuente de ingresos para el sostenimiento propio y de beneficiarios, y de qué manera se mantienen las circunstancias de las visas previas sujetas a acumulación.",
        "Copia de la cédula de extranjería, para consultar antecedentes judiciales.",
        "Cónyuges o compañeros permanentes: carta del cónyuge o compañero colombiano que respaldó la visa M, manifestando que persisten el vínculo y la convivencia, con dirección, correo y teléfono; copia sencilla de la cédula; poder especial ante notario para que el extranjero solicite.",
      ],
    ),
  ),
};

export function withApplicationChecklist(entry: VisaCatalogEntry): VisaCatalogEntry {
  const hasEn = (entry.applicationChecklist?.en?.length ?? 0) > 0;
  const hasEs = (entry.applicationChecklist?.es?.length ?? 0) > 0;
  if (hasEn && hasEs) return entry;
  const mapped = CHECKLISTS_BY_ARTICLE[entry.articleNum];
  if (!mapped) return entry;
  return { ...entry, applicationChecklist: mapped };
}
