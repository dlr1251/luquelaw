"use client";

import {
  getBookingUrl,
  isBookingConfigured,
  isMultiBookingPageUrl,
} from "@/lib/booking/url";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  locale?: "en" | "es";
  className?: string;
  heightClass?: string;
};

export function BookingCalendarEmbed({
  title,
  locale = "en",
  className,
  heightClass = "h-[600px]",
}: Props) {
  const bookingUrl = getBookingUrl();
  const configured = isBookingConfigured();
  const multiPage = configured && isMultiBookingPageUrl(bookingUrl);

  if (!configured) {
    const isDev = process.env.NODE_ENV === "development";
    return (
      <div
        className={cn(
          "border border-border bg-surface p-4 text-sm leading-6 text-muted-foreground",
          className,
        )}
      >
        {isDev ? (
          locale === "es" ? (
            <>
              Falta configurar el enlace del calendario. Define{" "}
              <span className="font-bold text-foreground">NEXT_PUBLIC_BOOKING_URL</span> con el embed
              de <span className="font-bold text-foreground">una sola</span> página de reserva
              (<code className="text-foreground">…/appointments/schedules/…</code>).
            </>
          ) : (
            <>
              The scheduler link isn&apos;t configured yet. Set{" "}
              <span className="font-bold text-foreground">NEXT_PUBLIC_BOOKING_URL</span> to a{" "}
              <span className="font-bold text-foreground">single</span> booking-page embed (
              <code className="text-foreground">…/appointments/schedules/…</code>).
            </>
          )
        ) : locale === "es" ? (
          <>
            La reserva en línea no está disponible por ahora. Escríbenos por WhatsApp o por el
            formulario de contacto.
          </>
        ) : (
          <>
            Online booking is temporarily unavailable. Reach us on WhatsApp or through the contact
            form.
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden border border-border bg-white", className)}>
      {multiPage && process.env.NODE_ENV === "development" ? (
        <p className="border-b border-amber-500/40 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          {locale === "es"
            ? "Este URL es el de “todas las páginas” (varios tipos). En Calendar → Booking pages → esa consulta → Website embed → “A single booking page”, y pega el src con /schedules/ en NEXT_PUBLIC_BOOKING_URL."
            : "This URL is the “all booking pages” aggregator. In Calendar → Booking pages → that consultation → Website embed → “A single booking page”, then paste the /schedules/ src into NEXT_PUBLIC_BOOKING_URL."}
        </p>
      ) : null}
      <iframe
        title={title}
        src={bookingUrl}
        className={cn("w-full border-0", heightClass)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
