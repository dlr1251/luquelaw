import type { Metadata } from "next";
import { Arbutus_Slab, Lato, Playfair_Display } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";

import "./globals.css";

const display = Arbutus_Slab({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const sans = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const refinement = Playfair_Display({
  variable: "--font-refinement",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Luque Law — Abogado · Legal Counsel",
    template: "%s · Luque Law",
  },
  description:
    "Colombian law for international clients — bilingual legal counsel in Medellín, Colombia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${refinement.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-[color:var(--caramel)] focus:bg-[color:var(--cream)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[color:var(--ink)] focus:shadow-sm"
        >
          Skip to content
        </a>
        <BookingProvider locale="en">
          <SiteHeader />
          <div id="main" className="flex flex-1 flex-col">
            {children}
          </div>
          <SiteFooter />
          <WhatsAppFloatingButton />
        </BookingProvider>
      </body>
    </html>
  );
}
