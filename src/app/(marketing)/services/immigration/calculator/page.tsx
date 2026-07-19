import { Container } from "@/components/container";
import { ImmigrationHubShell } from "@/components/practice-areas/immigration-hub-shell";
import { LastLegalDayCalculator } from "@/components/practice-areas/last-legal-day-calculator";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigrationCalculator.en.title,
  description: PAGE_SEO.immigrationCalculator.en.description,
  path: "/services/immigration/calculator",
  locale: "en",
});

export default function ImmigrationCalculatorPage() {
  return (
    <ImmigrationHubShell locale="en">
      <main>
        <section className="bg-background">
          <Container className="marketing-section">
            <p className="marketing-eyebrow mb-6">Immigration hub</p>
            <LastLegalDayCalculator locale="en" />
          </Container>
        </section>
      </main>
    </ImmigrationHubShell>
  );
}
