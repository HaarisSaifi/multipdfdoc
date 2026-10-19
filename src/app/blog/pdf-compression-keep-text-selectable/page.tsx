import { ArticleGuide, articleMetadata } from "@/components/seo/ArticleGuide";
import { selectableCompressionGuide } from "@/content/workflow-guides";
export const metadata = articleMetadata(selectableCompressionGuide, "pdf-compression-keep-text-selectable");
export default function Page() { return <ArticleGuide article={selectableCompressionGuide} slug="pdf-compression-keep-text-selectable" />; }
