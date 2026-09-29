// TODO: client to confirm these figures before launch — they change yearly.
// Blocked-account requirement (Sperrkonto) for a German student visa: €992/month, 12 months.
export const BLOCKED_ACCOUNT_MONTHLY_EUR = 992;
export const BLOCKED_ACCOUNT_MAX_MONTHS = 12;
// Indicative PKR per EUR. The calculator lets students override it with today's rate.
export const DEFAULT_PKR_PER_EUR = 316;
// Typical provider set-up fee range quoted for blocked accounts (EUR).
export const PROVIDER_FEE_EUR = { min: 49, max: 100 } as const;

export type CityTier = "small" | "mid" | "large";

export const CITY_TIERS: Record<CityTier, { label: string; hint: string }> = {
  small: { label: "Smaller city", hint: "e.g. university towns" },
  mid: { label: "Mid-size city", hint: "e.g. Stuttgart, Darmstadt" },
  large: { label: "Big city", hint: "e.g. Munich, Hamburg, Berlin" },
};

// TODO: client to replace these rough monthly estimates (EUR) with figures they trust.
// Each category has a slider range and a default per city tier.
export const BUDGET_CATEGORIES: {
  id: string;
  label: string;
  color: string;
  min: number;
  max: number;
  defaults: Record<CityTier, number>;
}[] = [
  { id: "rent", label: "Rent", color: "var(--color-brick)", min: 200, max: 900, defaults: { small: 350, mid: 450, large: 650 } },
  { id: "food", label: "Food", color: "var(--color-gold)", min: 100, max: 400, defaults: { small: 180, mid: 200, large: 240 } },
  { id: "insurance", label: "Health insurance", color: "var(--color-charcoal)", min: 80, max: 200, defaults: { small: 120, mid: 120, large: 120 } },
  { id: "semester", label: "Semester contribution", color: "#8f1d17", min: 20, max: 100, defaults: { small: 40, mid: 50, large: 55 } },
  { id: "phone", label: "Phone & internet", color: "var(--color-ink-muted)", min: 10, max: 60, defaults: { small: 25, mid: 30, large: 30 } },
  { id: "other", label: "Leisure & other", color: "#d9b56a", min: 20, max: 250, defaults: { small: 60, mid: 80, large: 110 } },
];

export type GradeScale = "cgpa4" | "percentage";

export const SCALES: Record<GradeScale, { label: string; max: number; defaultMin: number; step: number }> = {
  cgpa4: { label: "CGPA (out of 4.0)", max: 4, defaultMin: 2, step: 0.01 },
  percentage: { label: "Percentage (out of 100)", max: 100, defaultMin: 50, step: 0.1 },
};

/**
 * Modified Bavarian formula, the standard way German universities convert foreign grades:
 *   German grade = 1 + 3 × (Nmax − Nd) / (Nmax − Nmin)
 * where Nmax is the best possible grade, Nmin the lowest passing grade and Nd the student's grade.
 * German grades run from 1.0 (best) to 4.0 (lowest pass).
 */
export function toGermanGrade(score: number, max: number, min: number): number | null {
  if (!Number.isFinite(score) || max <= min || score < min || score > max) return null;
  const grade = 1 + (3 * (max - score)) / (max - min);
  return Math.round(grade * 10) / 10;
}

export type GradeBand = { label: string; tone: "great" | "good" | "fair" | "pass"; note: string };

export function describeGermanGrade(grade: number): GradeBand {
  if (grade <= 1.5)
    return { label: "Very good", tone: "great", note: "A strong profile — competitive even for selective programs." };
  if (grade <= 2.5)
    return { label: "Good", tone: "good", note: "A solid profile with plenty of program options." };
  if (grade <= 3.5)
    return { label: "Satisfactory", tone: "fair", note: "Many programs are open to you; shortlisting matters most." };
  return { label: "Sufficient", tone: "pass", note: "Options exist, but choosing the right program is critical." };
}
