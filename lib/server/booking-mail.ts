import nodemailer from "nodemailer";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import {
  BOOKING_TIME_LABEL,
  BOOKING_TIME_ZONE_LABEL,
  CONSULTATION_FEE_EUR,
  PENDING_HOLD_MINUTES,
  describeDate,
  paymentReference,
} from "@/lib/booking";
import { DEFAULT_PKR_PER_EUR } from "@/lib/data/tools";
import type { Booking } from "@/lib/server/booking-store";

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export const mailIsConfigured = smtpConfigured;

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: Number(process.env.SMTP_PORT ?? 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

const from = () => `${SITE_NAME} <${process.env.SMTP_USER}>`;
const advisorAddress = () => process.env.ADVISOR_EMAIL ?? process.env.SMTP_USER ?? "";

// Where the student sends the €25. Set these in the environment (Vercel) — see docs/06.
const PAYMENT_LINES: [string, string | undefined][] = [
  ["Bank", process.env.BANK_NAME],
  ["Account title", process.env.BANK_ACCOUNT_TITLE],
  ["Account number", process.env.BANK_ACCOUNT_NUMBER],
  ["IBAN", process.env.BANK_IBAN],
  ["Branch", process.env.BANK_BRANCH],
  ["JazzCash / Easypaisa", process.env.WALLET_NUMBER],
];

/** True when at least one real payment detail is configured. */
export const paymentDetailsConfigured = PAYMENT_LINES.some(([, value]) => Boolean(value));

async function send(message: { to: string; subject: string; html: string; replyTo?: string }) {
  if (!transporter) {
    // Local development only — in production the API refuses to take bookings without SMTP.
    console.log(`[booking-mail] (SMTP not configured) to=${message.to} subject="${message.subject}"`);
    return;
  }
  await transporter.sendMail({ from: from(), ...message });
}

function layout(title: string, body: string) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:540px;margin:0 auto;color:#1a1613">
    <h2 style="margin:0 0 16px;font-size:20px">${title}</h2>${body}
    <p style="margin-top:28px;font-size:12px;color:#7a7168">${SITE_NAME} · ${SITE_URL}</p></div>`;
}

const row = (label: string, value: string) =>
  `<tr><td style="padding:6px 12px 6px 0;color:#7a7168;vertical-align:top">${label}</td><td style="padding:6px 0"><strong>${escapeHtml(value)}</strong></td></tr>`;

const whenText = (b: Booking) =>
  `${describeDate(b.date).full}, ${BOOKING_TIME_LABEL} ${BOOKING_TIME_ZONE_LABEL}`;

/** The moment the 15-minute hold ends, in Pakistan time, e.g. "3:42 PM". */
function deadlineText(b: Booking) {
  const end = new Date(new Date(b.createdAt).getTime() + PENDING_HOLD_MINUTES * 60 * 1000);
  return `${end.toLocaleTimeString("en-US", { timeZone: "Asia/Karachi", hour: "numeric", minute: "2-digit" })} ${BOOKING_TIME_ZONE_LABEL}`;
}

const pkrAmount = () => (CONSULTATION_FEE_EUR * DEFAULT_PKR_PER_EUR).toLocaleString("en-US");

const sessionRows = (b: Booking) =>
  `${row("When", whenText(b))}${row("Fee", `€${CONSULTATION_FEE_EUR} (about PKR ${pkrAmount()})`)}`;

const detailRows = (b: Booking) =>
  `<table style="border-collapse:collapse;font-size:14px">${sessionRows(b)}${row("Name", b.name)}${row("Email", b.email)}${row("Phone", b.phone)}${row("City", b.city)}${row("Last qualification", b.qualification)}${row("CGPA / percentage", b.score)}${row("Desired degree", b.degree)}${row("Field of study", b.fieldOfStudy)}${b.languageTest && b.languageTest !== "Not taken yet" ? row("Language test", `${b.languageTest}${b.languageScore ? ` — ${b.languageScore}` : ""}`) : ""}${b.intake ? row("Intake", b.intake) : ""}${b.topic ? row("Message", b.topic) : ""}${row("Payment reference", paymentReference(b.id))}</table>`;

const button = (href: string, label: string, color: string) =>
  `<a href="${href}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 22px;border-radius:999px;background:${color};color:#fff;font-weight:bold;font-size:14px;text-decoration:none">${label}</a>`;

/** To the advisor: someone reserved a slot, confirm it once the money arrives. */
export async function sendAdvisorRequest(b: Booking) {
  await send({
    to: advisorAddress(),
    replyTo: b.email,
    subject: `New slot reserved — ${describeDate(b.date).full}`,
    html: layout(
      "A student reserved a slot",
      `${detailRows(b)}
       <p style="margin:20px 0 12px;font-size:14px;line-height:1.6">The slot is held for ${PENDING_HOLD_MINUTES} minutes (until ${deadlineText(b)}) while the student pays the fee. Once the payment has reached your account, open the admin page and press <strong>Confirm</strong> — the student is then emailed the confirmation.</p>
       ${button(`${SITE_URL}/admin`, "Open admin page", "#1a1613")}
       <p style="font-size:12px;color:#7a7168">Replying to this email writes to the student.</p>`,
    ),
  });
}

/** To the student: how to pay, and that the slot is theirs only for 15 minutes. */
export async function sendStudentPaymentInstructions(b: Booking) {
  const configured = PAYMENT_LINES.filter(([, value]) => Boolean(value));
  const bank = configured.length
    ? `<table style="border-collapse:collapse;font-size:14px;background:#faf7f1;border-radius:12px;padding:8px">${configured
        .map(([label, value]) => row(label, value as string))
        .join("")}</table>`
    : `<p style="font-size:14px"><em>Payment details will be sent to you by email shortly.</em></p>`;
  const ref = paymentReference(b.id);
  await send({
    to: b.email,
    subject: `Pay within ${PENDING_HOLD_MINUTES} minutes to keep your slot — ${describeDate(b.date).full}`,
    html: layout(
      `Thanks ${escapeHtml(b.name)} — your slot is reserved`,
      `<table style="border-collapse:collapse;font-size:14px">${sessionRows(b)}</table>
       <p style="margin:18px 0;padding:14px 16px;border-radius:12px;background:#fdecea;color:#7f1d17;font-size:14px;line-height:1.6"><strong>Important:</strong> we are holding this slot for you only for ${PENDING_HOLD_MINUTES} minutes — until <strong>${deadlineText(b)}</strong>. If the payment is not made within ${PENDING_HOLD_MINUTES} minutes, the slot is released and someone else can book it.</p>
       <h3 style="margin:20px 0 8px;font-size:16px">How to pay — step by step</h3>
       <ol style="padding-left:20px;font-size:14px;line-height:1.7">
         <li>Send <strong>€${CONSULTATION_FEE_EUR}</strong> (about <strong>PKR ${pkrAmount()}</strong>) to the account below.</li>
         <li>Write this payment reference in the transfer note: <strong>${ref}</strong>.</li>
         <li>Take a screenshot or photo of the payment receipt.</li>
         <li>Reply to this email with the receipt attached.</li>
         <li>Once we see the payment, our advisor confirms your session and you receive a confirmation email with the meeting details.</li>
       </ol>
       ${bank}
       <p style="font-size:13px;color:#7a7168;line-height:1.6;margin-top:18px">Your slot is only confirmed after the payment has been checked. If you miss the ${PENDING_HOLD_MINUTES}-minute window but have already paid, reply to this email — we will check if the day is still free or offer you the next one.</p>`,
    ),
  });
}

/** To the student: payment checked, session confirmed. */
export async function sendStudentConfirmed(b: Booking) {
  await send({
    to: b.email,
    subject: "Your counselling session is confirmed",
    html: layout(
      "Your session is confirmed ✓",
      `<p style="font-size:14px;line-height:1.6">We received your payment — thank you. Your one-to-one session is booked:</p>
       ${detailRows(b)}
       <p style="font-size:14px;line-height:1.6">We will email you the meeting link before the session. Please keep that time free and have your documents (transcripts, language certificate) ready.</p>`,
    ),
  });
}

/** To the student: the booking was cancelled by the team. */
export async function sendStudentCancelled(b: Booking) {
  await send({
    to: b.email,
    subject: "About your counselling booking",
    html: layout(
      "Your booking could not be completed",
      `<p style="font-size:14px;line-height:1.6">Sorry — we could not complete your booking for ${escapeHtml(whenText(b))}. If you have already paid, reply to this email and we will refund you or move you to another day.</p>
       <p><a href="${SITE_URL}/book-appointment" style="color:#b3241c;font-weight:bold">Choose another day</a></p>`,
    ),
  });
}
