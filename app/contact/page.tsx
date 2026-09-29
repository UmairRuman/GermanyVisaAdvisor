import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { BookCall } from "@/components/sections/book-call";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = {
  title: "Contact Us | GermanyChalo",
  description: "Send your profile and start your Germany journey with a clear next step.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&rsquo;s Talk About
            <br />
            <span className="text-brick">Your Germany Plan.</span>
          </>
        }
        description="Send your basic profile and start with a clear next step."
      />
      <BookCall />
      <ContactSection />
    </>
  );
}
