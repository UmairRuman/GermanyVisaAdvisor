"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarDays, Languages, MapPin, Search, SearchX, X } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { DEGREE_OPTIONS, UNIVERSITIES, type DegreeOption } from "@/lib/data/universities";
import { EASE_SETTLE } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function UniversitiesExplorer() {
  const [query, setQuery] = useState("");
  const [degree, setDegree] = useState<DegreeOption>("All degrees");
  const reduceMotion = useReducedMotion();

  const cities = useMemo(() => Array.from(new Set(UNIVERSITIES.map((u) => u.city))).sort(), []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return UNIVERSITIES.filter((university) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${university.name} ${university.city}`.toLowerCase().includes(normalizedQuery);
      const matchesDegree = degree === "All degrees" || university.degrees.includes(degree);
      return matchesQuery && matchesDegree;
    });
  }, [query, degree]);

  const hasFilters = query.trim().length > 0 || degree !== "All degrees";

  return (
    <div>
      {/* Filter bar */}
      <div className="rounded-3xl border border-line bg-paper-raised p-5 shadow-[0_20px_50px_-30px_rgba(26,22,19,0.25)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">Search universities or cities</span>
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted/60" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-full border border-line bg-paper py-3.5 pl-11 pr-11 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-brick focus:shadow-[0_0_0_4px_rgba(179,36,28,0.10)]"
              placeholder="Search a university or city…"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-ink/10 text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </label>

          <div role="radiogroup" aria-label="Degree" className="flex rounded-full border border-line bg-paper p-1">
            {DEGREE_OPTIONS.map((option) => {
              const active = degree === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setDegree(option)}
                  className={cn(
                    "relative rounded-full px-4 py-2.5 text-xs font-bold transition-colors duration-300",
                    active ? "text-paper" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="degree-pill"
                      className="absolute inset-0 rounded-full bg-charcoal"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="mr-1 text-xs font-bold uppercase tracking-wide text-ink-muted">Cities</span>
          {cities.map((city) => {
            const active = query.trim().toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                type="button"
                onClick={() => setQuery(active ? "" : city)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  active
                    ? "-translate-y-0.5 border-brick bg-brick text-paper shadow-[0_8px_18px_-8px_rgba(179,36,28,0.6)]"
                    : "border-line bg-paper text-ink-muted hover:-translate-y-0.5 hover:border-ink-muted hover:text-ink",
                )}
              >
                <MapPin size={11} /> {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result count */}
      <div className="mt-6 flex items-center justify-between px-1" aria-live="polite">
        <p className="text-sm font-semibold text-ink-muted">
          Showing <span className="font-display text-lg font-semibold text-ink">{filtered.length}</span> of{" "}
          {UNIVERSITIES.length} universities
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDegree("All degrees");
            }}
            className="text-xs font-bold text-brick underline-offset-4 hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      <motion.div layout={!reduceMotion} className="mt-4 grid gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((university, index) => (
            <motion.div
              key={university.name}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25), ease: EASE_SETTLE }}
            >
              <SpotlightCard className="group flex flex-col gap-5 overflow-hidden rounded-2xl border border-line bg-paper-raised p-6 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(26,22,19,0.2)] sm:flex-row sm:items-center sm:justify-between">
                <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-brick to-gold transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />

                <div className="relative flex items-start gap-4 sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <span className="font-display text-lg font-semibold">{university.city.slice(0, 1)}</span>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold leading-snug text-ink">{university.name}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                      <MapPin size={13} className="text-ink-muted/70" /> {university.city}
                    </p>
                  </div>
                </div>

                <div className="relative flex flex-wrap items-center gap-x-6 gap-y-3 sm:justify-end">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-1 text-xs font-bold text-ink-muted">
                      {university.type}
                    </span>
                    {university.degrees.map((deg) => (
                      <span
                        key={deg}
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors duration-300",
                          degree === deg ? "bg-brick text-paper" : "bg-charcoal text-paper",
                        )}
                      >
                        {deg}
                      </span>
                    ))}
                  </div>
                  <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                    <Languages size={13} className="text-ink-muted/70" /> {university.languages}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                    <CalendarDays size={13} className="text-ink-muted/70" /> {university.intake}
                  </p>
                  <LinkButton href="/contact" variant="secondary" className="w-fit px-4 py-2 text-xs">
                    Explore <ArrowRight size={13} />
                  </LinkButton>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center rounded-2xl border border-dashed border-line p-12 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-raised text-ink-muted ring-1 ring-line">
              <SearchX size={24} />
            </span>
            <p className="mt-4 font-display text-xl font-semibold text-ink">No matches yet</p>
            <p className="mt-1 text-sm text-ink-muted">Try a different search or degree.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
