import type { Metadata } from "next";

import { RootNotFoundPage } from "@/components/not-found/root-not-found-page";

export const metadata: Metadata = {
  title: "Page not found",
};

export default async function NotFound() {
  return <RootNotFoundPage />;
}
