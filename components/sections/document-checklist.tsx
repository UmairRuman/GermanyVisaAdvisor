"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, ClipboardCheck, MessageCircle, RotateCcw } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { EASE_SETTLE } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { CHECKLIST, CHECKLIST_TOTAL } from "@/lib/data/checklist";

// Progress is kept in this browser's localStorage so students can come back later.
// A tiny external store keeps server render and first client render identical (empty),
// then hydrates the saved ticks without a mismatch.
const STORAGE_KEY = "gc-visa-checklist";
const CHANGE_EVENT = "gc-checklist-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function save(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, ids.join(","));
  } catch {
    // Storage blocked (private mode) — ticks just won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Red at the start, drifting toward yellow as items are ticked, solid green only when complete.
function ringColor(percent: number) {
  if (percent >= 100) return "hsl(142, 70%, 42%)";
  return `hsl(${Math.round(4 + (percent / 100) * 46)}, 82%, 52%)`;
}

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DocumentChecklist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "");
  const reduceMotion = useReducedMotion();
  const done = new Set(raw ? raw.split(",") : []);
  const count = CHECKLIST.reduce((sum, g) => sum + g.items.filter((i) => done.has(i.id)).length, 0);
  const percent = Math.round((count / CHECKLIST_TOTAL) * 100);

  function toggle(id: string) {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    save([...next]);
  }

  const pending = CHECKLIST.flatMap((g) => g.items.filter((i) => !done.has(i.id)).map((i) => i.label));
  const message = [
    "Hi GermanyChalo! Here's my visa checklist progress.",
    `Done: ${count} of ${CHECKLIST_TOTAL}`,
    pending.length ? `\nStill to do:\n${pending.map((p) => `- ${p}`).join("\n")}` : "\nEverything is ticked off!",
    "",
    "Can you review what I have?",
  ].join("\n");

  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-paper-raised shadow-[0_40px_100px_-40px_rgba(26,22,19,0.35)]">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
        {/* Progress panel */}
        <div className="relative flex flex-col justify-between gap-8 bg-charcoal p-8 text-paper sm:p-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-paper/10 text-gold ring-1 ring-inset ring-paper/15">
                <ClipboardCheck size={20} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gold">Free Tool</p>
                <h3 className="font-display text-2xl font-semibold">Visa Document Checklist</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-paper/60">
              Tick things off as you go. Your progress is saved on this device.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative h-32 w-32 shrink-0">
              <svg viewBox="0 0 110 110" className="-rotate-90" aria-hidden>
                <circle cx="55" cy="55" r={RADIUS} fill="none" stroke="rgba(250,247,241,0.1)" strokeWidth="9" />
                <motion.circle
                  cx="55"
                  cy="55"
                  r={RADIUS}
                  fill="none"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  initial={false}
                  animate={{
                    strokeDashoffset: CIRCUMFERENCE * (1 - count / CHECKLIST_TOTAL),
                    stroke: ringColor(percent),
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.7, ease: EASE_SETTLE }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-semibold" aria-live="polite">
                  {percent}%
                </span>
              </div>
            </div>
            <div>
              <p className="font-display text-4xl font-semibold">
                {count}
                <span className="text-xl text-paper/40"> / {CHECKLIST_TOTAL}</span>
              </p>
              <p className="text-xs font-semibold text-paper/55">items ready</p>
              {count > 0 && (
                <button
                  type="button"
                  onClick={() => save([])}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-paper/60 transition-colors hover:text-paper"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs leading-relaxed text-paper/50">
              Requirements differ by embassy and program. We&rsquo;ll confirm your exact list.
            </p>
            <LinkButton href={buildWhatsAppLink(message)} variant="primary" className="w-full">
              <MessageCircle size={16} /> Send my progress to an advisor
            </LinkButton>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-8 p-8 sm:p-10">
          {CHECKLIST.map((group) => {
            const groupDone = group.items.filter((i) => done.has(i.id)).length;
            return (
              <div key={group.title}>
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-lg font-semibold text-ink">{group.title}</h4>
                  <span className="text-xs font-bold text-ink-muted">
                    {groupDone}/{group.items.length}
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => {
                    const checked = done.has(item.id);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={checked}
                          onClick={() => toggle(item.id)}
                          className={cn(
                            "flex w-full items-start gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                            checked ? "border-brick/25 bg-brick/[0.04]" : "border-line bg-paper hover:border-ink-muted",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
                              checked ? "border-brick bg-brick text-paper" : "border-line bg-paper-raised",
                            )}
                          >
                            <motion.span
                              initial={false}
                              animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 20 }}
                              className="flex"
                            >
                              <Check size={13} strokeWidth={3.5} />
                            </motion.span>
                          </span>
                          <span className="min-w-0">
                            <span
                              className={cn(
                                "block text-sm font-semibold transition-colors duration-300",
                                checked ? "text-ink-muted line-through decoration-ink-muted/40" : "text-ink",
                              )}
                            >
                              {item.label}
                            </span>
                            {item.hint && <span className="mt-0.5 block text-xs text-ink-muted/80">{item.hint}</span>}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
