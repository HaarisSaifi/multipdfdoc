import { ArticleGuide, articleMetadata } from "@/components/seo/ArticleGuide";
import { privacyArticle } from "@/content/articles";

export const metadata = articleMetadata(privacyArticle, "zero-knowledge-pdf-privacy-cloud-converter-risks");
export default function Page() { return <ArticleGuide article={privacyArticle} slug="zero-knowledge-pdf-privacy-cloud-converter-risks" />; }
