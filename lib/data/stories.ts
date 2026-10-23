export type Story = {
  initials: string;
  badge: string;
  name: string;
  program: string;
  /** Written in Roman Urdu (Urdu in English letters), the way students actually talk. */
  quote: string;
};

// PLACEHOLDER COPY — written to show layout and tone. Replace with real, consented student
// stories before launch; do not present these as genuine reviews (see docs/01-project-brief.md).
// Initials are used instead of photos so nothing is mistaken for a real, identifiable student.
// Tone: simple Roman Urdu, centred on transparency — students compare us with other consultancies.
export const STORIES: Story[] = [
  {
    initials: "M.A.",
    badge: "Visa Approved",
    name: "Muhammad Ahmed, Lahore",
    program: "BSc Computer Science · Winter Intake",
    quote: "Pehli meeting mein hi unhon ne fees, time aur chances sab saaf bata diye. Koi jhoota wada nahi kiya, aur akhir tak aisa hi raha.",
  },
  {
    initials: "A.K.",
    badge: "Admission + Visa",
    name: "Areeba Khan, Karachi",
    program: "MSc Engineering · Germany",
    quote: "Main kai consultancies se mil chuki thi. Yahan har step simple alfaaz mein samjhaya gaya aur koi baat chhupai nahi gayi. Isi liye bharosa hua.",
  },
  {
    initials: "H.M.",
    badge: "Visa Approved",
    name: "Hamza Malik, Islamabad",
    program: "BS Business Administration · Germany",
    quote: "Har document khud dekh kar bataya ke kya theek hai aur kya nahi. Aisi imandari mujhe kisi consultancy mein pehle nahi mili.",
  },
  {
    initials: "S.R.",
    badge: "Admission Received",
    name: "Sara Rauf, Faisalabad",
    program: "MSc Data Science · Germany",
    quote: "Ghar walon ko sab se zyada yaqeen is baat par hua ke har kharcha aur har step pehle se bata diya gaya. Koi hidden fee nahi thi.",
  },
];
