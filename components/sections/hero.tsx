"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight, BadgeCheck, FileCheck2, GraduationCap, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { EASE_SETTLE } from "@/lib/motion";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SERVICES } from "@/lib/data/services";
import { LinkButton } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Marquee } from "@/components/ui/marquee";
import { SplitText } from "@/components/ui/split-text";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Grain } from "@/components/ui/grain";

const ROUTE_PATH = "M64,196 C132,58 268,182 372,62";
const START = { x: 64, y: 196 };
const END = { x: 372, y: 62 };

// A paper plane that follows the route path on a loop. Position is written straight to the
// SVG transform attribute each frame (no React re-renders), and the heading is derived from
// the path's own tangent so the nose always points along the curve.
function FlyingPlane({ path }: { path: React.RefObject<SVGPathElement | null> }) {
  const plane = useRef<SVGGElement>(null);

  useEffect(() => {
    const route = path.current;
    const node = plane.current;
    if (!route || !node) return;
    const total = route.getTotalLength();

    const controls = animate(0, 1, {
      duration: 5.5,
      ease: [0.45, 0, 0.35, 1],
      repeat: Infinity,
      repeatDelay: 1.2,
      onUpdate: (t) => {
        const at = route.getPointAtLength(t * total);
        const ahead = route.getPointAtLength(Math.min(total, t * total + 2));
        const angle = (Math.atan2(ahead.y - at.y, ahead.x - at.x) * 180) / Math.PI + 90;
        node.setAttribute("transform", `translate(${at.x} ${at.y}) rotate(${angle})`);
        node.style.opacity = String(t < 0.04 ? t / 0.04 : t > 0.96 ? (1 - t) / 0.04 : 1);
      },
    });
    return () => controls.stop();
  }, [path]);

  return (
    <g ref={plane} style={{ opacity: 0 }}>
      <path d="M0,-13 L7,10 L0,5 L-7,10 Z" fill="var(--color-paper)" />
      <circle r={16} fill="var(--color-gold)" opacity={0.18} />
    </g>
  );
}

function RouteMap({ reduceMotion }: { reduceMotion: boolean | null }) {
  const pathRef = useRef<SVGPathElement>(null);

  return (
    <svg viewBox="0 0 440 250" className="h-auto w-full" role="img" aria-label="Route from Pakistan to Germany">
      <defs>
        <linearGradient id="route-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-gold)" />
          <stop offset="1" stopColor="#ff6a5c" />
        </linearGradient>
        <pattern id="map-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.1" fill="var(--color-paper)" opacity="0.14" />
        </pattern>
        <radialGradient id="map-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="map-mask">
          <rect width="440" height="250" fill="url(#map-fade)" />
        </mask>
      </defs>

      <rect width="440" height="250" fill="url(#map-dots)" mask="url(#map-mask)" />

      <motion.path
        ref={pathRef}
        d={ROUTE_PATH}
        fill="none"
        stroke="url(#route-grad)"
        strokeWidth={2.5}
        strokeDasharray="2 9"
        strokeLinecap="round"
        initial={{ pathLength: reduceMotion ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 1.8, ease: EASE_SETTLE, delay: 0.6 }}
      />

      {/* Origin */}
      <g>
        <circle cx={START.x} cy={START.y} r={9} fill="var(--color-gold)" className="ping-ring" opacity={0.6} />
        <circle cx={START.x} cy={START.y} r={6} fill="var(--color-paper)" />
        <circle cx={START.x} cy={START.y} r={2.5} fill="var(--color-charcoal)" />
        <text x={START.x - 4} y={START.y + 26} fill="var(--color-paper)" opacity={0.85} fontSize={11} fontWeight={700} letterSpacing={1.5}>
          PAKISTAN
        </text>
      </g>

      {/* Destination */}
      <g>
        <circle cx={END.x} cy={END.y} r={9} fill="var(--color-brick)" className="ping-ring" style={{ animationDelay: "1.2s" }} />
        <circle cx={END.x} cy={END.y} r={7} fill="#ff6a5c" />
        <circle cx={END.x} cy={END.y} r={2.5} fill="var(--color-paper)" />
        <text x={END.x - 30} y={END.y - 18} fill="var(--color-paper)" opacity={0.85} fontSize={11} fontWeight={700} letterSpacing={1.5}>
          GERMANY
        </text>
      </g>

      {!reduceMotion && <FlyingPlane path={pathRef} />}
    </svg>
  );
}

