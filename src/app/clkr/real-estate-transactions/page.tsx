import { ClkrArticleLayout } from "@/components/clkr/article-layout";

const sections = [
  { id: "definition", title: "Definition" },
  { id: "legal-framework", title: "Legal framework" },
  { id: "doctrinal-note", title: "Doctrinal note" },
  { id: "practical-example", title: "Practical example" },
  { id: "faq", title: "FAQ" },
  { id: "glossary", title: "Glossary" },
] as const;

export default function RealEstateTransactionsArticlePage() {
  return (
    <ClkrArticleLayout
      currentSlug="/clkr/real-estate-transactions"
      title="Real Estate Transactions for Foreigners"
      category="Real Estate"
      readingTime="14 min"
      description="Buying property in Colombia as a foreigner: due diligence, notarial process, taxes, registration, and foreign investment compliance."
      sections={[...sections]}
    >
      <h2 id="definition">Definition</h2>
      <p>
        <strong>Yes—foreigners can buy property in Colombia.</strong> In general,
        foreigners have the same civil rights as nationals, subject to
        constitutionally permitted limitations. A frequently cited baseline is{" "}
        <strong>Constitution Article 100</strong> and the broader foreign
        investment regime.
      </p>
      <p>
        The practical question is not whether you can buy, but how to buy in a
        way that preserves: (i) clean title, (ii) enforceable contractual
        position, and (iii) foreign-exchange compliance that protects future{" "}
        <strong>repatriation</strong> rights.
      </p>

      <h2 id="legal-framework">Legal framework</h2>
      <p>
        A foreign buyer typically intersects with two legal systems at once:
        property law (title/registration) and the foreign exchange regime
        (investment registration).
      </p>
      <ul>
        <li>
          <strong>Foreign exchange / investment regime</strong>: commonly
          associated with <strong>Law 9 of 1991</strong> and implementing norms
          (often referenced alongside <strong>Decree 1068 of 2015</strong>).
        </li>
        <li>
          <strong>Banco de la República investment registration</strong>: key for
          preserving repatriation rights for capital and profits.
        </li>
        <li>
          <strong>Notarial process</strong>: the transfer is formalized through
          an <strong>Escritura Pública</strong>, executed before a notary.
        </li>
        <li>
          <strong>Registration</strong>: the deed is registered in the public
          registry, updating the <strong>Folio de Matrícula Inmobiliaria</strong>.
        </li>
        <li>
          <strong>Transaction costs</strong>: transfer/registration taxes, notary
          fees, and banking charges (including <strong>GMF</strong>, depending on
          the path funds take).
        </li>
      </ul>
      <p>
        Rates vary by department/municipality and transaction structure, but a
        common planning range includes <strong>impuesto de registro</strong>{" "}
        (often described in the <strong>0.5–1%</strong> band), plus notary fees
        commonly estimated around <strong>~0.3%</strong> per party as a rough
        planning heuristic.
      </p>

      <h2 id="doctrinal-note">Doctrinal note</h2>
      <p>
        For foreign investors, the doctrinal core is the{" "}
        <strong>canal cambiario</strong>: bringing funds into Colombia through an
        authorized intermediary with the correct purpose coding and evidence.
      </p>
      <p>
        Paying “outside the system” (e.g., informal cash mechanisms) can create
        downstream problems: difficulty proving the lawful source of funds, and
        a weakened position to repatriate capital gains or principal later. In
        a transaction, compliance is not just bureaucracy—it is future optionality.
      </p>

      <h2 id="practical-example">Practical example</h2>
      <p>
        <strong>Scenario:</strong> A Canadian citizen buys a property in El
        Poblado for <strong>USD 200,000</strong>.
      </p>
      <ol>
        <li>
          <strong>Wire funds</strong> through an authorized intermediary (bank)
          using the appropriate foreign investment purpose coding.
        </li>
        <li>
          <strong>Document the FX/investment registration</strong> with Banco de
          la República (commonly via FIEM workflow evidence).
        </li>
        <li>
          <strong>Negotiate and sign</strong> a{" "}
          <strong>Promesa de Compraventa</strong> (promise to buy/sell) with
          clear conditions, timelines, and remedies.
        </li>
        <li>
          <strong>Due diligence</strong>: review title chain, liens, property
          tax status, building regulations, and seller authority.
        </li>
        <li>
          <strong>Execute the Escritura Pública</strong> before a notary, ensuring
          the deed reflects the true economic terms and the funds source evidence.
        </li>
        <li>
          <strong>Register the deed</strong> and confirm the updated folio and
          registration receipts.
        </li>
      </ol>

      <h2 id="faq">FAQ</h2>
      <h3>Do I need a Colombian ID to buy property?</h3>
      <p>
        Not necessarily. A passport can be sufficient for many steps, but some
        banks, notaries, or counterparties may require additional identifiers
        (e.g., tax registration) depending on the transaction.
      </p>

      <h3>Can I buy through an LLC or foreign company?</h3>
      <p>
        It’s possible, but the structure changes the compliance and tax analysis
        (corporate formalities, beneficial owner disclosures, and how foreign
        investment is registered). The choice should be driven by purpose and
        risk, not convenience.
      </p>

      <h3>How do I bring money into Colombia legally?</h3>
      <p>
        Typically by wiring through an authorized intermediary under the foreign
        exchange regime and keeping the documentation aligned with the investment.
        The investment registration evidence is crucial for future repatriation.
      </p>

      <h3>What taxes do I pay at closing?</h3>
      <p>
        Common closing costs include registration tax and notary fees, plus
        banking charges depending on the path. Exact amounts vary by location
        and transaction details.
      </p>

      <h3>Can I rent it out immediately?</h3>
      <p>
        Often yes, but leasing introduces practical compliance considerations
        (building rules, tax reporting, and in some cases licensing depending on
        use). Verify the building’s regulations and your intended rental model.
      </p>

      <h2 id="glossary">Glossary</h2>
      <ul>
        <li>
          <strong>Escritura Pública</strong>: Public deed executed before a notary
          that formalizes the transfer.
        </li>
        <li>
          <strong>Promesa de Compraventa</strong>: Preliminary contract that sets
          conditions and obligations to later execute the deed.
        </li>
        <li>
          <strong>Canal cambiario</strong>: The regulated route for bringing funds
          into Colombia via authorized intermediaries.
        </li>
        <li>
          <strong>Impuesto de registro</strong>: Registration tax applied to deeds
          upon registration.
        </li>
        <li>
          <strong>GMF</strong>: Financial transaction tax that can apply to certain
          banking movements.
        </li>
        <li>
          <strong>Catastro</strong>: Cadastre / property valuation registry used
          for administrative and tax purposes.
        </li>
        <li>
          <strong>Folio de Matrícula Inmobiliaria</strong>: The property’s public
          registry folio reflecting title, liens, and registration history.
        </li>
      </ul>
    </ClkrArticleLayout>
  );
}

