"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { BookingCalendarEmbed } from "@/components/booking/booking-calendar-embed";
import { localeFromPathname } from "@/lib/locale/paths";

type BookingContextValue = {
  open: () => void;
  close: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBookingModal() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookingModal must be used within BookingProvider");
  return ctx;
}

type Props = {
  children: React.ReactNode;
  /** Optional override; defaults to locale from the current pathname. */
  locale?: "en" | "es";
};

export function BookingProvider({ children, locale: localeProp }: Props) {
  const pathname = usePathname();
  const locale = localeProp ?? localeFromPathname(pathname);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const openModal = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#book") openModal();
    };
    window.addEventListener("hashchange", onHash);
    const timer = window.setTimeout(onHash, 0);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", onHash);
    };
  }, [openModal]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  const value = useMemo(() => ({ open: openModal, close }), [close, openModal]);

  const copy =
    locale === "es"
      ? {
          title: "Consulta inicial de 45 minutos",
          description: "Elige un horario y paga en el mismo flujo (USD 55 · Google Meet).",
          close: "Cerrar",
        }
      : {
          title: "45-minute initial consultation",
          description: "Pick a time and pay in the same flow (USD 55 · Google Meet).",
          close: "Close",
        };

  return (
    <BookingContext.Provider value={value}>
      {children}

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={copy.title}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[color:var(--ink)]/60"
            aria-label={copy.close}
            onClick={close}
          />

          <div className="relative flex max-h-[min(100dvh-2rem,900px)] w-full max-w-4xl flex-col overflow-hidden border border-border bg-card text-card-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border bg-surface p-4 sm:p-5">
              <div>
                <div className="font-display text-xl font-normal leading-tight tracking-tight text-[color:var(--forest)]">
                  {copy.title}
                </div>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {copy.description}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[color:var(--forest)] bg-background text-[color:var(--forest)] transition hover:bg-[color:var(--forest)] hover:text-[color:var(--parchment)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--moss)]"
                aria-label={copy.close}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
              <BookingCalendarEmbed
                title={copy.title}
                locale={locale}
                heightClass="h-[min(72dvh,640px)]"
              />
            </div>
          </div>
        </div>
      ) : null}
    </BookingContext.Provider>
  );
}
