// Redacted visa proof shown on the Success Stories page. Add a new item here (and drop the
// image in /public/visas) — no other code needs to change.
// TODO: owner to confirm each student consented and that passport/visa numbers and names are
// blurred in the image files before launch.
export type ProofItem = {
  src: string;
  alt: string;
  caption: string;
  /** Filter tags, e.g. "Bachelor", "Master", "Admission Letter". "Visa Approved" is implied. */
  tags?: string[];
};

export const PROOF: ProofItem[] = [
  { src: "/visas/visa-1.jpeg", alt: "German student visa and supplementary sheet", caption: "German student visa" },
  { src: "/visas/visa-2.jpeg", alt: "German student visa page", caption: "German student visa" },
  { src: "/visas/visa-3.jpeg", alt: "German student visa page", caption: "German student visa" },
  { src: "/visas/visa-4.jpeg", alt: "German student visa page", caption: "German student visa" },
  { src: "/visas/visa-5.jpeg", alt: "German student visa and supplementary sheet", caption: "German student visa" },
];
