import { ArticleGuide, articleMetadata } from "@/components/seo/ArticleGuide";
import { gpaArticle } from "@/content/articles";

export const metadata = articleMetadata(gpaArticle, "weighted-vs-unweighted-gpa-college-admissions");
export default function Page() { return <ArticleGuide article={gpaArticle} slug="weighted-vs-unweighted-gpa-college-admissions" />; }
