import {
  ClipboardCheck,
  FileText,
  GraduationCap,
  HeartPulse,
  Handshake,
  Home,
  PlaneTakeoff,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const SERVICES: Service[] = [
  {
    icon: GraduationCap,
    title: "University Shortlisting",
    description: "Find universities and programs that fit your profile.",
  },
  {
    icon: FileText,
    title: "Application Guidance",
    description: "Understand documents, deadlines and application steps.",
  },
  {
    icon: ClipboardCheck,
    title: "Document Review",
    description: "Organize your documents before submission.",
  },
  {
    icon: ShieldCheck,
    title: "Visa Guidance",
    description: "Understand required documents and the visa process.",
  },
  {
    icon: Wallet,
    title: "Blocked Account Guidance",
    description: "Understand financial proof and blocked-account steps.",
  },
  {
    icon: HeartPulse,
    title: "Health Insurance Guidance",
    description: "Know what type of insurance may be needed.",
  },
  {
    icon: Home,
    title: "Accommodation Guidance",
    description: "Learn where and how to search for student housing.",
  },
  {
    icon: PlaneTakeoff,
    title: "Pre-Departure Support",
    description: "Prepare important tasks before travelling.",
  },
  {
    icon: Handshake,
    title: "Arrival Guidance",
    description: "Understand common first steps after reaching Germany.",
  },
];
