import { BOOKING_TIMES, PENDING_HOLD_MINUTES, adminDates, paymentReference } from "@/lib/booking";
import { isAdmin } from "@/lib/server/admin-auth";
import { BLOCKED_MARKER, listBookings, slotHolders, type Booking } from "@/lib/server/booking-store";

export const dynamic = "force-dynamic";

export type AdminBooking = Booking & {
  reference: string;
  /** "expired" = still unpaid after the 15-minute hold ran out. */
  display: "awaiting-payment" | "expired" | "confirmed" | "cancelled";
  expiresAt: string;
};

export type AdminSlot = {
  time: string;
  state: "free" | "blocked" | "held" | "confirmed";
  bookingId?: string;
  name?: string;
};

export type AdminDay = { date: string; slots: AdminSlot[] };

export async function GET(request: Request) {
  if (!isAdmin(request)) return Response.json({ error: "Not signed in" }, { status: 401 });

  const [bookings, holders] = await Promise.all([listBookings(), slotHolders(adminDates())]);
  const now = Date.now();

  const decorated: AdminBooking[] = bookings.map((b) => {
    const expiresAt = new Date(new Date(b.createdAt).getTime() + PENDING_HOLD_MINUTES * 60_000);
    const display =
      b.status === "pending" ? (expiresAt.getTime() < now ? "expired" : "awaiting-payment") : b.status;
    return { ...b, reference: paymentReference(b.id), display, expiresAt: expiresAt.toISOString() };
  });
  const byId = new Map(decorated.map((b) => [b.id, b]));

  const days: AdminDay[] = Object.entries(holders).map(([date, byTime]) => ({
    date,
    slots: BOOKING_TIMES.map((time): AdminSlot => {
      const holder = byTime[time];
      if (!holder) return { time, state: "free" };
      if (holder === BLOCKED_MARKER) return { time, state: "blocked" };
      const booking = byId.get(holder);
      return { time, state: booking?.status === "confirmed" ? "confirmed" : "held", bookingId: holder, name: booking?.name };
    }),
  }));

  return Response.json({ bookings: decorated, days });
}
