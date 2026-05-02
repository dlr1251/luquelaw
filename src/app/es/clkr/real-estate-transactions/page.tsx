import { ClkrArticleLayout } from "@/components/clkr/article-layout";

const sections = [
  { id: "definition", title: "Definición" },
  { id: "legal-framework", title: "Marco legal" },
  { id: "doctrinal-note", title: "Nota doctrinal" },
  { id: "practical-example", title: "Ejemplo práctico" },
  { id: "faq", title: "Preguntas frecuentes" },
  { id: "glossary", title: "Glosario" },
] as const;

export default function RealEstateEsPage() {
  return (
    <ClkrArticleLayout
      locale="es"
      title="Transacciones Inmobiliarias para Extranjeros"
      category="Inmobiliario"
      readingTime="14 min"
      description="Cómo comprar propiedad en Colombia siendo extranjero: debida diligencia, notaría, impuestos, registro y cumplimiento cambiario."
      sections={[...sections]}
    >
      <h2 id="definition">Definición</h2>
      <p>
        Sí, los extranjeros pueden comprar inmuebles en Colombia. La pregunta
        práctica no es si pueden hacerlo, sino cómo estructurar la operación para
        proteger título, cumplimiento y futura repatriación.
      </p>
      <h2 id="legal-framework">Marco legal</h2>
      <p>
        Un comprador extranjero suele cruzarse con dos sistemas a la vez:
        derecho inmobiliario y régimen cambiario/inversión extranjera.
      </p>
      <h2 id="doctrinal-note">Nota doctrinal</h2>
      <p>
        El punto central suele ser el <strong>canal cambiario</strong>: ingresar
        fondos por un intermediario autorizado con la codificación correcta.
      </p>
      <h2 id="practical-example">Ejemplo práctico</h2>
      <p>
        Un ciudadano canadiense compra un apartamento en El Poblado por USD 200.000.
        El flujo típico incluye transferencia bancaria, promesa de compraventa,
        escritura pública, registro y soporte de inversión extranjera.
      </p>
      <h2 id="faq">Preguntas frecuentes</h2>
      <h3>¿Necesito cédula colombiana para comprar?</h3>
      <p>
        No siempre. En muchos casos basta el pasaporte, aunque bancos o notarías
        pueden pedir identificadores adicionales.
      </p>
      <h3>¿Puedo comprar mediante una LLC o sociedad extranjera?</h3>
      <p>
        Sí, pero cambia el análisis corporativo, tributario y cambiario.
      </p>
      <h2 id="glossary">Glosario</h2>
      <ul>
        <li><strong>Escritura pública</strong>: instrumento notarial que formaliza la compraventa.</li>
        <li><strong>Promesa de compraventa</strong>: contrato previo con condiciones para la escritura.</li>
        <li><strong>Canal cambiario</strong>: vía regulada para ingresar divisas a Colombia.</li>
      </ul>
    </ClkrArticleLayout>
  );
}

