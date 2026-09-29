"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { EASE_SETTLE } from "@/lib/motion";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Magnetic } from "@/components/ui/magnetic";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  // Lock page scroll behind the full-screen mobile menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const allLinks = [...NAV_LINKS, { href: "/contact", label: "Contact / Free Assessment" }];

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-500 ${
        open
          ? "border-transparent bg-transparent"
          : scrolled
            ? "border-line/80 bg-paper/80 shadow-[0_10px_40px_-20px_rgba(26,22,19,0.25)] backdrop-blur-xl"
            : "border-transparent bg-paper/40 backdrop-blur-sm"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        <Link
          href="/"
          className={`group flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight transition-colors duration-300 ${
            open ? "text-paper" : "text-ink"
          }`}
          onClick={() => setOpen(false)}
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-charcoal text-sm font-bold text-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110">
            GC
            <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brick/60 to-transparent" />
          </span>
          <span>
            Germany<span className="text-brick">Chalo</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 text-sm font-semibold text-ink/80 lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const showPill = hovered === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                onFocus={() => setHovered(link.href)}
                onBlur={() => setHovered(null)}
                className={`relative rounded-full px-3.5 py-2 transition-colors duration-200 ${
                  isActive ? "text-brick" : "hover:text-ink"
                }`}
              >
                {showPill && (
                  <motion.span
                    layoutId="nav-pill"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-ink/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    aria-hidden
                    className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brick"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <Magnetic className="hidden lg:inline-block" strength={0.25}>
          <Link
            href="/contact"
            className="shine group relative inline-flex items-center gap-2 rounded-full bg-brick px-5 py-2.5 text-sm font-bold text-paper shadow-[0_10px_24px_-8px_rgba(179,36,28,0.55)] transition-[background-color,box-shadow] duration-200 hover:bg-brick-dark"
          >
            Free Assessment
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Magnetic>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden ${
            open
              ? "border-paper/30 bg-transparent text-paper hover:border-paper"
              : "border-line bg-paper-raised/80 text-ink hover:border-ink"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "x" : "menu"}
              initial={reduceMotion ? false : { rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <ScrollProgress />
    </header>

      {/* Full-screen mobile menu: links stagger up, huge display type. Lives outside the
          <header> because its backdrop-filter would otherwise trap this fixed layer. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { clipPath: "circle(0% at calc(100% - 44px) 34px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 34px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 34px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE_SETTLE }}
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-charcoal px-6 pb-10 pt-24 lg:hidden"
          >
            <nav className="flex flex-col">
              {allLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 + index * 0.06, ease: EASE_SETTLE }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`group flex items-baseline justify-between border-b border-charcoal-line py-4 font-display text-3xl font-semibold ${
                        isActive ? "text-gold" : "text-paper"
                      }`}
                    >
                      <span>
                        <span className="mr-3 font-sans text-xs font-bold text-paper/30">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {link.label}
                      </span>
                      <ArrowRight
                        size={20}
                        className="-translate-x-2 text-brick opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <p className="mt-10 text-sm text-paper/40">From admission to arrival — clear, honest guidance.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
