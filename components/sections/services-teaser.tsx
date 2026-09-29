"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, GraduationCap, MapPin, PlaneTakeoff, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Grain } from "@/components/ui/grain";
import { LinkButton } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { UNIVERSITIES } from "@/lib/data/universities";
import { EASE_SETTLE } from "@/lib/motion";

const CITIES = Array.from(new Set(UNIVERSITIES.map((u) => u.city)));
const VISA_ITEMS = ["Admission letter", "Blocked account", "Health insurance", "Visa appointment"];
const DEPARTURE_ITEMS = ["Accommodation", "Flights & luggage", "Bank & SIM", "City registration"];

const cardBase =
  "group relative overflow-hidden rounded-[1.75rem] border p-7 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5";

function IconTile({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110 ${
        dark ? "bg-paper/10 text-gold ring-paper/15" : "bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-brick/10"
      }`}
    >
      {children}
    </div>
  );
}

function ChecklistVisual({ items, tone = "brick" }: { items: string[]; tone?: "brick" | "gold" }) {
  const reduceMotion = useReducedMotion();
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((item, index) => (
        <motion.li
          key={item}
          className="flex items-center gap-3 text-sm font-semibold text-ink"
          initial={reduceMotion ? false : { opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.18, ease: EASE_SETTLE }}
        >
          <motion.span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              tone === "brick" ? "bg-brick text-paper" : "bg-gold text-charcoal"
            }`}
            initial={reduceMotion ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.55 + index * 0.18 }}
          >
            <Check size={12} strokeWidth={3.5} />
          </motion.span>
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

export function ServicesTeaser() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-paper py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-[26rem] w-[44rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[110px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="How We Help"
          title={
            <>
              A Guided Process, <br className="hidden sm:block" />
              Not a Menu of Options.
            </>
          }
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {/* 1 — University guidance (wide) */}
          <Reveal className="lg:col-span-2">
            <SpotlightCard className={`${cardBase} h-full border-line bg-paper-raised hover:border-brick/25 hover:shadow-[0_30px_60px_-30px_rgba(26,22,19,0.3)]`}>
              <span className="absolute right-6 top-6 rounded-full border border-line bg-paper px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Stage 01
              </span>
              <IconTile>
                <GraduationCap size={22} />
              </IconTile>
              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">University Guidance</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                Find programs that genuinely match your profile, not just your budget.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {CITIES.map((city, index) => (
                  <motion.span
                    key={city}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-sm font-bold text-ink shadow-[0_6px_16px_-10px_rgba(26,22,19,0.3)] transition-colors duration-300 hover:border-brick hover:bg-brick hover:text-paper"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.6, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.25 + index * 0.09 }}
                  >
                    <MapPin size={13} /> {city}
                  </motion.span>
                ))}
                <span className="inline-flex items-center rounded-full border border-dashed border-line px-4 py-2 text-sm font-semibold text-ink-muted">
                  + more across Germany
                </span>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* 2 — Visa guidance */}
          <Reveal delay={0.08}>
            <SpotlightCard className={`${cardBase} h-full border-line bg-paper-raised hover:border-brick/25 hover:shadow-[0_30px_60px_-30px_rgba(26,22,19,0.3)]`}>
              <span className="absolute right-6 top-6 rounded-full border border-line bg-paper px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Stage 02
              </span>
              <IconTile>
                <ShieldCheck size={22} />
              </IconTile>
              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">Visa Guidance</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Understand every required document and each next step.
              </p>
              <ChecklistVisual items={VISA_ITEMS} />
            </SpotlightCard>
          </Reveal>

          {/* 3 — Pre-departure */}
          <Reveal delay={0.12}>
            <SpotlightCard
              color="rgba(185,138,46,0.22)"
              className={`${cardBase} h-full border-charcoal-line bg-charcoal text-paper hover:shadow-[0_30px_60px_-30px_rgba(23,19,16,0.7)]`}
            >
              <Grain opacity={0.06} blend="soft-light" />
              <span className="absolute right-6 top-6 rounded-full border border-paper/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-paper/60">
                Stage 03
              </span>
              <div className="relative">
                <IconTile dark>
                  <PlaneTakeoff size={22} />
                </IconTile>
                <h3 className="mt-5 font-display text-2xl font-semibold">Pre-Departure Support</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/60">
                  Arrive prepared, with your first weeks in Germany already mapped out.
                </p>
                <ul className="mt-6 space-y-3">
                  {DEPARTURE_ITEMS.map((item, index) => (
                    <motion.li
                      key={item}
                      className="flex items-center gap-3 text-sm font-semibold text-paper/85"
                      initial={reduceMotion ? false : { opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.15, ease: EASE_SETTLE }}
                    >
                      <span className="h-2 w-2 rounded-full bg-gold" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* 4 — Explore all (wide CTA tile) */}
          <Reveal delay={0.16} className="lg:col-span-2">
            <SpotlightCard
              color="rgba(255,255,255,0.14)"
              className={`${cardBase} flex h-full flex-col justify-between gap-8 border-brick-dark bg-gradient-to-br from-brick to-brick-dark text-paper hover:shadow-[0_30px_60px_-30px_rgba(179,36,28,0.7)] sm:flex-row sm:items-center`}
            >
              <Grain opacity={0.08} blend="soft-light" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-wide text-paper/70">Everything in one place</p>
                <h3 className="mt-2 max-w-md font-display text-3xl font-semibold leading-tight">
                  Nine guided services, from first shortlist to first week in Germany.
                </h3>
              </div>
              <Magnetic className="relative inline-block shrink-0">
                <LinkButton href="/services" variant="secondary" className="border-paper bg-paper px-6 py-4 text-ink hover:bg-paper-raised">
                  Explore All Services <ArrowUpRight size={16} />
                </LinkButton>
              </Magnetic>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
