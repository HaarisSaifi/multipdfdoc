import { ArticleGuide, articleMetadata } from "@/components/seo/ArticleGuide";
import { mixedOcrGuide } from "@/content/workflow-guides";
export const metadata = articleMetadata(mixedOcrGuide, "extract-text-mixed-scanned-pdf");
export default function Page() { return <ArticleGuide article={mixedOcrGuide} slug="extract-text-mixed-scanned-pdf" />; }
