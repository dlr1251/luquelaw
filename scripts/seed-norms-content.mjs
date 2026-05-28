/**
 * Seed norm section content into Supabase.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (Project Settings → API → service_role).
 *
 * Usage:
 *   npm run seed:norms
 *   npm run seed:norms -- constitucion-colombia resolucion-5477-2022
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env.local");

function loadEnvLocal() {
  if (!existsSync(envPath)) {
    console.error("Missing .env.local");
    process.exit(1);
  }
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function paragraph(text) {
  return `<p>${text}</p>`;
}

function articleHtml(body) {
  return body
    .split(/\n\n+/)
    .map((block) => paragraph(block.trim()))
    .join("");
}

const CONSTITUCION_ES = {
  slug: "constitucion-colombia",
  locale: "es",
  official_source_url: "https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/pdf/constitucion_politica_1991.pdf",
  sections: [
    {
      section_key: "overview",
      title: "Generalidades",
      sort_order: 0,
      depth: 0,
      html: paragraph(
        "Texto constitucional de referencia. La Constitución Política de Colombia de 1991 contiene 380 artículos organizados en 13 títulos. Use la tabla de contenidos para navegar.",
      ),
    },
    {
      section_key: "preambulo",
      title: "Preámbulo",
      number_label: "Preámbulo",
      sort_order: 10,
      depth: 0,
      html: articleHtml(
        "El pueblo de Colombia, en ejercicio de su poder soberano, representado por sus delegatarios a la Asamblea Nacional Constituyente, invocando la protección de Dios, y con el fin de fortalecer la unidad de la Nación y asegurar a sus integrantes la vida, la convivencia, el trabajo, la justicia, la igualdad, el conocimiento, la libertad y la paz, dentro de un marco jurídico, democrático y participativo que garantice un orden político, económico y social justo, y comprometido a impulsar la integración de la comunidad latinoamericana, decreta, sanciona y promulga la siguiente Constitución Política de Colombia.",
      ),
    },
    {
      section_key: "titulo-i",
      title: "Título I — De los principios fundamentales",
      number_label: "Título I",
      sort_order: 20,
      depth: 0,
    },
    {
      section_key: "art-1",
      title: "Artículo 1",
      number_label: "Art. 1",
      parent_section_key: "titulo-i",
      sort_order: 0,
      depth: 1,
      html: articleHtml(
        "Colombia es un Estado social de derecho, organizado en forma de República unitaria, descentralizada, con autonomía de sus entidades territoriales, democrática, participativa y pluralista, fundada en el respeto de la dignidad humana, en el trabajo y la solidaridad de las personas que la integran y en la prevalencia del interés general.",
      ),
    },
    {
      section_key: "art-2",
      title: "Artículo 2",
      number_label: "Art. 2",
      parent_section_key: "titulo-i",
      sort_order: 1,
      depth: 1,
      html: articleHtml(
        "Son fines esenciales del Estado: servir a la comunidad, promover la prosperidad general y garantizar la efectividad de los principios, derechos y deberes consagrados en la Constitución; facilitar la participación de todos en las decisiones que los afectan y en la vida económica, política, administrativa y cultural de la Nación; defender la independencia nacional, mantener la integridad territorial y asegurar la convivencia pacífica y la vigencia de un orden justo.\n\nLas autoridades de la República están instituidas para proteger a todas las personas residentes en Colombia, en su vida, honra, bienes, creencias, y demás derechos y libertades, y para asegurar el cumplimiento de los deberes sociales del Estado y de los particulares.",
      ),
    },
    {
      section_key: "art-3",
      title: "Artículo 3",
      number_label: "Art. 3",
      parent_section_key: "titulo-i",
      sort_order: 2,
      depth: 1,
      html: articleHtml(
        "La soberanía reside exclusivamente en el pueblo, del cual emana el poder público. El pueblo la ejerce en forma directa o por medio de sus representantes, en los términos que la Constitución establece.",
      ),
    },
    {
      section_key: "art-4",
      title: "Artículo 4",
      number_label: "Art. 4",
      parent_section_key: "titulo-i",
      sort_order: 3,
      depth: 1,
      html: articleHtml(
        "La Constitución es norma de normas. En todo caso de incompatibilidad entre la Constitución y la ley u otra norma jurídica, se aplicarán las disposiciones constitucionales.\n\nEs deber de los nacionales y de los extranjeros en Colombia acatar la Constitución y las leyes, y respetar y obedecer a las autoridades.",
      ),
    },
    {
      section_key: "art-5",
      title: "Artículo 5",
      number_label: "Art. 5",
      parent_section_key: "titulo-i",
      sort_order: 4,
      depth: 1,
      html: articleHtml(
        "El Estado reconoce, sin discriminación alguna, la primacía de los derechos inalienables de la persona y ampara a la familia como institución básica de la sociedad.",
      ),
    },
    {
      section_key: "art-6",
      title: "Artículo 6",
      number_label: "Art. 6",
      parent_section_key: "titulo-i",
      sort_order: 5,
      depth: 1,
      html: articleHtml(
        "Los particulares sólo son responsables ante las autoridades por infringir la Constitución y las leyes. Los servidores públicos lo son por la misma causa y por omisión o extralimitación en el ejercicio de sus funciones.",
      ),
    },
    {
      section_key: "art-7",
      title: "Artículo 7",
      number_label: "Art. 7",
      parent_section_key: "titulo-i",
      sort_order: 6,
      depth: 1,
      html: articleHtml(
        "El Estado reconoce y protege la diversidad étnica y cultural de la Nación colombiana.",
      ),
    },
    {
      section_key: "art-8",
      title: "Artículo 8",
      number_label: "Art. 8",
      parent_section_key: "titulo-i",
      sort_order: 7,
      depth: 1,
      html: articleHtml(
        "Es obligación del Estado y de las personas proteger las riquezas culturales y naturales de la Nación.",
      ),
    },
    {
      section_key: "art-9",
      title: "Artículo 9",
      number_label: "Art. 9",
      parent_section_key: "titulo-i",
      sort_order: 8,
      depth: 1,
      html: articleHtml(
        "Las relaciones exteriores del Estado se fundamentan en la soberanía nacional, en el respeto a la autodeterminación de los pueblos y en el reconocimiento de los principios del derecho internacional aceptados por Colombia.\n\nDe igual manera, la política exterior de Colombia se orientará hacia la integración latinoamericana y del Caribe.",
      ),
    },
    {
      section_key: "art-10",
      title: "Artículo 10",
      number_label: "Art. 10",
      parent_section_key: "titulo-i",
      sort_order: 9,
      depth: 1,
      html: articleHtml(
        "El castellano es el idioma oficial de Colombia. Las lenguas y dialectos de los grupos étnicos son también oficiales en sus territorios. La enseñanza que se imparta en las comunidades con tradiciones lingüísticas propias será bilingüe.",
      ),
    },
    {
      section_key: "titulo-ii",
      title: "Título II — De los derechos, las garantías y los deberes",
      number_label: "Título II",
      sort_order: 30,
      depth: 0,
      html: paragraph("Artículos 11 a 41. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-iii",
      title: "Título III — De los habitantes y del territorio",
      number_label: "Título III",
      sort_order: 40,
      depth: 0,
    },
    {
      section_key: "capitulo-extranjeros",
      title: "Capítulo III — De los extranjeros",
      number_label: "Cap. III",
      parent_section_key: "titulo-iii",
      sort_order: 0,
      depth: 1,
    },
    {
      section_key: "art-100",
      title: "Artículo 100",
      number_label: "Art. 100",
      parent_section_key: "capitulo-extranjeros",
      sort_order: 0,
      depth: 2,
      html: articleHtml(
        "Los extranjeros disfrutarán en Colombia de los mismos derechos civiles que se conceden a los colombianos. No obstante, la ley podrá, por razones de orden público, subordinar a condiciones especiales o negar el ejercicio de determinados derechos civiles a los extranjeros.\n\nAsí mismo, los extranjeros gozarán, en el territorio de la República, de las garantías concedidas a los nacionales, salvo las limitaciones que establezcan la Constitución o la ley.\n\nLos derechos políticos se reservan a los nacionales, pero la ley podrá conceder a los extranjeros residentes en Colombia el derecho al voto en las elecciones y consultas populares de carácter municipal o distrital.",
      ),
    },
    {
      section_key: "titulo-iv",
      title: "Título IV — De la participación democrática y de los partidos políticos",
      number_label: "Título IV",
      sort_order: 50,
      depth: 0,
      html: paragraph("Artículos 103 a 112. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-v",
      title: "Título V — De la organización del Estado",
      number_label: "Título V",
      sort_order: 60,
      depth: 0,
      html: paragraph("Artículos 113 a 122. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-vi",
      title: "Título VI — De la rama legislativa",
      number_label: "Título VI",
      sort_order: 70,
      depth: 0,
      html: paragraph("Artículos 132 a 188. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-vii",
      title: "Título VII — De la rama ejecutiva",
      number_label: "Título VII",
      sort_order: 80,
      depth: 0,
      html: paragraph("Artículos 189 a 227. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-viii",
      title: "Título VIII — De la rama judicial",
      number_label: "Título VIII",
      sort_order: 90,
      depth: 0,
      html: paragraph("Artículos 228 a 256. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-ix",
      title: "Título IX — De las elecciones y de la organización electoral",
      number_label: "Título IX",
      sort_order: 100,
      depth: 0,
      html: paragraph("Artículos 257 a 268. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-x",
      title: "Título X — De los organismos de control",
      number_label: "Título X",
      sort_order: 110,
      depth: 0,
      html: paragraph("Artículos 267 a 281. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-xi",
      title: "Título XI — De la organización territorial",
      number_label: "Título XI",
      sort_order: 120,
      depth: 0,
      html: paragraph("Artículos 282 a 317. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-xii",
      title: "Título XII — Del régimen económico y de la hacienda pública",
      number_label: "Título XII",
      sort_order: 130,
      depth: 0,
      html: paragraph("Artículos 334 a 363. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-xiii",
      title: "Título XIII — De la reforma de la Constitución",
      number_label: "Título XIII",
      sort_order: 140,
      depth: 0,
      html: paragraph("Artículos 374 a 380. Contenido en carga progresiva."),
    },
    {
      section_key: "disposiciones-transitorias",
      title: "Disposiciones transitorias",
      sort_order: 150,
      depth: 0,
      html: paragraph("Contenido en carga progresiva."),
    },
  ],
};

const CONSTITUCION_EN = {
  slug: "constitucion-colombia",
  locale: "en",
  official_source_url: "https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/pdf/constitucion_politica_1991.pdf",
  sections: CONSTITUCION_ES.sections.map((section) => {
    const enMap = {
      overview: {
        title: "Overview",
        html: paragraph(
          "Constitutional reference text. The Political Constitution of Colombia (1991) contains 380 articles in 13 titles. Use the table of contents to navigate.",
        ),
      },
      preambulo: {
        title: "Preamble",
        number_label: "Preamble",
        html: articleHtml(
          "The people of Colombia, exercising their sovereign power, represented by their delegates to the National Constituent Assembly, invoking the protection of God, and in order to strengthen the unity of the Nation and ensure to its members life, coexistence, work, justice, equality, knowledge, freedom, and peace within a legal, democratic, and participatory framework that guarantees a just political, economic, and social order, and committed to promoting the integration of the Latin American community, decree, sanction, and promulgate the following Political Constitution of Colombia.",
        ),
      },
      "titulo-i": {
        title: "Title I — Fundamental principles",
        number_label: "Title I",
      },
      "art-1": {
        html: articleHtml(
          "Colombia is a social state under the rule of law, organized as a unitary, decentralized republic, with autonomy of its territorial entities, democratic, participatory, and pluralistic, founded on respect for human dignity, on work and solidarity of the people who compose it, and on the prevalence of the general interest.",
        ),
      },
      "art-2": {
        html: articleHtml(
          "The essential goals of the State are to serve the community, promote general prosperity, and guarantee the effectiveness of the principles, rights, and duties enshrined in the Constitution; to facilitate the participation of all in the decisions that affect them and in the economic, political, administrative, and cultural life of the Nation; to defend national independence, maintain territorial integrity, and ensure peaceful coexistence and the enforcement of a just order.\n\nThe authorities of the Republic are established to protect all persons residing in Colombia in their life, honor, property, beliefs, and other rights and freedoms, and to ensure compliance with the social duties of the State and of individuals.",
        ),
      },
      "art-3": {
        html: articleHtml(
          "Sovereignty resides exclusively in the people, from whom public power emanates. The people exercise it directly or through their representatives, in the terms established by the Constitution.",
        ),
      },
      "art-4": {
        html: articleHtml(
          "The Constitution is the supreme norm. In any case of incompatibility between the Constitution and the law or any other legal norm, the constitutional provisions shall apply.\n\nIt is the duty of nationals and foreigners in Colombia to abide by the Constitution and the laws, and to respect and obey the authorities.",
        ),
      },
      "art-5": {
        html: articleHtml(
          "The State recognizes, without any discrimination, the primacy of the inalienable rights of the person and protects the family as the basic institution of society.",
        ),
      },
      "art-6": {
        html: articleHtml(
          "Individuals are responsible before the authorities only for violating the Constitution and the laws. Public servants are responsible for the same cause and for omission or overreach in the performance of their duties.",
        ),
      },
      "art-7": {
        html: articleHtml(
          "The State recognizes and protects the ethnic and cultural diversity of the Colombian Nation.",
        ),
      },
      "art-8": {
        html: articleHtml(
          "It is the duty of the State and of individuals to protect the cultural and natural wealth of the Nation.",
        ),
      },
      "art-9": {
        html: articleHtml(
          "The foreign relations of the State are based on national sovereignty, respect for the self-determination of peoples, and recognition of the principles of international law accepted by Colombia.\n\nLikewise, Colombia's foreign policy shall be oriented toward Latin American and Caribbean integration.",
        ),
      },
      "art-10": {
        html: articleHtml(
          "Spanish is the official language of Colombia. The languages and dialects of ethnic groups are also official in their territories. Education in communities with their own linguistic traditions shall be bilingual.",
        ),
      },
      "titulo-ii": {
        title: "Title II — Rights, guarantees, and duties",
        number_label: "Title II",
        html: paragraph("Articles 11–41. Content loading progressively."),
      },
      "titulo-iii": {
        title: "Title III — Inhabitants and territory",
        number_label: "Title III",
      },
      "capitulo-extranjeros": {
        title: "Chapter III — Foreigners",
        number_label: "Ch. III",
      },
      "art-100": {
        html: articleHtml(
          "Foreigners shall enjoy in Colombia the same civil rights as those granted to Colombians. However, for reasons of public order, the law may subject the exercise of certain civil rights to special conditions or deny them to foreigners.\n\nLikewise, foreigners shall enjoy in the territory of the Republic the guarantees granted to nationals, except for the limitations established by the Constitution or the law.\n\nPolitical rights are reserved to nationals, but the law may grant resident foreigners in Colombia the right to vote in municipal or district popular elections and consultations.",
        ),
      },
      "titulo-iv": {
        title: "Title IV — Democratic participation and political parties",
        number_label: "Title IV",
        html: paragraph("Articles 103–112. Content loading progressively."),
      },
      "titulo-v": {
        title: "Title V — Organization of the State",
        number_label: "Title V",
        html: paragraph("Articles 113–122. Content loading progressively."),
      },
      "titulo-vi": {
        title: "Title VI — Legislative branch",
        number_label: "Title VI",
        html: paragraph("Articles 132–188. Content loading progressively."),
      },
      "titulo-vii": {
        title: "Title VII — Executive branch",
        number_label: "Title VII",
        html: paragraph("Articles 189–227. Content loading progressively."),
      },
      "titulo-viii": {
        title: "Title VIII — Judicial branch",
        number_label: "Title VIII",
        html: paragraph("Articles 228–256. Content loading progressively."),
      },
      "titulo-ix": {
        title: "Title IX — Elections and electoral organization",
        number_label: "Title IX",
        html: paragraph("Articles 257–268. Content loading progressively."),
      },
      "titulo-x": {
        title: "Title X — Control bodies",
        number_label: "Title X",
        html: paragraph("Articles 267–281. Content loading progressively."),
      },
      "titulo-xi": {
        title: "Title XI — Territorial organization",
        number_label: "Title XI",
        html: paragraph("Articles 282–317. Content loading progressively."),
      },
      "titulo-xii": {
        title: "Title XII — Economic regime and public finance",
        number_label: "Title XII",
        html: paragraph("Articles 334–363. Content loading progressively."),
      },
      "titulo-xiii": {
        title: "Title XIII — Amendment of the Constitution",
        number_label: "Title XIII",
        html: paragraph("Articles 374–380. Content loading progressively."),
      },
      "disposiciones-transitorias": {
        title: "Transitional provisions",
        html: paragraph("Content loading progressively."),
      },
    };

    const en = enMap[section.section_key];
    if (!en) return section;
    return { ...section, ...en };
  }),
};

const RESOLUCION_5477_ES = {
  slug: "resolucion-5477-2022",
  locale: "es",
  official_source_url:
    "https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/resolucion_minrelaciones_5477_2022.htm",
  sections: [
    {
      section_key: "overview",
      title: "Generalidades",
      sort_order: 0,
      depth: 0,
      html: articleHtml(
        "Resolución 5477 de 22 de julio de 2022 del Ministerio de Relaciones Exteriores. Entró en vigor el 21 de octubre de 2022 y derogó las Resoluciones 5477 de 2014 y 6045 de 2017. Regula tipos de visa (V, M, R), requisitos, trámite y obligaciones migratorias.",
      ),
    },
    {
      section_key: "titulo-i",
      title: "Título I — Aspectos generales",
      number_label: "Título I",
      sort_order: 10,
      depth: 0,
    },
    {
      section_key: "art-1",
      title: "Artículo 1 — Ingreso de extranjeros",
      number_label: "Art. 1",
      parent_section_key: "titulo-i",
      sort_order: 0,
      depth: 1,
      html: articleHtml(
        "Los ciudadanos extranjeros requieren autorización para ingresar y permanecer en el territorio colombiano. Dicha autorización se expresa mediante un Permiso de Ingreso o mediante una visa.\n\nEl Ministerio de Relaciones Exteriores definirá mediante acto administrativo aquellos Estados o territorios cuyos nacionales podrán ingresar sin visa al territorio nacional para estancias cortas y no remuneradas.",
      ),
    },
    {
      section_key: "art-2",
      title: "Artículo 2 — Objeto",
      number_label: "Art. 2",
      parent_section_key: "titulo-i",
      sort_order: 1,
      depth: 1,
      html: articleHtml(
        "Mediante esta Resolución se establecen los tipos de visa y su alcance, así como las condiciones, requisitos y trámite para su solicitud, estudio, inadmisión, negación, autorización, cancelación y terminación.",
      ),
    },
    {
      section_key: "art-8",
      title: "Artículo 8 — Presentación de la solicitud",
      number_label: "Art. 8",
      parent_section_key: "titulo-i",
      sort_order: 2,
      depth: 1,
      html: articleHtml(
        "Toda solicitud de visa se deberá efectuar a través de la plataforma digital del Ministerio de Relaciones Exteriores (cancilleria.gov.co → trámites y servicios → visa), aportando los requisitos que correspondan.\n\nLos solicitantes en Colombia eligen la opción «oficina en Bogotá» y deben encontrarse en situación migratoria regular.",
      ),
    },
    {
      section_key: "art-13",
      title: "Artículo 13 — Tiempo de estudio",
      number_label: "Art. 13",
      parent_section_key: "titulo-i",
      sort_order: 3,
      depth: 1,
      html: articleHtml(
        "Una vez completa la solicitud y pagado el estudio, la Autoridad de Visas e Inmigración tendrá hasta treinta (30) días calendario para emitir pronunciamiento. Si el extranjero se encuentra en Colombia, debe mantener situación migratoria regular durante todo el procesamiento.",
      ),
    },
    {
      section_key: "titulo-ii",
      title: "Título II — Tipos de visas, requisitos y características",
      number_label: "Título II",
      sort_order: 20,
      depth: 0,
    },
    {
      section_key: "art-22",
      title: "Artículo 22 — Tipos de visas",
      number_label: "Art. 22",
      parent_section_key: "titulo-ii",
      sort_order: 0,
      depth: 1,
      html: `<p>Se establecen tres tipos de visas: <strong>Visitante (V)</strong>, <strong>Migrante (M)</strong> y <strong>Residente Permanente (R)</strong>, con sus correspondientes categorías.</p>
<table>
<thead><tr><th>Tipo</th><th>Categorías principales</th></tr></thead>
<tbody>
<tr><td>Visa V (Visitante)</td><td>Turismo, Negocios, Estudiante, Nómada Digital, Rentista, Tratamiento médico, y 19 categorías más</td></tr>
<tr><td>Visa M (Migrante)</td><td>Inversionista, Trabajador, Pensionado, Cónyuge de colombiano, Socio o Propietario, Refugiado, y 8 categorías más</td></tr>
<tr><td>Visa R (Residente)</td><td>Tiempo acumulado, ETPMV, Renuncia a nacionalidad, Residente Especial de Paz</td></tr>
</tbody>
</table>`,
    },
    {
      section_key: "art-23",
      title: "Artículo 23 — Alcance en cuanto a domicilio",
      number_label: "Art. 23",
      parent_section_key: "titulo-ii",
      sort_order: 1,
      depth: 1,
      html: articleHtml(
        "La Visa de Visitante se expide para actividades temporales sin ánimo de establecer domicilio. Constituyen prueba de residencia con vocación de permanencia las Visas de Migrante (al menos 3 años continuos como titular) y las visas Residente Permanente (R).",
      ),
    },
    {
      section_key: "art-24",
      title: "Artículo 24 — Requisitos generales",
      number_label: "Art. 24",
      parent_section_key: "titulo-ii",
      sort_order: 2,
      depth: 1,
      html: articleHtml(
        "Toda solicitud debe incluir: formulario electrónico, fotografía digital, pasaporte vigente (mínimo 6 meses), comprobante de ingreso regular si aplica, y demás requisitos según categoría.",
      ),
    },
    {
      section_key: "visa-v",
      title: "Visa de Visitante (V)",
      number_label: "Tipo V",
      parent_section_key: "titulo-ii",
      sort_order: 10,
      depth: 1,
    },
    {
      section_key: "visa-v-nomada-digital",
      title: "Visa V — Nómadas digitales (Art. 46)",
      number_label: "Art. 46",
      parent_section_key: "visa-v",
      sort_order: 0,
      depth: 2,
      html: articleHtml(
        "Alcance: Trabajo remoto desde Colombia para empresas extranjeras, como independiente o vinculado, o emprendimiento digital de interés para el país.\n\nRequisitos clave: pasaporte de país exento de visa corta estancia; carta de empresa extranjera o contrato; ingresos mínimos de 3 SMLMV en los últimos 3 meses; póliza de salud con cobertura en Colombia.\n\nVigencia: hasta 2 años. Beneficiarios permitidos. Restricción: no permite trabajar para persona natural o jurídica domiciliada en Colombia.",
      ),
    },
    {
      section_key: "visa-v-rentista",
      title: "Visa V — Rentista (Art. 56)",
      number_label: "Art. 56",
      parent_section_key: "visa-v",
      sort_order: 1,
      depth: 2,
      html: paragraph(
        "Para extranjeros con rentas de capital o pensiones del exterior. Requisitos de solvencia económica periódica. Contenido completo en carga.",
      ),
    },
    {
      section_key: "visa-m",
      title: "Visa de Migrante (M)",
      number_label: "Tipo M",
      parent_section_key: "titulo-ii",
      sort_order: 20,
      depth: 1,
    },
    {
      section_key: "visa-m-inversionista",
      title: "Visa M — Inversionista (Art. 79)",
      number_label: "Art. 79",
      parent_section_key: "visa-m",
      sort_order: 0,
      depth: 2,
      html: articleHtml(
        "Alcance: Extranjero con Inversión Extranjera Directa registrada o inmueble a nombre propio, manteniendo la inversión durante la vigencia. Permite acumular tiempo para visa R.\n\nRequisitos — inversión directa: comunicación del Banco de la República con registro superior a 650 SMLMV.\n\nRequisitos — inmueble: tradición y libertad a nombre exclusivo del extranjero por valor mínimo de 350 SMLMV, más registro cambiario de la inversión.\n\nAdemás: solvencia económica (extractos 3 meses), cobertura de salud, y demostrar mantenimiento de inversión en renovaciones.\n\nVigencia: hasta 3 años. Beneficiarios permitidos.\n\nParágrafo: cualquier cambio en la inversión debe informarse de inmediato a Cancillería.",
      ),
    },
    {
      section_key: "visa-m-pensionado",
      title: "Visa M — Pensionado (Art. 78)",
      number_label: "Art. 78",
      parent_section_key: "visa-m",
      sort_order: 1,
      depth: 2,
      html: paragraph(
        "Para extranjeros con pensión del exterior. Requisitos de ingreso periódico equivalente a 3 SMLMV. Contenido completo en carga.",
      ),
    },
    {
      section_key: "visa-m-trabajador",
      title: "Visa M — Trabajador (Art. 77)",
      number_label: "Art. 77",
      parent_section_key: "visa-m",
      sort_order: 2,
      depth: 2,
      html: paragraph(
        "Contrato laboral o prestación de servicios con empleador colombiano. Permiso de trabajo específico. Contenido completo en carga.",
      ),
    },
    {
      section_key: "visa-r",
      title: "Visa de Residente Permanente (R)",
      number_label: "Tipo R",
      parent_section_key: "titulo-ii",
      sort_order: 30,
      depth: 1,
    },
    {
      section_key: "visa-r-tiempo-acumulado",
      title: "Visa R — Tiempo acumulado (Art. 90)",
      number_label: "Art. 90",
      parent_section_key: "visa-r",
      sort_order: 0,
      depth: 2,
      html: paragraph(
        "Para extranjeros con acumulación de permanencia legal en Colombia (generalmente 5 años continuos con visa M, o 2 años con visa M inversionista). Contenido completo en carga.",
      ),
    },
    {
      section_key: "titulo-iii",
      title: "Título III — Procedimientos administrativos",
      number_label: "Título III",
      sort_order: 30,
      depth: 0,
      html: paragraph("Artículos 94–117. Cancelación, terminación, recursos. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-iv",
      title: "Título IV — Obligaciones migratorias",
      number_label: "Título IV",
      sort_order: 40,
      depth: 0,
      html: paragraph("Artículos 118–120. Contenido en carga progresiva."),
    },
    {
      section_key: "titulo-v",
      title: "Título V — Disposiciones finales",
      number_label: "Título V",
      sort_order: 50,
      depth: 0,
      html: paragraph("Vigencia, derogatorias y régimen de transición. Contenido en carga progresiva."),
    },
  ],
};

const RESOLUCION_5477_EN = {
  slug: "resolucion-5477-2022",
  locale: "en",
  official_source_url:
    "https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/resolucion_minrelaciones_5477_2022.htm",
  sections: RESOLUCION_5477_ES.sections.map((section) => {
    const enMap = {
      overview: {
        title: "Overview",
        html: articleHtml(
          "Resolution 5477 of July 22, 2022 (Ministry of Foreign Affairs). Effective October 21, 2022; repealed Resolutions 5477/2014 and 6045/2017. Governs visa types (V, M, R), requirements, procedures, and immigration obligations.",
        ),
      },
      "titulo-i": { title: "Title I — General provisions", number_label: "Title I" },
      "art-1": {
        title: "Article 1 — Entry of foreigners",
        html: articleHtml(
          "Foreign nationals require authorization to enter and remain in Colombian territory, expressed through an Entry Permit or a visa.\n\nThe Ministry of Foreign Affairs shall define by administrative act which states or territories may enter without a visa for short, non-remunerated stays.",
        ),
      },
      "art-2": {
        title: "Article 2 — Purpose",
        html: articleHtml(
          "This Resolution establishes visa types and scope, as well as conditions, requirements, and procedures for application, review, inadmission, denial, authorization, cancellation, and termination.",
        ),
      },
      "art-8": {
        title: "Article 8 — Filing the application",
        html: articleHtml(
          "All visa applications must be filed through the Ministry's digital platform (cancilleria.gov.co → procedures and services → visa).\n\nApplicants in Colombia select the Bogotá office option and must remain in regular immigration status.",
        ),
      },
      "art-13": {
        title: "Article 13 — Processing time",
        html: articleHtml(
          "Once the application is complete and study fees paid, the Visa and Immigration Authority has up to thirty (30) calendar days to decide. Applicants in Colombia must maintain regular status throughout processing.",
        ),
      },
      "titulo-ii": { title: "Title II — Visa types, requirements, and characteristics", number_label: "Title II" },
      "art-22": {
        title: "Article 22 — Visa types",
        html: `<p>Three visa types are established: <strong>Visitor (V)</strong>, <strong>Migrant (M)</strong>, and <strong>Permanent Resident (R)</strong>, each with categories.</p>
<table>
<thead><tr><th>Type</th><th>Main categories</th></tr></thead>
<tbody>
<tr><td>Visitor visa (V)</td><td>Tourism, Business, Student, Digital Nomad, Rentista, Medical treatment, and 19 more</td></tr>
<tr><td>Migrant visa (M)</td><td>Investor, Worker, Pensioner, Spouse of Colombian, Partner/Owner, Refugee, and 8 more</td></tr>
<tr><td>Resident visa (R)</td><td>Accumulated time, ETPMV, Renunciation of nationality, Special Peace Resident</td></tr>
</tbody>
</table>`,
      },
      "art-23": {
        title: "Article 23 — Scope regarding domicile",
        html: articleHtml(
          "Visitor visas are for temporary activities without intent to establish domicile. Migrant visas (3+ continuous years as holder) and Permanent Resident (R) visas demonstrate residence with intent to remain.",
        ),
      },
      "art-24": {
        title: "Article 24 — General requirements",
        html: articleHtml(
          "Every application must include: electronic form, digital photo, valid passport (minimum 6 months), proof of regular entry if applicable, and category-specific requirements.",
        ),
      },
      "visa-v": { title: "Visitor visa (V)", number_label: "Type V" },
      "visa-v-nomada-digital": {
        title: "Visitor visa — Digital nomads (Art. 46)",
        html: articleHtml(
          "Scope: Remote work from Colombia for foreign companies, as independent or employee, or digital entrepreneurship of interest to the country.\n\nKey requirements: passport from visa-exempt country; letter from foreign employer or contract; minimum income of 3 SMLMV for the last 3 months; health insurance with coverage in Colombia.\n\nValidity: up to 2 years. Beneficiaries allowed. Restriction: may not work for persons domiciled in Colombia.",
        ),
      },
      "visa-v-rentista": {
        title: "Visitor visa — Rentista (Art. 56)",
        html: paragraph("For foreigners with capital income or foreign pensions. Periodic solvency requirements. Full content loading."),
      },
      "visa-m": { title: "Migrant visa (M)", number_label: "Type M" },
      "visa-m-inversionista": {
        title: "Migrant visa — Investor (Art. 79)",
        html: articleHtml(
          "Scope: Foreigner with registered Foreign Direct Investment or real property in their name, maintained during validity. Allows accumulating time toward R visa.\n\nDirect investment: Banco de la República registration exceeding 650 SMLMV.\n\nReal property: clean title exclusively in foreigner's name, minimum 350 SMLMV, plus foreign investment registration.\n\nAlso: economic solvency (3-month bank statements), health coverage, and proof of maintained investment on renewals.\n\nValidity: up to 3 years. Beneficiaries allowed.\n\nParagraph: any investment change must be reported immediately to the Ministry.",
        ),
      },
      "visa-m-pensionado": {
        title: "Migrant visa — Pensioner (Art. 78)",
        html: paragraph("For foreigners with foreign pension income (minimum 3 SMLMV). Full content loading."),
      },
      "visa-m-trabajador": {
        title: "Migrant visa — Worker (Art. 77)",
        html: paragraph("Employment or services contract with Colombian employer. Specific work permit. Full content loading."),
      },
      "visa-r": { title: "Permanent Resident visa (R)", number_label: "Type R" },
      "visa-r-tiempo-acumulado": {
        title: "Resident visa — Accumulated time (Art. 90)",
        html: paragraph("For foreigners with accumulated legal stay (generally 5 continuous years with M visa, or 2 years as M investor). Full content loading."),
      },
      "titulo-iii": {
        title: "Title III — Administrative procedures",
        html: paragraph("Articles 94–117. Cancellation, termination, appeals. Content loading progressively."),
      },
      "titulo-iv": {
        title: "Title IV — Immigration obligations",
        html: paragraph("Articles 118–120. Content loading progressively."),
      },
      "titulo-v": {
        title: "Title V — Final provisions",
        html: paragraph("Effective date, repeals, and transition regime. Content loading progressively."),
      },
    };
    const en = enMap[section.section_key];
    if (!en) return section;
    return { ...section, ...en };
  }),
};

const CATALOG = {
  "constitucion-colombia": [CONSTITUCION_ES, CONSTITUCION_EN],
  "resolucion-5477-2022": [RESOLUCION_5477_ES, RESOLUCION_5477_EN],
};

async function replaceSections(supabase, normId, sections) {
  const { error: delError } = await supabase.from("norm_sections").delete().eq("norm_id", normId);
  if (delError) throw delError;

  const idByKey = new Map();

  for (const section of sections) {
    const { data, error } = await supabase
      .from("norm_sections")
      .insert({
        norm_id: normId,
        parent_id: null,
        section_key: section.section_key,
        title: section.title,
        number_label: section.number_label ?? null,
        html: section.html ?? null,
        sort_order: section.sort_order ?? 0,
        depth: section.depth ?? 0,
      })
      .select("id, section_key")
      .single();

    if (error) throw error;
    idByKey.set(data.section_key, data.id);
  }

  for (const section of sections) {
    if (!section.parent_section_key) continue;
    const sectionId = idByKey.get(section.section_key);
    const parentId = idByKey.get(section.parent_section_key);
    if (!sectionId || !parentId) {
      throw new Error(`Missing parent ${section.parent_section_key} for ${section.section_key}`);
    }
    const { error } = await supabase
      .from("norm_sections")
      .update({ parent_id: parentId })
      .eq("id", sectionId);
    if (error) throw error;
  }
}

async function seedCatalogEntry(supabase, entry) {
  const { data: norm, error: normError } = await supabase
    .from("norms")
    .select("id")
    .eq("slug_key", entry.slug)
    .eq("locale", entry.locale)
    .maybeSingle();

  if (normError) throw normError;
  if (!norm) {
    console.warn(`  skip: norm not found ${entry.slug} (${entry.locale})`);
    return;
  }

  if (entry.official_source_url) {
    const { error: urlError } = await supabase
      .from("norms")
      .update({ official_source_url: entry.official_source_url })
      .eq("id", norm.id);
    if (urlError) throw urlError;
  }

  await replaceSections(supabase, norm.id, entry.sections);
  console.log(`  ✓ ${entry.slug} (${entry.locale}) — ${entry.sections.length} sections`);
}

async function main() {
  loadEnvLocal();

  const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const emitSql = process.argv.includes("--sql");
  const targets = slugs.length ? slugs : Object.keys(CATALOG);

  if (emitSql) {
    const statements = [];
    for (const slug of targets) {
      for (const entry of CATALOG[slug] ?? []) {
        statements.push(buildSqlForEntry(entry));
      }
    }
    process.stdout.write(statements.join("\n\n"));
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();

  if (!url || !serviceKey) {
    console.error(
      "Add SUPABASE_SERVICE_ROLE_KEY to .env.local, or run: node scripts/seed-norms-content.mjs --sql",
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("Seeding norm sections…");
  for (const slug of targets) {
    const entries = CATALOG[slug];
    if (!entries) {
      console.warn(`Unknown slug: ${slug}`);
      continue;
    }
    console.log(`\n${slug}`);
    for (const entry of entries) {
      await seedCatalogEntry(supabase, entry);
    }
  }
  console.log("\nDone.");
}

function sqlLiteral(value) {
  if (value == null) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function buildSqlForEntry(entry) {
  const lines = [];
  lines.push(
    `-- ${entry.slug} (${entry.locale})`,
    `update public.norms set official_source_url = ${sqlLiteral(entry.official_source_url)} where slug_key = ${sqlLiteral(entry.slug)} and locale = ${sqlLiteral(entry.locale)};`,
    `delete from public.norm_sections where norm_id = (select id from public.norms where slug_key = ${sqlLiteral(entry.slug)} and locale = ${sqlLiteral(entry.locale)});`,
  );

  for (const section of entry.sections) {
    lines.push(
      `insert into public.norm_sections (norm_id, parent_id, section_key, title, number_label, html, sort_order, depth) select n.id, null, ${sqlLiteral(section.section_key)}, ${sqlLiteral(section.title)}, ${sqlLiteral(section.number_label ?? null)}, ${sqlLiteral(section.html ?? null)}, ${section.sort_order ?? 0}, ${section.depth ?? 0} from public.norms n where n.slug_key = ${sqlLiteral(entry.slug)} and n.locale = ${sqlLiteral(entry.locale)};`,
    );
  }

  for (const section of entry.sections) {
    if (!section.parent_section_key) continue;
    lines.push(
      `update public.norm_sections child set parent_id = parent.id from public.norm_sections parent where child.norm_id = parent.norm_id and child.norm_id = (select id from public.norms where slug_key = ${sqlLiteral(entry.slug)} and locale = ${sqlLiteral(entry.locale)}) and child.section_key = ${sqlLiteral(section.section_key)} and parent.section_key = ${sqlLiteral(section.parent_section_key)};`,
    );
  }

  return lines.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
