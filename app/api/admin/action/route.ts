import { z } from "zod";
import { adminDates } from "@/lib/booking";
import { isAdmin } from "@/lib/server/admin-auth";
import { blockDate, cancelBooking, confirmBooking, getBooking, unblockDate } from "@/lib/server/booking-store";
import { sendStudentCancelled, sendStudentConfirmed } from "@/lib/server/booking-mail";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("confirm"), id: z.string().min(8).max(64) }),
  z.object({ action: z.literal("cancel"), id: z.string().min(8).max(64) }),
  z.object({ action: z.literal("block"), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }),
  z.object({ action: z.literal("unblock"), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }),
]);

const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(request: Request) {
  if (!isAdmin(request)) return fail("Not signed in", 401);

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return fail("Invalid request");
  }

  if (input.action === "block" || input.action === "unblock") {
    if (!adminDates().includes(input.date)) return fail("That day is outside the manageable range.");
    if (input.action === "block") {
      return (await blockDate(input.date)) ? Response.json({ ok: true }) : fail("That day is already held, booked or blocked.", 409);
    }
    return (await unblockDate(input.date)) ? Response.json({ ok: true }) : fail("That day is not blocked.", 409);
  }

  const booking = await getBooking(input.id);
  if (!booking) return fail("Booking not found.", 404);

  if (input.action === "confirm") {
    if (booking.status === "confirmed") return fail("Already confirmed.", 409);
    const result = await confirmBooking(booking);
    if (!result.ok) {
      return fail(
        result.reason === "taken"
          ? "The 15-minute hold ran out and another student or a block now holds that day, so it can't be confirmed. Cancel this booking and move the student to another day."
          : "This booking was cancelled.",
        409,
      );
    }
    try {
      await sendStudentConfirmed(result.booking);
    } catch (error) {
      console.error("confirmation email failed", error);
      return Response.json({ ok: true, warning: "Confirmed, but the confirmation email failed — please email the student yourself." });
    }
    return Response.json({ ok: true });
  }

  if (booking.status === "cancelled") return fail("Already cancelled.", 409);
  const cancelled = await cancelBooking(booking);
  try {
    await sendStudentCancelled(cancelled);
  } catch (error) {
    console.error("cancel email failed", error);
    return Response.json({ ok: true, warning: "Cancelled, but the email to the student failed." });
  }
  return Response.json({ ok: true });
}
