"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getBookingUrl } from "@/lib/booking/url";

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
  locale?: "en" | "es";
};

export function BookingProvider({ children, locale = "en" }: Props) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const openModal = useCallback(() => setOpen(true), []);

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

  const title = locale === "es" ? "Agendar consulta" : "Book a consultation";
  const description =
    locale === "es"
      ? "Selecciona un horario en el calendario. Si prefieres, puedes ver los detalles en la página de contacto."
      : "Pick a time on the calendar. If you prefer, you can view consultation details on the contact page.";

  const bookingUrl = getBookingUrl();

  return (
    <BookingContext.Provider value={value}>
      {children}

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[color:var(--ink)]/60"
            aria-label={locale === "es" ? "Cerrar" : "Close"}
            onClick={close}
          />

          <div className="relative flex max-h-[min(100dvh-2rem,900px)] w-full max-w-4xl flex-col overflow-y-auto border-2 border-[color:var(--moss)] bg-[color:var(--parchment)] text-[color:var(--ink)] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--moss)]/25 bg-[color:var(--surface)] p-4 sm:p-5">
              <div>
                <div className="font-display text-xl font-normal leading-tight tracking-tight text-[color:var(--forest)]">
                  {title}
                </div>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[color:var(--forest)] bg-white/60 text-[color:var(--forest)] transition hover:bg-[color:var(--forest)] hover:text-[color:var(--parchment)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--moss)]"
                aria-label={locale === "es" ? "Cerrar" : "Close"}
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

            <div className="p-4 sm:p-5">
              {bookingUrl ? (
                <div className="relative w-full overflow-hidden border border-[color:var(--moss)]/30 bg-white">
                  <iframe
                    title={title}
                    src={bookingUrl}
                    className="h-[min(70dvh,520px)] w-full sm:h-[70vh]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="border border-[color:var(--moss)]/30 bg-[color:var(--surface)] p-4 text-sm leading-6 text-muted-foreground">
                  {locale === "es" ? (
                    <>
                      Falta configurar el enlace del calendario. Define{" "}
                      <span className="font-bold text-[color:var(--forest)]">NEXT_PUBLIC_BOOKING_URL</span> en tu entorno
                      para mostrar el calendario aquí.
                    </>
                  ) : (
                    <>
                      The scheduler link isn’t configured yet. Set{" "}
                      <span className="font-bold text-[color:var(--forest)]">NEXT_PUBLIC_BOOKING_URL</span> in your
                      environment to show the calendar here.
                    </>
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={locale === "es" ? "/es#contact" : "/#contact"}
                  className="text-sm font-bold text-[color:var(--forest)] underline-offset-2 hover:text-[color:var(--moss)] hover:underline"
                >
                  {locale === "es" ? "Ver detalles de la consulta →" : "View consultation details →"}
                </a>
                <a
                  href={
                    locale === "es"
                      ? "mailto:daniel@luquelaw.co?subject=Solicitud%20de%20consulta%20(Luque%20Law)"
                      : "mailto:daniel@luquelaw.co?subject=Consultation%20request%20(Luque%20Law)"
                  }
                  className="btn-secondary btn-secondary-sm"
                >
                  {locale === "es" ? "Solicitar por correo" : "Request by email"}
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </BookingContext.Provider>
  );
}

