import type { Metadata } from "next";

import { getEsLayoutMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = getEsLayoutMetadata();

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
