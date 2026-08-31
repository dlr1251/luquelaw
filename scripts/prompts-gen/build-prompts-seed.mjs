#!/usr/bin/env node
/**
 * One-time generator for prompts-seed.json.
 * Run: node scripts/prompts-gen/build-prompts-seed.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "prompts-seed.json");

function p(enTitle, enDesc, enPrompt, esTitle, esDesc, esPrompt) {
  return {
    en: { title: enTitle, description: enDesc, prompt_text: enPrompt },
    es: { title: esTitle, description: esDesc, prompt_text: esPrompt },
  };
}

const entries = [
  {
    slug_key: "immigration-support-letter-draft",
    category: "Immigration",
    article_slug_key: "visas-ground-rules",
    use_case: "draft",
    sort_order: 10,
    as_skill: true,
    ...p(
      "Draft immigration support letter",
      "Letter template for visa or migratory procedures before Migración Colombia.",
      `You are assisting a Colombian immigration lawyer. Draft a support letter for a migratory procedure in Colombia.

Context to include from the user:
- Applicant full name, nationality, passport number
- Current visa or permit status
- Purpose of the letter (visa application, visa correction, prórroga, etc.)
- Relationship between signatory and applicant (employer, family, landlord, etc.)

Requirements:
- Formal Spanish suitable for Cancillería or Migración Colombia
- Reference applicable Resolution 5477 of 2022 categories where relevant
- State facts only; do not invent legal conclusions
- Include place for notarization if required
- End with a disclaimer that this is a draft for lawyer review

Output: full letter text in Spanish with bracketed placeholders for missing facts.`,
      "Redactar carta de soporte migratorio",
      "Plantilla de carta para trámites ante Migración Colombia o Cancillería.",
      `Actúas como apoyo a un abogado colombiano de migración. Redacta una carta de soporte para un trámite migratorio en Colombia.

Contexto que debe pedir al usuario:
- Nombre completo, nacionalidad y pasaporte del solicitante
- Estado migratorio actual
- Objeto de la carta (visa, corrección, prórroga, etc.)
- Vínculo entre quien firma y el solicitante

Requisitos:
- Español formal, apto para Cancillería o Migración Colombia
- Mencionar la Resolución 5477 de 2022 cuando aplique
- Solo hechos verificables; sin conclusiones jurídicas inventadas
- Espacio para notarización si procede
- Cierre indicando que es borrador para revisión del abogado

Entrega: texto completo en español con corchetes para datos faltantes.`,
    ),
  },
  {
    slug_key: "visa-m-error-review",
    category: "Immigration",
    article_slug_key: "migrant-visa-type-m-categories-requirements",
    use_case: "review",
    sort_order: 20,
    ...p(
      "Review Visa M refusal or error",
      "Analyze a Visa M denial, annotation error, or category mismatch.",
      `Review a Colombian Visa M (migrante) issue. The user will provide refusal text, passport stamps, or Migración records.

Analyze:
1. Stated legal basis (Resolution 5477/2022, Decreto 1067/2015)
2. Whether the applied category matches the facts (worker, investor, pensioner, etc.)
3. Procedural defects (missing documents, form errors, timing)
4. Available remedies: reconsideración, correction before Migración, new application, tutela if applicable
5. Risk of overstaying or accrual of fines

Output structure:
- Summary of facts
- Likely cause of error or denial
- Recommended next steps in order of preference
- Documents to gather
- Flags requiring in-person legal review`,
      "Revisar negativa o error en Visa M",
      "Analiza negación, error de anotación o categoría incorrecta en Visa M.",
      `Revisa un problema con Visa M (migrante) en Colombia. El usuario aportará negativa, sellos o registros de Migración.

Analiza:
1. Fundamento normativo citado (Res. 5477/2022, Decreto 1067/2015)
2. Si la categoría aplicada coincide con los hechos
3. Vicios procedimentales
4. Remedios: reconsideración, corrección, nueva solicitud, tutela si aplica
5. Riesgo de permanencia irregular o multas

Entrega: hechos, causa probable, pasos recomendados, documentos y alertas para revisión presencial.`,
    ),
  },
  {
    slug_key: "cancilleria-right-of-petition-draft",
    category: "Immigration",
    article_slug_key: "visas-ground-rules",
    use_case: "draft",
    sort_order: 30,
    as_skill: true,
    ...p(
      "Draft right of petition to Cancillería",
      "Derecho de petición for visa delays, errors, or document requests.",
      `Draft a derecho de petición addressed to the Ministry of Foreign Affairs (Cancillería) or its visa unit.

Include:
- Petitioner identification and contact
- Clear factual narrative with dates
- Specific petition (status update, correction, copy of file, explanation of delay)
- Legal basis: Constitución art. 23, Ley 1755/2015
- Annex list
- Request for written response within legal term

Tone: respectful, precise, non-adversarial unless facts require it.
Language: Spanish.
Mark placeholders for facts not provided.`,
      "Redactar derecho de petición a Cancillería",
      "Derecho de petición por demoras, errores o solicitud de información visa.",
      `Redacta un derecho de petición dirigido al Ministerio de Relaciones Exteriores (Cancillería) o unidad de visas.

Incluye:
- Identificación y contacto del peticionario
- Narrativa cronológica de hechos
- Petición concreta (estado, corrección, copia del expediente, explicación de demora)
- Fundamentos: Constitución art. 23, Ley 1755/2015
- Anexos
- Solicitud de respuesta escrita en término legal

Tono formal y preciso. Español. Corchetes para datos faltantes.`,
    ),
  },
  {
    slug_key: "tourism-stay-checklist",
    category: "Immigration",
    article_slug_key: "visitor-visa-type-v",
    use_case: "checklist",
    sort_order: 40,
    ...p(
      "Tourism stay compliance checklist",
      "Verify lawful stay limits and next steps for visitors in Colombia.",
      `Create a compliance checklist for a foreign national visiting Colombia on permitted entry (visa exempt, Visa V, or permiso de ingreso).

Cover:
- Maximum stay allowed under their nationality/category
- Migratory check-in (if applicable)
- Extensions (prórroga) eligibility and timing
- Transition options to Visa M if planning longer stay
- Overstay fines and exit requirements
- Documents to keep while in country

Format as numbered checklist with Yes/No/N/A columns and notes column.`,
      "Checklist de permanencia turística",
      "Verifica límites de estadía y opciones para visitantes en Colombia.",
      `Arma un checklist de cumplimiento para extranjero en Colombia con ingreso permitido (exento, Visa V o permiso).

Cubre:
- Tiempo máximo de permanencia según nacionalidad/categoría
- Check-in migratorio si aplica
- Prórroga: requisitos y plazos
- Opciones de transición a Visa M
- Multas por permanencia y salida
- Documentos a conservar

Formato: lista numerada con columnas Sí/No/N/A y notas.`,
    ),
  },
  {
    slug_key: "investor-visa-checklist",
    category: "Immigration",
    article_slug_key: "investor-visa",
    use_case: "checklist",
    sort_order: 50,
    as_skill: true,
    ...p(
      "Investor visa (Visa M) document checklist",
      "Step-by-step checklist for foreign direct investment visa applications.",
      `Build a document and compliance checklist for a Colombian Visa M — Investor category under Resolution 5477/2022.

Steps:
1. Confirm investment vehicle (SAS, branch, portfolio) and minimum thresholds
2. Banco de la República foreign investment registration (if applicable)
3. Corporate documents (certificado de existencia, RUT, estados financieros)
4. Proof of funds and lawful source
5. Passport, photos, insurance, background checks
6. Cancillería online application workflow
7. Post-approval: cédula de extranjería timeline
8. Common refusal points

Output: phased checklist (pre-application, application, post-approval) with responsible party column.`,
      "Checklist documental visa inversionista",
      "Lista paso a paso para Visa M inversionista e inversión extranjera.",
      `Arma checklist documental para Visa M — Inversionista (Res. 5477/2022).

Pasos:
1. Confirmar vehículo de inversión y montos mínimos
2. Registro ante Banco de la República si aplica
3. Documentos societarios y financieros
4. Prueba de fondos y origen lícito
5. Pasaporte, seguro, antecedentes
6. Trámite en plataforma Cancillería
7. Post-aprobación: cédula de extranjería
8. Causas frecuentes de negativa

Entrega: checklist por fases con columna de responsable.`,
    ),
  },
  {
    slug_key: "migratory-check-in-review",
    category: "Immigration",
    article_slug_key: "migratory-check-in",
    use_case: "review",
    sort_order: 60,
    ...p(
      "Review migratory check-in obligation",
      "Assess whether check-in is required and consequences of non-compliance.",
      `Review migratory check-in (Registro de Extranjeros / check-in) obligations for the user's facts.

Analyze nationality, port of entry, visa status, and dates.
Identify if check-in was required, deadline, and evidence of completion.
Note fines under Resolución 1067 and corrective steps.
Recommend documentation for future visa renewals.`,
      "Revisar obligación de check-in migratorio",
      "Evalúa si aplica check-in y consecuencias de incumplimiento.",
      `Revisa la obligación de check-in migratorio según los hechos del usuario.

Analiza nacionalidad, ingreso, visa y fechas.
Indica si era obligatorio, plazo y prueba de cumplimiento.
Señala multas (Decreto 1067) y pasos correctivos.
Recomienda documentación para futuras renovaciones.`,
    ),
  },
  {
    slug_key: "cedula-extranjeria-checklist",
    category: "Immigration",
    article_slug_key: "cedula-de-extranjeria-foreigner-id",
    use_case: "checklist",
    sort_order: 70,
    ...p(
      "Cédula de extranjería application checklist",
      "Documents and steps after visa approval for foreigner ID card.",
      `Checklist for cédula de extranjería application after visa approval.

Include: appointment with Migración Colombia, form, visa stamp, photos, fingerprinting, payment, pickup timeline, and address registration requirements.`,
      "Checklist cédula de extranjería",
      "Documentos y pasos para cédula después de aprobar la visa.",
      `Checklist para solicitar cédula de extranjería tras aprobar visa.

Incluye: cita Migración Colombia, formulario, visa, fotos, huellas, pago, retiro y registro de dirección.`,
    ),
  },
  {
    slug_key: "resident-visa-r-checklist",
    category: "Immigration",
    article_slug_key: "resident-visa-type-r",
    use_case: "checklist",
    sort_order: 80,
    ...p(
      "Resident visa (Type R) eligibility checklist",
      "Verify pathways to Visa R after qualifying residence period.",
      `Checklist for Visa R (residente) eligibility under Resolution 5477/2022.

Cover time in M status, continuous residence, financial solvency, clean record, and documentary evidence for each pathway (accumulated time, Colombian spouse, investment, etc.).`,
      "Checklist elegibilidad Visa R",
      "Verifica requisitos para visa residente tras tiempo calificado.",
      `Checklist de elegibilidad para Visa R (Res. 5477/2022).

Cubre tiempo en M, residencia continua, solvencia, antecedentes y soportes por vía (tiempo acumulado, cónyuge colombiano, inversión, etc.).`,
    ),
  },
  {
    slug_key: "digital-nomad-visa-review",
    category: "Immigration",
    article_slug_key: "digital-nomad-visa-type-m",
    use_case: "review",
    sort_order: 90,
    ...p(
      "Review digital nomad visa application",
      "Check remote-work visa requirements and common gaps.",
      `Review a Visa M digital nomad application package.

Verify: remote employment or freelance proof, minimum income threshold, health insurance, passport validity, and that activity is performed abroad for foreign clients/employer.

Flag misclassification risks if work is tied to Colombian employer.`,
      "Revisar solicitud visa nómada digital",
      "Verifica requisitos de visa para teletrabajo y vacíos frecuentes.",
      `Revisa paquete de Visa M nómada digital.

Verifica: contrato o independiente remoto, ingreso mínimo, seguro, pasaporte, que el trabajo sea para cliente/exterior extranjero.

Señala riesgo de reclasificación si hay empleador colombiano.`,
    ),
  },
  {
    slug_key: "deportation-sanctions-review",
    category: "Immigration",
    article_slug_key: "deportation-and-migratory-sanctions",
    use_case: "review",
    sort_order: 100,
    ...p(
      "Review deportation or migratory sanction",
      "Analyze expulsion orders, fines, and admissibility bars.",
      `Review deportation, expulsion, or migratory sanction notice.

Identify legal basis, appeal windows, fine amounts, re-entry bars, and whether administrative or judicial remedy applies.`,
      "Revisar deportación o sanción migratoria",
      "Analiza expulsión, multas e inadmisión.",
      `Revisa auto de deportación, expulsión o sanción migratoria.

Identifica fundamento, recursos, multas, barreras de reingreso y vía administrativa o judicial.`,
    ),
  },
  {
    slug_key: "urban-lease-review",
    category: "Real Estate",
    article_slug_key: "lease-agreement",
    use_case: "review",
    sort_order: 110,
    as_skill: true,
    ...p(
      "Review urban lease agreement",
      "Clause-by-clause review of residential lease under Ley 820/2003.",
      `Review an urban residential lease in Colombia (Ley 820/2003).

Analyze: term, rent adjustment index (IPC), deposit (depósito), maintenance fees (administración), sublease, termination notice, inventory (inventario), guarantor (codeudor), and registration with cámara de comercio if commercial use.

Output:
- Summary of parties and property
- Risk clauses highlighted
- Missing mandatory provisions
- Suggested redlines (without rewriting entire contract)`,
      "Revisar contrato de arrendamiento urbano",
      "Revisión por cláusulas bajo Ley 820/2003.",
      `Revisa contrato de arrendamiento urbano (Ley 820/2003).

Analiza: plazo, incremento (IPC), depósito, administración, subarriendo, preaviso, inventario, codeudor y registro en cámara si hay uso comercial.

Entrega: resumen, cláusulas de riesgo, faltantes legales y redlines sugeridas.`,
    ),
  },
  {
    slug_key: "purchase-promise-draft",
    category: "Real Estate",
    article_slug_key: "promise-to-purchase-agreement",
    use_case: "draft",
    sort_order: 120,
    as_skill: true,
    ...p(
      "Draft promise to purchase (promesa de compraventa)",
      "Outline key terms for real estate purchase promise.",
      `Draft outline for a promesa de compraventa of real property in Colombia.

Include: parties, property description (matrícula, linderos), price, payment schedule, earnest money (arras), conditions precedent (title study, liens, permits), closing date, penalty clause, broker commission, governing law, and notarization note.

Use placeholders; flag need for lawyer and notary review.`,
      "Redactar promesa de compraventa",
      "Estructura de promesa de compraventa inmobiliaria.",
      `Redacta esquema de promesa de compraventa inmobiliaria en Colombia.

Incluye: partes, inmueble (matrícula, linderos), precio, pagos, arras, condiciones (estudio de títulos, gravámenes), cierre, cláusula penal, comisión, ley aplicable y nota de revisión notarial.

Usa corchetes; advierte revisión de abogado y notaría.`,
    ),
  },
  {
    slug_key: "real-estate-guarantees-checklist",
    category: "Real Estate",
    article_slug_key: "real-estate-transactions",
    use_case: "checklist",
    sort_order: 130,
    ...p(
      "Real estate guarantees checklist",
      "Verify mortgages, liens, and encumbrances before closing.",
      `Checklist of guarantees and encumbrances for Colombian real estate due diligence.

Cover: certificado de tradición y libertad, hipotecas, embargos, servidumbres, urbanistic licenses, property tax (predial) status, horizontal property debts, and seller authorization if entity.`,
      "Checklist de garantías inmobiliarias",
      "Verifica hipotecas, gravámenes y limitaciones al dominio.",
      `Checklist de garantías y gravámenes en due diligence inmobiliario.

Cubre: tradición y libertad, hipotecas, embargos, servidumbres, licencias, predial, deudas de propiedad horizontal y facultades del vendedor.`,
    ),
  },
  {
    slug_key: "real-estate-due-diligence-checklist",
    category: "Real Estate",
    article_slug_key: "real-estate-transactions",
    use_case: "checklist",
    sort_order: 140,
    as_skill: true,
    ...p(
      "Real estate due diligence checklist",
      "Full pre-closing diligence for property purchases.",
      `Full due diligence checklist for purchasing real property in Colombia.

Phases:
1. Title and ownership chain
2. Urban/rural zoning and estrato
3. Lease or occupation status
4. Tax and utility certificates
5. Entity seller compliance
6. Foreign buyer FX registration if applicable
7. Closing documents (escritura, registro)

Include responsible professional for each item.`,
      "Checklist due diligence inmobiliario",
      "Diligencia completa previa al cierre de compraventa.",
      `Checklist integral de due diligence para compra inmobiliaria.

Fases: título, zonificación, arrendamiento/ocupación, impuestos y servicios, vendedor persona jurídica, registro cambiario comprador extranjero, documentos de cierre.

Indica responsable profesional por ítem.`,
    ),
  },
  {
    slug_key: "horizontal-property-review",
    category: "Real Estate",
    article_slug_key: "horizontal-property-regime",
    use_case: "review",
    sort_order: 150,
    ...p(
      "Review horizontal property regime compliance",
      "Assess PH regulations, bylaws, and administrator obligations.",
      `Review horizontal property (propiedad horizontal) issues for a unit purchase or lease.

Check reglamento de propiedad horizontal, assembly minutes, administrator contracts, common expense arrears, and parking/storage coefficient assignments.`,
      "Revisar régimen de propiedad horizontal",
      "Evalúa reglamento, cuotas y obligaciones del administrador.",
      `Revisa propiedad horizontal para compra o arriendo.

Verifica reglamento, actas, contrato de administración, mora en expensas y coeficientes de parqueadero/bodega.`,
    ),
  },
  {
    slug_key: "closing-costs-checklist",
    category: "Real Estate",
    article_slug_key: "real-estate-purchase-closing-costs",
    use_case: "checklist",
    sort_order: 160,
    ...p(
      "Real estate closing costs checklist",
      "Estimate notary, registration, and tax costs at closing.",
      `Checklist of closing costs for Colombian real estate purchase.

Include: notary fees, registration (registro), beneficiary participation tax (beneficencia) if applicable, withholding (retención en la fuente) for sellers, broker fees, and FX settlement steps for foreign buyers.`,
      "Checklist costos de cierre inmobiliario",
      "Estima notaría, registro e impuestos al cierre.",
      `Checklist de costos de cierre en compraventa inmobiliaria.

Incluye: notaría, registro, beneficencia si aplica, retención al vendedor, comisión de corretaje y liquidación cambiaria para comprador extranjero.`,
    ),
  },
  {
    slug_key: "property-title-review",
    category: "Real Estate",
    article_slug_key: "real-property-rights",
    use_case: "review",
    sort_order: 170,
    ...p(
      "Review property title certificate",
      "Analyze certificado de tradición y libertad findings.",
      `Review findings from a certificado de tradición y libertad.

Summarize ownership chain, annotations, pending registrations, and red flags (embargos, pending lawsuits, gaps in chain). Recommend further certificates or notary queries.`,
      "Revisar certificado de tradición",
      "Analiza hallazgos del certificado de tradición y libertad.",
      `Revisa certificado de tradición y libertad.

Resume cadena de dominio, anotaciones, registros pendientes y alertas (embargos, litigios, saltos en la cadena). Recomienda certificados adicionales.`,
    ),
  },
  {
    slug_key: "employment-contract-draft",
    category: "Labor",
    article_slug_key: "employment-contract",
    use_case: "draft",
    sort_order: 210,
    as_skill: true,
    ...p(
      "Draft employment contract",
      "Colombian individual employment contract under Código Sustantivo del Trabajo.",
      `Draft an individual employment contract under Colombian labor law (CST).

Include: parties, role, salary and benefits, work location, term (indefinido/fijo/obra), schedule, probation period within legal limits, confidentiality, IP assignment, termination grounds reference, and social security obligations.

Do not include illegal clauses (e.g., waiving mandatory benefits).
Language per user request (Spanish default).
Mark placeholders.`,
      "Redactar contrato de trabajo",
      "Contrato individual de trabajo bajo CST colombiano.",
      `Redacta contrato individual de trabajo (CST).

Incluye: partes, cargo, salario y prestaciones, lugar, término, horario, periodo de prueba legal, confidencialidad, cesión de PI, remisión a justas causas, seguridad social.

Sin cláusulas ilegales. Español por defecto. Corchetes para datos.`,
    ),
  },
  {
    slug_key: "termination-review",
    category: "Labor",
    article_slug_key: "termination-of-employment-contract",
    use_case: "review",
    sort_order: 220,
    as_skill: true,
    ...p(
      "Review employment termination",
      "Assess just cause, notice, and severance exposure.",
      `Review a Colombian employment termination scenario.

Analyze: contract type, cause invoked (justa causa vs. unilateral), preaviso, cesantías/intereses, prima, vacaciones, fines under CST, and risk of reinstatement or labor inspection claims.

Output: exposure summary and safer alternative paths if termination is weak.`,
      "Revisar terminación laboral",
      "Evalúa justa causa, preaviso e indemnizaciones.",
      `Revisa terminación de contrato de trabajo en Colombia.

Analiza: tipo de contrato, causa, preaviso, cesantías, prima, vacaciones, sanciones y riesgo de reintegro o reclamación.

Entrega: exposición y alternativas más seguras si la causa es débil.`,
    ),
  },
  {
    slug_key: "subordination-analysis",
    category: "Labor",
    article_slug_key: "subordination-in-employment",
    use_case: "review",
    sort_order: 230,
    ...p(
      "Analyze subordination vs. independent contractor",
      "Detect labor misclassification risk in service contracts.",
      `Analyze whether a working relationship is employment (subordinación) or legitimate independent services under Colombian law.

Review: schedule control, exclusivity, tools, payment method, benefits, and contract labels.

Conclude misclassification risk level and suggest structural changes.`,
      "Analizar subordinación vs. prestación de servicios",
      "Detecta riesgo de contrato laboral encubierto.",
      `Analiza si la relación es laboral (subordinación) o prestación de servicios legítima.

Revisa: horario, exclusividad, herramientas, pago, prestaciones y etiquetas contractuales.

Concluye nivel de riesgo y ajustes sugeridos.`,
    ),
  },
  {
    slug_key: "remote-work-policy-draft",
    category: "Labor",
    article_slug_key: "remote-work",
    use_case: "draft",
    sort_order: 240,
    ...p(
      "Draft remote work policy",
      "Internal policy aligned with teletrabajo rules in Colombia.",
      `Draft a remote work (teletrabajo) policy for a Colombian employer.

Cover: eligibility, equipment, ergonomics, data security, working hours, expense reimbursement, occupational health, and hybrid office rules per Ley 1221/2008 and recent regulation.

For internal HR use; lawyer review required.`,
      "Redactar política de teletrabajo",
      "Política interna alineada con teletrabajo en Colombia.",
      `Redacta política de teletrabajo para empleador colombiano.

Cubre: elegibilidad, equipos, ergonomía, datos, horario, reembolsos, salud ocupacional e híbrido según Ley 1221/2008.

Uso interno; requiere revisión jurídica.`,
    ),
  },
  {
    slug_key: "service-contract-vs-employment",
    category: "Labor",
    article_slug_key: "service-provision-contract",
    use_case: "review",
    sort_order: 250,
    ...p(
      "Review service provision contract",
      "Check independent contractor agreement for labor law compliance.",
      `Review a prestación de servicios contract for labor misclassification and tax withholding obligations.

Flag clauses implying subordination; note retención en la fuente and invoice requirements.`,
      "Revisar contrato de prestación de servicios",
      "Verifica encubrimiento laboral y retenciones.",
      `Revisa contrato de prestación de servicios.

Señala subordinación encubierta; indica retención en la fuente y facturación.`,
    ),
  },
  {
    slug_key: "severance-calculation-checklist",
    category: "Labor",
    article_slug_key: "severance-pay",
    use_case: "checklist",
    sort_order: 260,
    ...p(
      "Severance calculation checklist",
      "Verify cesantías, interest, prima, and vacation payouts.",
      `Checklist to calculate Colombian termination payouts.

Items: salario base, auxilio de transporte, average commissions, cesantías, intereses cesantías, prima semestral, vacaciones, indemnización if applicable, and parcialidades timing.`,
      "Checklist cálculo de liquidación",
      "Verifica cesantías, intereses, prima y vacaciones.",
      `Checklist para liquidación laboral.

Ítems: salario, auxilio transporte, comisiones, cesantías, intereses, prima, vacaciones, indemnización y plazos de pago.`,
    ),
  },
  {
    slug_key: "probation-period-review",
    category: "Labor",
    article_slug_key: "probation-period",
    use_case: "review",
    sort_order: 270,
    ...p(
      "Review probation period clause",
      "Validate periodo de prueba duration and termination rules.",
      `Review periodo de prueba clause in employment contract.

Verify duration limits under CST, termination without cause during trial, and conversion to indefinite term.`,
      "Revisar periodo de prueba",
      "Valida duración y terminación en periodo de prueba.",
      `Revisa cláusula de periodo de prueba.

Verifica límites legales, terminación sin justa causa en prueba y conversión a término indefinido.`,
    ),
  },
  {
    slug_key: "notice-requirements-checklist",
    category: "Labor",
    article_slug_key: "notice-requirements",
    use_case: "checklist",
    sort_order: 280,
    ...p(
      "Labor notice (preaviso) checklist",
      "Confirm preaviso length and written requirements.",
      `Checklist for preaviso compliance on Colombian employment termination.

Include salary threshold rules, written notice, payment in lieu option, and interaction with just cause terminations.`,
      "Checklist de preaviso laboral",
      "Confirma duración y requisitos de preaviso.",
      `Checklist de preaviso en terminación laboral.

Incluye reglas por salario, aviso escrito, pago en lugar de preaviso e interacción con justa causa.`,
    ),
  },
  {
    slug_key: "sas-incorporation-checklist",
    category: "Corporate",
    article_slug_key: "sas-simplified-stock-company",
    use_case: "checklist",
    sort_order: 310,
    as_skill: true,
    ...p(
      "SAS incorporation checklist",
      "Steps to incorporate a Simplified Stock Company in Colombia.",
      `Checklist to incorporate a SAS in Colombia (Ley 1258/2008).

Phases:
1. Name availability (cámara de comercio)
2. Bylaws (estatutos) and shareholder decisions
3. Legal representative appointment
4. Registration and NIT/RUT
5. Bank account and capital payment
6. Books and corporate governance baseline
7. Foreign investment registration if foreign shareholder

Assign typical professional for each step.`,
      "Checklist constitución SAS",
      "Pasos para constituir una SAS en Colombia.",
      `Checklist de constitución de SAS (Ley 1258/2008).

Fases: nombre, estatutos, representante legal, registro y RUT, cuenta bancaria y capital, libros, registro de inversión extranjera si aplica.

Asigna profesional típico por paso.`,
    ),
  },
  {
    slug_key: "shareholders-agreement-draft",
    category: "Corporate",
    article_slug_key: "shareholders-agreement",
    use_case: "draft",
    sort_order: 320,
    as_skill: true,
    ...p(
      "Draft shareholders agreement (SAS)",
      "Outline accionistas agreement for Colombian SAS.",
      `Draft outline for a shareholders agreement among SAS quotaholders.

Include: governance, reserved matters, transfer restrictions (ROFR/tag/drag), deadlock, non-compete limits under Colombian law, dividend policy, and dispute resolution (arbitration clause outline).

Note interaction with estatutos and need for notarized forms where required.`,
      "Redactar acuerdo de accionistas SAS",
      "Estructura de acuerdo entre accionistas en SAS.",
      `Redacta esquema de acuerdo de accionistas en SAS.

Incluye: gobierno, materias reservadas, restricciones de transferencia, deadlock, no competencia dentro de límites legales, dividendos y arbitraje.

Nota interacción con estatutos y formalidades.`,
    ),
  },
  {
    slug_key: "powers-of-attorney-corporate-draft",
    category: "Corporate",
    article_slug_key: "power-of-attorney",
    use_case: "draft",
    sort_order: 330,
    ...p(
      "Draft corporate power of attorney",
      "Poder for legal representative or special attorney-in-fact.",
      `Draft outline for a corporate poder (special or general) under Colombian law.

Specify grantor entity, attorney powers (litigation, contracts, banking, administrative), limits, substitution, term, and notarization requirements.`,
      "Redactar poder societario",
      "Poder del representante legal o apoderado especial.",
      `Redacta esquema de poder societario (general o especial).

Indica otorgante, facultades (litigio, contratos, banca, administrativo), límites, sustitución, término y notarización.`,
    ),
  },
  {
    slug_key: "board-minutes-draft",
    category: "Corporate",
    article_slug_key: "sas-general-assembly-s-acts",
    use_case: "draft",
    sort_order: 340,
    as_skill: true,
    ...p(
      "Draft SAS assembly minutes",
      "Acta de asamblea de accionistas for ordinary or extraordinary decisions.",
      `Draft minutes (acta) for a SAS shareholders assembly.

Include: quorum, agenda, decisions (capital, manager appointment, financial statements approval, dividend declaration), voting record, and signatures.

Follow Ley 1258 formalities; mark placeholders for dates and names.`,
      "Redactar acta de asamblea SAS",
      "Acta de asamblea ordinaria o extraordinaria.",
      `Redacta acta de asamblea de accionistas SAS.

Incluye: quórum, orden del día, decisiones (capital, gerente, estados, dividendos), votación y firmas.

Formalidades Ley 1258; corchetes para fechas y nombres.`,
    ),
  },
  {
    slug_key: "legal-representative-review",
    category: "Corporate",
    article_slug_key: "legal-representative-in-sas",
    use_case: "review",
    sort_order: 350,
    ...p(
      "Review legal representative appointment",
      "Verify representante legal authority and registration.",
      `Review appointment and powers of SAS legal representative.

Check estatutos, registration with cámara, joint signature rules, and liability exposure for unauthorized acts.`,
      "Revisar nombramiento representante legal",
      "Verifica facultades y registro del representante legal.",
      `Revisa nombramiento del representante legal SAS.

Verifica estatutos, registro en cámara, firma conjunta y responsabilidad por actos no autorizados.`,
    ),
  },
  {
    slug_key: "sas-dissolution-checklist",
    category: "Corporate",
    article_slug_key: "dissolution-and-liquidation-of-sas",
    use_case: "checklist",
    sort_order: 360,
    ...p(
      "SAS dissolution and liquidation checklist",
      "Steps to dissolve and liquidate a SAS.",
      `Checklist for SAS dissolution and liquidation.

Cover shareholder resolution, liquidator appointment, creditor notice, DIAN filings, final balance, and registry cancellation.`,
      "Checklist disolución y liquidación SAS",
      "Pasos para disolver y liquidar una SAS.",
      `Checklist de disolución y liquidación SAS.

Incluye acuerdo de accionistas, liquidador, aviso a acreedores, DIAN, balance final y cancelación registral.`,
    ),
  },
  {
    slug_key: "company-formation-comparison",
    category: "Corporate",
    article_slug_key: "company-formation-types-of-legal-entities",
    use_case: "checklist",
    sort_order: 370,
    ...p(
      "Compare legal entity types",
      "SAS vs S.A. vs Ltda. for foreign investors.",
      `Comparison checklist: SAS, S.A., and Ltda. for a foreign investor entering Colombia.

Compare liability, capital, governance flexibility, transfer of shares, tax treatment overview, and typical use cases.`,
      "Comparar tipos societarios",
      "SAS vs S.A. vs Ltda. para inversionistas extranjeros.",
      `Cuadro comparativo SAS, S.A. y Ltda. para inversionista extranjero.

Compara responsabilidad, capital, gobierno, transferencia de cuotas/acciones, tratamiento tributario general y casos típicos.`,
    ),
  },
  {
    slug_key: "franchise-agreement-review",
    category: "Corporate",
    article_slug_key: "franchise-agreement",
    use_case: "review",
    sort_order: 380,
    ...p(
      "Review franchise agreement",
      "Key clauses for franchisor/franchisee under Colombian commercial law.",
      `Review franchise contract under Colombian law.

Focus: IP license, territory, fees, exclusivity, termination, non-compete, supply obligations, and dispute forum.`,
      "Revisar contrato de franquicia",
      "Cláusulas clave para franquiciante y franquiciado.",
      `Revisa contrato de franquicia.

Enfócate en licencia de PI, territorio, tarifas, exclusividad, terminación, no competencia, suministros y foro.`,
    ),
  },
  {
    slug_key: "tax-residency-checklist",
    category: "Tax",
    article_slug_key: "tax-residency-in-colombia",
    use_case: "checklist",
    sort_order: 410,
    as_skill: true,
    ...p(
      "Tax residency determination checklist",
      "183-day rule and ties test for Colombian tax residency.",
      `Checklist to assess Colombian tax residency (Estatuto Tributario).

Cover 183-day presence, core of vital interests, permanent home, center of economic interests, and treaty tie-breaker if dual residency risk.

Note filing obligations and foreign asset reporting triggers.`,
      "Checklist residencia fiscal",
      "Regla 183 días y prueba de vínculos en Colombia.",
      `Checklist de residencia fiscal colombiana.

Cubre 183 días, intereses vitales, hogar permanente, centro de intereses económicos y convenio si hay doble residencia.

Indica obligaciones declarativas y activos en el exterior.`,
    ),
  },
  {
    slug_key: "fx-regulations-review",
    category: "Tax",
    article_slug_key: "foreign-exchange-regulations",
    use_case: "review",
    sort_order: 420,
    as_skill: true,
    ...p(
      "Review foreign exchange compliance",
      "Banco de la República registration and channel requirements.",
      `Review FX compliance for a transaction involving Colombia.

Analyze: registration of foreign investment, import/export documentation, loan registration, dividend remittance, and applicable Exchange Regime (Régimen Cambiario) violations risk.

Cite relevant Banco de la República resolutions conceptually; user must verify current circulars.`,
      "Revisar cumplimiento cambiario",
      "Registro ante BanRep y canalización de divisas.",
      `Revisa cumplimiento cambiario en operación con Colombia.

Analiza: registro de inversión, import/export, registro de crédito, remesa de dividendos y riesgo de infracción al Régimen Cambiario.

Referencia normativa BanRep; verificar circulares vigentes.`,
    ),
  },
  {
    slug_key: "corporate-income-tax-review",
    category: "Tax",
    article_slug_key: "corporate-income-tax",
    use_case: "review",
    sort_order: 430,
    ...p(
      "Review corporate income tax position",
      "High-level CIT review for Colombian entity.",
      `Review corporate income tax considerations for a Colombian company.

Cover taxable income concepts, non-deductibles, thin capitalization note, transfer pricing flag, and filing calendar with DIAN.`,
      "Revisar renta corporativa",
      "Revisión general de impuesto de renta societario.",
      `Revisa impuesto de renta de sociedad colombiana.

Cubre ingreso gravable, no deducibles, endeudamiento, precios de transferencia y calendario DIAN.`,
    ),
  },
  {
    slug_key: "vat-compliance-checklist",
    category: "Tax",
    article_slug_key: "vat-in-colombia",
    use_case: "checklist",
    sort_order: 440,
    ...p(
      "VAT compliance checklist",
      "IVA registration, invoicing, and filing obligations.",
      `VAT (IVA) compliance checklist for Colombian business.

Include RUT IVA responsibility, electronic invoicing (facturación electrónica), rates, excluded services, withholding IVA, and bimonthly filing.`,
      "Checklist cumplimiento IVA",
      "Registro, facturación electrónica y declaraciones.",
      `Checklist de IVA en Colombia.

Incluye responsabilidad en RUT, facturación electrónica, tarifas, exclusiones, retención de IVA y declaración bimestral.`,
    ),
  },
  {
    slug_key: "withholding-tax-review",
    category: "Tax",
    article_slug_key: "withholding-tax-on-foreign-payments",
    use_case: "review",
    sort_order: 450,
    ...p(
      "Review withholding on foreign payments",
      "Retención en la fuente on cross-border services and royalties.",
      `Review withholding tax on payments abroad from Colombia.

Identify service type, treaty relief, certificate requirements, and declaratory duties of local payer.`,
      "Revisar retención en pagos al exterior",
      "Retención en servicios y regalías transfronterizas.",
      `Revisa retención en pagos al exterior desde Colombia.

Identifica tipo de servicio, beneficio en convenio, certificados y obligaciones del pagador local.`,
    ),
  },
  {
    slug_key: "tax-year-filing-checklist",
    category: "Tax",
    article_slug_key: "tax-year-and-filing",
    use_case: "checklist",
    sort_order: 460,
    ...p(
      "Annual income tax filing checklist",
      "Declaración de renta preparation for individuals or companies.",
      `Checklist to prepare declaración de renta in Colombia.

Gather financial statements, supporting schedules, foreign asset form if applicable, previous year carryforwards, and DIAN submission window.`,
      "Checklist declaración de renta",
      "Preparación de renta para persona natural o jurídica.",
      `Checklist para declaración de renta.

Reúne estados financieros, anexos, activos en el exterior si aplica, pérdidas arrastrables y ventana DIAN.`,
    ),
  },
  {
    slug_key: "permanent-establishment-analysis",
    category: "Tax",
    article_slug_key: "permanent-establishment",
    use_case: "review",
    sort_order: 470,
    ...p(
      "Permanent establishment risk analysis",
      "PE exposure for foreign company operating in Colombia.",
      `Analyze permanent establishment (establecimiento permanente) risk for foreign entity activity in Colombia.

Review fixed place, dependent agent, construction PE, and service PE concepts; suggest structural mitigations.`,
      "Análisis riesgo establecimiento permanente",
      "EP por actividad de empresa extranjera en Colombia.",
      `Analiza riesgo de establecimiento permanente de empresa extranjera.

Revisa lugar fijo, agente dependiente, obra y servicios; sugiere mitigaciones.`,
    ),
  },
  {
    slug_key: "dividend-distribution-review",
    category: "Tax",
    article_slug_key: "dividend-distribution",
    use_case: "review",
    sort_order: 480,
    ...p(
      "Review dividend distribution",
      "Tax and corporate steps to pay dividends to shareholders.",
      `Review dividend distribution from Colombian company.

Cover shareholder approval, fiscal transparency, withholding on dividends to foreigners, FX remittance, and accounting entries.`,
      "Revisar distribución de dividendos",
      "Pasos societarios y tributarios para pagar dividendos.",
      `Revisa distribución de dividendos.

Incluye acuerdo social, transparencia fiscal, retención a extranjeros, remesa cambiaria y contabilidad.`,
    ),
  },
  {
    slug_key: "civil-marriage-checklist",
    category: "Family",
    article_slug_key: "civil-marriage-in-colombia",
    use_case: "checklist",
    sort_order: 510,
    as_skill: true,
    ...p(
      "Civil marriage requirements checklist",
      "Notary marriage requirements for nationals and foreigners.",
      `Checklist for civil marriage before Colombian notary.

Documents for nationals/foreigners, prior marital status certificates, apostille/translation, publication of bans if required, and patrimonial regime choice (sociedad conyugal vs. separación).`,
      "Checklist matrimonio civil",
      "Requisitos notariales para nacionales y extranjeros.",
      `Checklist de matrimonio civil ante notaría.

Documentos, soltería, apostilla/traducción, publicación de edictos si aplica y régimen patrimonial.`,
    ),
  },
  {
    slug_key: "divorce-grounds-review",
    category: "Family",
    article_slug_key: "divorce-grounds",
    use_case: "review",
    sort_order: 520,
    ...p(
      "Review divorce grounds and process",
      "Causal and procedural path for divorce in Colombia.",
      `Review divorce strategy under Colombian family law.

Identify applicable causal (mutual consent, breach, etc.), property regime implications, alimony preview, and court vs. notary route.`,
      "Revisar causales y proceso de divorcio",
      "Vía procesal y patrimonial del divorcio.",
      `Revisa estrategia de divorcio.

Identifica causal, régimen patrimonial, alimentos y ruta notarial o judicial.`,
    ),
  },
  {
    slug_key: "common-law-union-checklist",
    category: "Family",
    article_slug_key: "common-law-union",
    use_case: "checklist",
    sort_order: 530,
    ...p(
      "Common-law union (UMH) proof checklist",
      "Documentary evidence for marital union of hecho.",
      `Checklist to prove unión marital de hecho in Colombia.

Evidence of cohabitation, community of life, duration, joint assets, public reputation; notarial declaration or judicial process options.`,
      "Checklist prueba unión marital de hecho",
      "Soportes para UMH y declaración notarial o judicial.",
      `Checklist para probar unión marital de hecho.

Convivencia, comunidad de vida, tiempo, bienes comunes, reputación; vía notarial o judicial.`,
    ),
  },
  {
    slug_key: "custody-agreement-draft",
    category: "Family",
    article_slug_key: "custody",
    use_case: "draft",
    sort_order: 540,
    as_skill: true,
    ...p(
      "Draft custody and visitation arrangement",
      "Outline cuidado personal and visitation schedule.",
      `Draft outline for child custody (cuidado personal) and visitation (regimen de visitas) in Colombia.

Prioritize best interest of child; include decision-making, schedule, holidays, travel abroad consent, and modification mechanism.

For lawyer review; do not assume specific court outcome.`,
      "Redactar acuerdo de custodia y visitas",
      "Esquema de cuidado personal y régimen de visitas.",
      `Redacta esquema de cuidado personal y visitas.

Prioriza interés superior del menor; incluye decisiones, calendario, vacaciones, viajes al exterior y modificación.

Para revisión del abogado.`,
    ),
  },
  {
    slug_key: "general-power-of-attorney-draft",
    category: "Civil",
    article_slug_key: "power-of-attorney",
    use_case: "draft",
    sort_order: 610,
    as_skill: true,
    ...p(
      "Draft general power of attorney",
      "General poder for personal or property matters.",
      `Draft outline for general power of attorney (poder general) under Colombian civil law.

Define grantor, attorney-in-fact, general vs. special powers (administration, litigation), term, revocation, and notarization.

Warn about fraud risks with broad powers.`,
      "Redactar poder general",
      "Poder general para actos personales o patrimoniales.",
      `Redacta esquema de poder general (Código Civil).

Otorgante, apoderado, facultades generales o especiales, término, revocatoria y notarización.

Advierte riesgos de fraude con facultades amplias.`,
    ),
  },
  {
    slug_key: "sale-contract-draft",
    category: "Civil",
    article_slug_key: "sale-contract",
    use_case: "draft",
    sort_order: 620,
    as_skill: true,
    ...p(
      "Draft movable or immovable sale contract",
      "Compraventa outline with delivery and warranty clauses.",
      `Draft outline for compraventa under Colombian civil/commercial law.

Include: object description, price, payment, delivery, warranties (eviction and hidden defects), conditions, and dispute resolution.

Specify if movable vs. real property (note notary/registration for real property).`,
      "Redactar contrato de compraventa",
      "Esquema con entrega y saneamiento.",
      `Redacta esquema de compraventa.

Objeto, precio, pago, entrega, saneamiento por evicción y vicios ocultos, condiciones y solución de controversias.

Diferencia mueble vs. inmueble (notaría/registro).`,
    ),
  },
  {
    slug_key: "prenuptial-agreement-review",
    category: "Family",
    article_slug_key: "prenuptial-agreement",
    use_case: "review",
    sort_order: 550,
    ...p(
      "Review prenuptial agreement (capitulaciones)",
      "Capitulaciones matrimoniales and patrimonial regime.",
      `Review capitulaciones matrimoniales or prenuptial agreement.

Check patrimonial regime choice, asset lists, future acquisitions, notarization, and registration requirements.`,
      "Revisar capitulaciones matrimoniales",
      "Régimen patrimonial y formalidades.",
      `Revisa capitulaciones matrimoniales.

Verifica régimen, inventario de bienes, adquisiciones futuras, notaría y registro.`,
    ),
  },
  {
    slug_key: "alimony-calculation-review",
    category: "Family",
    article_slug_key: "alimony",
    use_case: "review",
    sort_order: 560,
    ...p(
      "Review alimony (cuota alimentaria) estimate",
      "Factors for food allowance under Colombian family law.",
      `Review alimony estimate for spouse or child.

Apply needs vs. capacity analysis, income evidence, and provisional vs. definitive cuota; note judicial discretion.`,
      "Revisar cuota alimentaria",
      "Factores de necesidad y capacidad.",
      `Revisa estimación de cuota alimentaria.

Contrasta necesidad y capacidad, prueba de ingresos y cuota provisional vs. definitiva.`,
    ),
  },
  {
    slug_key: "marital-partnership-liquidation",
    category: "Family",
    article_slug_key: "liquidation-of-marital-partnership",
    use_case: "checklist",
    sort_order: 570,
    ...p(
      "Marital partnership liquidation checklist",
      "Liquidación sociedad conyugal after divorce or death.",
      `Checklist to liquidate sociedad conyugal.

Inventory assets/debts, active/passive allocation, compensations, and notarial or judicial approval path.`,
      "Checklist liquidación sociedad conyugal",
      "Inventario y adjudicación tras divorcio o muerte.",
      `Checklist de liquidación de sociedad conyugal.

Inventario, activos/pasivos, compensaciones y vía notarial o judicial.`,
    ),
  },
  {
    slug_key: "succession-planning-checklist",
    category: "Family",
    article_slug_key: "succession-and-inheritance-law",
    use_case: "checklist",
    sort_order: 580,
    ...p(
      "Succession planning checklist",
      "Wills, forced heirship, and estate administration basics.",
      `Checklist for succession planning in Colombia.

Cover legitimate portions (legítima), will types, foreign assets, life insurance beneficiaries, and matrimonial property interaction.`,
      "Checklist planificación sucesoral",
      "Testamento, legítima y administración de herencia.",
      `Checklist de sucesión en Colombia.

Legítima, tipos de testamento, bienes en el exterior, seguros y régimen patrimonial.`,
    ),
  },
  {
    slug_key: "foreign-investment-registration-checklist",
    category: "Immigration",
    article_slug_key: "foreign-investment-registration",
    use_case: "checklist",
    sort_order: 105,
    ...p(
      "Foreign investment registration checklist",
      "BanRep Form 4 and FX registration for inbound investment.",
      `Checklist for foreign direct investment registration with Banco de la República.

Identify Form 4 timing, supporting documents, capital contributions vs. portfolio, and link to investor visa if applicable.`,
      "Checklist registro inversión extranjera",
      "Formulario 4 BanRep para inversión entrante.",
      `Checklist de registro de inversión extranjera ante BanRep.

Formulario 4, soportes, aporte vs. cartera y vínculo con visa inversionista.`,
    ),
  },
  {
    slug_key: "lease-deposit-review",
    category: "Real Estate",
    article_slug_key: "lease-agreement",
    use_case: "review",
    sort_order: 175,
    ...p(
      "Review lease deposit (depósito) terms",
      "Validate deposit amount and return conditions.",
      `Review depósito (security deposit) clauses in Colombian lease.

Check maximum amounts under Ley 820, interest, deductions allowed, return timeline, and inventory linkage.`,
      "Revisar depósito en arrendamiento",
      "Monto, deducciones y devolución del depósito.",
      `Revisa cláusulas de depósito en arrendamiento.

Verifica topes Ley 820, intereses, deducciones, plazo de devolución e inventario.`,
    ),
  },
  {
    slug_key: "social-security-labor-checklist",
    category: "Labor",
    article_slug_key: "social-security-contributions",
    use_case: "checklist",
    sort_order: 285,
    ...p(
      "Employer social security checklist",
      "EPS, pension, ARL, and parafiscales enrollment.",
      `Checklist for employer social security compliance in Colombia.

Register employees with EPS, pension, ARL risk class, caja de compensación, SENA, ICBF, and monthly PILA payment.`,
      "Checklist seguridad social empleador",
      "Afiliaciones EPS, pensión, ARL y parafiscales.",
      `Checklist de seguridad social del empleador.

Afiliación EPS, pensión, ARL, caja, SENA, ICBF y PILA mensual.`,
    ),
  },
  {
    slug_key: "double-taxation-treaty-review",
    category: "Tax",
    article_slug_key: "double-taxation-treaties",
    use_case: "review",
    sort_order: 485,
    ...p(
      "Review double taxation treaty benefit",
      "Treaty relief on cross-border income flows.",
      `Review whether a tax treaty reduces withholding on payment between treaty countries and Colombia.

Identify article, limitation on benefits, certificate of residency, and domestic law interaction.`,
      "Revisar beneficio de convenio tributario",
      "Alivio de doble imposición en pagos transfronterizos.",
      `Revisa si un convenio reduce retención en pago entre Colombia y otro Estado.

Identifica artículo, limitación de beneficios, certificado de residencia e interacción con ley interna.`,
    ),
  },
];

if (entries.length < 52) {
  throw new Error(`Expected at least 52 entries, got ${entries.length}`);
}

writeFileSync(OUT, JSON.stringify(entries, null, 2) + "\n", "utf8");
console.log(`Wrote ${entries.length} entries to ${OUT}`);
const skills = entries.filter((e) => e.as_skill).length;
console.log(`Marked ${skills} entries as skills`);
