"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarCheck, Check, Clock, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Grain } from "@/components/ui/grain";
import { SuccessBurst } from "@/components/ui/success-burst";
import { Button } from "@/components/ui/button";
import { fieldInputClass } from "@/components/ui/field";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { EASE_SETTLE } from "@/lib/motion";
import { cn } from "@/lib/cn";

// TODO: client to confirm real counselling hours (times below are Pakistan Standard Time).
const SLOTS = ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];
const DAY_COUNT = 7;

// The date strip must be computed in the visitor's browser (a static page would otherwise
// bake in the build date). useSyncExternalStore gives "" on the server and the real date on
// the client without a hydration mismatch.
const subscribeNever = () => () => {};
const todayKey = () => new Date().toDateString();

function buildDays(start: string) {
  const base = new Date(start);
  return Array.from({ length: DAY_COUNT }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i + 1);
    return {
      key: date.toDateString(),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      full: date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" }),
    };
  });
}

export function BookCall() {
  const today = useSyncExternalStore(subscribeNever, todayKey, () => "");
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reduceMotion = useReducedMotion();

  const days = today ? buildDays(today) : [];
  const chosenDay = days.find((d) => d.key === dayKey);
  const ready = Boolean(chosenDay && slot && name.trim().length >= 2);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready || !chosenDay) return;
    const message = [
      "Hi GermanyChalo! I'd like to book a free counselling call.",
      "",
      `Name: ${name.trim()}`,
      `Preferred day: ${chosenDay.full}`,
      `Preferred time: ${slot} (Pakistan time)`,
    ].join("\n");
    setSubmitted(true);
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <section className="bg-paper pb-8 pt-2">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-charcoal p-6 text-paper shadow-[0_40px_100px_-40px_rgba(23,19,16,0.7)] sm:p-12">
            <Grain opacity={0.06} blend="soft-light" />
            <div aria-hidden className="aurora-a pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold/20 blur-[100px]" />
            <div aria-hidden className="aurora-b pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-brick/25 blur-[100px]" />

            <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper/10 text-gold ring-1 ring-inset ring-paper/15">
                  <CalendarCheck size={22} />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-wide text-gold">Free Counselling</p>
                <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  Book a call at a time that suits you.
                </h2>
                <p className="mt-4 text-paper/60">
                  Pick a day and time. We&rsquo;ll confirm it with you on WhatsApp.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-paper/70">
                  {["No obligation", "Around 20 minutes", "Honest, practical advice"].map((line) => (
                    <li key={line} className="flex items-center gap-2">
                      <Check size={14} className="text-gold" strokeWidth={3} /> {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-paper/10 bg-paper/[0.05] p-4 backdrop-blur-sm sm:p-8">
                {submitted ? (
                  <div className="text-ink [&_h3]:text-paper [&_p]:text-paper/70">
                    <SuccessBurst className="min-h-[340px]" />
                  </div>
                ) : (
                  <form onSubmit={submit}>
                    <p className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-paper/50">
                      1 · Pick a day
                      <span className="text-[10px] font-semibold normal-case tracking-normal text-paper/35 sm:hidden">
                        Swipe →
                      </span>
                    </p>
                    <div
                      className="no-scrollbar -mx-2 mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pb-3 pt-1 sm:mx-0 sm:grid sm:grid-cols-7 sm:overflow-visible sm:px-0 sm:pb-0"
                      role="radiogroup"
                      aria-label="Day"
                    >
                      {days.length === 0
                        ? Array.from({ length: DAY_COUNT }, (_, i) => (
                            <div key={i} className="h-[74px] w-16 shrink-0 animate-pulse rounded-2xl bg-paper/10 sm:w-auto" />
                          ))
                        : days.map((day) => {
                            const active = dayKey === day.key;
                            return (
                              <button
                                key={day.key}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => setDayKey(day.key)}
                                className={cn(
                                  "relative w-16 shrink-0 snap-start rounded-2xl border px-2 py-3 text-center transition-all sm:w-auto duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                  active
                                    ? "-translate-y-1 border-gold bg-gold text-charcoal shadow-[0_14px_28px_-12px_rgba(185,138,46,0.7)]"
                                    : "border-paper/15 hover:border-paper/40",
                                )}
                              >
                                <span className={cn("block text-[10px] font-bold uppercase tracking-wider", active ? "text-charcoal/70" : "text-paper/50")}>
                                  {day.weekday}
                                </span>
                                <span className="block font-display text-2xl font-semibold leading-tight">{day.day}</span>
                                <span className={cn("block text-[10px] font-semibold", active ? "text-charcoal/70" : "text-paper/50")}>
                                  {day.month}
                                </span>
                              </button>
                            );
                          })}
                    </div>

                    <p className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-paper/50">
                      2 · Pick a time <Clock size={12} /> <span className="font-semibold normal-case tracking-normal">Pakistan time</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Time">
                      {SLOTS.map((time) => {
                        const active = slot === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setSlot(time)}
                            className={cn(
                              "rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300",
                              active
                                ? "border-gold bg-gold text-charcoal"
                                : "border-paper/15 text-paper/80 hover:border-paper/40",
                            )}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>

                    <p className="mt-6 text-xs font-bold uppercase tracking-wide text-paper/50">3 · Your name</p>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                      className={cn(fieldInputClass, "mt-3 border-paper/15 bg-paper/10 text-paper placeholder:text-paper/35")}
                    />

                    <AnimatePresence initial={false}>
                      {ready && chosenDay && (
                        <motion.p
                          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: EASE_SETTLE }}
                          className="mt-4 overflow-hidden text-sm text-paper/70"
                        >
                          You&rsquo;re asking for <strong className="text-paper">{chosenDay.full}</strong> at{" "}
                          <strong className="text-paper">{slot}</strong>.
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <Button type="submit" disabled={!ready} className="mt-6 w-full">
                      <MessageCircle size={16} /> Request this slot on WhatsApp <ArrowRight size={16} />
                    </Button>
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
