import { ArticleGuide, articleMetadata } from "@/components/seo/ArticleGuide";
import { signatureArticle } from "@/content/articles";

export const metadata = articleMetadata(signatureArticle, "signature-photo-resize-100kb-50kb-exam-portals");
export default function Page() {
  return <ArticleGuide article={signatureArticle} slug="signature-photo-resize-100kb-50kb-exam-portals" />;
}

