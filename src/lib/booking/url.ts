export function getBookingUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BOOKING_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL ||
    "https://calendar.app.google/6nqwkQTmHX1UohVb7"
  );
}
