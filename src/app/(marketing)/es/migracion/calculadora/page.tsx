import { Container } from "@/components/container";
import { ImmigrationHubShell } from "@/components/practice-areas/immigration-hub-shell";
import { LastLegalDayCalculator } from "@/components/practice-areas/last-legal-day-calculator";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigrationCalculator.es.title,
  description: PAGE_SEO.immigrationCalculator.es.description,
  path: "/es/migracion/calculadora",
  locale: "es",
});

export default function ImmigrationCalculatorPageEs() {
  return (
    <ImmigrationHubShell locale="es">
      <main>
        <section className="bg-background">
          <Container className="marketing-section">
            <p className="marketing-eyebrow mb-6">Hub migratorio</p>
            <LastLegalDayCalculator locale="es" />
          </Container>
        </section>
      </main>
    </ImmigrationHubShell>
  );
}
