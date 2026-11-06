export type CourseLevel = "regular" | "honors" | "ap_ib";
export type CourseStatus = "completed" | "in_progress";

export interface GpaCourse {
  grade: string;
  level: CourseLevel;
  credits: number;
  status?: CourseStatus;
}

export const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0,
};

export const LEVEL_WEIGHT_BONUS: Record<CourseLevel, number> = { regular: 0.0, honors: 0.5, ap_ib: 1.0 };

export interface GpaResult {
  credits: number;
  unweighted: number | null;
  weighted: number | null;
}

/**
 * Credit-weighted GPA. Zero/invalid credits are excluded; failing grades earn no level bonus.
 * Returns null averages when no positive credits are included (never divides by zero).
 */
export function computeGpa(courses: GpaCourse[], options: { completedOnly?: boolean } = {}): GpaResult {
  let credits = 0, unweightedPts = 0, weightedPts = 0;
  for (const c of courses) {
    if (options.completedOnly && c.status === "in_progress") continue;
    const cred = Number.isFinite(c.credits) ? Math.max(0, c.credits) : 0;
    if (cred === 0) continue;
    const base = GRADE_POINTS[c.grade] ?? 0;
    const bonus = base > 0 ? LEVEL_WEIGHT_BONUS[c.level] ?? 0 : 0;
    credits += cred;
    unweightedPts += base * cred;
    weightedPts += (base + bonus) * cred;
  }
  return credits > 0
    ? { credits, unweighted: unweightedPts / credits, weighted: weightedPts / credits }
    : { credits: 0, unweighted: null, weighted: null };
}
