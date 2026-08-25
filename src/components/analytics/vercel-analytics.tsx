"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { useCookieConsent } from "@/components/cookies/cookie-consent-provider";

export function VercelAnalytics() {
  const { ready, analyticsAllowed } = useCookieConsent();

  if (!ready || !analyticsAllowed) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
