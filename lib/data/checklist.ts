export type ChecklistGroup = { title: string; items: { id: string; label: string; hint?: string }[] };

// TODO: client to review — exact requirements vary by embassy, university and program.
// The tool tells students so; we confirm each student's personal list during counselling.
export const CHECKLIST: ChecklistGroup[] = [
  {
    title: "Admission",
    items: [
      { id: "passport", label: "Valid passport", hint: "Check the expiry date covers your whole stay." },
      { id: "transcripts", label: "Academic transcripts & degree certificates" },
      { id: "language", label: "Language proof", hint: "IELTS/TOEFL for English programs, or German proof where required." },
      { id: "cv", label: "CV and motivation letter" },
      { id: "admission", label: "Admission letter received" },
    ],
  },
  {
    title: "Money & insurance",
    items: [
      { id: "blocked", label: "Blocked account opened & confirmation received" },
      { id: "insurance", label: "Health insurance arranged" },
    ],
  },
  {
    title: "Visa",
    items: [
      { id: "form", label: "Visa application form completed" },
      { id: "photos", label: "Biometric passport photos" },
      { id: "appointment", label: "Visa appointment booked" },
      { id: "fee", label: "Visa fee paid" },
    ],
  },
  {
    title: "Before you fly",
    items: [
      { id: "housing", label: "First accommodation arranged" },
      { id: "flight", label: "Flight booked" },
      { id: "copies", label: "Printed & digital copies of all documents" },
    ],
  },
];

export const CHECKLIST_TOTAL = CHECKLIST.reduce((sum, group) => sum + group.items.length, 0);