function FloatingChip({
  className,
  depth,
  mx,
  my,
  delay,
  children,
}: {
  className: string;
  depth: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  delay: number;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);

  return (
    <motion.div className={`absolute z-20 ${className}`} style={{ x, y }}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay, ease: EASE_SETTLE }}
      >
        <div className="float-y" style={{ ["--float-delay" as string]: `${delay}s` }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

const MARQUEE_ITEMS = SERVICES.map((service) => service.title);

export function Hero() {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mx = useSpring(mouseX, { stiffness: 80, damping: 18 });
  const my = useSpring(mouseY, { stiffness: 80, damping: 18 });

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  // The card itself tilts a few degrees toward the cursor.
  const rotateY = useTransform(mx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(my, [-0.5, 0.5], [5, -5]);

  return (
    <>
      <section
        className="relative isolate overflow-hidden pt-10 pb-16 sm:pt-20 sm:pb-28"
        onPointerMove={onPointerMove}
      >
        {/* Aurora: two soft, slowly drifting colour fields */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="aurora-a absolute -right-24 -top-24 h-[34rem] w-[34rem] rounded-full bg-gold/25 blur-[110px]" />
          <div className="aurora-b absolute -bottom-32 right-1/4 h-[28rem] w-[28rem] rounded-full bg-brick/15 blur-[110px]" />
          <div className="aurora-a absolute -left-32 top-1/3 h-[22rem] w-[22rem] rounded-full bg-gold/15 blur-[100px]" />
          <div className="dot-grid absolute inset-0 text-ink/[0.07] [mask-image:radial-gradient(ellipse_at_30%_20%,#000,transparent_65%)]" />
        </div>
        <Grain className="-z-10" opacity={0.03} />

        <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:gap-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_SETTLE }}
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-paper-raised/80 py-1.5 pl-2 pr-4 text-xs font-bold uppercase tracking-wide text-ink-muted shadow-[0_6px_20px_-10px_rgba(26,22,19,0.2)] backdrop-blur"
            >
              <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-brick/10">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-brick/60" />
                <span className="h-2 w-2 rounded-full bg-brick" />
              </span>
              Your Germany Journey Starts Here
            </motion.span>

            <h1 className="mt-7 font-display text-[clamp(2.9rem,6.2vw,5rem)] font-semibold leading-[0.98] tracking-tight text-ink">
              <SplitText
                onMount
                delay={0.15}
                text={"Study in Germany.\nWe Make the Path Clear."}
                highlight={["Germany"]}
              />
            </h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE_SETTLE }}
              className="mt-7 max-w-lg text-lg leading-relaxed text-ink-muted"
            >
              From choosing the right university to preparing your student visa — honest,
              step-by-step guidance for students moving from Pakistan to Germany.
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05, ease: EASE_SETTLE }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Magnetic className="block w-full sm:inline-block sm:w-auto">
                <LinkButton href="/contact" variant="primary" className="w-full px-7 py-4 sm:w-auto">
                  Get Your Free Assessment
                  <ArrowRight size={16} />
                </LinkButton>
              </Magnetic>
              <Magnetic className="block w-full sm:inline-block sm:w-auto">
                <LinkButton href={buildWhatsAppLink()} variant="secondary" className="w-full px-7 py-4 sm:w-auto">
                  <MessageCircle size={16} className="text-[#1fae54]" />
                  Chat on WhatsApp
                </LinkButton>
              </Magnetic>
            </motion.div>

            <motion.dl
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-ink-muted"
            >
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-brick" /> Admission Guidance
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-brick" /> Visa Preparation
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brick" /> Germany-Focused, Always
              </div>
            </motion.dl>
          </div>

          {/* Route card — tilts toward the cursor, with floating proof chips around it */}
          <div className="relative mx-auto my-10 w-full max-w-[34rem] [perspective:1200px] sm:my-0">
            <FloatingChip className="left-3 -top-9 sm:-left-8 sm:top-10" depth={38} mx={mx} my={my} delay={1.1}>
              <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-paper-raised px-4 py-3 shadow-[0_20px_40px_-16px_rgba(26,22,19,0.35)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1fae54]/12 text-[#1fae54]">
                  <BadgeCheck size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">Visa Approved</p>
                  <p className="text-[11px] text-ink-muted">Every document checked</p>
                </div>
              </div>
            </FloatingChip>

            <FloatingChip className="-bottom-9 right-3 sm:-right-8 sm:bottom-24" depth={-30} mx={mx} my={my} delay={1.3}>
              <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-paper-raised px-4 py-3 shadow-[0_20px_40px_-16px_rgba(26,22,19,0.35)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brick/10 text-brick">
                  <FileCheck2 size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">Admission Letter</p>
                  <p className="text-[11px] text-ink-muted">Shortlist → Apply</p>
                </div>
              </div>
            </FloatingChip>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: EASE_SETTLE }}
              style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative overflow-hidden rounded-[2rem] border border-charcoal-line bg-charcoal p-7 text-paper shadow-[0_50px_100px_-30px_rgba(23,19,16,0.55)] sm:p-8"
            >
              <Grain opacity={0.07} blend="soft-light" />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/25 blur-3xl"
              />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gold">The Route</p>
                  <p className="mt-1 font-display text-2xl font-semibold">Pakistan &rarr; Germany</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/15 bg-paper/5 px-3 py-1 text-[11px] font-bold text-paper/70">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1fae54]" /> Guided live
                </span>
              </div>

              <div className="relative mt-2">
                <RouteMap reduceMotion={reduceMotion} />
              </div>

              {/* TODO: replace illustrative numbers with real, client-confirmed stats */}
              <div className="relative mt-4 grid grid-cols-2 gap-3 border-t border-paper/10 pt-5">
                <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] px-4 py-3">
                  <p className="font-display text-3xl font-semibold">
                    <AnimatedNumber value={500} suffix="+" />
                  </p>
                  <p className="text-xs font-semibold text-paper/55">Students guided</p>
                </div>
                <div className="rounded-2xl border border-paper/10 bg-paper/[0.04] px-4 py-3">
                  <p className="font-display text-3xl font-semibold">
                    <AnimatedNumber value={9} />
                  </p>
                  <p className="text-xs font-semibold text-paper/55">Guided service areas</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scrolling ribbon of everything we help with */}
      <div className="relative border-y border-line bg-paper-raised py-5">
        <Marquee duration={45}>
          {MARQUEE_ITEMS.map((item) => (
            <span key={item} className="flex items-center font-display text-xl font-medium italic text-ink/70">
              <span className="px-8">{item}</span>
              <span aria-hidden className="text-gold">
                ✦
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </>
  );
}
