import { ArticleGuide, articleMetadata } from "@/components/seo/ArticleGuide";
import { compressionArticle } from "@/content/articles";

export const metadata = articleMetadata(compressionArticle, "compress-pdf-200kb-uscis-passport-guide");
export default function Page() { return <ArticleGuide article={compressionArticle} slug="compress-pdf-200kb-uscis-passport-guide" />; }
