import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

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
    ];
  },
};

export default nextConfig;
