import type { Metadata } from "next";
import { Building2, GraduationCap, MapPinned } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { UniversitiesExplorer } from "@/components/sections/universities-explorer";
import { Reveal } from "@/components/reveal";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { UNIVERSITIES } from "@/lib/data/universities";

export const metadata: Metadata = {
  title: "Universities in Germany | GermanyChalo",
  description: "Search universities in Germany by program, city, language and intake.",
};

const CITY_COUNT = new Set(UNIVERSITIES.map((u) => u.city)).size;
const DEGREE_LEVEL_COUNT = new Set(UNIVERSITIES.flatMap((u) => u.degrees)).size;

const STATS = [
  { icon: GraduationCap, value: UNIVERSITIES.length, label: "Universities in this list" },
  { icon: MapPinned, value: CITY_COUNT, label: "Cities across Germany" },
  { icon: Building2, value: DEGREE_LEVEL_COUNT, label: "Degree levels covered" },
];

export default function UniversitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Universities"
        title={
          <>
            Find Your Place
            <br />
            <span className="text-gold">in Germany.</span>
          </>
        }
        description="Search by program, city, language and intake."
        image={{
          // Placeholder photo (Unsplash) — swap for real partner-campus photography once confirmed.
          src: "https://images.unsplash.com/photo-1747502064507-ed08d79802db?q=80&w=1800&auto=format&fit=crop",
          alt: "A sunny university campus with pathways and buildings",
        }}
      />

      <section className="border-b border-line bg-paper-raised py-10">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-3">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Reveal key={stat.label} delay={index * 0.06} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-display text-3xl font-semibold text-ink">
                    <AnimatedNumber value={stat.value} />
                  </p>
                  <p className="text-xs font-semibold text-ink-muted">{stat.label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-paper pb-24 pt-14">
        <div className="mx-auto max-w-6xl px-6">
          <UniversitiesExplorer />
          <p className="mt-8 rounded-2xl border border-line bg-paper-raised p-5 text-sm text-ink-muted">
            This list is illustrative front-end content. Real partner university data can be
            connected once confirmed with the client.
          </p>
        </div>
      </section>
    </>
  );
}
