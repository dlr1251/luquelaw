import type { Metadata } from "next";

import { BookingProvider } from "@/components/booking/BookingProvider";
import { SiteSearchPalette } from "@/components/search/site-search-palette";
import { SiteSearchProvider } from "@/components/search/site-search-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderChrome } from "@/components/site-header-chrome";
import { getSiteHeaderProps } from "@/components/site-header";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";
import { NOINDEX_NOFOLLOW_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = NOINDEX_NOFOLLOW_METADATA;

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const header = await getSiteHeaderProps();

  return (
    <div className="marketing-theme flex min-h-svh flex-col">
      <SiteSearchProvider>
        <BookingProvider>
          <SiteHeaderChrome {...header} />
          <div id="main" className="dashboard-theme flex min-h-0 flex-1 flex-col">
            {children}
          </div>
          <div className="relative z-20 shrink-0">
            <SiteFooter signedIn={header.signedIn} />
          </div>
          <WhatsAppFloatingButton />
          <SiteSearchPalette signedIn={header.signedIn} />
        </BookingProvider>
      </SiteSearchProvider>
    </div>
  );
}
