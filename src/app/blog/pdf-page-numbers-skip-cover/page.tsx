import { ArticleGuide, articleMetadata } from "@/components/seo/ArticleGuide";
import { numberingGuide } from "@/content/workflow-guides";
export const metadata = articleMetadata(numberingGuide, "pdf-page-numbers-skip-cover");
export default function Page() { return <ArticleGuide article={numberingGuide} slug="pdf-page-numbers-skip-cover" />; }
