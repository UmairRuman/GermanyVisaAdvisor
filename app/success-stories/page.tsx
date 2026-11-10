import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { StatsBand } from "@/components/sections/stats-band";
import { StoriesBrowser } from "@/components/sections/stories-browser";

export const metadata: Metadata = {
  title: "Student Success Stories | GermanyChalo",
  description: "Student reviews and visa approvals from Pakistani students we have guided to Germany.",
};

export default function SuccessStoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Success Stories"
        title={
          <>
            Dreams Become
            <br />
            <span className="text-brick">Success Stories.</span>
          </>
        }
        description="Student reviews and visa approvals in one place."
      />
      <StatsBand />
      <StoriesBrowser />
    </>
  );
}
