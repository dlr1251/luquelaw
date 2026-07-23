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
