export const COOKIE_CONSENT_KEY = "luquelaw-cookie-consent";

export type CookieConsentValue = "accepted" | "essential";

export type CookieConsentState = {
  value: CookieConsentValue | null;
  decided: boolean;
};

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (raw === "accepted" || raw === "essential") return raw;
  } catch {
    // ignore storage failures
  }
  return null;
}

export function writeCookieConsent(value: CookieConsentValue) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // ignore storage failures
  }
}

export function clearCookieConsent() {
  try {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch {
    // ignore
  }
}
