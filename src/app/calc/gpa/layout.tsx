import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weighted and Unweighted GPA Calculator (4.0 Scale)",
  description: "Convert high school AP, IB, and Honors courses to standard unweighted 4.0 GPA scale. Estimate credit-weighted GPA using the displayed grade scale; confirm your school’s rules.",
  alternates: {
    canonical: "https://multipdfdoc.com/calc/gpa",
  },
  openGraph: {
    title: "Weighted to Unweighted GPA Converter | MultiPDF Doc",
    description: "Convert weighted grades to standard 4.0 scale with optional AP/IB honors boosts and clearly stated assumptions.",
    url: "https://multipdfdoc.com/calc/gpa",
  },
};

export default function GpaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["calc/gpa"]}
        toolName="Weighted to Unweighted GPA Converter"
        title="GPA Calculation Guide: High School GPA Scaling & College Admissions Conversion"
        subtitle="How the Common Application, UC admissions, and state universities interpret weighted vs unweighted GPA."
        sections={[{"heading":"Calculate from course-level information","content":"An unweighted GPA is the credit-weighted mean of grade points under a particular grade scale. This calculator uses the displayed plus/minus mapping, where A and A+ are 4.0, A- is 3.7 and B+ is 3.3. Your school may use a different mapping or exclude some courses. Enter each eligible course and its credits from the transcript rather than trying to subtract a fixed number from an overall weighted GPA. The overall weighted number alone cannot reveal the original course mix."},
{"heading":"Keep local estimates separate from institution rules","content":"The optional weights here add 0.5 for Honors and 1.0 for AP, IB or dual-enrollment selections when the grade is not failing. Those are this calculator’s assumptions, not universal school rules. Colleges can define their own eligible subjects, year ranges and weighting caps. University of California GPA instructions, for example, need to be followed in their own context. A general calculator cannot predict admission or assign reliable college cutoffs. Use the result to check arithmetic and understand scenarios, then consult the actual application instructions."}, ...supplements["calc/gpa"]]}
        formula={{
          title: "Grade Point Average Formula",
          formula: "GPA = Σ(Course_Credits * Grade_Points) / Σ(Course_Credits)",
          explanation: "The credit-weighted mean using the displayed grade-point assumptions. School policies can differ."
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
            answer: "No. MultiPDF Doc processes all grade inputs locally in your browser with zero server data collection or transmission."
          }
        ]}
      /></div></>;
}
