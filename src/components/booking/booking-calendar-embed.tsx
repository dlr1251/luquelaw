"use client";

import { getBookingUrl, isBookingConfigured } from "@/lib/booking/url";
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

  if (!configured) {
    return (
      <div
        className={cn(
          "border border-border bg-surface p-4 text-sm leading-6 text-muted-foreground",
          className,
        )}
      >
        {locale === "es" ? (
          <>
            Falta configurar el enlace del calendario. Define{" "}
            <span className="font-bold text-foreground">NEXT_PUBLIC_BOOKING_URL</span> en tu entorno
            para mostrar el calendario aquí.
          </>
        ) : (
          <>
            The scheduler link isn&apos;t configured yet. Set{" "}
            <span className="font-bold text-foreground">NEXT_PUBLIC_BOOKING_URL</span> in your
            environment to show the calendar here.
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden border border-border bg-white", className)}>
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
