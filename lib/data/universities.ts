export const DEGREE_OPTIONS = ["All degrees", "Bachelor", "Master", "PhD"] as const;
export type DegreeOption = (typeof DEGREE_OPTIONS)[number];
export type Degree = Exclude<DegreeOption, "All degrees">;

export type University = {
  name: string;
  city: string;
  type: "Public" | "Private";
  languages: string;
  intake: string;
  degrees: Degree[];
};

// Illustrative only — replace with the client's real partner/target university list
// (see docs/04-tech-stack.md, open question #5).
export const UNIVERSITIES: University[] = [
  {
    name: "Technical University Example",
    city: "Darmstadt",
    type: "Public",
    languages: "English / German",
    intake: "Winter",
    degrees: ["Bachelor", "Master"],
  },
  {
    name: "University of Example",
    city: "Berlin",
    type: "Public",
    languages: "English",
    intake: "Winter / Summer",
    degrees: ["Master", "PhD"],
  },
  {
    name: "Applied Sciences Example",
    city: "Munich",
    type: "Public",
    languages: "German / English",
    intake: "Winter",
    degrees: ["Bachelor"],
  },
  {
    name: "Institute of Technology Example",
    city: "Stuttgart",
    type: "Public",
    languages: "English",
    intake: "Winter",
    degrees: ["Master", "PhD"],
  },
  {
    name: "University of Applied Sciences Example",
    city: "Hamburg",
    type: "Public",
    languages: "English / German",
    intake: "Summer",
    degrees: ["Bachelor", "Master"],
  },
];
