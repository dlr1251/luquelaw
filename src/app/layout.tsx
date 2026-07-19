import type { Metadata } from "next";
import { headers } from "next/headers";
import { Arbutus_Slab, Figtree, Geist, Libre_Baskerville } from "next/font/google";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { CookieBanner } from "@/components/cookies/cookie-banner";
import { CookieConsentProvider } from "@/components/cookies/cookie-consent-provider";
import { ThemeScript } from "@/components/theme-script";
import { TooltipProvider } from "@/components/ui/tooltip";
import { localeFromPathname } from "@/lib/locale/paths";
import { getRootMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const display = Arbutus_Slab({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const heading = Libre_Baskerville({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const sans = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = getRootMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const lang = localeFromPathname(pathname);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        display.variable,
        heading.variable,
        sans.variable,
        geist.variable,
      )}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <CookieConsentProvider>
          <GoogleAnalytics />
          <TooltipProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-sm"
            >
              Skip to content
            </a>
            {children}
            <CookieBanner />
          </TooltipProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
