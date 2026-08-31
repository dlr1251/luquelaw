import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { withEve } from "eve/next";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      { source: "/clkr/guides", destination: "/clkr", permanent: true },
      { source: "/es/clkr/guides", destination: "/es/clkr", permanent: true },
      { source: "/clkr/study/:slug*", destination: "/clkr", permanent: true },
      { source: "/es/clkr/study/:slug*", destination: "/es/clkr", permanent: true },
      // CLKR visa guides → immigration visas catalog (content lives there now)
      {
        source: "/clkr/guides/investor-visa",
        destination: "/services/immigration/visas/inversionista",
        permanent: true,
      },
      {
        source: "/es/clkr/guides/investor-visa",
        destination: "/es/servicios/migracion/visas/inversionista",
        permanent: true,
      },
      {
        source: "/clkr/guides/migrant-visa-type-m-investor",
        destination: "/services/immigration/visas/inversionista",
        permanent: true,
      },
      {
        source: "/es/clkr/guides/migrant-visa-type-m-investor",
        destination: "/es/servicios/migracion/visas/inversionista",
        permanent: true,
      },
      {
        source: "/clkr/guides/migrant-visa-type-m-worker",
        destination: "/services/immigration/visas/trabajador",
        permanent: true,
      },
      {
        source: "/es/clkr/guides/migrant-visa-type-m-worker",
        destination: "/es/servicios/migracion/visas/trabajador",
        permanent: true,
      },
      {
        source: "/clkr/guides/migrant-visa-type-m-pensioner-rentier",
        destination: "/services/immigration/visas/pensionado",
        permanent: true,
      },
      {
        source: "/es/clkr/guides/migrant-visa-type-m-pensioner-rentier",
        destination: "/es/servicios/migracion/visas/pensionado",
        permanent: true,
      },
      {
        source: "/clkr/guides/digital-nomad-visa-type-m",
        destination: "/services/immigration/visas/nomadas-digitales",
        permanent: true,
      },
      {
        source: "/es/clkr/guides/digital-nomad-visa-type-m",
        destination: "/es/servicios/migracion/visas/nomadas-digitales",
        permanent: true,
      },
      {
        source: "/clkr/guides/visitor-visa-type-v",
        destination: "/services/immigration/visas",
        permanent: true,
      },
      {
        source: "/es/clkr/guides/visitor-visa-type-v",
        destination: "/es/servicios/migracion/visas",
        permanent: true,
      },
      {
        source: "/clkr/guides/resident-visa-type-r",
        destination: "/services/immigration/visas",
        permanent: true,
      },
      {
        source: "/es/clkr/guides/resident-visa-type-r",
        destination: "/es/servicios/migracion/visas",
        permanent: true,
      },
      {
        source: "/clkr/guides/migrant-visa-type-m-categories-requirements",
        destination: "/services/immigration/visas",
        permanent: true,
      },
      {
        source: "/es/clkr/guides/migrant-visa-type-m-categories-requirements",
        destination: "/es/servicios/migracion/visas",
        permanent: true,
      },
      { source: "/norms", destination: "/clkr/norms", permanent: true },
      { source: "/es/norms", destination: "/es/clkr/norms", permanent: true },
      { source: "/norms/:slug*", destination: "/clkr/norms/:slug*", permanent: true },
      { source: "/es/norms/:slug*", destination: "/es/clkr/norms/:slug*", permanent: true },
      { source: "/account", destination: "/portal", permanent: true },
      { source: "/account/:path*", destination: "/portal/:path*", permanent: true },
      { source: "/portal/torny", destination: "/portal/lucy", permanent: true },
      { source: "/portal/torny/:path*", destination: "/portal/lucy/:path*", permanent: true },
      { source: "/immigration", destination: "/services/immigration", permanent: true },
      {
        source: "/immigration/:path*",
        destination: "/services/immigration/:path*",
        permanent: true,
      },
      { source: "/es/migracion", destination: "/es/servicios/migracion", permanent: true },
      {
        source: "/es/migracion/:path*",
        destination: "/es/servicios/migracion/:path*",
        permanent: true,
      },
      { source: "/es/services", destination: "/es/servicios", permanent: true },
      {
        source: "/es/services/:path*",
        destination: "/es/servicios/:path*",
        permanent: true,
      },
    ];
  },
};

export default withEve(nextConfig);
