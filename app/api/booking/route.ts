import { randomUUID } from "node:crypto";
import { z } from "zod";
import { isBookableDate } from "@/lib/booking";
import { declineBooking, holdSlot, storeIsPersistent, underRateLimit, type Booking } from "@/lib/server/booking-store";
import { mailIsConfigured, sendAdvisorRequest, sendStudentReceived } from "@/lib/server/booking-mail";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  whatsapp: z.string().trim().min(7).max(25),
  topic: z.string().trim().max(500).optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // Honeypot: real visitors never see or fill this field; bots usually do.
  company: z.string().optional(),
});

const fail = (message: string, status: number) => Response.json({ error: message }, { status });

export async function POST(request: Request) {
  // Without email there is no way to reach the advisor — never take a booking we can't deliver.
  if (!mailIsConfigured && process.env.NODE_ENV === "production") {
    return fail("Booking is temporarily unavailable. Please message us on WhatsApp.", 503);
  }
  if (!storeIsPersistent && process.env.NODE_ENV === "production") {
    return fail("Booking is temporarily unavailable. Please message us on WhatsApp.", 503);
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await request.json());
  } catch {
    return fail("Please check your details and try again.", 400);
  }

  // Bots get a fake success so they learn nothing.
  if (input.company) return Response.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await underRateLimit(`booking:${ip}`, 5))) {
    return fail("Too many requests. Please try again in an hour.", 429);
  }

  if (!isBookableDate(input.date)) return fail("That day is not available. Please pick another.", 400);

  const booking: Booking = {
    id: randomUUID(),
    date: input.date,
    name: input.name,
    email: input.email,
    whatsapp: input.whatsapp,
    topic: input.topic,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (!(await holdSlot(booking))) return fail("Sorry, that day was just taken. Please pick another.", 409);

  try {
    await sendAdvisorRequest(booking);
    // The student's receipt is a courtesy — a failure here must not undo the booking.
    await sendStudentReceived(booking).catch((error) => console.error("student email failed", error));
  } catch (error) {
    console.error("advisor email failed", error);
    await declineBooking(booking); // release the day so it isn't locked with no request sent
    return fail("We couldn't send your request. Please message us on WhatsApp.", 502);
  }

  return Response.json({ ok: true });
}
