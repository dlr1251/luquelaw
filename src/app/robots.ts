import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/portal", "/login", "/es/login", "/auth"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
