import { ClkrArticleLayout } from "@/components/clkr/article-layout";

const sections = [
  { id: "definition", title: "Definition" },
  { id: "legal-framework", title: "Legal framework" },
  { id: "doctrinal-note", title: "Doctrinal note" },
  { id: "practical-example", title: "Practical example" },
  { id: "faq", title: "FAQ" },
  { id: "glossary", title: "Glossary" },
] as const;

export default function InvestorVisaArticlePage() {
  return (
    <ClkrArticleLayout
      currentSlug="/clkr/investor-visa"
      title="Investor Visa (Visa de Inversionista — Tipo M)"
      category="Immigration"
      readingTime="12 min"
      description="Eligibility, legal framework (Resolución 5477 de 2022), qualifying investments, FIEM registration, timelines, and common edge cases."
      sections={[...sections]}
    >
      <h2 id="definition">Definition</h2>
      <p>
        Colombia’s investor visa (commonly referred to as the{" "}
        <strong>Visa de Inversionista</strong>) is an <strong>M-category</strong>{" "}
        visa designed for foreign nationals who make and maintain a qualifying
        investment in Colombia.
      </p>
      <p>
        In practice, the investment must be{" "}
        <strong>documented and properly registered</strong> for the visa
        application to be viable. The visa is not “automatic” after buying an
        asset; the legal and foreign-exchange formalities matter.
      </p>

      <h2 id="legal-framework">Legal framework</h2>
      <p>
        The current administrative framework is primarily governed by{" "}
        <strong>Resolución 5477 de 2022</strong> (Cancillería). For the investor
        visa, a key threshold is an investment of{" "}
        <strong>100 SMLMV</strong>{" "}
        (salarios mínimos legales mensuales vigentes). As a rough reference, this
        has been described in practice as approximately{" "}
        <strong>COP 130,000,000</strong> / <strong>USD 32,000</strong>, but the
        exact COP value moves with the minimum wage and foreign exchange.
      </p>
      <p>
        Qualifying investments commonly include (subject to documentary support
        and compliance): <strong>real estate</strong>, <strong>equity/corporate participation</strong>, and certain{" "}
        <strong>financial instruments</strong>. The most frequent failure point
        for applicants is not the purchase itself, but the inability to evidence
        compliant foreign investment registration.
      </p>

      <h2 id="doctrinal-note">Doctrinal note</h2>
      <p>
        The investor visa should be treated as a distinct legal mechanism from
        other M-category visas. For investors, a core doctrinal and practical
        pillar is the <strong>foreign investment registration</strong> with{" "}
        <strong>Banco de la República</strong>.
      </p>
      <p>
        Historically this registration was associated with{" "}
        <strong>Form No. 4</strong>. The system has moved toward digital
        workflows (commonly discussed as <strong>FIEM</strong>). The name of the
        platform is less important than the legal consequence: without a
        properly registered investment, your ability to support the visa and to
        preserve repatriation rights can be impaired.
      </p>

      <h2 id="practical-example">Practical example</h2>
      <p>
        <strong>Scenario:</strong> A U.S. citizen purchases a Medellín apartment
        for <strong>USD 60,000</strong>.
      </p>
      <ol>
        <li>
          <strong>Bring funds through the legal channel</strong> (typically via
          an authorized intermediary such as a bank) with correct labeling for
          foreign investment purposes.
        </li>
        <li>
          <strong>Register the foreign investment</strong> with Banco de la
          República via the applicable mechanism (often referenced as FIEM),
          keeping the registration evidence consistent with the investment type.
        </li>
        <li>
          <strong>Prepare the visa file</strong>: investment evidence, proof of
          registration, identity documents, and supporting documents required by
          Cancillería.
        </li>
        <li>
          <strong>Apply and track</strong>: timing depends on documentation
          readiness and government processing. A common practical timeline is
          measured in weeks, not days, when documentation is clean.
        </li>
        <li>
          <strong>Renewal strategy</strong>: the investment generally must be{" "}
          <strong>maintained</strong> through the visa period, and the
          documentary chain should remain consistent for renewals.
        </li>
      </ol>

      <h2 id="faq">FAQ</h2>
      <h3>Can I use a property held in a Colombian company?</h3>
      <p>
        Sometimes—this depends on how the investment is structured and evidenced
        (real estate ownership vs. corporate participation), and how it is
        registered. The documentary package must match the legal nature of the
        investment.
      </p>

      <h3>Does the investment need to be maintained during the visa period?</h3>
      <p>
        Generally, the investment is expected to remain in place while the visa
        is valid. If the asset is sold or restructured, the visa basis may be
        undermined unless a compliant replacement investment and registration
        exists.
      </p>

      <h3>Can dependents be included?</h3>
      <p>
        Dependent visas are commonly available for qualifying family members,
        subject to documentary requirements and the principal visa’s validity.
      </p>

      <h3>What happens if I sell the property?</h3>
      <p>
        Selling the qualifying asset can eliminate the factual basis for the
        investor visa. A case-specific analysis is required to assess timing,
        renewal implications, and whether a substitute investment can preserve
        continuity.
      </p>

      <h2 id="glossary">Glossary</h2>
      <ul>
        <li>
          <strong>SMLMV</strong>: Salario Mínimo Legal Mensual Vigente (Colombia’s
          monthly minimum legal wage), used as a legal threshold.
        </li>
        <li>
          <strong>FIEM</strong>: Common shorthand for the digital workflow used
          to manage foreign investment registration evidence.
        </li>
        <li>
          <strong>Cancillería</strong>: Colombia’s Ministry of Foreign Affairs
          (visa authority for most categories).
        </li>
        <li>
          <strong>NIT</strong>: Tax identification number used for entities and,
          in some contexts, individuals.
        </li>
        <li>
          <strong>Cédula de extranjería</strong>: Foreigner ID card tied to
          certain visa statuses.
        </li>
        <li>
          <strong>Resolución 5477 de 2022</strong>: Visa regulation issued by the
          Ministry of Foreign Affairs.
        </li>
      </ul>
    </ClkrArticleLayout>
  );
}

