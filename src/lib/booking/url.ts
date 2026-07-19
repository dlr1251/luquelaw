/**
 * Google Calendar Appointment Scheduling URLs
 *
 * Single booking page (one consultation type) — use this:
 *   https://calendar.google.com/calendar/appointments/schedules/SCHEDULE_ID?gv=true
 *
 * All booking pages (lists every service — shows multiple types):
 *   https://calendar.google.com/calendar/appointments/AcZss…=?gv=true
 *
 * How to get the single-page embed (official docs):
 *   Calendar → Booking pages → hover the 45-min schedule → Options →
 *   Sharing options → Website embed → “A single booking page” →
 *   Inline booking page → copy the iframe `src`.
 *   https://support.google.com/calendar/answer/10733297
 */

function readBookingUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BOOKING_URL?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_BOOKING_URL?.trim() ||
    ""
  );
}

/** True when the URL is the multi-service “all booking pages” aggregator. */
export function isMultiBookingPageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "calendar.google.com" &&
      parsed.pathname.startsWith("/calendar/appointments/") &&
      !parsed.pathname.includes("/schedules/")
    );
  } catch {
    return false;
  }
}

export function getBookingUrl(): string {
  return readBookingUrl();
}

export function isBookingConfigured(): boolean {
  const url = readBookingUrl();
  return Boolean(url && !url.toLowerCase().includes("your_schedule_id") && !url.includes("your-link"));
}

export function isSingleBookingPageConfigured(): boolean {
  const url = readBookingUrl();
  return isBookingConfigured() && !isMultiBookingPageUrl(url);
}
