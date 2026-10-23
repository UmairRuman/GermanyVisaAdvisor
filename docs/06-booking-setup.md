# Booking setup (paid counselling sessions)

The booking card on `/contact` takes a request, emails the advisor, and holds the day until the
advisor confirms or declines from the email. Slots are 12:00 PM Pakistan time, bookable from
2 days ahead (rules live in `lib/booking.ts`).

## Flow

1. Student picks a day and submits name, email, WhatsApp and an optional topic.
2. The day is **held for 24 hours** (so nobody else can take it) and two emails go out:
   - to the advisor, with **Confirm** and **Decline** buttons;
   - to the student, saying the request is waiting for confirmation.
3. The advisor clicks a button, then presses the confirmation button on the page that opens.
   The student is emailed the result. **Confirm** keeps the day blocked; **Decline** (or no
   answer within 24 hours) frees it.

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.germanychlo.com` (used in the email links) |
| `BOOKING_SECRET` | a long random string; signs the confirm/decline links |
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | the mailbox, e.g. `info@germanychlo.com` |
| `SMTP_PASS` | that mailbox's password |
| `ADVISOR_EMAIL` | where requests are delivered (defaults to `SMTP_USER`) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | added automatically by the Upstash integration |

Slot state needs Redis: add **Upstash Redis** from the Vercel Marketplace (free tier) and connect it
to the project. In production the booking endpoint refuses requests while email or Redis is not
configured, so nobody can book something that can't be delivered or held.

Redeploy after adding or changing variables.

## Local testing

`npm run dev` works without any of the above: emails are printed to the terminal (with the
confirm/decline links) and slots are kept in memory. Set `BOOKING_SECRET` to anything first.

## Not included

Online payment. The €25 fee is arranged after confirmation (the confirmation email says payment
details follow on WhatsApp). A payment gateway can be added later.
