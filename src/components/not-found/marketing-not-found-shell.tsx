import { BookingProvider } from "@/components/booking/BookingProvider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";

import type { NotFoundLocale } from "./not-found-view";

type Props = {
  locale: NotFoundLocale;
  children: React.ReactNode;
};

export function MarketingNotFoundShell({ locale, children }: Props) {
  return (
    <div className="marketing-theme flex min-h-full flex-col">
      <BookingProvider locale={locale}>
        <SiteHeader />
        <div id="main" className="flex flex-1 flex-col">
          {children}
        </div>
        <SiteFooter />
        <WhatsAppFloatingButton />
      </BookingProvider>
    </div>
  );
}
