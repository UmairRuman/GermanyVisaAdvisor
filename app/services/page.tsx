import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { LinkButton } from "@/components/ui/button";
import { Grain } from "@/components/ui/grain";
import { SERVICES } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Our Services | GermanyChalo",
  description:
    "University shortlisting, visa guidance and pre-departure support — one guided process from admission to arrival in Germany.",
};

// Placeholder photos (Unsplash) for each phase's featured tile — swap for real photography
// once the client supplies it.
const PHASES = [
  {
    label: "Phase 01",
    title: "Before You Apply",
    description: "Getting your shortlist and your paperwork right, before deadlines get tight.",
    image: {
      src: "https://images.unsplash.com/photo-1747502064507-ed08d79802db?q=80&w=1200&auto=format&fit=crop",
      alt: "A sunny university campus with pathways and buildings",
    },
    services: SERVICES.slice(0, 3),
  },
  {
    label: "Phase 02",
    title: "Visa & Finances",
    description: "The part students worry about most — made procedural, not stressful.",
    image: {
      src: "https://images.unsplash.com/photo-1473213183008-891c09fe6404?q=80&w=1200&auto=format&fit=crop",
      alt: "A passport resting on a desk",
    },
    services: SERVICES.slice(3, 6),
  },
  {
    label: "Phase 03",
    title: "Moving & Arrival",
    description: "Everything between packing your bags and your first weeks settled in.",
    image: {
      src: "https://images.unsplash.com/photo-1641232458416-feace752b346?q=80&w=1200&auto=format&fit=crop",
      alt: "A cozy furnished living room",
    },
    services: SERVICES.slice(6, 9),
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title={
          <>
            Guidance for Every
            <br />
            <span className="text-brick">Important Step.</span>
          </>
        }
        description="Clear support from program selection to your move to Germany — one guided process, not a menu."
      />

      <section className="bg-paper pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="space-y-8">
            {PHASES.map((phase, phaseIndex) => {
              const [featured, ...rest] = phase.services;
              const FeaturedIcon = featured.icon;
              return (
                <Reveal key={phase.title} delay={phaseIndex * 0.06}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-lg font-semibold text-brick">{phase.label}</span>
                      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{phase.title}</h2>
                    </div>
                    <p className="max-w-sm text-sm text-ink-muted">{phase.description}</p>
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <div className="relative isolate min-h-[320px] overflow-hidden rounded-3xl lg:h-full">
                      <Image
                        src={phase.image.src}
                        alt={phase.image.alt}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="-z-20 object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/75 to-charcoal/25" />
                      <Grain className="-z-10" opacity={0.05} blend="soft-light" />

                      <div className="relative flex h-full flex-col justify-end p-8">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-paper/10 text-gold ring-1 ring-inset ring-paper/20 backdrop-blur-sm">
                          <FeaturedIcon size={24} />
                        </div>
                        <h3 className="mt-6 font-display text-2xl font-semibold text-paper">{featured.title}</h3>
                        <p className="mt-3 max-w-md leading-relaxed text-paper/70">{featured.description}</p>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                      {rest.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Card key={service.title} hover className="h-full">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10">
                              <Icon size={20} />
                            </div>
                            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{service.title}</h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{service.description}</p>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-16 flex justify-center">
              <LinkButton href="/contact" variant="primary">
                Get Your Free Assessment <ArrowRight size={16} />
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
