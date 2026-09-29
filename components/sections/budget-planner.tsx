"use client";

import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Info, MessageCircle, PiggyBank } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { LiveNumber } from "@/components/ui/live-number";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { EASE_SETTLE } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { BLOCKED_ACCOUNT_MONTHLY_EUR, BUDGET_CATEGORIES, CITY_TIERS, type CityTier } from "@/lib/data/tools";

function defaultsFor(tier: CityTier) {
  return Object.fromEntries(BUDGET_CATEGORIES.map((c) => [c.id, c.defaults[tier]])) as Record<string, number>;
}

export function BudgetPlanner() {
  const [tier, setTier] = useState<CityTier>("mid");
  const [values, setValues] = useState(() => defaultsFor("mid"));
  const reduceMotion = useReducedMotion();

  const total = BUDGET_CATEGORIES.reduce((sum, c) => sum + values[c.id], 0);
  const diff = BLOCKED_ACCOUNT_MONTHLY_EUR - total;
  const withinBudget = diff >= 0;

  function changeTier(next: CityTier) {
    setTier(next);
    setValues(defaultsFor(next));
  }

  const message = [
    "Hi GermanyChalo! I used the monthly budget planner.",
    `City type: ${CITY_TIERS[tier].label}`,
    ...BUDGET_CATEGORIES.map((c) => `${c.label}: €${values[c.id]}`),
    `Total: about €${total}/month`,
    "",
    "Can you help me plan my costs for Germany?",
  ].join("\n");

  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-paper-raised shadow-[0_40px_100px_-40px_rgba(26,22,19,0.35)]">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        {/* Controls */}
        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10">
              <PiggyBank size={20} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brick">Free Tool</p>
              <h3 className="font-display text-2xl font-semibold text-ink">Monthly Budget Planner</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Pick the kind of city you&rsquo;ll live in, then adjust each cost to see your monthly total.
          </p>

          <div role="radiogroup" aria-label="City type" className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-line bg-paper p-1">
            {(Object.keys(CITY_TIERS) as CityTier[]).map((key) => {
              const active = tier === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => changeTier(key)}
                  className={cn(
                    "relative rounded-xl px-2 py-3 text-center transition-colors duration-300",
                    active ? "text-paper" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="tier-pill"
                      className="absolute inset-0 rounded-xl bg-charcoal"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative block text-xs font-bold">{CITY_TIERS[key].label}</span>
                  <span className={cn("relative hidden text-[10px] sm:block", active ? "text-paper/60" : "text-ink-muted/60")}>
                    {CITY_TIERS[key].hint}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-7 space-y-5">
            {BUDGET_CATEGORIES.map((category) => {
              const fill = ((values[category.id] - category.min) / (category.max - category.min)) * 100;
              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor={`budget-${category.id}`} className="flex items-center gap-2 font-semibold text-ink">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
                      {category.label}
                    </label>
                    <span className="font-display text-lg font-semibold text-ink">€{values[category.id]}</span>
                  </div>
                  <input
                    id={`budget-${category.id}`}
                    type="range"
                    min={category.min}
                    max={category.max}
                    step={5}
                    value={values[category.id]}
                    onChange={(event) => setValues((prev) => ({ ...prev, [category.id]: Number(event.target.value) }))}
                    className="range mt-2.5"
                    style={{ "--fill": `${fill}%` } as CSSProperties}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col justify-between gap-8 border-t border-line bg-paper p-8 sm:p-10 lg:border-l lg:border-t-0">
          <div aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Estimated per month</p>
            <p className="mt-2 font-display text-6xl font-semibold leading-none tracking-tight text-ink sm:text-7xl">
              €<LiveNumber value={total} />
            </p>

            {/* Stacked bar of where the money goes */}
            <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-line" aria-hidden>
              {BUDGET_CATEGORIES.map((category) => (
                <motion.div
                  key={category.id}
                  className="h-full"
                  style={{ background: category.color }}
                  animate={{ width: `${(values[category.id] / total) * 100}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE_SETTLE }}
                />
              ))}
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-ink-muted">
              {BUDGET_CATEGORIES.map((category) => (
                <li key={category.id} className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: category.color }} />
                  {category.label}
                  <span className="ml-auto font-bold text-ink">{Math.round((values[category.id] / total) * 100)}%</span>
                </li>
              ))}
            </ul>

            <div
              className={cn(
                "mt-6 rounded-2xl border p-4 text-sm",
                withinBudget ? "border-[#1fae54]/30 bg-[#1fae54]/8 text-[#157a3b]" : "border-brick/30 bg-brick/8 text-brick",
              )}
            >
              <p className="font-bold">
                {withinBudget
                  ? `€${diff} below the €${BLOCKED_ACCOUNT_MONTHLY_EUR} monthly visa allowance`
                  : `€${Math.abs(diff)} above the €${BLOCKED_ACCOUNT_MONTHLY_EUR} monthly visa allowance`}
              </p>
              <p className="mt-1 text-xs opacity-80">
                {withinBudget
                  ? "Your plan fits within what the blocked account releases each month."
                  : "You may need extra savings or a part-time income to cover the difference."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2.5 text-xs leading-relaxed text-ink-muted">
              <Info size={15} className="mt-0.5 shrink-0 text-gold" />
              <p>Rough estimates only. Real costs vary by city, housing type and lifestyle.</p>
            </div>
            <LinkButton href={buildWhatsAppLink(message)} variant="primary" className="w-full">
              <MessageCircle size={16} /> Plan my costs with an advisor <ArrowRight size={16} />
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
