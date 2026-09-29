import type { Metadata } from "next";
import {
  Briefcase,
  Building2,
  CalendarDays,
  GraduationCap,
  Globe2,
  Home,
  Languages,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Study in Germany | GermanyChalo",
  description:
    "Degrees, universities, intakes, costs and student life — clear information on studying in Germany.",
};

const WHY: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: GraduationCap,
    title: "Quality Education",
    description: "Study at internationally recognized universities and institutions.",
  },
  {
    icon: Globe2,
    title: "International Programs",
    description: "Many programs are available in English, especially at Master's level.",
  },
  {
    icon: Briefcase,
    title: "Career Exposure",
    description: "Build international academic and professional experience.",
  },
];

const PATHS = [
  { title: "Bachelor's", description: "For students starting undergraduate study in Germany." },
  {
    title: "Master's",
    description: "For graduates looking for specialized study and research options.",
  },
  { title: "PhD", description: "For research-focused students seeking doctoral opportunities." },
];

const UNDERSTAND: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Building2,
    title: "Public vs Private Universities",
    description: "Know the differences in fees, admission models and program structure.",
  },
  {
    icon: CalendarDays,
    title: "Intakes & Deadlines",
    description: "Plan around winter or summer intake depending on the program.",
  },
  {
    icon: Languages,
    title: "Language Requirements",
    description: "Requirements can include English or German language proof.",
  },
  {
    icon: Wallet,
    title: "Costs & Budgeting",
    description: "Plan for semester contribution, living costs, insurance and travel.",
  },
  {
    icon: Home,
    title: "Student Life & Accommodation",
    description: "Prepare early for housing and your first weeks in Germany.",
  },
];

export default function StudyInGermanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Study in Germany"
        title={
          <>
            Germany Could Be
            <br />
            <span className="text-brick">Your Next Classroom.</span>
          </>
        }
        description="Simple information about degrees, universities, intakes, costs and student life."
      />

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Why Study in Germany?" title="Strong Universities, Real Opportunity." />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {WHY.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.08}>
                  <Card hover className="h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper-raised py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Choose Your Path" title="A Route for Every Background." />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {PATHS.map((path, index) => (
              <Reveal key={path.title} delay={index * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-paper p-8 transition-[background-color,border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:border-charcoal hover:bg-charcoal hover:shadow-[0_30px_60px_-24px_rgba(23,19,16,0.5)]">
                  <span
                    aria-hidden
                    className="text-outline pointer-events-none absolute -right-2 -top-4 select-none font-display text-[8rem] font-semibold leading-none text-ink/10 transition-colors duration-500 group-hover:text-gold/40"
                  >
                    0{index + 1}
                  </span>
                  <h3 className="relative mt-16 font-display text-3xl font-semibold text-ink transition-colors duration-500 group-hover:text-paper">
                    {path.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-ink-muted transition-colors duration-500 group-hover:text-paper/65">
                    {path.description}
                  </p>
                  <span className="relative mt-6 block h-0.5 w-10 bg-brick transition-[width,background-color] duration-500 group-hover:w-20 group-hover:bg-gold" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading eyebrow="Before You Apply" title="What You Should Understand." />
          <div className="mt-12 grid gap-4">
            {UNDERSTAND.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.05}>
                  <div className="flex items-start gap-4 rounded-2xl border border-line bg-paper-raised p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-display text-lg font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
