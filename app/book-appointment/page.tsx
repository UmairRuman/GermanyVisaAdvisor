import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { BookCall } from "@/components/sections/book-call";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { CONSULTATION_FEE_EUR } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Book Appointment | GermanyChalo",
  description: "Book a paid one-to-one counselling session with a GermanyChalo advisor.",
};

// TODO: owner to write and approve the real policy wording before launch.
const POLICIES = [
  {
    question: "What does the session include?",
    answer: `A one-to-one session of around 20 minutes (€${CONSULTATION_FEE_EUR}) where the advisor reviews your profile, suggests suitable universities and explains the next steps for admission and the visa.`,
  },
  {
    question: "Rescheduling policy",
    answer: "To change your day, contact us by email at least 24 hours before the session. The advisor will offer the next free day.",
  },
  {
    question: "Cancellation and refund policy",
    answer: "If we cannot confirm your slot, no payment is needed. Refund terms for confirmed sessions will be published here by the consultancy before launch.",
  },
  {
    question: "Privacy policy",
    answer: "We only collect the details needed to prepare your session, use them only to contact you about your enquiry, and never sell them.",
  },
  {
    question: "What we cannot guarantee",
    answer: "We guide you honestly, but admissions and visas are decided by universities and the embassy. We never promise a visa or an admission.",
  },
];

export default function BookAppointmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Book Appointment"
        title={
          <>
            Talk To An Advisor,
            <br />
            <span className="text-brick">One To One.</span>
          </>
        }
        description="Choose a day, tell us about your profile and we will confirm your session by email."
      />
      <BookCall />
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading eyebrow="Before You Book" title="Session & Policies" />
          <div className="mt-10">
            <Accordion items={POLICIES} />
          </div>
        </div>
      </section>
    </>
  );
}
