"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import {
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentValue,
} from "@/lib/cookies/consent";

const CONSENT_EVENT = "luquelaw-cookie-consent";

function subscribeConsent(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onChange = () => onStoreChange();
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}

function getConsentSnapshot(): CookieConsentValue | null {
  return readCookieConsent();
}

function getServerConsentSnapshot(): CookieConsentValue | null {
  return null;
}

function subscribeHydration() {
  return () => {};
}

function getClientHydrated() {
  return true;
}

function getServerHydrated() {
  return false;
}

function persistConsent(value: CookieConsentValue) {
  writeCookieConsent(value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

type CookieConsentContextValue = {
  ready: boolean;
  consent: CookieConsentValue | null;
  analyticsAllowed: boolean;
  showBanner: boolean;
  acceptAll: () => void;
  essentialOnly: () => void;
  openSettings: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}

type Props = {
  children: React.ReactNode;
};

export function CookieConsentProvider({ children }: Props) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const ready = useSyncExternalStore(subscribeHydration, getClientHydrated, getServerHydrated);
  const [forceShow, setForceShow] = useState(false);

  const acceptAll = useCallback(() => {
    const previous = readCookieConsent();
    persistConsent("accepted");
    setForceShow(false);
    if (previous === "essential") {
      window.location.reload();
    }
  }, []);

  const essentialOnly = useCallback(() => {
    const previous = readCookieConsent();
    persistConsent("essential");
    setForceShow(false);
    if (previous === "accepted") {
      window.location.reload();
    }
  }, []);

  const openSettings = useCallback(() => {
    setForceShow(true);
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      ready,
      consent,
      analyticsAllowed: consent === "accepted",
      showBanner: ready && (forceShow || consent === null),
      acceptAll,
      essentialOnly,
      openSettings,
    }),
    [ready, consent, forceShow, acceptAll, essentialOnly, openSettings],
  );

  return (
    <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
  );
}
