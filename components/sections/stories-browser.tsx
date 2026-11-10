"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { LinkButton } from "@/components/ui/button";
import { VisaWall } from "@/components/sections/visa-wall";
import { REVIEWS, reviewInitials } from "@/lib/data/reviews";
import { PROOF } from "@/lib/data/proof";
import { BOOKING_PATH } from "@/lib/contact";
import { cn } from "@/lib/cn";

// A filter chip only appears when at least one item carries that tag, so the owner can add
// `tags` to reviews/proof in the data files and the matching chips show up automatically.
const OPTIONAL_TAGS = ["Bachelor", "Master", "Admission Letter"];

export function StoriesBrowser() {
  const [filter, setFilter] = useState("All");

  const chips = useMemo(() => {
    const used = new Set<string>([...REVIEWS.flatMap((r) => r.tags ?? []), ...PROOF.flatMap((p) => p.tags ?? [])]);
    return ["All", "Reviews", "Visa Approved", ...OPTIONAL_TAGS.filter((t) => used.has(t))];
  }, []);

  const reviews = REVIEWS.filter((r) => filter === "All" || filter === "Reviews" || r.tags?.includes(filter));
  const proof = PROOF.filter((p) => filter === "All" || filter === "Visa Approved" || p.tags?.includes(filter));

  return (
    <section className="bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div role="tablist" aria-label="Filter stories" className="flex flex-wrap justify-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              role="tab"
              aria-selected={filter === chip}
              onClick={() => setFilter(chip)}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-bold transition-colors",
                filter === chip
                  ? "border-brick bg-brick text-paper"
                  : "border-line bg-paper-raised text-ink hover:border-ink",
              )}
            >
              {chip}
            </button>
          ))}
        </div>

        {reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-ink">Student Reviews</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, index) => (
                <Reveal key={review.name} delay={(index % 3) * 0.08}>
                  <article className="flex h-full flex-col rounded-3xl border border-line bg-paper-raised p-7 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgba(26,22,19,0.22)]">
                    <p className="flex-1 text-sm leading-relaxed text-ink-muted">&ldquo;{review.quote}&rdquo;</p>
                    <div className="mt-5 flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-sm font-semibold text-paper">
                        {reviewInitials(review.name)}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-base font-semibold text-ink">{review.name}</h3>
                        {(review.city || review.program || review.intake || review.university) && (
                          <p className="text-xs text-ink-muted">
                            {[review.city, review.program, review.university, review.intake].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {proof.length > 0 && (
          <div className="mt-16">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
              <BadgeCheck size={22} className="text-gold" /> Visa Wall
            </h2>
            <VisaWall key={filter} items={proof} />
          </div>
        )}

        <Reveal>
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="text-ink-muted">Want guidance like this for your own plan?</p>
            <LinkButton href={BOOKING_PATH} variant="primary">
              Book Appointment <ArrowRight size={16} />
            </LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
