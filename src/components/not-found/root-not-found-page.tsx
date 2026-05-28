import { headers } from "next/headers";

import { MarketingNotFoundShell } from "@/components/not-found/marketing-not-found-shell";
import { NotFoundView, type NotFoundLocale } from "@/components/not-found/not-found-view";

function localeFromPathname(pathname: string): NotFoundLocale {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

export async function RootNotFoundPage() {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const locale = localeFromPathname(pathname);

  return (
    <MarketingNotFoundShell locale={locale}>
      <NotFoundView locale={locale} />
    </MarketingNotFoundShell>
  );
}
