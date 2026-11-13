"use client";

import React, { useEffect, useState } from "react";
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
  Clock,
  Share2,
} from "lucide-react";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { computeGpa, GRADE_POINTS, type CourseLevel, type CourseStatus } from "@/lib/gpa";

interface CourseRow {
  id: string;
  name: string;
  grade: string;
  level: CourseLevel;
  credits: number;
  status: CourseStatus;
}

const fmt = (v: number | null) => (v === null ? "—" : v.toFixed(2));

export default function GpaConverterPage() {
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: "1", name: "AP Calculus BC", grade: "A", level: "ap_ib", credits: 1, status: "completed" },
    { id: "2", name: "AP Chemistry", grade: "A-", level: "ap_ib", credits: 1, status: "completed" },
    { id: "3", name: "English Literature Honors", grade: "A", level: "honors", credits: 1, status: "completed" },
    { id: "4", name: "US History", grade: "B+", level: "regular", credits: 1, status: "completed" },
    { id: "5", name: "Spanish III Honors", grade: "A", level: "honors", credits: 1, status: "in_progress" },
  ]);
  const [preliminary, setPreliminary] = useState(false);
  const [copied, setCopied] = useState(false);

  // Deep link from guides: /calc/gpa#preliminary opens preliminary mode.
  useEffect(() => {
    if (window.location.hash === "#preliminary") setPreliminary(true);
  }, []);

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: Date.now().toString(),
        name: `Course ${courses.length + 1}`,
        grade: "A",
        level: "regular",
        credits: 1,
        status: "completed",
      },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = <K extends keyof CourseRow>(id: string, field: K, value: CourseRow[K]) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  // All rows (cumulative / projected) and completed-only rows (preliminary).
  const all = computeGpa(courses);
  const done = computeGpa(courses, { completedOnly: true });
  const totalCredits = all.credits;
  const inProgressCount = courses.filter((c) => c.status === "in_progress" && c.credits > 0).length;
  const primary = preliminary ? done : all;

  const copySummary = () => {
    try {
      const summaryText =
        `MultiPDF Doc — High School GPA Calculation Summary\n` +
        `Mode: ${preliminary ? "Preliminary GPA (Completed Terms Only)" : "Cumulative GPA"}\n` +
        `Unweighted GPA: ${fmt(primary.unweighted)} / 4.00\n` +
        `Weighted GPA: ${fmt(primary.weighted)} / 5.00\n` +
        `Credits Included: ${primary.credits}\n` +
        (preliminary && inProgressCount > 0 ? `Projected (After in-progress classes): Unweighted ${fmt(all.unweighted)}, Weighted ${fmt(all.weighted)}\n` : "") +
        `Calculate 100% free and private in-browser at: https://multipdfdoc.com/calc/gpa`;
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-sm">
          <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
          <span>Course-by-course GPA Estimate • Unweighted 4.0 & Weighted 5.0</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Weighted, Unweighted &amp; Preliminary GPA Calculator
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Convert AP, IB and Honors courses between the unweighted 4.0 and weighted 5.0 scales, or switch on Preliminary GPA mode to see your GPA from completed semesters only, the figure most transcripts send to colleges. Everything is calculated in your browser.
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

          <div id="preliminary" className={`scroll-mt-28 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-colors ${preliminary ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}>
            <div className="text-xs text-slate-600">
              <p className="font-bold text-slate-900 flex items-center gap-1.5 whitespace-nowrap"><Clock className="w-3.5 h-3.5 text-emerald-600" /> Preliminary GPA mode</p>
              <p className="mt-0.5">Mark current courses as in progress. Your preliminary GPA counts completed courses only.</p>
            </div>
            <button
              type="button"
              aria-pressed={preliminary}
              onClick={() => setPreliminary((v) => !v)}
              className={`px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap shadow-sm transition-all ${preliminary ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"}`}
            >
              {preliminary ? "Preliminary mode on" : "Turn on preliminary mode"}
            </button>
          </div>

          <div className="space-y-2.5">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-2xl border ${preliminary && course.status === "in_progress" ? "bg-amber-50/70 border-amber-200 border-dashed" : "bg-slate-50 border-slate-200"}`}
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
                    onChange={(e) => updateCourse(course.id, "level", e.target.value as CourseLevel)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                  >
                    <option value="regular">Regular (4.0)</option>
                    <option value="honors">Honors (+0.5)</option>
                    <option value="ap_ib">AP / IB / Dual (+1.0)</option>
                  </select>

                  {preliminary && (
                    <select aria-label="Course status"
                      value={course.status}
                      onChange={(e) => updateCourse(course.id, "status", e.target.value as CourseStatus)}
                      className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                      <option value="completed">Completed</option>
                      <option value="in_progress">In progress (expected grade)</option>
                    </select>
                  )}

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
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider whitespace-nowrap">
              {preliminary ? "Preliminary GPA (Completed Only)" : "Cumulative Academic Scores"}
            </span>

            {totalCredits <= 0 && <p role="status" className="text-sm text-slate-600">Enter at least one positive-credit course to calculate GPA.</p>}
            {preliminary && totalCredits > 0 && done.credits <= 0 && <p role="status" className="text-sm text-amber-700">Mark at least one course as completed to see a preliminary GPA.</p>}
            {/* Dual Score Cards */}
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Unweighted</span>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
                  {fmt(primary.unweighted)}
                </div>
                <span className="text-[10px] font-mono text-slate-600">Out of 4.00</span>
              </div>

              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 space-y-1">
                <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wide">Weighted</span>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-violet-700">
                  {fmt(primary.weighted)}
                </div>
                <span className="text-[10px] font-mono text-violet-700">Out of 5.00</span>
              </div>
            </div>
            <p className="text-[11px] font-mono text-slate-500">{primary.credits} credits included{preliminary ? ` • ${inProgressCount} in progress excluded` : ""}</p>

            <button
              type="button"
              onClick={copySummary}
              className="w-full py-2.5 px-4 rounded-full text-xs font-bold btn-bubble btn-bubble-violet flex items-center justify-center gap-2 shadow-clay-pill transition-all"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Copied Summary to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Copy GPA Summary to Share</span>
                </>
              )}
            </button>

            {preliminary && inProgressCount > 0 && all.credits > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Projected after in-progress courses</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700 font-mono">
                  <span>Unweighted <strong className="text-slate-900">{fmt(all.unweighted)}</strong></span>
                  <span>Weighted <strong className="text-violet-700">{fmt(all.weighted)}</strong></span>
                </div>
                {done.unweighted !== null && all.unweighted !== null && (
                  <p className="text-xs text-slate-600">
                    If you earn the expected grades, your unweighted GPA moves by {(all.unweighted - done.unweighted >= 0 ? "+" : "") + (all.unweighted - done.unweighted).toFixed(2)}. Colleges confirm this on your final transcript.
                  </p>
                )}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-sm text-slate-600 space-y-2">
              <h3 className="font-bold text-slate-900">Understand your estimate</h3>
              <p>This calculator uses +0.5 for Honors and +1.0 for AP/IB passing grades. Your school may use another policy. Zero-credit courses are excluded. In preliminary mode, in-progress courses never affect the preliminary figure.</p>
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
