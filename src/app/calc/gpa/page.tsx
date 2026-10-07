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
    const cred = Number.isFinite(c.credits) ? Math.max(0, c.credits) : 0;

    totalCredits += cred;
    unweightedQualityPoints += basePts * cred;
    weightedQualityPoints += (basePts + (basePts > 0 ? bonus : 0)) * cred;
  });

  const unweightedGpa = totalCredits > 0 ? unweightedQualityPoints / totalCredits : 0;
  const weightedGpa = totalCredits > 0 ? weightedQualityPoints / totalCredits : 0;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-sm">
          <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
          <span>Course-by-course GPA Estimate • Unweighted 4.0 & Weighted 5.0</span>
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
                <input aria-label="Course title"
                  type="text"
                  placeholder="Course Title"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <select aria-label="Course grade"
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                  >
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS[g].toFixed(1)})
                      </option>
                    ))}
                  </select>

                  <select aria-label="Course difficulty"
                    value={course.level}
                    onChange={(e) => updateCourse(course.id, "level", e.target.value)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                  >
                    <option value="regular">Regular (4.0)</option>
                    <option value="honors">Honors (+0.5)</option>
                    <option value="ap_ib">AP / IB / Dual (+1.0)</option>
                  </select>

                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">Credits
                    <input aria-label="Course credits" type="number" min="0" max="1000" step="0.25" value={course.credits} onChange={(e) => updateCourse(course.id, "credits", Math.min(1000, Math.max(0, Number(e.target.value))))} className="w-16 min-w-0 px-2 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900" />
                  </label>

                  <button aria-label="Remove this row"
                    type="button"
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length <= 1}
                    className="p-1.5 text-slate-600 hover:text-rose-600 disabled:opacity-30 transition-colors"
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

            {totalCredits <= 0 && <p role="status" className="text-sm text-slate-600">Enter at least one positive-credit course to calculate GPA.</p>}
            {/* Dual Score Cards */}
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Unweighted</span>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
                  {totalCredits > 0 ? unweightedGpa.toFixed(2) : "—"}
                </div>
                <span className="text-[10px] font-mono text-slate-600">Out of 4.00</span>
              </div>

              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 space-y-1">
                <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wide">Weighted</span>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-violet-700">
                  {totalCredits > 0 ? weightedGpa.toFixed(2) : "—"}
                </div>
                <span className="text-[10px] font-mono text-violet-700">Out of 5.00</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-sm text-slate-600 space-y-2">
              <h3 className="font-bold text-slate-900">Understand your estimate</h3>
              <p>This calculator uses +0.5 for Honors and +1.0 for AP/IB passing grades. Your school may use another policy. Zero-credit courses are excluded.</p>
              <p>These numbers are not admissions cutoffs or a UC GPA calculation. Report your official transcript and follow each college’s instructions.</p>
            </div>
          </div>

          <AdPlaceholder slot="sidebar-ad" format="rectangle" />
        </div>
      </div>

      {/* AdSense Value Wrapper Layer */}

    </div>
  );
}
