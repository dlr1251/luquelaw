#!/usr/bin/env node
/**
 * Builds topics-seed.json from Notion CLKR topics export (por-módulo view).
 * Run: node scripts/clkr-gen/build-topics-seed.mjs
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "topics-seed.json");

function toUuid(url) {
  const m = url.match(/([a-f0-9]{32})/i);
  if (!m) throw new Error(`No UUID in URL: ${url}`);
  const r = m[1];
  return `${r.slice(0, 8)}-${r.slice(8, 12)}-${r.slice(12, 16)}-${r.slice(16, 20)}-${r.slice(20)}`;
}

/** Topic|Español|Módulo|Prioridad|Status|url|Artículo|Notas */
const TSV = `Copyright|Derechos de Autor (Ley 23/1982)|🔬 Intellectual Property|🔴 P1|Pendiente|https://app.notion.com/p/0a9b129514b5447bb5b752bd6e1f9bde||
Contracts — Formation and Validity|Formación y Validez del Contrato|🏛️ Civil & Contract Law|🔴 P1|Pendiente|https://app.notion.com/p/1821a9b4626d4640a9dfd14917fd0af9||
Liquidation of Marital Partnership|Liquidación de Sociedad Conyugal|👨‍⚖️ Family & Civil Law|🔴 P1|Pendiente|https://app.notion.com/p/5cb35b864c9c406f98365cf3f72e6f21||
Prenuptial Agreement|Capitulaciones Matrimoniales|👨‍⚖️ Family & Civil Law|🔴 P1|Pendiente|https://app.notion.com/p/c97fbe2ad87141889f88ab08074e36c3||
Common-Law Union|Unión Marital de Hecho|👨‍⚖️ Family & Civil Law|🔴 P1|Pendiente|https://app.notion.com/p/0b964a06d5c94b7dba41d45164c8cae1||Verificar: hay una entrada en el índice del hub que podría ser este artículo (enlace roto/alias).
SAS — General Assembly's Acts|Actas de Asamblea SAS|🏢 Business & Corporate Law|🔴 P1|Pendiente|https://app.notion.com/p/db8460bcd3324f4faa5dbfe6c7935114||
SAS — Shareholders' Rights|Derechos del Accionista en SAS|🏢 Business & Corporate Law|🔴 P1|Pendiente|https://app.notion.com/p/afa699b6b0114d1abe11ad73d644da2e||
Tax Year and Filing|Año Gravable y Declaración de Renta|💰 Tax Law|🔴 P1|Pendiente|https://app.notion.com/p/df0e64c3c3a646658b1a817b5f0c81df||
Employment Contract — Types|Tipos de Contrato de Trabajo|⚖️ Labour Law|🔴 P1|Pendiente|https://app.notion.com/p/00527841dac3459c88055d470c278c2e||Término fijo, indefinido, obra o labor.
Migrant Visa — Type M (Investor)|Visa de Migrante — Inversionista|🛂 Immigration & Visas|🔴 P1|Pendiente|https://app.notion.com/p/4884a87e00ff477ca7f3fce4187f3cf5||Clave para inversión extranjera directa.
Migrant Visa — Type M (Worker)|Visa de Migrante — Trabajador|🛂 Immigration & Visas|🔴 P1|Pendiente|https://app.notion.com/p/b77f01b699124a2794b87a627c36d447||Muy solicitada por expats con contrato laboral. Verificar solapamiento con el artículo general de Visa M ya publicado.
Accounting Requirements for Businesses|Obligaciones Contables|🌐 International & Public Law|🟠 P2|Pendiente|https://app.notion.com/p/0e3ef6f16b914238a8c945556d23b248||
Property Crimes|Delitos contra el Patrimonio|⚠️ Criminal Law|🟠 P2|Pendiente|https://app.notion.com/p/719c484ade06400d84100e3cac1e06b0||
Criminal Procedure — Investigation and Prosecution|Investigación y Acusación Penal|⚠️ Criminal Law|🟠 P2|Pendiente|https://app.notion.com/p/6d66a0b6dfeb4467a0ef44b7079279dd||
Patents|Patentes de Invención|🔬 Intellectual Property|🟠 P2|Pendiente|https://app.notion.com/p/aaf14eb8516348bc89eb57ba8b89628a||
Executive Process|Proceso Ejecutivo|⚙️ Administrative & Procedural Law|🟠 P2|Pendiente|https://app.notion.com/p/f18f034fa883407ba91a24c78bd9f6c9||
Administrative Silence|Silencio Administrativo|⚙️ Administrative & Procedural Law|🟠 P2|Pendiente|https://app.notion.com/p/6d9e3ae1bae147a49541329fba6c69a4||
Arbitration — Domestic|Arbitraje Nacional|⚙️ Administrative & Procedural Law|🟠 P2|Pendiente|https://app.notion.com/p/149ae279ec33401fb4840019d89112c4||
Administrative Appeals & Remedies|Recursos Administrativos|⚙️ Administrative & Procedural Law|🟠 P2|Pendiente|https://app.notion.com/p/057b528969404db4bcd0d736d787a840||
Arbitration — International|Arbitraje Internacional|⚙️ Administrative & Procedural Law|🟠 P2|Pendiente|https://app.notion.com/p/08028cda54714b8ea36f6beaa133ed58||
Interest Regime in Colombia|Régimen de Intereses — Tasa Legal y Moratoria|🏛️ Civil & Contract Law|🟠 P2|Pendiente|https://app.notion.com/p/03a5a1367070440884cf2905b0b4b58f||Aparecía duplicado en Tax y Civil en el roadmap; consolidado aquí. Transversal a tributario y civil.
Torts — Strict and Vicarious Liability|Responsabilidad Civil Extracontractual|🏛️ Civil & Contract Law|🟠 P2|Pendiente|https://app.notion.com/p/b5fe64df3c9f495584e84760222833b8||Aparecía duplicado en Real Estate y Civil en el roadmap; consolidado aquí. Relevante también para inmobiliario (vecinos, obras, daños).
Sale Contract|Contrato de Compraventa Civil|🏛️ Civil & Contract Law|🟠 P2|Pendiente|https://app.notion.com/p/cc574d0b3f4f4f20858df35542f6761a||
Testate Succession — Wills|Testamento|👨‍⚖️ Family & Civil Law|🟠 P2|Pendiente|https://app.notion.com/p/551567f647e64f848b2ce44e3b69c6ef||Posible sub-entrada del artículo general de Sucesiones.
Intestate Succession|Sucesión Intestada|👨‍⚖️ Family & Civil Law|🟠 P2|Pendiente|https://app.notion.com/p/bc0f16151d1e459c8c448beead9e34cb||Posible sub-entrada del artículo general de Sucesiones.
Common-Law Union — Dissolution|Disolución de Unión Marital de Hecho|👨‍⚖️ Family & Civil Law|🟠 P2|Pendiente|https://app.notion.com/p/8a4a7b02b8c2485c81c75ea2ab5c72a8||
Divorce — Property Division|Repartición de Bienes en Divorcio|👨‍⚖️ Family & Civil Law|🟠 P2|Pendiente|https://app.notion.com/p/9773fc8c6674409f9290b4020fff3723||
Alimony|Cuota Alimentaria|👨‍⚖️ Family & Civil Law|🟠 P2|Pendiente|https://app.notion.com/p/63acb0d92fe147f88d7b2185a528007e||
Divorce — Grounds|Causales de Divorcio|👨‍⚖️ Family & Civil Law|🟠 P2|Pendiente|https://app.notion.com/p/8b640a99719d427cb74703f61a988bf7||
Shareholders' Meetings|Asambleas de Accionistas|🏢 Business & Corporate Law|🟠 P2|Pendiente|https://app.notion.com/p/ef3b42122862418b84dbd38dc5977e67||
Dissolution and Liquidation of SAS|Disolución y Liquidación de SAS|🏢 Business & Corporate Law|🟠 P2|Pendiente|https://app.notion.com/p/61788c044dcb49b9a4a42187008e6076||
Legal Representative in SAS|Representante Legal de SAS|🏢 Business & Corporate Law|🟠 P2|Pendiente|https://app.notion.com/p/e216e9cc0d004cd191d9cdc06de1b862||
Tax Incentives for Investment|Beneficios Tributarios para Inversión|💰 Tax Law|🟠 P2|Pendiente|https://app.notion.com/p/ae8b4895f7084f129b2ffe5338e9485b||
Tax Procedure (DIAN)|Procedimiento Tributario|💰 Tax Law|🟠 P2|Pendiente|https://app.notion.com/p/60f97f0160d94f769ff9ae8b4938a483||
Remote Work|Teletrabajo / Trabajo en Casa|⚖️ Labour Law|🟠 P2|Pendiente|https://app.notion.com/p/85d129b6eb014bf4a542d03f58dc0788||
Notice Requirements|Preaviso|⚖️ Labour Law|🟠 P2|Pendiente|https://app.notion.com/p/04c42b802bc9451fbadc81a7791bc2fc||
Severance Pay|Indemnización por Despido|⚖️ Labour Law|🟠 P2|Pendiente|https://app.notion.com/p/8d16ed32f33142fa9662b47ba1f94353||
Termination — Just Cause|Terminación con Justa Causa|⚖️ Labour Law|🟠 P2|Pendiente|https://app.notion.com/p/4243950f2fb8473bbdce0b3a4284d97f||
Probation Period|Período de Prueba|⚖️ Labour Law|🟠 P2|Pendiente|https://app.notion.com/p/7a5a652d69ef4f529fe8c4d82d498fd2||
Real Estate Fiducia|Fiducia Inmobiliaria|🏠 Real Estate Law|🟠 P2|Pendiente|https://app.notion.com/p/5129f4746477408fa48a0f271af4ae20||Mecanismo de financiación de proyectos VIS/no-VIS.
Adverse Possession|Prescripción Adquisitiva de Dominio (Pertenencia)|🏠 Real Estate Law|🟠 P2|Pendiente|https://app.notion.com/p/0713072ad2fc4a84a610dae4ce98a264||Muy relevante en Colombia rural y urbano.
Possession|Posesión|🏠 Real Estate Law|🟠 P2|Pendiente|https://app.notion.com/p/d0ef19e640ca47159edf0ac473e92844||Distinto del dominio; base para pertenencia.
Safe-Conduct (Salvoconducto de Permanencia)|Salvoconducto de Permanencia|🛂 Immigration & Visas|🟠 P2|Pendiente|https://app.notion.com/p/9a855938a1964cf3a35bfeb095e1d48c||Para trámites migratorios en curso.
Migrant Visa — Type M (Pensioner / Rentier)|Visa de Migrante — Pensionado / Rentista|🛂 Immigration & Visas|🟠 P2|Pendiente|https://app.notion.com/p/c6873c3bbe7f4cf8bdf434719b9a581d||Muy relevante para retirados extranjeros.
Transitional Justice — JEP|JEP y Justicia Transicional|🌐 International & Public Law|🟡 P3|Pendiente|https://app.notion.com/p/3120298c7d884d839215cfc3ef9ae33f||
International Environmental Law — Climate Change|Derecho Ambiental Internacional|🌐 International & Public Law|🟡 P3|Pendiente|https://app.notion.com/p/bab6b79610a34fd7ac4de7ddb3b2c353||
Peace Agreements and IHL|Acuerdos de Paz y DIH|🌐 International & Public Law|🟡 P3|Pendiente|https://app.notion.com/p/0495f95bab9948f89617f281a5a18e52||
Environmental Liability|Responsabilidad Ambiental|🌐 International & Public Law|🟡 P3|Pendiente|https://app.notion.com/p/aa7e5e2cffab4fc7a039e632a486e7f4||
Alternative Sanctions|Subrogados Penales|⚠️ Criminal Law|🟡 P3|Pendiente|https://app.notion.com/p/69af4b73966e445699cf8c242f1ec584||
Homicide and Criminal Liability|Homicidio y Responsabilidad Penal|⚠️ Criminal Law|🟡 P3|Pendiente|https://app.notion.com/p/ae52fffe7d064b0cab22fe0801bae747||
Drug Crimes|Delitos de Narcotráfico|⚠️ Criminal Law|🟡 P3|Pendiente|https://app.notion.com/p/488d196d379645f19f85762b39530349||
Criminal Procedure — Trial and Appeals|Juicio Oral y Recursos Penales|⚠️ Criminal Law|🟡 P3|Pendiente|https://app.notion.com/p/c45316f3aa6c4ffeb344ec28369808b1||
IP in Entertainment — Revenue Sharing|Propiedad Intelectual en Entretenimiento|🔬 Intellectual Property|🟡 P3|Pendiente|https://app.notion.com/p/c2a416debae440e881e525613f704411||
Lawyer Disciplinary Procedures|Régimen Disciplinario del Abogado|⚙️ Administrative & Procedural Law|🟡 P3|Pendiente|https://app.notion.com/p/a90e67606bc9459e9974243f1d419955||
Civil Procedure — Jurisdiction|Jurisdicción Civil|⚙️ Administrative & Procedural Law|🟡 P3|Pendiente|https://app.notion.com/p/f45eb1635cda4f1b91cbcc6a169734de||
Administrative Contracts — Termination|Terminación de Contratos Estatales|⚙️ Administrative & Procedural Law|🟡 P3|Pendiente|https://app.notion.com/p/84a7e033febc40889a129ceb0c297ca4||
Administrative Contracts — Types and Award|Contratos Estatales|⚙️ Administrative & Procedural Law|🟡 P3|Pendiente|https://app.notion.com/p/73338f9f545b4aa7a5ac60d09076402e||
Administrative Sanctionatory Procedure|Proceso Sancionatorio Administrativo|⚙️ Administrative & Procedural Law|🟡 P3|Pendiente|https://app.notion.com/p/deb924d6d7154d7eb356ef11c8aa897f||
Warehouse Receipts|Títulos Valores — Certificados de Depósito|🏛️ Civil & Contract Law|🟡 P3|Pendiente|https://app.notion.com/p/2afd7a943f464260b19928fd5fc40348||
Creditor Classes in Insolvency|Clasificación de Acreedores|🏛️ Civil & Contract Law|🟡 P3|Pendiente|https://app.notion.com/p/0c478f69a8ae4357827a8a381dbd45b7||
Sources of Civil Law|Fuentes del Derecho Civil|🏛️ Civil & Contract Law|🟡 P3|Pendiente|https://app.notion.com/p/6427e564dd9b4a64a833e5b45f7b4b71||
Custody|Custodia y Cuidado Personal de Hijos|👨‍⚖️ Family & Civil Law|🟡 P3|Pendiente|https://app.notion.com/p/ddb93a5fb288453daad3efd579d05401||
Foreign Wills — Recognition in Colombia|Testamentos Extranjeros|👨‍⚖️ Family & Civil Law|🟡 P3|Pendiente|https://app.notion.com/p/f8ede53981d847288ce1292a1a98b2d8||
Family Estate|Patrimonio de Familia|👨‍⚖️ Family & Civil Law|🟡 P3|Pendiente|https://app.notion.com/p/fd38817c1ed7462797db4c5658a0d767||
Religious Marriage|Matrimonio Religioso|👨‍⚖️ Family & Civil Law|🟡 P3|Pendiente|https://app.notion.com/p/f14ff7676af2465f867535d65143b62d||
Bonds and Shares|Bonos y Acciones|🏢 Business & Corporate Law|🟡 P3|Pendiente|https://app.notion.com/p/390296ccfa354a42a29ab0bd4119a635||
Abuse of Dominant Position|Abuso de Posición Dominante|🏢 Business & Corporate Law|🟡 P3|Pendiente|https://app.notion.com/p/7efa6faa61814b11af2de9e6edb95529||Posible solapamiento con el artículo publicado de Competition Law.
Commercial Acts|Actos de Comercio|🏢 Business & Corporate Law|🟡 P3|Pendiente|https://app.notion.com/p/f64c04ee654d44c89deb106cd9ce8206||
Free Trade Zones|Zonas Francas|💰 Tax Law|🟡 P3|Pendiente|https://app.notion.com/p/5005bb76315e4456bd3c0fa1ededbcf7||
Customs — Import Duties|Aranceles de Importación|💰 Tax Law|🟡 P3|Pendiente|https://app.notion.com/p/8bb1dbe063a444c28e5bb657b40679a8||
Right to Strike|Derecho de Huelga|⚖️ Labour Law|🟡 P3|Pendiente|https://app.notion.com/p/03c4f6b04ade4e1e8e64a42e075a3c39||
Collective Labour Disputes|Conflictos Colectivos de Trabajo|⚖️ Labour Law|🟡 P3|Pendiente|https://app.notion.com/p/af30a848507d4ce7b82060e60752ed28||
Unions and Collective Bargaining|Sindicatos y Negociación Colectiva|⚖️ Labour Law|🟡 P3|Pendiente|https://app.notion.com/p/b197e68fab584c408d1f3ef3bf3e8dda||
General Principles — Employee Rights|Principios del Derecho Laboral|⚖️ Labour Law|🟡 P3|Pendiente|https://app.notion.com/p/1010396181314411926a438ca44fc162||
Foreign Nationals & Colombian Citizenship|Naturalización y Ciudadanía|🛂 Immigration & Visas|🟡 P3|Pendiente|https://app.notion.com/p/a8fb82c172a7408f98b2aee98e8794e8||Después de 5 años de residencia.
Migratory Check-In|Check-In Migratorio|🛂 Immigration & Visas|🟡 P3|Pendiente|https://app.notion.com/p/07fe4bc597e74a5184c15366b73f1131||Obligación de registro ante Migración Colombia.
Deportation and Migratory Sanctions|Deportación y Sanciones Migratorias|🛂 Immigration & Visas|🟡 P3|Pendiente|https://app.notion.com/p/6b6aa481c60143e1955e6a3385d9fb69||Multas, deportación, inadmisión.
Environmental Permits|Licencias Ambientales|⚙️ Administrative & Procedural Law||Publicado|https://app.notion.com/p/72597847a0054ad8977fd92bc4049efc|https://app.notion.com/p/f03b53a790614edab5e16a8bf26f6a29|No estaba en el roadmap; agregado desde el índice del hub.
Power of Attorney|Mandato y Poder|🏛️ Civil & Contract Law||Publicado|https://app.notion.com/p/2df77723f2e14b8a902da3fb602bc0b1|https://app.notion.com/p/63dbac1a51bb4289bc10c89c5f240289|Era P1 en el roadmap; ya publicado (indexado bajo Family & Civil en el hub).
Consumer Protection|Estatuto del Consumidor (Ley 1480/2011)|💻 Digital & Consumer Law||Publicado|https://app.notion.com/p/92d955ddfe1d49469bd60dbbe0c6c6be|https://app.notion.com/p/076b991ce4884bda9e13380abc358e40|Era P2 en el roadmap; ya publicado.
E-Commerce and Electronic Contracts|Comercio Electrónico (Ley 527/1999)|💻 Digital & Consumer Law||Publicado|https://app.notion.com/p/724801354d9d46e1a4201892eb73156e|https://app.notion.com/p/ac19ef330d7c44dcb761a3178e4230c5|Era P3 en el roadmap; ya publicado.
Habeas Data and Data Protection|Hábeas Data (Ley 1581/2012)|💻 Digital & Consumer Law||Publicado|https://app.notion.com/p/494589aad4464b5283772471be45173a|https://app.notion.com/p/5d6f47f9adb04f6993bb349ba86cfc6d|Era P1 en el roadmap; ya publicado.
Succession and Inheritance Law|Derecho de Sucesiones|👨‍⚖️ Family & Civil Law||Publicado|https://app.notion.com/p/3d9db620a2074cd5bc8c21cafa52d217|https://app.notion.com/p/69e43b8ccdab4174bb62458addebdc29|Artículo general publicado; sub-temas (intestada, testamento) siguen pendientes.
Civil Marriage in Colombia|Matrimonio Civil|👨‍⚖️ Family & Civil Law||Publicado|https://app.notion.com/p/5d2314235103485dbf90bfc9833dd291|https://app.notion.com/p/3c92d6e6a9ad41799581a8680dad307d|Era P1 en el roadmap; ya publicado.
Recognition of Foreign Marriage|Matrimonio Celebrado en el Exterior|👨‍⚖️ Family & Civil Law||Publicado|https://app.notion.com/p/f268e89216224ddca0bbc0769316135a|https://app.notion.com/p/69f0dadd780c4397a0430e1281ea9923|
Competition Law|Libre Competencia y Prácticas Restrictivas|🏢 Business & Corporate Law||Publicado|https://app.notion.com/p/4654545647254c5b8b7a01750fc5da5b|https://app.notion.com/p/947034754609425f9c1373563f3ae16f|No estaba en el roadmap; agregado desde el índice del hub.
Franchise Agreement|Contrato de Franquicia|🏢 Business & Corporate Law||Publicado|https://app.notion.com/p/218de748dc804548af939ab632e90af2|https://app.notion.com/p/6f46c413d3704a029b2fe47036a0aa7e|No estaba en el roadmap; agregado desde el índice del hub.
Commercial Agency|Contrato de Agencia Comercial|🏢 Business & Corporate Law||Publicado|https://app.notion.com/p/7dbdaeef3cdb4cf8bfc564ba207fbd08|https://app.notion.com/p/b27de4500a364bed9765d6cd69020483|No estaba en el roadmap; agregado desde el índice del hub.
Shareholders' Agreement|Pacto de Accionistas — SAS|🏢 Business & Corporate Law||Publicado|https://app.notion.com/p/23dde25e7f244f73ae2d6b3195d4756d|https://app.notion.com/p/81f54a2cd0cd4a6ea4644fbabf881eee|No estaba en el roadmap; agregado desde el índice del hub.
Company Formation — Types of Legal Entities|Tipos de Sociedades en Colombia|🏢 Business & Corporate Law||Publicado|https://app.notion.com/p/7c7d2519bf544b4fb7f3d25709bf1c4f|https://app.notion.com/p/cd4d98dd97ed44bfa16b213c8cdee19f|Era P1 en el roadmap; ya publicado.
SAS — Simplified Stock Company|Sociedad por Acciones Simplificada|🏢 Business & Corporate Law||Publicado|https://app.notion.com/p/986ecb75d403498da6a8f54c05fc3d95|https://app.notion.com/p/137777f4578f43e0b323c1f0463b3096|
Foreign Exchange Regulations|Régimen Cambiario|💰 Tax Law||Publicado|https://app.notion.com/p/76583f64adfe4c0784fca8f29ece8694|https://app.notion.com/p/a2463d7433fa403f82eb0e25cb4c5fa4|No estaba en el roadmap; agregado desde el índice del hub.
Dividend Distribution|Distribución de Dividendos y Utilidades|💰 Tax Law||Publicado|https://app.notion.com/p/785793b8ef4e4bfcbc1141addae5f7f5|https://app.notion.com/p/f35e248d35db4918a8470dff61a29a0c|No estaba en el roadmap; agregado desde el índice del hub.
Transfer Pricing|Precios de Transferencia|💰 Tax Law||Publicado|https://app.notion.com/p/c06fe1be7d604262b2a878425c0531e3|https://app.notion.com/p/3e029f3fab7246afa4af3b975ce3e480|Era P2 en el roadmap; ya publicado.
VAT in Colombia|Impuesto al Valor Agregado — IVA|💰 Tax Law||Publicado|https://app.notion.com/p/3dd0bc21ff064c6f9b70648e54998c75|https://app.notion.com/p/f60ca68467be40cea1586f9ae0324375|Era P1 en el roadmap; ya publicado.
Double Taxation Treaties|Convenios para Evitar la Doble Imposición|💰 Tax Law||Publicado|https://app.notion.com/p/5ac9c2b3c4094e398a32c26ceb50acdb|https://app.notion.com/p/4e714817ac0f4438a711a4ef14dfea5b|Era P1 en el roadmap; ya publicado.
Corporate Income Tax|Impuesto de Renta — Sociedades|💰 Tax Law||Publicado|https://app.notion.com/p/38e1ba5b89e84fc4840d65e6b0b1ee18|https://app.notion.com/p/51e1a42ee2be4b3db66a8729968deceb|Era P1 en el roadmap; ya publicado.
Withholding Tax on Foreign Payments|Retención en la Fuente|💰 Tax Law||Publicado|https://app.notion.com/p/250c41ff9a1a45e28dedcb17b8649151|https://app.notion.com/p/991312d7ea5a44babe0aa909e695459b|
Colombian-Source Income|Renta de Fuente Nacional|💰 Tax Law||Publicado|https://app.notion.com/p/dacc9b31963d40f29265980f6d880ce4|https://app.notion.com/p/c862355208a84f0891cef181401b9997|
Permanent Establishment|Establecimiento Permanente|💰 Tax Law||Publicado|https://app.notion.com/p/8a1fdf1f4ac24e589e605a346093ff1a|https://app.notion.com/p/f1908c1b378542e7967bcf3e3e11453c|
Tax Residency in Colombia|Residencia Fiscal|💰 Tax Law||Publicado|https://app.notion.com/p/9e25c82ec5f641798bfee80f95ad9fc5|https://app.notion.com/p/60e12b6401be47e8bc3976dbc2b9b440|
Social Security Contributions|Seguridad Social y Parafiscales|⚖️ Labour Law||Publicado|https://app.notion.com/p/b8f7fbc4295e49f49065fa26abac9d2e|https://app.notion.com/p/936cde513d3b4ecb8c714d374cc76236|Era P1 en el roadmap; ya publicado (indexado bajo Corporate en el hub).
Subordination in Employment|Subordinación Laboral|⚖️ Labour Law||Publicado|https://app.notion.com/p/c3aaa95626bf4f82953f7386387c074d|https://app.notion.com/p/79ca66eca2824b238c314e0ed7026c0e|Era P1 en el roadmap; ya publicado.
Termination of Employment Contract|Terminación del Contrato de Trabajo|⚖️ Labour Law||Publicado|https://app.notion.com/p/221468c2b3c34fd0b4d8b70dc8bb9e08|https://app.notion.com/p/fdd82a793da8469491318d3d305b682c|
Service Provision Contract|Contrato de Prestación de Servicios|⚖️ Labour Law||Publicado|https://app.notion.com/p/4367e439432c44d59bece0b97e886b06|https://app.notion.com/p/f30d4351bbe542acae1089766333dd70|
Employment Contract|Contrato de Trabajo|⚖️ Labour Law||Publicado|https://app.notion.com/p/b4b2487587c64bc2bb831fce0f293af8|https://app.notion.com/p/f92c4dc44f0b4bbf83cf3af59cfed471|
Real Estate Purchase & Closing Costs|Compraventa Inmobiliaria y Costos de Cierre|🏠 Real Estate Law||Publicado|https://app.notion.com/p/92f7fb942201464ab5198fdc369b2b1e|https://app.notion.com/p/11771267c2d14aef87fab113cccdf84c|Escritura pública + registro. Era P1 en el roadmap; ya publicado.
Lease Agreement|Contrato de Arrendamiento de Inmueble|🏠 Real Estate Law||Publicado|https://app.notion.com/p/7c018664daf743428f76566c9891ba22|https://app.notion.com/p/cfdd8ce6594c497da7834741f90cda47|
Real Property Rights|Derecho de Dominio|🏠 Real Estate Law||Publicado|https://app.notion.com/p/beabdac0f9c343e6848e3e0d3c1a3e02|https://app.notion.com/p/2d1de4503c764023b865459bba4b4d0e|
Promise to Purchase Agreement|Promesa de Compraventa|🏠 Real Estate Law||Publicado|https://app.notion.com/p/71708ce7b67a411eacc02c30c1c71816|https://app.notion.com/p/97afc34561f84086a9e7179b3ff2dffb|
Horizontal Property Regime|Propiedad Horizontal|🏠 Real Estate Law||Publicado|https://app.notion.com/p/48776bd34ccf48479400c1bd1946a628|https://app.notion.com/p/445c1e97428948b38a6b1ebaf37074d5|
Resident Visa — Type R|Visa de Residente|🛂 Immigration & Visas||Publicado|https://app.notion.com/p/9ee34d1d98f6499a9f10c606e3b61341|https://app.notion.com/p/671acfda3cea4c5aa41cf6b790ecde6d|
Migrant Visa — Type M (Categories & Requirements)|Visa de Migrante — Categorías y Requisitos|🛂 Immigration & Visas||Publicado|https://app.notion.com/p/9fa95122048942ac88507a1aa23d891d|https://app.notion.com/p/3fc8effbf0094bd384a0916f7b5aa2ec|
Visitor Visa — Type V|Visa de Visitante|🛂 Immigration & Visas||Publicado|https://app.notion.com/p/73503a67728b45e3bd5e398584d8ce9a|https://app.notion.com/p/6404e49752904b34b9d0706b8334f6e3|
Digital Nomad Visa — Type M|Visa de Nómada Digital|🛂 Immigration & Visas||Publicado|https://app.notion.com/p/6c1d30b3b5a047bc950cb7c90160e70a|https://app.notion.com/p/9016e2d3a833492e8d59d98519619ae5|
Cédula de Extranjería — Foreigner ID|Cédula de Extranjería|🛂 Immigration & Visas||Publicado|https://app.notion.com/p/a2823dcdaa584616880a1fa2849f0a4e|https://app.notion.com/p/c863c0f277ee403aab10cd5a9f805b40|
Foreign Investment Registration|Registro de Inversión Extranjera|🛂 Immigration & Visas||Publicado|https://app.notion.com/p/b3108b05cea5483ab0498c58360ab1e4|https://app.notion.com/p/6ad8d79b079845e7afcd39de0841ba3f|`;

function parseRow(line) {
  const parts = line.split("|");
  if (parts.length < 6) {
    throw new Error(`Bad row (${parts.length} fields): ${line.slice(0, 80)}`);
  }
  const [topic, espanol, modulo, prioridad, status, url, articulo = "", notas = ""] =
    parts;
  return {
    id: toUuid(url),
    url,
    topic,
    espanol,
    modulo,
    prioridad: prioridad || null,
    status,
    articulo: articulo || "",
    articulo_es: "",
    slug_key: "",
    gen_status: null,
    notas: notas || "",
  };
}

const lines = TSV.trim().split("\n");
const topics = lines.map(parseRow);

if (topics.length !== 117) {
  console.error(`Expected 117 topics, got ${topics.length}`);
  process.exit(1);
}

const ids = new Set();
for (const t of topics) {
  if (ids.has(t.id)) {
    console.error(`Duplicate id: ${t.id} (${t.topic})`);
    process.exit(1);
  }
  ids.add(t.id);
}

const payload = {
  exported_at: "2026-07-23T12:00:00Z",
  source: "notion-view-por-modulo",
  topics,
};

writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(`Wrote ${topics.length} topics → ${OUT}`);
