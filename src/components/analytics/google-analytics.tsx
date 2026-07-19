"use client";

import Script from "next/script";

import { useCookieConsent } from "@/components/cookies/cookie-consent-provider";
import { GA_MEASUREMENT_ID } from "@/lib/seo/config";

export function GoogleAnalytics() {
  const { ready, analyticsAllowed } = useCookieConsent();

  if (!GA_MEASUREMENT_ID || !ready || !analyticsAllowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
