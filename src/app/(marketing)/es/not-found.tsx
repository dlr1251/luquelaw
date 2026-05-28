import type { Metadata } from "next";

import { NotFoundView } from "@/components/not-found/not-found-view";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function MarketingNotFoundEs() {
  return <NotFoundView locale="es" />;
}
