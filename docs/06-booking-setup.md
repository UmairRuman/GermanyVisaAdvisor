# Booking setup (paid counselling sessions, bank transfer)

Sessions are 12:00 PM Pakistan time, bookable from 2 days ahead (rules in `lib/booking.ts`).
There is no online payment gateway: the student pays the €25 fee by bank transfer.

## Flow

1. Student fills the form on `/book-appointment` (or `/contact`) and picks a day.
2. The day is **held for 15 minutes**. Two emails go out:
   - **Student:** bank details, a payment reference (e.g. `GC-1A2B3C`), step-by-step instructions
     and a clear warning that the slot is released if payment is not made within 15 minutes.
   - **Advisor:** a notice with every form field and a button to the admin page.
3. The student pays and replies to the email with the receipt.
4. In **`/admin`** the advisor presses **Payment received — Confirm**. The slot is blocked
   permanently and the student gets the confirmation email.
5. If nobody confirms and the 15 minutes pass, the day is released automatically (shown as
   "Hold expired" in admin). If the student paid late, admin can still confirm as long as the
   day is free; otherwise the system refuses and the booking should be cancelled / moved.

## Admin page (`/admin`)

Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` (cookie lasts 12 hours, 10 login tries per hour per IP).
- **Bookings:** every request with its status, all details, **Confirm** and **Cancel** (cancel frees the day and emails the student).
- **Manage slots:** the next 30 days; **Block** a day the advisor is away, **Unblock** later.
The page is not linked from the site and is excluded from search (`noindex`, `robots.txt`).

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.germanychlo.com` |
| `BOOKING_SECRET` | a long random string; signs the admin login cookie |
| `ADMIN_EMAIL` | the login name for `/admin` |
| `ADMIN_PASSWORD` | the password for `/admin` |
| `SMTP_HOST` / `SMTP_PORT` | `smtp.hostinger.com` / `465` |
| `SMTP_USER` / `SMTP_PASS` | the mailbox, e.g. `info@germanychlo.com`, and its password |
| `ADVISOR_EMAIL` | where new-slot notices go (defaults to `SMTP_USER`) |
| `BANK_NAME`, `BANK_ACCOUNT_TITLE`, `BANK_ACCOUNT_NUMBER`, `BANK_IBAN`, `BANK_BRANCH`, `WALLET_NUMBER` | the payment details shown in the student email; set at least one (unset ones are left out) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | added automatically by the Upstash integration |

Slot state and the booking list need Redis: add **Upstash Redis** from the Vercel Marketplace
(free tier). In production the booking endpoint refuses requests while email, Redis or payment
details are not configured. Redeploy after changing variables.

## Local testing

`npm run dev` works without the above: emails are printed to the terminal and data lives in
memory. For the admin page set `BOOKING_SECRET` and `ADMIN_PASSWORD` to anything.
