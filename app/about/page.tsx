import type { Metadata } from "next";
import {
  ArrowRight,
  Eye,
  FileCheck2,
  GraduationCap,
  Handshake,
  Languages,
  LayoutList,
  MapPin,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { Grain } from "@/components/ui/grain";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { SocialCards, SocialIconRow } from "@/components/social-links";
import { FinalCta } from "@/components/sections/final-cta";
import { STUDENTS_GUIDED } from "@/lib/site";
import { UNIVERSITIES } from "@/lib/data/universities";

const CITY_COUNT = new Set(UNIVERSITIES.map((u) => u.city)).size;

export const metadata: Metadata = {
  title: "About GermanyChalo",
  description:
    "GermanyChalo guides students from Pakistan to Germany with honest advice, clear fees and no false promises — from first shortlist to first week abroad.",
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

const PROMISES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Eye,
    title: "Honest about your chances",
    description: "We tell you plainly where your profile stands, even when it isn’t the answer you hoped for.",
  },
  {
    icon: Wallet,
    title: "Every cost explained upfront",
    description: "You know what you will pay, and why, before you commit to anything. No hidden charges.",
  },
  {
    icon: ShieldCheck,
    title: "No false promises",
    description: "We never guarantee an admission or a visa. No one honestly can — we guarantee our effort and our honesty.",
  },
  {
    icon: FileCheck2,
    title: "Document-by-document checking",
    description: "Each paper is reviewed so a small mistake doesn’t cost you months.",
  },
  {
    icon: MapPin,
    title: "Built for students from Pakistan",
    description: "Costs shown in rupees, familiar grading, and advice that fits where you are starting from.",
  },
  {
    icon: Languages,
    title: "Explained in your language",
    description: "Ask in Urdu or English. We explain things in simple words, for you and your family.",
  },
];

const STEPS = [
  { title: "Free assessment", description: "Share your profile and we show you honestly where you stand." },
  { title: "Shortlist", description: "Universities and programs that genuinely fit you, not just your budget." },
  { title: "Apply and visa", description: "Documents, applications, blocked account and visa file, handled step by step." },
  { title: "Arrive prepared", description: "Housing, travel and your first weeks in Germany planned before you fly." },
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
        description="GermanyChalo helps students from Pakistan understand what comes next on the way to Germany — honestly, step by step."
        image={{
          // Placeholder photo (Unsplash) — swap for real GermanyChalo/office photography when available.
          src: "https://images.unsplash.com/photo-1780495419763-8fed7fd78c22?q=80&w=1800&auto=format&fit=crop",
          alt: "The Brandenburg Gate in Berlin at dusk",
        }}
      />

      <section className="bg-paper pt-2 pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl bg-charcoal p-7 text-paper sm:p-9">
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
                Too many students lose time, money and hope to confusing advice and promises that can’t be
                kept. We exist to replace that with clear information, practical guidance and simple next
                steps.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Card className="h-full sm:p-9">
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

      <section className="bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Our Promises"
            title="Transparency Isn’t a Slogan. It’s How We Work."
            description="Students who have talked to many consultancies tell us the same thing: they want straight answers. This is what you can expect from us."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROMISES.map((promise, index) => {
              const Icon = promise.icon;
              return (
                <Reveal key={promise.title} delay={(index % 3) * 0.08}>
                  <Card hover className="group h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink">{promise.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{promise.description}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-raised py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="How We Work" title="Four Steps, No Surprises." />
          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08}>
                <li className="relative h-full overflow-hidden rounded-3xl border border-line bg-paper p-7">
                  <span
                    aria-hidden
                    className="text-outline pointer-events-none absolute -right-1 -top-3 select-none font-display text-[6rem] font-semibold leading-none text-ink/10"
                  >
                    0{index + 1}
                  </span>
                  <h3 className="relative mt-10 font-display text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-ink-muted">{step.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.2} className="mt-10 text-center">
            <LinkButton href="/services" variant="secondary">
              See all services <ArrowRight size={16} />
            </LinkButton>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-charcoal p-7 text-paper sm:p-12">
              <Grain opacity={0.06} blend="soft-light" />
              <div aria-hidden className="aurora-a pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold/20 blur-[100px]" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
                {/* TODO: client to confirm the advisor's name and supply a real photo and short bio. */}
                <div className="relative h-28 w-28 shrink-0">
                  <div className="flex h-full w-full items-end justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#d9cdb8] to-[#b9a98c] ring-4 ring-paper/15">
                    <svg viewBox="0 0 48 56" className="h-full w-full text-charcoal/40" fill="currentColor" aria-hidden>
                      <circle cx="24" cy="21" r="9" />
                      <path d="M6 56c0-12 8-19 18-19s18 7 18 19z" />
                    </svg>
                  </div>
                  <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-[3px] border-charcoal bg-[#1fae54]" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gold">Meet Your Advisor</p>
                  <h2 className="mt-2 font-display text-3xl font-semibold">Mr. Shahid Ali</h2>
                  <p className="mt-3 max-w-xl text-paper/65">
                    Guides students from Pakistan through university selection, applications and the visa
                    process, and shares free step-by-step guides on YouTube and WhatsApp so every student can
                    learn before they spend a rupee.
                  </p>
                  <SocialIconRow tone="dark" className="mt-5" />
                </div>
                <LinkButton href="/contact" variant="primary" className="w-full lg:w-auto">
                  Book a session <ArrowRight size={16} />
                </LinkButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-paper-raised py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Join Our Community"
            title="Learn With Us, Before You Decide."
            description="Free guides, updates and answers to the questions students ask most."
          />
          <Reveal delay={0.1}>
            <SocialCards className="mt-12" />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-16 text-paper">
        <Grain opacity={0.045} blend="soft-light" />
        <div className="relative mx-auto grid max-w-4xl gap-10 px-6 sm:grid-cols-3">
          {[
            { icon: Users, value: STUDENTS_GUIDED, suffix: "+", label: "Students guided" },
            // Counted from the real university list, so these stay true as the list grows.
            { icon: GraduationCap, value: UNIVERSITIES.length, suffix: "", label: "Universities covered" },
            { icon: LayoutList, value: CITY_COUNT, suffix: "", label: "Cities across Germany" },
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

      <FinalCta />
    </>
  );
}
