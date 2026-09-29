import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { ConvictionBand } from "@/components/sections/conviction-band";
import { ServicesTeaser } from "@/components/sections/services-teaser";
import { SuccessTeaser } from "@/components/sections/success-teaser";
import { AssessmentForm } from "@/components/sections/assessment-form";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Journey />
      <ConvictionBand />
      <ServicesTeaser />
      <SuccessTeaser />
      <AssessmentForm />
      <FinalCta />
    </>
  );
}
