import { BookingProvider } from "@/components/booking/BookingProvider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  let signedIn = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getClaims();
      signedIn = Boolean(data?.claims);
    } catch {
      signedIn = false;
    }
  }

  return (
    <div className="marketing-theme flex min-h-full flex-col">
      <BookingProvider locale="en">
        <SiteHeader />
        <div id="main" className="flex flex-1 flex-col">
          {children}
        </div>
        <SiteFooter signedIn={signedIn} />
        <WhatsAppFloatingButton />
      </BookingProvider>
    </div>
  );
}
