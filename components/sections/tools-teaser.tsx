import { ArrowUpRight, Calculator, Landmark } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { BLOCKED_ACCOUNT_MONTHLY_EUR, BLOCKED_ACCOUNT_MAX_MONTHS } from "@/lib/data/tools";

const TOOLS = [
  {
    icon: Landmark,
    title: "Blocked Account Calculator",
    description: "See exactly how much to deposit for your student visa — in euros and rupees.",
    stat: `€${(BLOCKED_ACCOUNT_MONTHLY_EUR * BLOCKED_ACCOUNT_MAX_MONTHS).toLocaleString("en-US")}`,
    statLabel: "typical 12-month amount",
  },
  {
    icon: Calculator,
    title: "CGPA → German Grade",
    description: "Convert your CGPA or percentage to the 1.0–4.0 German scale in seconds.",
    stat: "1.0 – 4.0",
    statLabel: "German grading scale",
  },
];

export function ToolsTeaser() {
  return (
    <section className="bg-paper-raised py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Free Tools"
          title="Get Answers Before You Even Call."
          description="Two quick calculators students ask us about most."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {TOOLS.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Reveal key={tool.title} delay={index * 0.08}>
                <Link href="/tools" className="block h-full">
                  <SpotlightCard className="group flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[1.75rem] border border-line bg-paper p-8 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-brick/25 hover:shadow-[0_30px_60px_-30px_rgba(26,22,19,0.3)]">
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                        <Icon size={22} />
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-all duration-300 group-hover:border-brick group-hover:bg-brick group-hover:text-paper">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                    <div>
                      <p className="font-display text-5xl font-semibold tracking-tight text-ink">{tool.stat}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-brick">{tool.statLabel}</p>
                      <h3 className="mt-5 font-display text-xl font-semibold text-ink">{tool.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{tool.description}</p>
                    </div>
                  </SpotlightCard>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
