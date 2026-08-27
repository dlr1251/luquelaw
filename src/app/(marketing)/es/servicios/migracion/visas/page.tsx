import { ImmigrationHubShell } from "@/components/practice-areas/immigration-hub-shell";
import { VisasCatalogBrowser } from "@/components/practice-areas/visas-catalog-browser";
import { Container } from "@/components/container";
import { PAGE_SEO } from "@/lib/seo/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { resolveVisasCatalog } from "@/lib/visas/get-visas";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: PAGE_SEO.immigrationVisas.es.title,
  description: PAGE_SEO.immigrationVisas.es.description,
  path: "/es/servicios/migracion/visas",
  locale: "es",
});

export default async function ImmigrationVisasPageEs() {
  const visas = await resolveVisasCatalog();

  return (
    <ImmigrationHubShell locale="es">
      <main>
        <section className="border-b border-border bg-background">
          <Container className="marketing-section">
            <div className="mb-10 max-w-2xl space-y-3">
              <p className="marketing-eyebrow">Hub migratorio</p>
              <h1 className="marketing-title">Tipos y categorías de visa</h1>
              <p className="marketing-body">
                Explora Visitante (V), Migrante (M) y Residente (R) bajo la Resolución 5477 de 2022.
              </p>
            </div>
            <VisasCatalogBrowser locale="es" visas={visas} />
          </Container>
        </section>
      </main>
    </ImmigrationHubShell>
  );
}
