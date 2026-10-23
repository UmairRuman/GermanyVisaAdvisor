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

// Well-known German universities. Languages, intakes and degree levels are indicative only —
// they differ program by program, so we confirm them for each student's shortlist.
// TODO: client to review the list and mark the universities they most often work with.
const ALL: Degree[] = ["Bachelor", "Master", "PhD"];

export const UNIVERSITIES: University[] = [
  { name: "Technical University of Munich (TUM)", city: "Munich", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "Ludwig Maximilian University of Munich (LMU)", city: "Munich", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "Heidelberg University", city: "Heidelberg", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "RWTH Aachen University", city: "Aachen", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "Technical University of Berlin (TU Berlin)", city: "Berlin", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "Humboldt University of Berlin", city: "Berlin", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "Free University of Berlin (FU Berlin)", city: "Berlin", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "Karlsruhe Institute of Technology (KIT)", city: "Karlsruhe", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "University of Stuttgart", city: "Stuttgart", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "Technical University of Darmstadt", city: "Darmstadt", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "University of Hamburg", city: "Hamburg", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "University of Freiburg", city: "Freiburg", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "University of Bonn", city: "Bonn", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "TU Dresden", city: "Dresden", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "University of Göttingen", city: "Göttingen", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "University of Mannheim", city: "Mannheim", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "Goethe University Frankfurt", city: "Frankfurt", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "University of Cologne", city: "Cologne", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "TU Dortmund University", city: "Dortmund", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
  { name: "University of Münster", city: "Münster", type: "Public", languages: "English / German", intake: "Winter / Summer", degrees: ALL },
];
