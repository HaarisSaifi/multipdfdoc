"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  Flame,
  Coffee,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Percent,
  Download,
  BookOpen,
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function FinalGradeCalculatorPage() {
  const [currentGrade, setCurrentGrade] = useState<number>(82);
  const [targetGrade, setTargetGrade] = useState<number>(90);
  const [finalWeight, setFinalWeight] = useState<number>(25);
  const [curveBuffer, setCurveBuffer] = useState<number>(0);

  // Math formula:
  // Current * (100 - Weight) + (Required * Weight) = Target - Curve
  // Required = ((Target - Curve) - (Current * (1 - Weight/100))) / (Weight/100)
  const currentWeightFrac = (100 - finalWeight) / 100;
  const finalWeightFrac = finalWeight / 100;
  const adjustedTarget = targetGrade - curveBuffer;
  const currentContribution = currentGrade * currentWeightFrac;
  const requiredScore = (adjustedTarget - currentContribution) / finalWeightFrac;

  // Status gauge
  let statusBadge = {
    label: "Chill (Easy Target)",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    ringColor: "text-emerald-500",
    message: "You are in great shape. Minimal review hours needed to secure this grade.",
    icon: Coffee,
  };

  if (requiredScore > 100) {
    statusBadge = {
      label: "Hail Mary (Extra Credit Needed)",
      color: "bg-rose-50 text-rose-800 border-rose-200",
      ringColor: "text-rose-500",
      message: "Mathematically impossible with standard exam points alone. Ask your professor about extra credit or course curves.",
      icon: AlertTriangle,
    };
  } else if (requiredScore > 89) {
    statusBadge = {
      label: "Heavy Prep (High Effort)",
      color: "bg-amber-50 text-amber-800 border-amber-200",
      ringColor: "text-amber-500",
      message: "Challenging but entirely attainable. Dedicate 3-4 structured study blocks.",
      icon: Flame,
    };
  } else if (requiredScore > 74) {
    statusBadge = {
      label: "Realistic Effort",
      color: "bg-violet-50 text-violet-800 border-violet-200",
      ringColor: "text-violet-500",
      message: "Very realistic with standard revision. Review past exams and homework keys.",
      icon: TrendingUp,
    };
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-sm">
          <GraduationCap className="w-3.5 h-3.5 text-violet-600" />
          <span>The Panic vs. Chill Simulator • 100% In-Browser</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Final Exam Target Grade Calculator
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Find out the exact minimum percentage you need on your final exam to pass or secure an A. Zero tracking and instant results at <strong className="text-slate-800">multipdfdoc.com</strong>.
        </p>
      </div>

      {/* Main Interactive Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-display font-bold text-base text-slate-900">Course Parameters</h2>
            <span className="text-xs font-mono font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200">
              WEIGHTED ALGORITHM
            </span>
          </div>

          {/* Current Grade */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>Current Class Grade</span>
              </label>
              <div className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                {currentGrade}%
              </div>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={currentGrade}
              onChange={(e) => setCurrentGrade(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>30% (Failing)</span>
              <span>75% (C)</span>
              <span>100% (A+)</span>
            </div>
          </div>

          {/* Target Grade */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800">
                Desired Target Grade (What you want)
              </label>
              <div className="font-mono font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
                {targetGrade}%
              </div>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={targetGrade}
              onChange={(e) => setTargetGrade(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>70% (C - Pass)</span>
              <span>80% (B)</span>
              <span>90% (A)</span>
              <span>93% (A)</span>
            </div>
          </div>

          {/* Final Exam Weight */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800">
                Weight of Final Exam in Syllabus (%)
              </label>
              <div className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                {finalWeight}%
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={finalWeight}
              onChange={(e) => setFinalWeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (Quiz Weight)</span>
              <span>25% (Standard Mid-term)</span>
              <span>50% (Comprehensive)</span>
            </div>
          </div>

          {/* Advanced Curve Slider */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Course Curve / Extra Credit Buffer:</span>
              <span className="font-mono font-bold text-emerald-700">+{curveBuffer}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={curveBuffer}
              onChange={(e) => setCurveBuffer(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-[11px] text-slate-500">
              If your professor applies a bell-curve or offers extra credit, slide to see your required score drop!
            </p>
          </div>
        </div>

        {/* Right Output: The Hero Scorecard (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6 text-center">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              Required Final Exam Score
            </span>

            {/* Giant Score Gauge */}
            <div className="py-2">
              <div className="text-5xl sm:text-6xl font-display font-extrabold text-slate-900 tracking-tight">
                {requiredScore <= 0 ? "0.0%" : `${requiredScore.toFixed(1)}%`}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                {requiredScore <= 0
                  ? "You already locked in this grade regardless of the final!"
                  : `Needed out of 100 on the final test`}
              </p>
            </div>

            {/* Status Badge */}
            <div className={`p-4 rounded-2xl border text-left space-y-1.5 ${statusBadge.color}`}>
              <div className="flex items-center gap-2 font-bold text-xs">
                <statusBadge.icon className="w-4 h-4 flex-shrink-0" />
                <span>{statusBadge.label}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {statusBadge.message}
              </p>
            </div>

            {/* Mathematical Breakdown Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left font-mono text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Existing Points Banked:</span>
                <span className="font-bold text-slate-800">{currentContribution.toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between">
                <span>Target Points Needed:</span>
                <span className="font-bold text-violet-700">{adjustedTarget.toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1 text-slate-900 font-bold">
                <span>Final Exam Margin:</span>
                <span>{finalWeight}% of total</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Calculated 100% locally in your browser</span>
            </div>
          </div>

          <AdPlaceholder slot="sidebar-ad" format="rectangle" />
        </div>
      </div>

      {/* AdSense Value Wrapper Layer */}
      <ValueWrapper
        toolName="Final Exam Target Grade Calculator"
        title="Understanding Weighted Grading Systems: Mathematical Principles & Syllabus Survival Strategies"
        subtitle="How university and high school professors calculate weighted averages, curves, and final exam thresholds."
        sections={[
          {
            heading: "1. The Mathematics of Course Weighting: Why Simple Averages Fail",
            content: `Most students mistakenly calculate their class standing by adding up raw scores and dividing by the number of assignments. However, over 90% of US colleges and high schools utilize weighted grading categories governed by the standard weighted average formula.

In a weighted course syllabus, individual grade categories (such as Homework 15%, Quizzes 20%, Midterms 25%, and Final Exam 40%) carry vastly disparate mathematical power:
• Low-Weight Dampening: Scoring a zero on a homework assignment weighted at 1% damages your final course grade by only 0.15 grade points.
• High-Weight Volatility: In contrast, a 15-point swing on a 40% final exam will alter your course standing by 6 full percentage points—often the difference between an A- and a C+.`
          },
          {
            heading: "2. Strategic Study Allocation: The 'Cram vs. Chill' Curve",
            content: `When exam week arrives, hours are scarce. Use your calculated target score to triage study priority:
• Scores below 70%: Review lecture slides once; your banked points already guarantee course completion. Redirect study hours toward harder classes.
• Scores between 70% and 85%: Focus on high-frequency midterm concepts and practice problem sets.
• Scores above 90%: Schedule immediate office hours with your teaching assistant (TA). Request past exams and ask whether syllabus curving will lower the required threshold.`
          },
          {
            heading: "3. How Course Curves Alter Your Target Score",
            content: `Many STEM courses (such as Calculus, Chemistry, and Organic Chemistry) employ bell-curve grading where grades are normalized against class standard deviations.

If historical department data indicates an average 5% curve, input '5' into our Course Curve Buffer above to visualize your reduced final test score target.`
          }
        ]}
        formula={{
          title: "Weighted Final Exam Requirement Formula",
          formula: "Score_Required = (Target - (Current * (1 - W_final))) / W_final",
          explanation: "Where Target represents your desired course percentage, Current represents your existing banked grade, and W_final represents the syllabus weight of the final exam."
        }}
        faqs={[
          {
            question: "What happens if the calculator says I need more than 100%?",
            answer: "If your required score exceeds 100%, it means that even a perfect score on the final exam will not mathematically reach your target grade without additional extra credit points or a professor's curve."
          },
          {
            question: "Can I use this for high school and college classes?",
            answer: "Yes. The algorithm works for any course that uses percentage-weighted categories, regardless of whether you are in high school, undergraduate, or graduate school."
          },
          {
            question: "Is this calculator completely private?",
            answer: "Yes. MultiPDF Doc executes all mathematical operations in your browser. No grade history or school names are ever transmitted to any external server."
          }
        ]}
      />
    </div>
  );
}
