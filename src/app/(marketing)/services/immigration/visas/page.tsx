import { ImmigrationHubShell } from "@/components/practice-areas/immigration-hub-shell";
import { VisasCatalogBrowser } from "@/components/practice-areas/visas-catalog-browser";
import { Container } from "@/components/container";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigrationVisas.en.title,
  description: PAGE_SEO.immigrationVisas.en.description,
  path: "/services/immigration/visas",
  locale: "en",
});

export default function ImmigrationVisasPage() {
  return (
    <ImmigrationHubShell locale="en">
      <main>
        <section className="border-b border-border bg-background">
          <Container className="marketing-section">
            <div className="mb-10 max-w-2xl space-y-3">
              <p className="marketing-eyebrow">Immigration hub</p>
              <h1 className="marketing-title">Visa types & categories</h1>
              <p className="marketing-body">
                Browse Visitante (V), Migrante (M), and Residente (R) categories under Resolución
                5477 de 2022.
              </p>
            </div>
            <VisasCatalogBrowser locale="en" />
          </Container>
        </section>
      </main>
    </ImmigrationHubShell>
  );
}
