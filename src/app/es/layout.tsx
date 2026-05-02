import type { Metadata } from "next";

import { BookingProvider } from "@/components/booking/BookingProvider";

export const metadata: Metadata = {
  title: {
    default: "Luque Law — Abogado",
    template: "%s · Luque Law",
  },
  description: "Derecho colombiano para clientes internacionales — asesoría legal bilingüe en Colombia.",
};

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return <BookingProvider locale="es">{children}</BookingProvider>;
}

