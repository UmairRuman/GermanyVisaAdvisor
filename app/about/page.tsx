import type { Metadata } from "next";
import { GraduationCap, Handshake, LayoutList, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { Grain } from "@/components/ui/grain";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { STUDENTS_GUIDED } from "@/lib/site";

export const metadata: Metadata = {
  title: "About GermanyChalo",
  description:
    "GermanyChalo helps students understand what comes next on their Germany journey — without unnecessary confusion.",
};

const APPROACH: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ShieldCheck,
    title: "Clear Guidance",
    description: "No confusing information — just the next honest step.",
  },
  {
    icon: Users,
    title: "Student Focused",
    description: "Your goals come first, not a one-size-fits-all script.",
  },
  {
    icon: Handshake,
    title: "Transparent Process",
    description: "You always know what happens next, and why.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About GermanyChalo"
        title={
          <>
            We Make the Journey
            <br />
            <span className="text-gold">Clearer.</span>
          </>
        }
        description="GermanyChalo helps students understand what comes next — without unnecessary confusion."
        image={{
          // Placeholder photo (Unsplash) — swap for real GermanyChalo/office photography when available.
          src: "https://images.unsplash.com/photo-1780495419763-8fed7fd78c22?q=80&w=1800&auto=format&fit=crop",
          alt: "The Brandenburg Gate in Berlin at dusk",
        }}
      />

      <section className="bg-paper pt-2 pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl bg-charcoal p-7 text-paper">
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-6 select-none font-display text-[11rem] font-semibold leading-none text-paper/[0.06]"
              >
                &rdquo;
              </span>
              <p className="relative text-xs font-bold uppercase tracking-wide text-gold">Our Mission</p>
              <h2 className="relative mt-3 font-display text-3xl font-semibold leading-tight">
                Make studying in Germany easier to understand and easier to start.
              </h2>
              <p className="relative mt-4 text-paper/60">
                Clear information. Practical guidance. Simple next steps.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Card className="h-full">
              <p className="text-xs font-bold uppercase tracking-wide text-brick">Our Approach</p>
              <div className="mt-5 space-y-5">
                {APPROACH.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{item.title}</p>
                        <p className="text-sm text-ink-muted">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-paper-raised py-20">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 select-none font-display text-[14rem] font-semibold leading-none text-ink/[0.04] sm:text-[18rem]"
          style={{ transform: "translateX(-50%)" }}
        >
          &ldquo;
        </span>
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-brick">Why We Exist</p>
          <p className="mt-5 font-display text-2xl leading-snug text-ink sm:text-3xl">
            We didn&rsquo;t set out to build another lead-generation funnel. We built the guide we
            wished existed when the process first felt overwhelming —{" "}
            <span className="text-brick">one honest conversation, one clear next step, at a time.</span>
          </p>
        </Reveal>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-16 text-paper">
        <Grain opacity={0.045} blend="soft-light" />
        <div className="relative mx-auto grid max-w-4xl gap-10 px-6 sm:grid-cols-3">
          {[
            { icon: Users, value: STUDENTS_GUIDED, suffix: "+", label: "Students guided" },
            { icon: LayoutList, value: 9, suffix: "", label: "Guided service areas" },
            { icon: GraduationCap, value: 1, suffix: "", label: "Clear, guided process" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Reveal key={stat.label} delay={index * 0.08} className="flex flex-col items-center text-center">
                <Icon size={20} className="text-gold" />
                <p className="mt-3 font-display text-4xl font-semibold">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-paper/55">{stat.label}</p>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
