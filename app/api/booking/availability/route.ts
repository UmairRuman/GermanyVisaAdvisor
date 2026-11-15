import { BOOKING_TIMES, bookableDates, timeLabel } from "@/lib/booking";
import { slotHolders } from "@/lib/server/booking-store";

// Which days and times can a student pick right now? Computed on the server in Pakistan time,
// so the visitor's own clock (or time zone) never decides what is bookable.
export async function GET() {
  const dates = bookableDates();
  const holders = await slotHolders(dates);
  const days = dates.map((date) => {
    const slots = BOOKING_TIMES.map((time) => ({ time, label: timeLabel(time), available: !holders[date]?.[time] }));
    return { date, available: slots.some((s) => s.available), slots };
  });
  return Response.json({ days }, { headers: { "Cache-Control": "no-store" } });
}
