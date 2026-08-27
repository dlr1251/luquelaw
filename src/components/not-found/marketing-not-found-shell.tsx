import { BookingProvider } from "@/components/booking/BookingProvider";
import { SiteSearchPalette } from "@/components/search/site-search-palette";
import { SiteSearchProvider } from "@/components/search/site-search-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderChrome } from "@/components/site-header-chrome";
import { getSiteHeaderProps } from "@/components/site-header";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";

import type { NotFoundLocale } from "./not-found-view";

type Props = {
  locale: NotFoundLocale;
  children: React.ReactNode;
};

export async function MarketingNotFoundShell({ locale, children }: Props) {
  const header = await getSiteHeaderProps();

  return (
    <div className="marketing-theme flex min-h-full flex-col">
      <SiteSearchProvider>
        <BookingProvider locale={locale}>
          <SiteHeaderChrome {...header} />
          <div id="main" className="flex flex-1 flex-col">
            {children}
          </div>
          <SiteFooter signedIn={header.signedIn} />
          <WhatsAppFloatingButton />
          <SiteSearchPalette signedIn={header.signedIn} />
        </BookingProvider>
      </SiteSearchProvider>
    </div>
  );
}
