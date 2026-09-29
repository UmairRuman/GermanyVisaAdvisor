import type { Metadata } from "next";
import Image from "next/image";
import {
  CalendarDays,
  ClipboardList,
  Home,
  Languages,
  MessageCircle,
  PlaneTakeoff,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { Accordion } from "@/components/ui/accordion";
import { Grain } from "@/components/ui/grain";
import { LinkButton } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { FAQS } from "@/lib/data/faqs";
import { JsonLd } from "@/components/json-ld";

const GUIDES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ClipboardList,
    title: "Student Visa Checklist",
    description: "A simple overview of common visa preparation items, from application to appointment.",
  },
  {
    icon: Wallet,
    title: "Blocked Account Guide",
    description: "Understand financial proof and preparation.",
  },
  {
    icon: CalendarDays,
    title: "Germany Intake Guide",
    description: "Understand winter and summer intake planning.",
  },
  {
    icon: Languages,
    title: "Language Requirements",
    description: "Learn how language requirements differ by program.",
  },
  {
    icon: Home,
    title: "Accommodation Guide",
    description: "Know where students commonly search for housing.",
  },
  {
    icon: PlaneTakeoff,
    title: "Before You Fly",
    description: "A pre-departure checklist for your first days in Germany.",
  },
];

const [FEATURED_GUIDE, ...OTHER_GUIDES] = GUIDES;

export const metadata: Metadata = {
  title: "Resources & FAQs | GermanyChalo",
  description:
    "Guides, checklists and answers to the questions students ask most about studying in Germany.",
};

export default function ResourcesPage() {
  const FeaturedIcon = FEATURED_GUIDE.icon;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <PageHero
        eyebrow="Resources"
        title={
          <>
            Germany, Made
            <br />
            <span className="text-brick">Easier to Understand.</span>
          </>
        }
        description="Short guides, checklists and common questions for students."
      />

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <div className="relative isolate min-h-[340px] overflow-hidden rounded-3xl">
                {/* Placeholder photo (Unsplash) — swap for real photography when available. */}
                <Image
                  src="https://images.unsplash.com/photo-1473213183008-891c09fe6404?q=80&w=1600&auto=format&fit=crop"
                  alt="A passport resting on a desk"
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="-z-20 object-cover"
                />
                <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/20" />
                <Grain className="-z-10" opacity={0.05} blend="soft-light" />

                <div className="relative flex h-full flex-col justify-end p-8 text-paper sm:p-10">
                  <span className="inline-flex w-fit items-center rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold">
                    Start Here
                  </span>
                  <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-paper/10 text-gold ring-1 ring-inset ring-paper/20 backdrop-blur-sm">
                    <FeaturedIcon size={24} />
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-semibold">{FEATURED_GUIDE.title}</h3>
                  <p className="mt-3 max-w-md text-paper/65">{FEATURED_GUIDE.description}</p>
                </div>
              </div>
            </Reveal>

            {OTHER_GUIDES.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <Reveal key={guide.title} delay={(index % 3) * 0.06 + 0.05}>
                  <Card hover className="h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-ink">{guide.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{guide.description}</p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-paper-raised py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
          <div className="mt-10">
            <Accordion items={FAQS} />
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-paper px-6 py-8 text-center">
              <p className="text-sm text-ink-muted">
                Still have a question that&rsquo;s specific to your profile?
              </p>
              <LinkButton href={buildWhatsAppLink()} variant="primary">
                <MessageCircle size={16} /> Ask Us on WhatsApp
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
