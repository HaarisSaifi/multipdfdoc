import { ArticleGuide, articleMetadata } from "@/components/seo/ArticleGuide";
import { invoiceArticle } from "@/content/articles";

export const metadata = articleMetadata(invoiceArticle, "freelance-invoice-payment-terms-guide");
export default function Page() { return <ArticleGuide article={invoiceArticle} slug="freelance-invoice-payment-terms-guide" />; }
