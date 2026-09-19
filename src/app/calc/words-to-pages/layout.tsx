import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Words to Pages Calculator (Times, Arial, Calibri) & Speech Timer",
  description: "Convert word counts to printed pages for single and double spaced formats. Calculate presentation speech delivery time at 110-150 wpm on multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/calc/words-to-pages",
  },
  openGraph: {
    title: "Words to Pages Calculator & Speech Presentation Timer | MultiPDF Doc",
    description: "Convert word counts to printed pages for MLA/APA standards and estimate speech presentation time.",
    url: "https://multipdfdoc.com/calc/words-to-pages",
  },
};

export default function WordsToPagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
