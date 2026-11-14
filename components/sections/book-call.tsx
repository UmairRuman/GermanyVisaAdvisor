"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarCheck, Check, Clock, Mail, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Grain } from "@/components/ui/grain";
import { SuccessBurst } from "@/components/ui/success-burst";
import { Button } from "@/components/ui/button";
import { fieldInputClass } from "@/components/ui/field";
import { CONTACT_EMAIL, buildMailLink } from "@/lib/contact";
import { EASE_SETTLE } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { DEFAULT_PKR_PER_EUR } from "@/lib/data/tools";
import {
  BOOKING_LEAD_DAYS,
  BOOKING_TIME_LABEL,
  BOOKING_TIME_ZONE_LABEL,
  CONSULTATION_FEE_EUR,
  describeDate,
} from "@/lib/booking";

type Day = { date: string; available: boolean };

const QUALIFICATIONS = ["Matric", "Intermediate", "Bachelor", "Master", "Other"];
const DEGREES = ["Bachelor", "Master", "PhD"];
const LANGUAGE_TESTS = ["Not taken yet", "IELTS", "TOEFL", "PTE", "Duolingo English Test", "German (Goethe / telc / TestDaF)"];
const INTAKES = ["Winter", "Summer"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  city: string;
  qualification: string;
  score: string;
  degree: string;
  fieldOfStudy: string;
  languageTest: string;
  languageScore: string;
  intakeSeason: string;
  intakeYear: string;
  topic: string;
  consent: boolean;
  company: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  city: "",
  qualification: "Bachelor",
  score: "",
  degree: "Master",
  fieldOfStudy: "",
  languageTest: "Not taken yet",
  languageScore: "",
  intakeSeason: "",
  intakeYear: "",
  topic: "",
  consent: false,
  company: "",
};

const inputClass = cn(fieldInputClass, "border-paper/15 bg-paper/10 text-paper placeholder:text-paper/35");

// TODO: client to supply a real advisor photo — this silhouette is a stand-in.
function AdvisorBadge() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14 shrink-0">
        <div className="flex h-full w-full items-end justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#d9cdb8] to-[#b9a98c] ring-2 ring-paper/20">
          <svg viewBox="0 0 48 56" className="h-full w-full text-charcoal/40" fill="currentColor" aria-hidden>
            <circle cx="24" cy="21" r="9" />
            <path d="M6 56c0-12 8-19 18-19s18 7 18 19z" />
          </svg>
        </div>
        <span className="absolute bottom-0 right-0 flex h-4 w-4" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1fae54]/60" />
          <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-charcoal bg-[#1fae54]" />
        </span>
      </div>
      <div>
        <p className="text-sm font-bold text-paper">Your advisor</p>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-[#5fd68a]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1fae54]" /> Available for bookings
        </p>
      </div>
    </div>
  );
}

