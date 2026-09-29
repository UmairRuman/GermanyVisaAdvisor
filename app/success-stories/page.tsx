import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { StoryPlate } from "@/components/ui/story-plate";
import { VisaWall } from "@/components/sections/visa-wall";
import { STORIES } from "@/lib/data/stories";

export const metadata: Metadata = {
  title: "Student Success Stories | GermanyChalo",
  description: "Real student journeys, admission outcomes and redacted visa approvals.",
};

export default function SuccessStoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Success Stories"
        title={
          <>
            Dreams Become
            <br />
            <span className="text-brick">Success Stories.</span>
          </>
        }
        description="Student journeys, admission outcomes and redacted visa approvals in one place."
      />

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STORIES.slice(0, 3).map((story, index) => (
              <Reveal key={story.initials} delay={index * 0.08}>
                <article className="group overflow-hidden rounded-3xl border border-line bg-paper-raised transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgba(26,22,19,0.22)]">
                  <StoryPlate story={story} />
                  <div className="p-7">
                    <h3 className="font-display text-lg font-semibold text-ink">{story.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-ink-muted">{story.program}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">&ldquo;{story.quote}&rdquo;</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-raised py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Visa Wall" title="Redacted Proof, Real Outcomes." />

          <Reveal delay={0.1}>
            <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm text-ink">
              <ShieldAlert size={18} className="mt-0.5 shrink-0 text-gold" />
              <p>
                <strong>Privacy first:</strong> passport number, visa number, date of birth,
                address and MRZ lines are blurred before anything is published — and only with
                the student&rsquo;s consent.
              </p>
            </div>
          </Reveal>

          <VisaWall stories={STORIES} />
        </div>
      </section>
    </>
  );
}
