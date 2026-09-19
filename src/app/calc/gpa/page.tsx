"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Award,
  BookOpen,
  School,
  TrendingUp,
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface CourseRow {
  id: string;
  name: string;
  grade: string;
  level: "regular" | "honors" | "ap_ib";
  credits: number;
}

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "F": 0.0,
};

const LEVEL_WEIGHT_BONUS: Record<string, number> = {
  regular: 0.0,
  honors: 0.5,
  ap_ib: 1.0,
};

export default function GpaConverterPage() {
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: "1", name: "AP Calculus BC", grade: "A", level: "ap_ib", credits: 1 },
    { id: "2", name: "AP Chemistry", grade: "A-", level: "ap_ib", credits: 1 },
    { id: "3", name: "English Literature Honors", grade: "A", level: "honors", credits: 1 },
    { id: "4", name: "US History", grade: "B+", level: "regular", credits: 1 },
    { id: "5", name: "Spanish III Honors", grade: "A", level: "honors", credits: 1 },
  ]);

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: Date.now().toString(),
        name: `Course ${courses.length + 1}`,
        grade: "A",
        level: "regular",
        credits: 1,
      },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseRow, value: any) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  // Compute Unweighted & Weighted GPA
  let totalCredits = 0;
  let unweightedQualityPoints = 0;
  let weightedQualityPoints = 0;

  courses.forEach((c) => {
    const basePts = GRADE_POINTS[c.grade] ?? 0;
    const bonus = LEVEL_WEIGHT_BONUS[c.level] ?? 0;
    const cred = c.credits > 0 ? c.credits : 1;

    totalCredits += cred;
    unweightedQualityPoints += basePts * cred;
    weightedQualityPoints += (basePts + bonus) * cred;
  });

  const unweightedGpa = totalCredits > 0 ? unweightedQualityPoints / totalCredits : 0;
  const weightedGpa = totalCredits > 0 ? weightedQualityPoints / totalCredits : 0;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-sm">
          <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
          <span>US College Admissions Standard • Unweighted 4.0 & Weighted 5.0</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Weighted to Unweighted GPA Converter
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Accurately convert your AP, IB, and Honors courses between standard 4.0 and weighted 5.0 scales. Complete client-side calculations at <strong className="text-slate-800">multipdfdoc.com</strong>.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Course Rows Table (7 Cols) */}
        <div className="lg:col-span-7 bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">Your Course Roster</h2>
              <p className="text-[11px] text-slate-500">Select course difficulty to apply AP (+1.0) and Honors (+0.5) boosts.</p>
            </div>
            <button
              type="button"
              onClick={addCourse}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-100/70 hover:bg-violet-100 text-violet-700 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <input
                  type="text"
                  placeholder="Course Title"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-violet-500"
                />

                <div className="flex items-center gap-2">
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 outline-none"
                  >
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS[g].toFixed(1)})
                      </option>
                    ))}
                  </select>

                  <select
                    value={course.level}
                    onChange={(e) => updateCourse(course.id, "level", e.target.value)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 outline-none"
                  >
                    <option value="regular">Regular (4.0)</option>
                    <option value="honors">Honors (+0.5)</option>
                    <option value="ap_ib">AP / IB / Dual (+1.0)</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual Live Rings Output (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6 text-center">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              Cumulative Academic Scores
            </span>

            {/* Dual Score Cards */}
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Unweighted</span>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
                  {unweightedGpa.toFixed(2)}
                </div>
                <span className="text-[10px] font-mono text-slate-400">Out of 4.00</span>
              </div>

              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 space-y-1">
                <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wide">Weighted</span>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-violet-700">
                  {weightedGpa.toFixed(2)}
                </div>
                <span className="text-[10px] font-mono text-violet-500">Out of 5.00</span>
              </div>
            </div>

            {/* Benchmark College Cutoff Comparison */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                <School className="w-4 h-4 text-violet-600" />
                <span>US University Benchmark Ranges</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between border-b border-slate-200/70 pb-1">
                  <span>Ivy League / Top 15 (MIT, Stanford):</span>
                  <span className="font-bold text-slate-900">3.90+ Unw / 4.4+ W</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-1">
                  <span>Top 50 State Flagships (UCLA, UF, UT Austin):</span>
                  <span className="font-bold text-slate-900">3.75+ Unw / 4.1+ W</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard College Admissions:</span>
                  <span className="font-bold text-slate-900">3.00+ Unw / 3.4+ W</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Standard College Board & Common App conversion format</span>
            </div>
          </div>

          <AdPlaceholder slot="sidebar-ad" format="rectangle" />
        </div>
      </div>

      {/* AdSense Value Wrapper Layer */}
      <ValueWrapper
        toolName="Weighted to Unweighted GPA Converter"
        title="Official Academic Standards: High School GPA Scaling & College Admissions Conversion"
        subtitle="How the Common Application, UC admissions, and state universities interpret weighted vs unweighted GPA."
        sections={[
          {
            heading: "1. The Fundamental Difference: Unweighted 4.0 vs Weighted 5.0 Scales",
            content: `The standard unweighted Grade Point Average (GPA) measures raw academic performance on a fixed 0.0 to 4.00 scale regardless of course rigor:
• An 'A' in standard introductory gym awards 4.0 quality points, exactly matching an 'A' in college-level Multivariable Calculus.

To reward students who undertake demanding coursework, high schools utilize Weighted GPA scales that apply quality point adders:
• Honors Courses: Typically receive a +0.5 weight bonus (where an A equals 4.5).
• Advanced Placement (AP) and International Baccalaureate (IB): Receive a +1.0 weight bonus (where an A equals 5.0).
• Dual-Enrollment College Credits: Typically credited with a +1.0 weight bonus under state university articulation agreements.`
          },
          {
            heading: "2. Why College Admissions Officers Recalculate Your GPA",
            content: `Because every high school calculates weighted GPAs using slightly different proprietary formulas (some capping weighted GPA at 4.5, others allowing scores up to 5.3), major university systems (such as the University of California and State University of New York) strip away local weighting and recalculate applicant GPAs using a unified standard.

Understanding both your unweighted baseline and weighted rigor profile ensures you target realistic admissions percentiles.`
          }
        ]}
        formula={{
          title: "Grade Point Average Formula",
          formula: "GPA = Σ(Course_Credits * Grade_Points) / Σ(Course_Credits)",
          explanation: "The standard credit-weighted quality point average recommended by the National Association for College Admission Counseling (NACAC)."
        }}
        faqs={[
          {
            question: "Do colleges care more about weighted or unweighted GPA?",
            answer: "Admissions officers evaluate both: unweighted GPA demonstrates your core grade consistency, while weighted GPA verifies that you challenged yourself with the most rigorous curriculum available at your school."
          },
          {
            question: "How does an A- or B+ factor into the scale?",
            answer: "Under the standard plus/minus system, an A- earns 3.7 unweighted points, a B+ earns 3.3 points, and a B earns 3.0 points."
          },
          {
            question: "Is this calculation saved on your server?",
            answer: "No. MultiPDF Doc processes all grade inputs locally in your browser with zero server data retention."
          }
        ]}
      />
    </div>
  );
}