export function BookCall() {
  const reduceMotion = useReducedMotion();
  const [days, setDays] = useState<Day[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  // Used for "Try again" and after a clash; the first load happens in the effect below.
  async function loadDays() {
    try {
      const response = await fetch("/api/booking/availability", { cache: "no-store" });
      if (!response.ok) throw new Error("bad response");
      const data = (await response.json()) as { days: Day[] };
      setDays(data.days);
      setLoadFailed(false);
    } catch {
      setLoadFailed(true);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/booking/availability", { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("bad response");
        return response.json() as Promise<{ days: Day[] }>;
      })
      .then((data) => setDays(data.days))
      .catch((failure: Error) => {
        if (failure.name !== "AbortError") setLoadFailed(true);
      });
    return () => controller.abort();
  }, []);

  const firstFree = days?.find((d) => d.available);
  const chosen = days?.find((d) => d.date === date && d.available);
  const emailOk = /^S+@S+.S+$/.test(form.email.trim());
  const ready =
    Boolean(chosen) &&
    form.name.trim().length >= 2 &&
    emailOk &&
    form.phone.trim().length >= 7 &&
    form.city.trim().length >= 2 &&
    form.score.trim().length >= 1 &&
    form.fieldOfStudy.trim().length >= 2 &&
    form.consent;
  const pkr = (CONSULTATION_FEE_EUR * DEFAULT_PKR_PER_EUR).toLocaleString("en-US");

  const update =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((previous) => ({ ...previous, [key]: event.target.value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready || !chosen || status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, intake: [form.intakeSeason, form.intakeYear.trim()].filter(Boolean).join(" "), date: chosen.date }),
      });
      if (response.ok) {
        setStatus("done");
        return;
      }
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Something went wrong. Please try again.");
      if (response.status === 409) {
        setDate(null);
        void loadDays(); // someone else took the day — show the fresh list
      }
    } catch {
      setError(`We couldn't reach the server. Please check your connection or email us at ${CONTACT_EMAIL}.`);
    }
    setStatus("idle");
  }

  return (
    <section className="bg-paper pb-8 pt-2">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-charcoal p-6 text-paper shadow-[0_40px_100px_-40px_rgba(23,19,16,0.7)] sm:p-12">
            <Grain opacity={0.06} blend="soft-light" />
            <div aria-hidden className="aurora-a pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold/20 blur-[100px]" />
            <div aria-hidden className="aurora-b pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-brick/25 blur-[100px]" />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="min-w-0">
                <AdvisorBadge />
                <p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gold">
                  <CalendarCheck size={14} /> Paid Counselling
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  Book a one-on-one session with our advisor.
                </h2>
                <p className="mt-4 text-paper/60">
                  Pick a day and send your details. We hold your slot for 15 minutes and email you the bank details. Pay within 15 minutes and our advisor confirms your session.
                </p>
                <div className="mt-6 inline-flex items-baseline gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3">
                  <span className="font-display text-3xl font-semibold text-gold">€{CONSULTATION_FEE_EUR}</span>
                  <span className="text-xs font-semibold text-paper/70">session fee (about PKR {pkr})</span>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-paper/70">
                  {[
                    "Around 20 minutes, one-on-one",
                    "Honest, practical advice",
                    `Booked at least ${BOOKING_LEAD_DAYS} days ahead`,
                    "Slot held for 15 minutes while you pay",
                    "Bank details and steps sent to your email",
                    "Confirmation email once payment is checked",
                  ].map((line) => (
                    <li key={line} className="flex items-center gap-2">
                      <Check size={14} className="text-gold" strokeWidth={3} /> {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0 rounded-3xl border border-paper/10 bg-paper/[0.05] p-4 backdrop-blur-sm sm:p-8">
                {status === "done" ? (
                  <div className="text-ink [&_h3]:text-paper [&_p]:text-paper/70">
                    <SuccessBurst
                      className="min-h-[340px]"
                      title="Slot reserved for 15 minutes"
                      description={`We emailed the bank details and payment steps to ${form.email.trim()}. Pay within 15 minutes to keep your slot — after that it is released. Once we see your payment, our advisor confirms and you get a confirmation email. Check your spam folder if you don't see it.`}
                    />
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate>
                    <p className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-paper/50">
                      1 · Pick a day
                      <span className="text-[10px] font-semibold normal-case tracking-normal text-paper/35 sm:hidden">
                        Swipe →
                      </span>
                    </p>
                    <div
                      className="no-scrollbar -mx-2 mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pb-3 pt-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0 sm:pb-0"
                      role="radiogroup"
                      aria-label="Day"
                    >
                      {days === null
                        ? Array.from({ length: 10 }, (_, i) => (
                            <div key={i} className="h-[74px] w-16 shrink-0 animate-pulse rounded-2xl bg-paper/10 sm:w-auto" />
                          ))
                        : days.map((day) => {
                            const info = describeDate(day.date);
                            const active = date === day.date;
                            return (
                              <button
                                key={day.date}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                disabled={!day.available}
                                onClick={() => setDate(day.date)}
                                className={cn(
                                  "relative w-16 shrink-0 snap-start rounded-2xl border px-2 py-3 text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-auto",
                                  active
                                    ? "-translate-y-1 border-gold bg-gold text-charcoal shadow-[0_14px_28px_-12px_rgba(185,138,46,0.7)]"
                                    : "border-paper/15 hover:border-paper/40",
                                  !day.available && "cursor-not-allowed opacity-35 hover:border-paper/15",
                                )}
                              >
                                <span className={cn("block text-[10px] font-bold uppercase tracking-wider", active ? "text-charcoal/70" : "text-paper/50")}>
                                  {info.weekday}
                                </span>
                                <span className="block font-display text-2xl font-semibold leading-tight">{info.day}</span>
                                <span className={cn("block text-[10px] font-semibold", active ? "text-charcoal/70" : "text-paper/50")}>
                                  {day.available ? info.month : "Taken"}
                                </span>
                              </button>
                            );
                          })}
                    </div>
                    {loadFailed && (
                      <p className="mt-2 text-xs font-semibold text-[#ff8a7e]">
                        Couldn&rsquo;t load available days.{" "}
                        <button type="button" onClick={() => void loadDays()} className="underline">
                          Try again
                        </button>
                      </p>
                    )}
                    {firstFree && !date && (
                      <p className="mt-2 text-xs text-paper/50">
                        Earliest available: {describeDate(firstFree.date).full}
                      </p>
                    )}

                    <p className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-paper/50">
                      2 · Time <Clock size={12} />
                    </p>
                    <p className="mt-3 inline-flex rounded-full border border-gold bg-gold/10 px-4 py-2 text-sm font-bold text-paper">
                      {BOOKING_TIME_LABEL} · {BOOKING_TIME_ZONE_LABEL}
                    </p>

                    <p className="mt-6 text-xs font-bold uppercase tracking-wide text-paper/50">3 · Your details</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <input value={form.name} onChange={update("name")} placeholder="Full name" autoComplete="name" className={inputClass} aria-label="Full name" />
                      <input value={form.email} onChange={update("email")} placeholder="Email address" type="email" inputMode="email" autoComplete="email" className={inputClass} aria-label="Email address" />
                      <input value={form.phone} onChange={update("phone")} placeholder="Phone number (+92 3xx xxxxxxx)" type="tel" inputMode="tel" autoComplete="tel" className={inputClass} aria-label="Phone number" />
                      <input value={form.city} onChange={update("city")} placeholder="City" autoComplete="address-level2" className={inputClass} aria-label="City" />
                      <select value={form.qualification} onChange={update("qualification")} className={cn(inputClass, "[&>option]:text-ink")} aria-label="Last qualification">{QUALIFICATIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select>
                      <input value={form.score} onChange={update("score")} placeholder="CGPA / percentage (e.g. 3.2 / 75%)"  className={inputClass} aria-label="CGPA or percentage" />
                      <select value={form.degree} onChange={update("degree")} className={cn(inputClass, "[&>option]:text-ink")} aria-label="Desired degree">{DEGREES.map((o) => <option key={o} value={o}>{o}</option>)}</select>
                      <input value={form.fieldOfStudy} onChange={update("fieldOfStudy")} placeholder="Field of study (e.g. Computer Science)"  className={inputClass} aria-label="Field of study" />
                      <select value={form.languageTest} onChange={update("languageTest")} className={cn(inputClass, "[&>option]:text-ink")} aria-label="Language test">{LANGUAGE_TESTS.map((o) => <option key={o} value={o}>{o}</option>)}</select>
                      <input value={form.languageScore} onChange={update("languageScore")} placeholder="Language score (optional)"  className={inputClass} aria-label="Language score (optional)" />
                      <select value={form.intakeSeason} onChange={update("intakeSeason")} className={cn(inputClass, "[&>option]:text-ink")} aria-label="Intake"><option value="">Intake (optional)</option>{INTAKES.map((o) => <option key={o} value={o}>{o}</option>)}</select>
                      <input value={form.intakeYear} onChange={update("intakeYear")} placeholder="Intake year, e.g. 2027" inputMode="numeric" maxLength={4} className={inputClass} aria-label="Intake year, e.g. 2027" />
                      <textarea value={form.topic} onChange={update("topic")} placeholder="What would you like help with? (optional)" rows={3} maxLength={500} className={cn(inputClass, "sm:col-span-2")} aria-label="Message" />
                      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-paper/65 sm:col-span-2">
                        <input type="checkbox" checked={form.consent} onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))} className="mt-0.5 h-4 w-4 shrink-0 accent-[#b98a2e]" />
                        <span>
                          I agree to the privacy policy and the cancellation and refund policy.
                        </span>
                      </label>
                      {/* Honeypot — hidden from people, tempting to bots */}
                      <input value={form.company} onChange={update("company")} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                    </div>

                    <AnimatePresence initial={false}>
                      {ready && chosen && (
                        <motion.p
                          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: EASE_SETTLE }}
                          className="mt-4 overflow-hidden text-sm text-paper/70"
                        >
                          You&rsquo;re reserving <strong className="text-paper">{describeDate(chosen.date).full}</strong> at{" "}
                          <strong className="text-paper">{BOOKING_TIME_LABEL}</strong> for{" "}
                          <strong className="text-paper">€{CONSULTATION_FEE_EUR}</strong>.
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {error && (
                      <p role="alert" className="mt-4 rounded-2xl border border-[#ff8a7e]/30 bg-[#ff8a7e]/10 px-4 py-3 text-sm font-semibold text-[#ffb4ab]">
                        {error}{" "}
                        <a href={buildMailLink("Hi, I would like to book a counselling session.", "Appointment request")} className="underline">
                          Email us instead
                        </a>
                      </p>
                    )}

                    <Button type="submit" disabled={!ready || status === "sending"} className="mt-6 w-full">
                      <Mail size={16} /> {status === "sending" ? "Sending…" : `Reserve slot for 15 min · €${CONSULTATION_FEE_EUR}`}{" "}
                      {status !== "sending" && <ArrowRight size={16} />}
                    </Button>
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-paper/45">
                      <ShieldCheck size={12} /> Nothing is charged on this site. You pay by bank transfer after reserving; the slot is yours for 15 minutes.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
