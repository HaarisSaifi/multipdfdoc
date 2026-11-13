import { ToolBreadcrumb } from "@/components/seo/ToolBreadcrumb";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Weighted, Unweighted & Preliminary GPA Calculator (AP, IB, Honors)" },
  description: "Free GPA calculator: convert weighted to unweighted GPA with AP/IB (+1.0) and Honors (+0.5), or find your preliminary GPA from completed semesters only. No signup, runs locally.",
  alternates: {
    canonical: "https://multipdfdoc.com/calc/gpa",
  },
  openGraph: {
    title: "Weighted, Unweighted & Preliminary GPA Calculator (AP, IB, Honors)",
    description: "Free GPA calculator: convert weighted to unweighted GPA with AP/IB (+1.0) and Honors (+0.5), or find your preliminary GPA from completed semesters only. No signup, runs locally.",
    url: "https://multipdfdoc.com/calc/gpa",
  },
};

export default function GpaLayout({ children }: { children: React.ReactNode }) {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Weighted, Unweighted and Preliminary GPA",
    "description": "Step-by-step method to compute high school cumulative GPA on a 4.0 and 5.0 scale, including 6th and 7th semester preliminary GPA for college applications.",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Course Names and Credit Values",
        "text": "List high school or college courses along with their assigned semester credits (usually 0.5 or 1.0 credit per term)."
      },
      {
        "@type": "HowToStep",
        "name": "Assign Letter Grades and Course Rigor Levels",
        "text": "Select your letter grade (A through F) and designate whether the course is Regular (4.0 max), Honors (+0.5 weight), or AP / IB / Dual Enrollment (+1.0 weight)."
      },
      {
        "@type": "HowToStep",
        "name": "Toggle Preliminary GPA Mode for Early College Admissions",
        "text": "For 6th or 7th semester college application deadlines, toggle Preliminary GPA mode and mark senior spring courses as 'In Progress' to calculate your interim GPA from completed terms only."
      },
      {
        "@type": "HowToStep",
        "name": "Review Dual Unweighted and Weighted Results",
        "text": "View real-time dual score rings displaying your exact unweighted GPA (out of 4.00) and weighted GPA (out of 5.00) with zero server uploads."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <ToolBreadcrumb name="GPA calculator" href="/calc/gpa" />
      {children}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <ValueWrapper
          sources={toolSources["calc/gpa"]}
        toolName="Weighted, Unweighted & Preliminary GPA Calculator"
        title="GPA Calculation Guide: High School GPA Scaling & College Admissions Conversion"
        subtitle="How the Common Application, UC admissions, and state universities interpret weighted vs unweighted GPA."
        sections={[{"heading":"How to calculate a preliminary GPA with this tool","content":"A preliminary GPA is your cumulative GPA through the last completed term, calculated before graduation. Many schools report it after six semesters (end of junior year) or seven semesters (end of senior fall). To reproduce it, switch on Preliminary GPA mode, enter every course from your transcript and set current classes to In progress. The large score cards then count completed courses only, which matches how a mid-year transcript treats courses that have no final grade yet.\n\nIn-progress rows still matter for planning. Give each one the grade you expect, and the amber Projected panel shows where your cumulative GPA would land once those courses are graded, along with the change from your preliminary figure. For example, 99 unweighted quality points over 27 completed credits is a 3.67 preliminary GPA; adding five in-progress credits worth 18 points projects to 117 / 32 = 3.66. The projection is arithmetic, not a prediction: a college compares your final transcript with the preliminary figure it admitted you on."},
{"heading":"Calculate from course-level information","content":"An unweighted GPA is the credit-weighted mean of grade points under a particular grade scale. This calculator uses the displayed plus/minus mapping, where A and A+ are 4.0, A- is 3.7 and B+ is 3.3. Your school may use a different mapping or exclude some courses. Enter each eligible course and its credits from the transcript rather than trying to subtract a fixed number from an overall weighted GPA. The overall weighted number alone cannot reveal the original course mix."},
{"heading":"Keep local estimates separate from institution rules","content":"The optional weights here add 0.5 for Honors and 1.0 for AP, IB or dual-enrollment selections when the grade is not failing. Those are this calculator’s assumptions, not universal school rules. Colleges can define their own eligible subjects, year ranges and weighting caps. University of California GPA instructions, for example, need to be followed in their own context. A general calculator cannot predict admission or assign reliable college cutoffs. Use the result to check arithmetic and understand scenarios, then consult the actual application instructions."}, ...supplements["calc/gpa"]]}
        formula={{
          title: "Grade Point Average Formula",
          formula: "GPA = Σ(Course_Credits * Grade_Points) / Σ(Course_Credits)",
          explanation: "The credit-weighted mean using the displayed grade-point assumptions. School policies can differ."
        }}
        faqs={[
          {
            question: "Is a cumulative GPA weighted or unweighted?",
            answer: "A cumulative GPA can be either weighted or unweighted depending on your school district. An unweighted cumulative GPA measures grade performance strictly on a 4.0 scale across all terms, while a weighted cumulative GPA includes additional quality points (up to 5.0) for AP, IB, and Honors coursework."
          },
          {
            question: "How do I calculate my preliminary GPA?",
            answer: "Turn on Preliminary GPA mode, enter all transcript courses with their credits, and mark current classes as In progress. The calculator averages completed courses only, weighted by credits, which is how most schools compute a 6th- or 7th-semester preliminary GPA."
          },
          {
            question: "What is the meaning of a preliminary GPA?",
            answer: "A preliminary GPA is an interim cumulative GPA calculated before graduation, usually after the 6th semester (junior year) or 7th semester (senior fall). Colleges see it on transcripts sent with applications and later confirm it against the final transcript."
          },
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
      /></div></>
  );
}
