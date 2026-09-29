"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { LinkButton } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Marquee } from "@/components/ui/marquee";
import { SplitText } from "@/components/ui/split-text";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Grain } from "@/components/ui/grain";

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const backdropX = useTransform(scrollYProgress, [0, 1], ["8%", "-18%"]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-charcoal pt-20 sm:pt-28">
      <Grain opacity={0.05} blend="soft-light" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-a absolute left-1/4 top-0 h-[30rem] w-[30rem] rounded-full bg-brick/25 blur-[120px]" />
        <div className="aurora-b absolute -right-10 bottom-10 h-[26rem] w-[26rem] rounded-full bg-gold/20 blur-[120px]" />
      </div>

      {/* Giant outlined word drifting behind the copy as you scroll */}
      <motion.p
        aria-hidden
        style={{ x: reduceMotion ? 0 : backdropX }}
        className="text-outline pointer-events-none absolute left-0 top-1/2 -z-10 -translate-y-1/2 select-none whitespace-nowrap font-display text-[clamp(10rem,26vw,24rem)] font-semibold leading-none text-paper/[0.07]"
      >
        Willkommen
      </motion.p>

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <div className="mx-auto h-1.5 w-20 rounded-full bg-gradient-to-r from-brick to-gold" />
        </Reveal>
        <h2 className="mx-auto mt-7 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-tight text-paper">
          <SplitText text="Your Germany Journey Can Start Today." highlight={["Today"]} highlightClassName="text-gold" />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-md text-lg text-paper/60">
            One clear conversation can help you understand your next step.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic className="block w-full sm:inline-block sm:w-auto">
              <LinkButton href="/contact" variant="primary" className="w-full px-8 py-4 sm:w-auto">
                Get Free Assessment <ArrowRight size={16} />
              </LinkButton>
            </Magnetic>
            <Magnetic className="block w-full sm:inline-block sm:w-auto">
              <LinkButton href={buildWhatsAppLink()} variant="dark-outline" className="w-full px-8 py-4 sm:w-auto">
                <MessageCircle size={16} /> WhatsApp Us
              </LinkButton>
            </Magnetic>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-16 border-t sm:mt-24 border-charcoal-line py-6">
        <Marquee duration={38} reverse>
          {["Study in Germany", "Visa Guidance", "University Shortlisting", "Arrival Support", "Free Assessment"].map(
            (item) => (
              <span key={item} className="flex items-center font-display text-2xl font-medium text-paper/35">
                <span className="px-8">{item}</span>
                <span aria-hidden className="text-brick">
                  ✦
                </span>
              </span>
            ),
          )}
        </Marquee>
      </div>
    </section>
  );
}
