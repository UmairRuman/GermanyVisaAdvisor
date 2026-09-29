"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Calculator, MessageCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { LiveNumber } from "@/components/ui/live-number";
import { fieldInputClass } from "@/components/ui/field";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { EASE_SETTLE } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { SCALES, describeGermanGrade, toGermanGrade, type GradeScale } from "@/lib/data/tools";

const TONE_CLASS = {
  great: "bg-[#1fae54]/12 text-[#157a3b]",
  good: "bg-gold/15 text-[#7a5a17]",
  fair: "bg-brick/10 text-brick",
  pass: "bg-ink/10 text-ink",
} as const;

export function GradeConverter() {
  const [scale, setScale] = useState<GradeScale>("cgpa4");
  const [score, setScore] = useState("3.2");
  const [min, setMin] = useState(String(SCALES.cgpa4.defaultMin));
  const reduceMotion = useReducedMotion();

  const config = SCALES[scale];
  const scoreNumber = Number(score);
  const minNumber = Number(min);
  const hasInput = score.trim() !== "";
  const grade = hasInput ? toGermanGrade(scoreNumber, config.max, minNumber) : null;
  const band = grade ? describeGermanGrade(grade) : null;
  // 1.0 sits on the right (best), 4.0 on the left — a higher marker means a stronger grade.
  const markerPercent = grade ? ((4 - grade) / 3) * 100 : 0;

  function changeScale(next: GradeScale) {
    setScale(next);
    setMin(String(SCALES[next].defaultMin));
    setScore(next === "cgpa4" ? "3.2" : "75");
  }

  let error: string | null = null;
  if (hasInput && grade === null) {
    error =
      minNumber >= config.max
        ? "Minimum passing grade must be lower than the maximum."
        : `Enter a score between ${min || config.defaultMin} and ${config.max}.`;
  }

  const message = grade
    ? [
        "Hi GermanyChalo! I used the grade converter.",
        `My score: ${score} (${config.label})`,
        `German equivalent: about ${grade.toFixed(1)}`,
        "",
        "Can you tell me which programs I could aim for?",
      ].join("\n")
    : "Hi GermanyChalo! I'd like help understanding my grades for Germany.";

  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-line bg-paper-raised shadow-[0_40px_100px_-40px_rgba(26,22,19,0.35)] lg:grid-cols-[0.95fr_1.05fr]">
      {/* Inputs */}
      <div className="p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10">
            <Calculator size={20} />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brick">Free Tool</p>
            <h3 className="font-display text-2xl font-semibold text-ink">CGPA → German Grade</h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          German universities use a 1.0 (best) to 4.0 (lowest pass) scale. Convert your grade in seconds.
        </p>

        <div role="radiogroup" aria-label="Grading scale" className="mt-7 flex rounded-full border border-line bg-paper p-1">
          {(Object.keys(SCALES) as GradeScale[]).map((key) => {
            const active = scale === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => changeScale(key)}
                className={cn(
                  "relative flex-1 rounded-full px-4 py-2.5 text-xs font-bold transition-colors duration-300",
                  active ? "text-paper" : "text-ink-muted hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="scale-pill"
                    className="absolute inset-0 rounded-full bg-charcoal"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{key === "cgpa4" ? "CGPA / 4.0" : "Percentage"}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-ink">Your score</span>
            <input
              inputMode="decimal"
              value={score}
              onChange={(event) => setScore(event.target.value)}
              aria-invalid={Boolean(error)}
              className={fieldInputClass}
              placeholder={scale === "cgpa4" ? "e.g. 3.2" : "e.g. 75"}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-ink">Lowest passing grade</span>
            <input
              inputMode="decimal"
              value={min}
              onChange={(event) => setMin(event.target.value)}
              className={fieldInputClass}
            />
          </label>
        </div>
        {error && <p className="mt-2 text-xs font-semibold text-brick">{error}</p>}
        <p className="mt-3 text-xs text-ink-muted">
          Most Pakistani degrees pass at {SCALES.cgpa4.defaultMin}.0 CGPA or {SCALES.percentage.defaultMin}% —
          change it if your university differs.
        </p>
      </div>

      {/* Result */}
      <div className="flex flex-col justify-between gap-8 bg-paper p-8 sm:p-10">
        <div aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Your German grade</p>
          <div className="mt-2 flex items-end gap-4">
            <p className="font-display text-7xl font-semibold leading-none tracking-tight text-ink sm:text-8xl">
              {grade ? <LiveNumber value={grade} format={(n) => n.toFixed(1)} /> : "–.–"}
            </p>
            {band && (
              <span className={cn("mb-2 rounded-full px-3.5 py-1.5 text-xs font-bold", TONE_CLASS[band.tone])}>
                {band.label}
              </span>
            )}
          </div>
          <p className="mt-3 min-h-[3rem] max-w-md text-sm leading-relaxed text-ink-muted">
            {band ? band.note : "Enter your score to see where you land."}
          </p>

          {/* Gauge: 4.0 (left) → 1.0 (right) */}
          <div className="mt-6">
            <div className="relative h-3 rounded-full bg-gradient-to-r from-line via-gold/60 to-[#1fae54]">
              <motion.span
                aria-hidden
                className="absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-charcoal bg-paper-raised shadow-[0_8px_18px_-4px_rgba(23,19,16,0.5)]"
                initial={false}
                animate={{ left: `${markerPercent}%`, opacity: grade ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE_SETTLE }}
              />
            </div>
            <div className="mt-3 flex justify-between text-[11px] font-bold text-ink-muted/70">
              <span>4.0 · lowest pass</span>
              <span>1.0 · best</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-ink-muted">
            Uses the standard &ldquo;modified Bavarian formula&rdquo;. It&rsquo;s an estimate — each university
            or uni-assist makes the official conversion.
          </p>
          <LinkButton href={buildWhatsAppLink(message)} variant="primary" className="w-full">
            <MessageCircle size={16} /> Which programs fit my grade? <ArrowRight size={16} />
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
