import { describeDate, BOOKING_TIME_LABEL, BOOKING_TIME_ZONE_LABEL } from "@/lib/booking";
import { readToken } from "@/lib/server/booking-token";
import { confirmBooking, declineBooking, getBooking } from "@/lib/server/booking-store";
import { sendStudentDecision } from "@/lib/server/booking-mail";

// The advisor's confirm / decline links land here. GET only shows a page with a button and
// changes nothing — email scanners often "click" links in advance, so the action itself
// happens on POST, when the advisor presses the button.

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head>
  <body style="margin:0;background:#faf7f1;font-family:Arial,Helvetica,sans-serif;color:#1a1613">
  <main style="max-width:460px;margin:12vh auto;padding:32px;background:#fff;border:1px solid #e7dfd2;border-radius:24px">
  <h1 style="margin:0 0 16px;font-size:22px">${title}</h1>${body}</main></body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

const summary = (name: string, date: string) =>
  `<p style="font-size:15px;line-height:1.6"><strong>${escapeHtml(name)}</strong><br>${describeDate(date).full}, ${BOOKING_TIME_LABEL} ${BOOKING_TIME_ZONE_LABEL}</p>`;

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const parsed = readToken(token);
  if (!parsed) return page("Link not valid", "<p>This link is invalid or has been altered.</p>", 400);

  const booking = await getBooking(parsed.id);
  if (!booking) return page("Request not found", "<p>This request has expired or no longer exists.</p>", 404);

  if (booking.status !== "pending") {
    return page(`Already ${booking.status}`, `${summary(booking.name, booking.date)}<p>No further action is needed.</p>`);
  }

  const confirming = parsed.action === "confirm";
  return page(
    confirming ? "Confirm this session?" : "Decline this request?",
    `${summary(booking.name, booking.date)}
     <form method="post" action="/api/booking/respond"><input type="hidden" name="token" value="${escapeHtml(token)}">
     <button type="submit" style="padding:14px 28px;border:0;border-radius:999px;background:${confirming ? "#1fae54" : "#b3241c"};color:#fff;font-weight:bold;font-size:15px;cursor:pointer">
     ${confirming ? "Yes, confirm" : "Yes, decline"}</button></form>
     <p style="font-size:12px;color:#7a7168">The student is emailed straight away.</p>`,
  );
}

export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = readToken(String(form.get("token") ?? ""));
  if (!parsed) return page("Link not valid", "<p>This link is invalid or has been altered.</p>", 400);

  const booking = await getBooking(parsed.id);
  if (!booking) return page("Request not found", "<p>This request has expired or no longer exists.</p>", 404);
  if (booking.status !== "pending") {
    return page(`Already ${booking.status}`, `${summary(booking.name, booking.date)}<p>Nothing was changed.</p>`);
  }

  const updated = parsed.action === "confirm" ? await confirmBooking(booking) : await declineBooking(booking);
  try {
    await sendStudentDecision(updated);
  } catch (error) {
    console.error("decision email failed", error);
    return page(
      "Saved — but the email failed",
      `${summary(updated.name, updated.date)}<p>The booking is ${updated.status}, but we couldn't email the student. Please contact them: ${escapeHtml(updated.email)} / ${escapeHtml(updated.whatsapp)}.</p>`,
      502,
    );
  }

  return page(
    updated.status === "confirmed" ? "Session confirmed ✓" : "Request declined",
    `${summary(updated.name, updated.date)}<p>${escapeHtml(updated.name)} has been emailed.</p>`,
  );
}
