"use client";

import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Landmark, Info, MessageCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Grain } from "@/components/ui/grain";
import { LiveNumber } from "@/components/ui/live-number";
import { fieldInputClass } from "@/components/ui/field";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { EASE_SETTLE } from "@/lib/motion";
import {
  BLOCKED_ACCOUNT_MAX_MONTHS,
  BLOCKED_ACCOUNT_MONTHLY_EUR,
  DEFAULT_PKR_PER_EUR,
  PROVIDER_FEE_EUR,
} from "@/lib/data/tools";

export function BlockedAccountCalculator() {
  const [months, setMonths] = useState(BLOCKED_ACCOUNT_MAX_MONTHS);
  const [rate, setRate] = useState(String(DEFAULT_PKR_PER_EUR));
  const reduceMotion = useReducedMotion();

  const totalEur = months * BLOCKED_ACCOUNT_MONTHLY_EUR;
  const parsedRate = Number(rate);
  const rateValid = Number.isFinite(parsedRate) && parsedRate > 0;
  const totalPkr = rateValid ? totalEur * parsedRate : 0;
  const fill = ((months - 1) / (BLOCKED_ACCOUNT_MAX_MONTHS - 1)) * 100;

  const message = [
    "Hi GermanyChalo! I used the blocked account calculator.",
    `Months: ${months}`,
    `Amount: €${totalEur.toLocaleString("en-US")}${rateValid ? ` (≈ PKR ${Math.round(totalPkr).toLocaleString("en-US")})` : ""}`,
    "",
    "Can you guide me through opening a blocked account?",
  ].join("\n");

  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-line bg-paper-raised shadow-[0_40px_100px_-40px_rgba(26,22,19,0.35)] lg:grid-cols-[1.05fr_0.95fr]">
      {/* Inputs */}
      <div className="p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10">
            <Landmark size={20} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brick">Free Tool</p>
            <h3 className="font-display text-2xl font-semibold text-ink">Blocked Account Calculator</h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          Germany asks student-visa applicants to prove they can support themselves. See exactly how much
          to deposit.
        </p>

        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <label htmlFor="months" className="text-xs font-bold text-ink">
              Months of funds to show
            </label>
            <span className="font-display text-2xl font-semibold text-ink">
              {months} <span className="text-sm text-ink-muted">{months === 1 ? "month" : "months"}</span>
            </span>
          </div>
          <input
            id="months"
            type="range"
            min={1}
            max={BLOCKED_ACCOUNT_MAX_MONTHS}
            value={months}
            onChange={(event) => setMonths(Number(event.target.value))}
            className="range mt-4"
            style={{ "--fill": `${fill}%` } as CSSProperties}
          />
          <div className="mt-2 flex justify-between text-[11px] font-semibold text-ink-muted/70">
            <span>1</span>
            <span>6</span>
            <span>12 (usual for visas)</span>
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="rate" className="mb-1.5 block text-xs font-bold text-ink">
            Exchange rate (PKR per €1)
          </label>
          <input
            id="rate"
            inputMode="decimal"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            aria-invalid={!rateValid}
            className={fieldInputClass}
          />
          {!rateValid && <p className="mt-1 text-xs font-semibold text-brick">Enter a valid rate.</p>}
          <p className="mt-1.5 text-xs text-ink-muted">Rates move daily — use today&rsquo;s rate for a sharper figure.</p>
        </div>
      </div>

      {/* Result */}
      <div className="relative flex flex-col justify-between gap-8 overflow-hidden bg-charcoal p-8 text-paper sm:p-10">
        <Grain opacity={0.06} blend="soft-light" />
        <div aria-hidden className="aurora-a pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/25 blur-[90px]" />

        <div className="relative" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-wide text-gold">You need to deposit</p>
          <p className="mt-2 font-display text-6xl font-semibold leading-none tracking-tight sm:text-7xl">
            €<LiveNumber value={totalEur} />
          </p>
          <p className="mt-3 text-lg font-semibold text-paper/70">
            ≈ PKR {rateValid ? <LiveNumber value={totalPkr} /> : "—"}
          </p>

          {/* One block per month — fills as the slider moves */}
          <div className="mt-6 grid grid-cols-12 gap-1.5" aria-hidden>
            {Array.from({ length: BLOCKED_ACCOUNT_MAX_MONTHS }, (_, index) => (
              <motion.span
                key={index}
                className="h-8 rounded-md"
                animate={{
                  backgroundColor: index < months ? "var(--color-gold)" : "rgba(250,247,241,0.1)",
                  scaleY: index < months ? 1 : 0.55,
                }}
                transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE_SETTLE, delay: reduceMotion ? 0 : index * 0.015 }}
                style={{ transformOrigin: "bottom" }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-paper/50">
            €{BLOCKED_ACCOUNT_MONTHLY_EUR.toLocaleString("en-US")} released to you each month in Germany.
          </p>
        </div>

        <div className="relative space-y-4">
          <div className="flex gap-2.5 rounded-2xl border border-paper/10 bg-paper/[0.05] p-4 text-xs leading-relaxed text-paper/65">
            <Info size={15} className="mt-0.5 shrink-0 text-gold" />
            <p>
              Providers usually charge a one-off fee of about €{PROVIDER_FEE_EUR.min}–€{PROVIDER_FEE_EUR.max}, plus
              any bank transfer charges from Pakistan. The required amount is set by German authorities and
              can change — we&rsquo;ll confirm the current figure with you.
            </p>
          </div>
          <LinkButton href={buildWhatsAppLink(message)} variant="primary" className="w-full">
            <MessageCircle size={16} /> Get help opening my account <ArrowRight size={16} />
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
