import { bookableDates } from "@/lib/booking";
import { takenDates } from "@/lib/server/booking-store";

// Which days can a student pick right now? Computed on the server in Pakistan time, so the
// visitor's own clock (or time zone) never decides what is bookable.
export async function GET() {
  const dates = bookableDates();
  const taken = new Set(await takenDates(dates));
  return Response.json(
    { days: dates.map((date) => ({ date, available: !taken.has(date) })) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
