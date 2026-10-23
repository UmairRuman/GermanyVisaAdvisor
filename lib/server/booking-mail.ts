import nodemailer from "nodemailer";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import {
  BOOKING_TIME_LABEL,
  BOOKING_TIME_ZONE_LABEL,
  CONSULTATION_FEE_EUR,
  PENDING_HOLD_HOURS,
  describeDate,
} from "@/lib/booking";
import { createToken } from "@/lib/server/booking-token";
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

async function send(message: { to: string; subject: string; html: string; replyTo?: string }) {
  if (!transporter) {
    // Local development only — in production the API refuses to take bookings without SMTP.
    const links = [...message.html.matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1]);
    console.log(`[booking-mail] (SMTP not configured) to=${message.to} subject="${message.subject}"`, links);
    return;
  }
  await transporter.sendMail({ from: from(), ...message });
}

function layout(title: string, body: string) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1a1613">
    <h2 style="margin:0 0 16px;font-size:20px">${title}</h2>${body}
    <p style="margin-top:28px;font-size:12px;color:#7a7168">${SITE_NAME} · ${SITE_URL}</p></div>`;
}

const detailRows = (b: Booking) => {
  const when = `${describeDate(b.date).full}, ${BOOKING_TIME_LABEL} ${BOOKING_TIME_ZONE_LABEL}`;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#7a7168;vertical-align:top">${label}</td><td style="padding:6px 0"><strong>${escapeHtml(value)}</strong></td></tr>`;
  return `<table style="border-collapse:collapse;font-size:14px">${row("When", when)}${row("Fee", `€${CONSULTATION_FEE_EUR}`)}${row("Name", b.name)}${row("Email", b.email)}${row("WhatsApp", b.whatsapp)}${b.topic ? row("Topic", b.topic) : ""}</table>`;
};

const button = (href: string, label: string, color: string) =>
  `<a href="${href}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 22px;border-radius:999px;background:${color};color:#fff;font-weight:bold;font-size:14px;text-decoration:none">${label}</a>`;

/** To the advisor: a new request with one-click confirm / decline links. */
export async function sendAdvisorRequest(b: Booking) {
  const link = (action: "confirm" | "decline") =>
    `${SITE_URL}/api/booking/respond?token=${createToken(b.id, action)}`;
  await send({
    to: advisorAddress(),
    replyTo: b.email,
    subject: `New counselling request — ${describeDate(b.date).full}`,
    html: layout(
      "New counselling request",
      `${detailRows(b)}
       <p style="margin:20px 0 12px;font-size:14px">The slot is held for ${PENDING_HOLD_HOURS} hours. Please answer:</p>
       ${button(link("confirm"), "Confirm this slot", "#1fae54")}${button(link("decline"), "Decline", "#b3241c")}
       <p style="font-size:12px;color:#7a7168">Replying to this email writes to the student.</p>`,
    ),
  });
}

/** To the student: we got it, waiting for the advisor. */
export async function sendStudentReceived(b: Booking) {
  await send({
    to: b.email,
    subject: "We received your counselling request",
    html: layout(
      `Thanks ${escapeHtml(b.name)} — request received`,
      `<p style="font-size:14px;line-height:1.6">Your request is waiting for our advisor to confirm. We hold the slot for you for ${PENDING_HOLD_HOURS} hours and will email you as soon as it is confirmed.</p>${detailRows(b)}
       <p style="font-size:13px;color:#7a7168">The session fee is €${CONSULTATION_FEE_EUR}. We will share payment details when your slot is confirmed.</p>`,
    ),
  });
}

/** To the student: the advisor's answer. */
export async function sendStudentDecision(b: Booking) {
  if (b.status === "confirmed") {
    await send({
      to: b.email,
      subject: "Your counselling session is confirmed",
      html: layout(
        "Your session is confirmed ✓",
        `${detailRows(b)}
         <p style="font-size:14px;line-height:1.6">We will contact you on WhatsApp (${escapeHtml(b.whatsapp)}) with the payment details for the €${CONSULTATION_FEE_EUR} session fee and the meeting link. Please keep that time free.</p>`,
      ),
    });
  } else {
    await send({
      to: b.email,
      subject: "About your counselling request",
      html: layout(
        "We couldn't confirm that time",
        `<p style="font-size:14px;line-height:1.6">Sorry — our advisor isn't available at the time you chose, and no payment is needed. Please pick another day on our website and we'll gladly try again.</p>${detailRows(b)}
         <p><a href="${SITE_URL}/contact" style="color:#b3241c;font-weight:bold">Choose another day</a></p>`,
      ),
    });
  }
}
