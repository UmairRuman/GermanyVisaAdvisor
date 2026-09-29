import type { Metadata } from "next";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { StoryPlate } from "@/components/ui/story-plate";
import { Grain } from "@/components/ui/grain";
import { VisaStamp } from "@/components/ui/visa-stamp";

export const metadata: Metadata = {
  title: "Student Success Stories | GermanyChalo",
  description: "Real student journeys, admission outcomes and redacted visa approvals.",
};
import { STORIES } from "@/lib/data/stories";

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
                <article className="group overflow-hidden rounded-3xl border border-line bg-paper-raised transition-shadow duration-300 hover:shadow-[0_24px_48px_-24px_rgba(26,22,19,0.22)]">
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

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STORIES.map((story, index) => (
              <Reveal key={story.initials} delay={index * 0.06}>
                <div
                  className="group rounded-2xl border border-line bg-paper p-4 shadow-[0_1px_2px_rgba(26,22,19,0.04)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(26,22,19,0.25)]"
                  style={{ transform: `rotate(${index % 2 === 0 ? -0.6 : 0.6}deg)` }}
                >
                  <div className="relative flex h-40 flex-col justify-between overflow-hidden rounded-xl border border-line bg-paper-raised p-4">
                    <Grain opacity={0.05} />
                    <div className="relative flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted/60">
                        Student Visa
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold">
                        <BadgeCheck size={10} /> Verified
                      </span>
                    </div>
                    <div className="relative space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-ink/[0.08]" />
                      <div className="h-2 w-4/5 rounded-full bg-ink/[0.08]" />
                      <div className="h-2 w-full rounded-full bg-ink/[0.08]" />
                      <div className="h-2 w-2/3 rounded-full bg-ink/[0.08]" />
                    </div>
                    <div className="relative flex items-end justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">
                        Redacted
                      </span>
                      <VisaStamp delay={index * 0.12} />
                    </div>
                  </div>
                  <p className="mt-3 font-display text-sm font-semibold text-ink">
                    {story.initials} — {story.program.split(" · ")[0]}
                  </p>
                  <p className="text-xs text-ink-muted">{story.badge}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
