// Booking rules shared by the API routes and the booking card.
// Everything is computed in Pakistan time (UTC+5, no daylight saving) so the server and the
// visitor's browser can never disagree about which day is "today".

export const BOOKING_TIME_LABEL = "12:00 PM";
export const BOOKING_TIME_ZONE_LABEL = "Pakistan time";
/** The earliest bookable day is this many days after today, e.g. book on the 23rd → 25th. */
export const BOOKING_LEAD_DAYS = 2;
/** How many consecutive days are shown to pick from. */
export const BOOKING_WINDOW_DAYS = 10;
/** A request the advisor hasn't answered releases its slot after this long. */
export const PENDING_HOLD_HOURS = 24;

// TODO: client to confirm the fee. Shown on the site and in every booking email.
export const CONSULTATION_FEE_EUR = 25;

const PKT_OFFSET_MS = 5 * 60 * 60 * 1000;

/** Today's date in Pakistan as "YYYY-MM-DD". */
export function todayInPakistan(now: Date = new Date()): string {
  return new Date(now.getTime() + PKT_OFFSET_MS).toISOString().slice(0, 10);
}

export function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** The days a student may choose from, earliest first. */
export function bookableDates(now: Date = new Date()): string[] {
  const first = addDays(todayInPakistan(now), BOOKING_LEAD_DAYS);
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, i) => addDays(first, i));
}

export function isBookableDate(dateKey: string, now: Date = new Date()): boolean {
  return bookableDates(now).includes(dateKey);
}

export function describeDate(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    date.toLocaleDateString("en-US", { timeZone: "UTC", ...options });
  return {
    weekday: fmt({ weekday: "short" }),
    day: d,
    month: fmt({ month: "short" }),
    full: fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  };
}
