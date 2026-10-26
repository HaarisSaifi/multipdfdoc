export const dynamic = "force-static";

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://multipdfdoc.com";
  // Verified stable release date for content freshness auditing
  const stableDate = new Date("2026-10-07T00:00:00.000Z");

  return [
    // 1. Homepage Launchpad
    {
      url: baseUrl,
      lastModified: stableDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // 2. High-Priority PDF Utilities
    {
      url: `${baseUrl}/pdf/compress`,
      lastModified: stableDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf/merge`,
      lastModified: stableDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pdf/to-text`,
      lastModified: stableDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/invoice`,
      lastModified: stableDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/receipt`,
      lastModified: stableDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },

    // 3. Core Document Tools
    {
      url: `${baseUrl}/pdf/split`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pdf/to-image`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pdf/from-image`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pdf/organize`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pdf/protect`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pdf/unlock`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pdf/page-numbers`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // 4. Academic & Long-Tail Calculators
    {
      url: `${baseUrl}/calc/final-grade`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calc/gpa`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calc/words-to-pages`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // 5. Editorial Blog Hub & Guides
    {
      url: `${baseUrl}/blog`,
      lastModified: stableDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/compress-pdf-200kb-uscis-passport-guide`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog/freelance-invoice-payment-terms-guide`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog/weighted-vs-unweighted-gpa-college-admissions`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog/zero-knowledge-pdf-privacy-cloud-converter-risks`,
      lastModified: stableDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },

    { url: `${baseUrl}/blog/pdf-page-numbers-skip-cover`, lastModified: new Date("2026-10-11T00:00:00.000Z"), changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/blog/extract-text-mixed-scanned-pdf`, lastModified: new Date("2026-10-11T00:00:00.000Z"), changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/blog/pdf-compression-keep-text-selectable`, lastModified: new Date("2026-10-11T00:00:00.000Z"), changeFrequency: "monthly", priority: 0.75 },

    // 6. E-E-A-T, Leadership & Author Entity
    {
      url: `${baseUrl}/author/haaris-saifi`,
      lastModified: new Date("2026-10-26T00:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: stableDate,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified: stableDate,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: stableDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: stableDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: stableDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
