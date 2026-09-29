export type Story = {
  initials: string;
  badge: string;
  name: string;
  program: string;
  quote: string;
};

// TODO: replace with real, consented student stories — see docs/01-project-brief.md.
// Initials/monograms are used instead of photos so nothing here is mistaken for a real,
// identifiable student before real stories and consent exist.
export const STORIES: Story[] = [
  {
    initials: "M.A.",
    badge: "Visa Approved",
    name: "Muhammad Ahmed",
    program: "MSc Computer Science · Winter Intake",
    quote: "I didn't understand any of the visa process until it was broken down step by step.",
  },
  {
    initials: "A.S.",
    badge: "Admission + Visa",
    name: "Areeba S.",
    program: "MSc Engineering · Germany",
    quote: "Having someone check every document before submission removed all the guesswork.",
  },
  {
    initials: "H.K.",
    badge: "Success Story",
    name: "Hamza K.",
    program: "MSc Data Science · Germany",
    quote: "University shortlisting to pre-departure — every stage was mapped out clearly.",
  },
  {
    initials: "S.R.",
    badge: "Visa Approved",
    name: "Sara R.",
    program: "MSc Business · Germany",
    quote: "Every step, from choosing a university to visa paperwork, was explained before I had to ask.",
  },
];
