"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, GraduationCap, Plane } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Field, fieldInputClass } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Grain } from "@/components/ui/grain";
import { SuccessBurst } from "@/components/ui/success-burst";
import { EASE_SETTLE } from "@/lib/motion";
import { cn } from "@/lib/cn";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  whatsapp: z.string().min(7, "Enter a valid WhatsApp number"),
  qualification: z.string().min(2, "Required"),
  fieldOfStudy: z.string().min(2, "Required"),
  score: z.string().min(1, "Required"),
  degree: z.enum(["Bachelor", "Master", "PhD"]),
});

type FormValues = z.infer<typeof schema>;
type FieldName = keyof FormValues;

const DEGREES = ["Bachelor", "Master", "PhD"] as const;

const STEPS: { label: string; fields: FieldName[] }[] = [
  { label: "About you", fields: ["name", "whatsapp"] },
  { label: "Your studies", fields: ["qualification", "fieldOfStudy", "score"] },
  { label: "Your goal", fields: ["degree"] },
];

const TRUST_LINES = [
  "No obligation, no pressure",
  "Reply within 24 hours on WhatsApp",
  "Your information stays private",
];

function PassportRow({ label, value, placeholder }: { label: string; value?: string; placeholder: string }) {
  const filled = Boolean(value && value.trim());
  return (
    <div className="flex items-center justify-between gap-4 border-b border-paper/10 py-2.5 last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-paper/40">{label}</span>
      <span
        className={cn(
          "flex min-w-0 items-center gap-1.5 truncate text-sm font-semibold transition-colors duration-300",
          filled ? "text-paper" : "text-paper/25",
        )}
      >
        <span className="truncate">{filled ? value : placeholder}</span>
        {filled && <Check size={13} className="shrink-0 text-gold" strokeWidth={3} />}
      </span>
    </div>
  );
}

