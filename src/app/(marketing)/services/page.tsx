import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { NOINDEX_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = NOINDEX_METADATA;

export default function ServicesPage() {
  redirect("/#practice-areas");
}
