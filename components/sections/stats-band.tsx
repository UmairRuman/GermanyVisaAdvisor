import { BadgeCheck, CalendarClock, GraduationCap, MessageSquareQuote, Users, type LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Grain } from "@/components/ui/grain";
import { Reveal } from "@/components/reveal";
import { STUDENTS_GUIDED, VISAS_APPROVED, YEARS_EXPERIENCE } from "@/lib/site";
import { UNIVERSITIES } from "@/lib/data/universities";
import { REVIEWS } from "@/lib/data/reviews";

// Real figures only. Items whose value is null are hidden until the owner supplies the number.
const STATS: { icon: LucideIcon; value: number | null; suffix: string; label: string }[] = [
  { icon: Users, value: STUDENTS_GUIDED, suffix: "+", label: "Students guided" },
  { icon: BadgeCheck, value: VISAS_APPROVED, suffix: "+", label: "Visas approved" },
  { icon: GraduationCap, value: UNIVERSITIES.length, suffix: "", label: "Universities covered" },
  { icon: CalendarClock, value: YEARS_EXPERIENCE, suffix: "+", label: "Years of experience" },
  { icon: MessageSquareQuote, value: REVIEWS.length, suffix: "", label: "Student reviews" },
];

export function StatsBand() {
  const stats = STATS.filter((s) => s.value !== null);
  return (
    <section className="relative overflow-hidden bg-charcoal py-12 text-paper">
      <Grain opacity={0.05} blend="soft-light" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 text-center sm:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Reveal key={stat.label} delay={index * 0.06}>
              <Icon size={20} className="mx-auto text-gold" />
              <p className="mt-3 font-display text-4xl font-semibold">
                <AnimatedNumber value={stat.value as number} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-paper/55">{stat.label}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
