import { ClkrArticleLayout } from "@/components/clkr/article-layout";

const sections = [
  { id: "definition", title: "Definición" },
  { id: "legal-framework", title: "Marco legal" },
  { id: "doctrinal-note", title: "Nota doctrinal" },
  { id: "practical-example", title: "Ejemplo práctico" },
  { id: "faq", title: "Preguntas frecuentes" },
  { id: "glossary", title: "Glosario" },
] as const;

export default function InvestorVisaEsPage() {
  return (
    <ClkrArticleLayout
      locale="es"
      title="Visa de Inversionista (Tipo M)"
      category="Inmigración"
      readingTime="12 min"
      description="Elegibilidad, marco legal, inversiones admisibles, registro FIEM, tiempos y errores frecuentes."
      sections={[...sections]}
    >
      <h2 id="definition">Definición</h2>
      <p>
        La visa de inversionista en Colombia es una visa de categoría M pensada
        para extranjeros que realizan y mantienen una inversión calificada en el país.
      </p>
      <h2 id="legal-framework">Marco legal</h2>
      <p>
        El marco administrativo vigente se apoya principalmente en la{" "}
        <strong>Resolución 5477 de 2022</strong>. Uno de los umbrales clave es la
        inversión equivalente a <strong>100 SMLMV</strong>.
      </p>
      <h2 id="doctrinal-note">Nota doctrinal</h2>
      <p>
        La visa de inversionista debe diferenciarse de otras visas tipo M. En la
        práctica, el eje probatorio es el <strong>registro de inversión extranjera</strong>{" "}
        ante el Banco de la República.
      </p>
      <h2 id="practical-example">Ejemplo práctico</h2>
      <p>
        Un ciudadano estadounidense compra un apartamento en Medellín por USD 60.000.
        El flujo típico incluye canal cambiario, registro FIEM, preparación del expediente
        y presentación ante Cancillería.
      </p>
      <h2 id="faq">Preguntas frecuentes</h2>
      <h3>¿Puedo usar un inmueble adquirido a través de una sociedad colombiana?</h3>
      <p>
        Depende de cómo esté estructurada y soportada la inversión. La naturaleza
        jurídica de la inversión debe coincidir con la evidencia documental.
      </p>
      <h3>¿La inversión debe mantenerse durante la vigencia de la visa?</h3>
      <p>
        Generalmente sí. Si el activo se vende o cambia, puede afectarse el sustento
        de la visa.
      </p>
      <h2 id="glossary">Glosario</h2>
      <ul>
        <li><strong>SMLMV</strong>: salario mínimo legal mensual vigente.</li>
        <li><strong>FIEM</strong>: flujo digital usado para soportar el registro de inversión extranjera.</li>
        <li><strong>Cancillería</strong>: autoridad migratoria para la mayoría de visas.</li>
      </ul>
    </ClkrArticleLayout>
  );
}

