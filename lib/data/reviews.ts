export type Review = {
  name: string;
  quote: string;
  /** Optional extra details — shown on the card only when filled in. */
  city?: string;
  program?: string;
  university?: string;
  intake?: string;
  /** Filter tags: "Bachelor", "Master", "Admission Letter". */
  tags?: string[];
};

export const reviewInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

// Client-supplied reviews (Nov 2026). The two originally written in Urdu script (Asad Hafeez,
// Haseeb Akhtir) were converted to Roman Urdu to match the rest of the site.
// TODO: confirm each student consented to being quoted by name.
export const REVIEWS: Review[] = [
  { name: "Ali Shan Shah", quote: "My experience with Germanychlo was excellent. Muhammad Shahid guided me throughout the entire visa process, from selecting the right university to preparing my documents and completing the visa application. He explained every step clearly and always kept me informed. I never felt confused or left alone during the process. Highly recommended!" },
  { name: "Abdul Hafeez", quote: "I really appreciate the support I received from Muhammad Aqib. He helped me explore multiple universities, compare their courses and understand the admission requirements. What I liked most was the transparency. Everything was explained before proceeding, and I was able to make my own decision. Thank you, Germanychlo!" },
  { name: "Mohsin Iqbal", quote: "A big thanks to Ameer Hamza for helping me prepare for my embassy interview. He provided useful guidance, explained possible interview questions and helped me understand how to present my study plans confidently. The preparation made a big difference to my confidence. I am grateful to the entire Germanychlo team." },
  { name: "Muhammad Ahmad", quote: "My journey did not end when I received my visa. Germanychlo also supported me after my arrival. Their team helped coordinate my airport pickup and made sure I knew where to go. Having someone guide me during my first arrival in a new country was a huge relief. Truly appreciated!" },
  { name: "Saqib Ali", quote: "Muhammad Shahid and his team helped me with my university application, visa documentation and initial accommodation arrangements. Moving abroad for the first time can be stressful, but their continuous support made things much easier. I appreciate their professional attitude and commitment." },
  { name: "Asad Hafeez", quote: "Mera Germanychlo ke sath experience bohat acha raha. Muhammad Aqib ne university ke intikhab se le kar admission, documents ki tayyari aur visa process tak har marhale par meri rehnumai ki. Sab se achi baat yeh thi ke har cheez mujhe tafseel se samjhai gayi aur kisi bhi marhale par koi baat chhupai nahi gayi. Main un ki mehnat aur taawun ka shukar guzar hoon." },
  { name: "Saba Tanveer", quote: "Mera Germanychlo ke sath experience bohat acha raha. Ameer Hamza ne mujhe different universities aur courses ke bare mein guide kiya. Unhon ne har university ki requirements aur admission process clearly explain kiya. Har step par proper communication rahi. Thank you so much for your support!" },
  { name: "Zuha Ijaz", quote: "I appreciate the additional guidance I received from Germanychlo after reaching my destination. Apart from helping me with my admission and visa process, their team also shared useful information about student life, part-time work opportunities and managing expenses. This practical guidance helped me understand how to settle into my new environment." },
  { name: "Rohan Ali", quote: "Main Muhammad Shahid ka specially shukriya ada karna chahta hoon. Unhon ne mujhe har cheez honestly explain ki, chahe university selection ho, fees structure ho ya visa documentation. Mujhe kabhi aisa feel nahi hua ke mujh se koi information hide ki ja rahi hai. Germanychlo ki service waqai appreciate karne ke qabil hai." },
  { name: "Maham Rida", quote: "Getting a student visa involves many steps, and I was initially worried about the documentation and application procedure. Muhammad Aqib made the entire process easier by explaining everything step by step. From admission guidance to visa application support, his communication and professionalism were excellent." },
  { name: "Haseeb Akhtir", quote: "Germanychlo ki team ka rawayya bohat acha aur professional hai. Unhon ne mere tamam sawalat ke jawabat diye aur har marhale par meri rehnumai ki. Khaas tor par visa file ki tayyari aur interview ki tayyari mein un ki madad qabil-e-tareef thi. Main un ki khidmat se mutmain hoon." },
  { name: "Maira Qaiser", quote: "I would like to thank Ameer Hamza for his continuous support. He guided me through the admission and visa process and also helped me understand the arrangements needed after arriving abroad. The guidance regarding accommodation, university procedures and settling in was particularly helpful. Germanychlo offers support beyond just paperwork." },
  { name: "Muhammad Ali", quote: "Germanychlo ke sath mera safar bohat acha raha. Shahid bhai ne shuru se akhir tak bohat achi guidance di. Documents, university application, embassy preparation aur har choti bari detail mein help ki. Unka communication style bohat friendly hai aur woh har sawal ka jawab dete hain. Highly recommended!" },
  { name: "Mudassar Hussain", quote: "What makes Germanychlo different is the team's willingness to support students throughout their journey. I received guidance with university applications, documentation, visa preparation and the arrangements needed for travelling abroad. Muhammad Shahid, Ameer Hamza and Muhammad Aqib were helpful and approachable. I am thankful for their assistance." },
  { name: "Muhammad Naeem", quote: "Abroad study ka plan banana mere liye bohat bara decision tha. Germanychlo ne meri journey ko kaafi easy bana diya. Muhammad Aqib ne mujhe har stage par guide kiya aur mujhe samjhaya ke agla step kya hoga. University selection se le kar visa process aur departure tak unki guidance helpful rahi. Main poori team ka dil se shukriya ada karta hoon." },
];
