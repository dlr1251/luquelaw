function readBookingUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL?.trim() ||
    ""
  );
}

export function getBookingUrl(): string {
  return readBookingUrl();
}

export function isBookingConfigured(): boolean {
  const url = readBookingUrl();
  return Boolean(url && !url.includes("your-link"));
}
