import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organize, Rotate & Delete PDF Pages (Visual 3D Editor)",
  description: "Rotate individual PDF pages 90° or 180°, reorder thumbnails, and delete unwanted pages with zero server transmission at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/organize",
  },
  openGraph: {
    title: "Organize, Rotate & Delete PDF Pages | MultiPDF Doc",
    description: "Visual card reordering, page rotation, and single-click deletion in your browser memory.",
    url: "https://multipdfdoc.com/pdf/organize",
  },
};

export default function OrganizePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
