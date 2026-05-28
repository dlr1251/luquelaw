import { BookingProvider } from "@/components/booking/BookingProvider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-theme flex min-h-full flex-col">
      <BookingProvider locale="en">
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
