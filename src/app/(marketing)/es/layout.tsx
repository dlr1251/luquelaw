import type { Metadata } from "next";

import { BookingProvider } from "@/components/booking/BookingProvider";
import { getEsLayoutMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = getEsLayoutMetadata();

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return <BookingProvider locale="es">{children}</BookingProvider>;
}

