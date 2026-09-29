import Link from "next/link";
import { ArrowUp, ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Grain } from "@/components/ui/grain";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-charcoal-line bg-charcoal text-paper/65">
      <div className="h-[3px] bg-gradient-to-r from-brick via-gold to-brick" />
      <Grain opacity={0.045} blend="soft-light" />
      <div aria-hidden className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-brick/15 blur-[100px]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-10 pt-16 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5 font-display text-lg font-semibold text-paper">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-paper/10 text-xs font-bold text-paper">
              GC
            </span>
            <span>
              Germany<span className="text-brick">Chalo</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            From admission to arrival — clear, honest guidance for your Germany journey.
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex items-center gap-2 rounded-full border border-paper/20 px-5 py-2.5 text-sm font-bold text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-charcoal"
          >
            Free Assessment
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-sm font-semibold sm:flex sm:flex-col sm:gap-1">
          <p className="col-span-2 mb-2 text-xs font-bold uppercase tracking-wide text-paper/35">Explore</p>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex w-fit items-center gap-2 py-2.5 transition-colors hover:text-paper sm:py-1"
            >
              <span className="h-px w-0 bg-brick transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="text-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-paper/35">Get in touch</p>
          {/* TODO: client to provide real email, WhatsApp number, office address */}
          <a href="mailto:hello@germanychalo.com" className="flex items-center gap-2 py-1 font-semibold text-paper/80 transition-colors hover:text-paper">
            <Mail size={15} className="text-gold" /> hello@germanychalo.com
          </a>
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-1 font-semibold text-paper/80 transition-colors hover:text-paper"
          >
            <MessageCircle size={15} className="text-gold" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the bottom edge */}
      <div aria-hidden className="relative select-none overflow-hidden px-4">
        <p className="text-center font-display text-[clamp(2.75rem,13.2vw,15rem)] font-semibold leading-[0.8] tracking-tighter text-paper/[0.06]">
          GermanyChalo
        </p>
      </div>

      <div className="relative border-t border-charcoal-line">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-start justify-between gap-4 px-6 py-5 pb-24 text-xs text-paper/40 sm:flex-row sm:items-center sm:pb-5">
          <span>© {new Date().getFullYear()} GermanyChalo. All rights reserved.</span>
          <a
            href="#"
            className="group inline-flex items-center gap-2 font-bold text-paper/60 transition-colors hover:text-paper"
          >
            Back to top
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-paper/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-paper">
              <ArrowUp size={13} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