export function AssessmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { degree: "Master" },
  });

  const values = useWatch({ control });
  const isLast = step === STEPS.length - 1;
  const filledCount = (Object.keys(schema.shape) as FieldName[]).filter((key) => String(values[key] ?? "").trim()).length;
  const completeness = Math.round((filledCount / 6) * 100);

  async function goNext() {
    const valid = await trigger(STEPS[step].fields);
    if (!valid) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function onSubmit(data: FormValues) {
    // No CRM/backend chosen yet (see docs/04-tech-stack.md) — hand the profile straight to
    // WhatsApp, the primary channel this business already runs on.
    const message = [
      "Hi GermanyChalo! I'd like a free profile assessment.",
      "",
      `Name: ${data.name}`,
      `Qualification: ${data.qualification}`,
      `Field of Study: ${data.fieldOfStudy}`,
      `CGPA / Percentage: ${data.score}`,
      `Desired Degree: ${data.degree}`,
      `WhatsApp: ${data.whatsapp}`,
    ].join("\n");

    setSubmitted(true);
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <section className="relative overflow-hidden bg-paper py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-brick/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="grid overflow-hidden rounded-[2rem] border border-line shadow-[0_40px_100px_-30px_rgba(26,22,19,0.3)] lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left: pitch + a passport that fills in as the student types */}
            <div className="relative flex flex-col justify-between gap-10 overflow-hidden bg-charcoal p-8 text-paper sm:p-10">
              <Grain opacity={0.05} blend="soft-light" />
              <div aria-hidden className="aurora-a pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-[90px]" />

              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-wide text-gold">Free Profile Evaluation</p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  Not sure where you stand?
                </h2>
                <p className="mt-4 text-paper/60">
                  Tell us your profile. We&rsquo;ll tell you, honestly, what your realistic next step looks
                  like.
                </p>
              </div>

              <div className="relative rotate-[-1.5deg] rounded-2xl border border-paper/15 bg-gradient-to-br from-paper/[0.09] to-paper/[0.02] p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold">
                    <GraduationCap size={14} /> Student Profile
                  </div>
                  <span className="rounded-full bg-paper/10 px-2.5 py-1 text-[10px] font-bold text-paper/70">
                    {completeness}% ready
                  </span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brick to-gold"
                    animate={{ width: `${completeness}%` }}
                    transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE_SETTLE }}
                  />
                </div>
                <div className="mt-3">
                  <PassportRow label="Name" value={values.name} placeholder="Your full name" />
                  <PassportRow label="Studied" value={values.qualification} placeholder="Qualification" />
                  <PassportRow label="Field" value={values.fieldOfStudy} placeholder="Field of study" />
                  <PassportRow label="Score" value={values.score} placeholder="CGPA / percentage" />
                  <PassportRow label="Aiming for" value={`${values.degree} in Germany`} placeholder="Degree" />
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-paper/35">
                  <Plane size={12} className="rotate-45" /> PAK → DEU
                </div>
              </div>

              <ul className="relative space-y-2.5 text-sm text-paper/70">
                {TRUST_LINES.map((line) => (
                  <li key={line} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-gold" /> {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: 3-step wizard */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (isLast) void handleSubmit(onSubmit)(event);
                else void goNext();
              }}
              className="bg-paper-raised p-8 sm:p-10"
            >
              {submitted ? (
                <SuccessBurst className="h-full min-h-[420px]" />
              ) : (
                <>
                  {/* Progress */}
                  <ol className="flex items-center gap-2" aria-label="Form progress">
                    {STEPS.map((s, index) => {
                      const done = index < step;
                      const current = index === step;
                      return (
                        <li key={s.label} className="flex flex-1 items-center gap-2" aria-current={current ? "step" : undefined}>
                          <span
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-500",
                              done && "bg-brick text-paper",
                              current && "bg-charcoal text-paper ring-4 ring-charcoal/10",
                              !done && !current && "bg-paper text-ink-muted ring-1 ring-line",
                            )}
                          >
                            {done ? <Check size={13} strokeWidth={3} /> : index + 1}
                          </span>
                          <span
                            className={cn(
                              "hidden text-xs font-bold sm:block",
                              current ? "text-ink" : "text-ink-muted/70",
                            )}
                          >
                            {s.label}
                          </span>
                          {index < STEPS.length - 1 && (
                            <span className="relative ml-1 h-px flex-1 bg-line">
                              <motion.span
                                className="absolute inset-y-0 left-0 bg-brick"
                                animate={{ width: done ? "100%" : "0%" }}
                                transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE_SETTLE }}
                              />
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>

                  <div className="relative mt-8 min-h-[250px]">
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                      <motion.div
                        key={step}
                        custom={direction}
                        initial={reduceMotion ? false : { opacity: 0, x: direction * 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, x: direction * -40 }}
                        transition={{ duration: 0.35, ease: EASE_SETTLE }}
                        className="grid gap-4 sm:grid-cols-2"
                      >
                        {step === 0 && (
                          <>
                            <div className="sm:col-span-2">
                              <h3 className="font-display text-2xl font-semibold text-ink">First, who are you?</h3>
                              <p className="mt-1 text-sm text-ink-muted">So we know who we&rsquo;re talking to.</p>
                            </div>
                            <Field label="Name" error={errors.name?.message}>
                              <input className={fieldInputClass} placeholder="Your full name" autoComplete="name" {...register("name")} />
                            </Field>
                            <Field label="WhatsApp Number" error={errors.whatsapp?.message}>
                              <input className={fieldInputClass} placeholder="+92 3xx xxxxxxx" autoComplete="tel" {...register("whatsapp")} />
                            </Field>
                          </>
                        )}

                        {step === 1 && (
                          <>
                            <div className="sm:col-span-2">
                              <h3 className="font-display text-2xl font-semibold text-ink">Tell us what you&rsquo;ve studied.</h3>
                              <p className="mt-1 text-sm text-ink-muted">Rough answers are fine.</p>
                            </div>
                            <Field label="Qualification" error={errors.qualification?.message}>
                              <input className={fieldInputClass} placeholder="e.g. Bachelor's" {...register("qualification")} />
                            </Field>
                            <Field label="Field of Study" error={errors.fieldOfStudy?.message}>
                              <input className={fieldInputClass} placeholder="e.g. Computer Science" {...register("fieldOfStudy")} />
                            </Field>
                            <div className="sm:col-span-2">
                              <Field label="CGPA / Percentage" error={errors.score?.message}>
                                <input className={fieldInputClass} placeholder="e.g. 3.2 / 75%" {...register("score")} />
                              </Field>
                            </div>
                          </>
                        )}

                        {step === 2 && (
                          <div className="sm:col-span-2">
                            <h3 className="font-display text-2xl font-semibold text-ink">What are you aiming for?</h3>
                            <p className="mt-1 text-sm text-ink-muted">Pick the degree you want to pursue in Germany.</p>
                            <div role="radiogroup" aria-label="Desired degree" className="mt-6 grid grid-cols-3 gap-3">
                              {DEGREES.map((degree) => {
                                const active = values.degree === degree;
                                return (
                                  <button
                                    key={degree}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => setValue("degree", degree, { shouldValidate: true })}
                                    className={cn(
                                      "relative rounded-2xl border-2 px-3 py-5 text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                      active
                                        ? "-translate-y-1 border-brick bg-brick/[0.05] shadow-[0_16px_30px_-16px_rgba(179,36,28,0.5)]"
                                        : "border-line bg-paper hover:border-ink-muted",
                                    )}
                                  >
                                    {active && (
                                      <motion.span
                                        layoutId="degree-check"
                                        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brick text-paper"
                                      >
                                        <Check size={12} strokeWidth={3.5} />
                                      </motion.span>
                                    )}
                                    <span className={cn("block font-display text-xl font-semibold", active ? "text-brick" : "text-ink")}>
                                      {degree}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    {step > 0 && (
                      <Button type="button" variant="secondary" onClick={goBack} className="px-5">
                        <ArrowLeft size={16} /> Back
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isLast ? "Check My Profile" : "Continue"} <ArrowRight size={16} />
                    </Button>
                  </div>
                  <p className="mt-3 text-center text-xs text-ink-muted">
                    {isLast
                      ? "Submitting opens WhatsApp with your details pre-filled, so we can pick up the conversation immediately."
                      : `Step ${step + 1} of ${STEPS.length} — takes about a minute.`}
                  </p>
                </>
              )}
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
