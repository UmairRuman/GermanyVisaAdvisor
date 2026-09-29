import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/reveal";
import { BlockedAccountCalculator } from "@/components/sections/blocked-account-calculator";
import { GradeConverter } from "@/components/sections/grade-converter";
import { BudgetPlanner } from "@/components/sections/budget-planner";
import { DocumentChecklist } from "@/components/sections/document-checklist";
import { FinalCta } from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Free Tools for Students | GermanyChalo",
  description:
    "Free tools for studying in Germany: blocked account calculator, CGPA-to-German-grade converter, monthly budget planner and a visa document checklist.",
};

const TOOLS = [
  { id: "blocked-account", label: "Blocked Account" },
  { id: "grade-converter", label: "Grade Converter" },
  { id: "budget", label: "Monthly Budget" },
  { id: "checklist", label: "Visa Checklist" },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Free Tools"
        title={
          <>
            Answers in Seconds,
            <br />
            <span className="text-brick">Not Weeks.</span>
          </>
        }
        description="Free calculators and checklists to help you understand where you stand — before you speak to anyone."
      />

      <section className="bg-paper pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <nav aria-label="Jump to a tool" className="-mt-4 mb-12 flex flex-wrap justify-center gap-2">
              {TOOLS.map((tool) => (
                <a
                  key={tool.id}
                  href={`#${tool.id}`}
                  className="rounded-full border border-line bg-paper-raised px-4 py-2 text-xs font-bold text-ink-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-brick hover:bg-brick hover:text-paper"
                >
                  {tool.label}
                </a>
              ))}
            </nav>
          </Reveal>

          <div className="space-y-10">
            <Reveal className="scroll-mt-28">
              <div id="blocked-account" className="scroll-mt-28">
                <BlockedAccountCalculator />
              </div>
            </Reveal>
            <Reveal>
              <div id="grade-converter" className="scroll-mt-28">
                <GradeConverter />
              </div>
            </Reveal>
            <Reveal>
              <div id="budget" className="scroll-mt-28">
                <BudgetPlanner />
              </div>
            </Reveal>
            <Reveal>
              <div id="checklist" className="scroll-mt-28">
                <DocumentChecklist />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
