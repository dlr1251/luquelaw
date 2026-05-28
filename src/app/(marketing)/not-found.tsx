import type { Metadata } from "next";

import { NotFoundView } from "@/components/not-found/not-found-view";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function MarketingNotFound() {
  return <NotFoundView locale="en" />;
}
