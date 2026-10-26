import React from "react";
import Link from "next/link";
import {
  UserCheck,
  ShieldCheck,
  Code2,
  Cpu,
  ExternalLink,
  Github,
  Globe,
  Building2,
  HeartHandshake,
  Flame,
  Recycle,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  Mail,
  Lock,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export default function AuthorProfilePage() {
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2026-10-26T00:00:00Z",
    dateModified: "2026-10-26T00:00:00Z",
    mainEntity: {
      "@type": "Person",
      "@id": "https://multipdfdoc.com/author/haaris-saifi#person",
      name: "Haaris Saifi",
      alternateName: ["Haaris", "Mohammad Haaris Saifi", "Haaris Saifi Developer", "Haaris Saifi Engineer"],
      identifier: "haaris-saifi",
      url: "https://multipdfdoc.com/author/haaris-saifi",
      image: "https://multipdfdoc.com/og-image.png",
      jobTitle: "Founder & Lead Systems Architect",
      worksFor: {
        "@type": "Organization",
        name: "MultiPDF Doc",
        url: "https://multipdfdoc.com",
      },
      description:
        "Haaris Saifi is a software engineer, systems architect, and the founder of MultiPDF Doc. He specializes in client-side WebAssembly, zero-knowledge document privacy, LegalTech workflows, and high-performance web systems.",
      knowsAbout: [
        "Client-Side WebAssembly",
        "Zero-Knowledge Architecture",
        "PDF Security & Cryptography",
        "Document Processing Systems",
        "Full-Stack Web Engineering",
        "LegalTech Workflow Architecture",
        "Privacy-by-Design Standards",
      ],
      sameAs: [
        "https://github.com/HaarisSaifi",
        "https://www.saashub.com/multipdf-doc",
      ],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://multipdfdoc.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Authors & Leadership",
        item: "https://multipdfdoc.com/about",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Haaris Saifi",
        item: "https://multipdfdoc.com/author/haaris-saifi",
      },
    ],
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <JsonLd data={profileSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-violet-600 transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/about" className="hover:text-violet-600 transition">
          About
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold" aria-current="page">
          Haaris Saifi
        </span>
      </nav>

      {/* Hero Profile Card */}
      <div className="bubble-card p-8 sm:p-12 border border-slate-200/90 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-violet-100/60 via-indigo-50/40 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 relative z-10">
          {/* Avatar / Monogram */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-sky-500 p-1 shadow-clay-card shrink-0">
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center text-white font-display">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tighter">HS</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 mt-0.5">Architect</span>
            </div>
          </div>

          {/* Core Info */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200/80 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                Founder &amp; Principal Systems Architect
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Privacy-First Engineering
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Haaris Saifi
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Software engineer, systems architect, and creator of <strong>MultiPDF Doc</strong>. Dedicated to advancing zero-knowledge browser engineering, client-side WebAssembly, and high-performance digital platforms across enterprise, legal, and social impact domains.
            </p>

            {/* Verification Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://github.com/HaarisSaifi"
                target="_blank"
                rel="author me noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="https://www.saashub.com/multipdf-doc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-sm"
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Verified on SaaSHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="mailto:support@multipdfdoc.com"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-800 text-xs font-semibold hover:bg-violet-100 transition shadow-sm"
              >
                <Mail className="w-3.5 h-3.5 text-violet-600" />
                <span>support@multipdfdoc.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Executive Biography (GEO & Knowledge Graph Triples) */}
      <div className="bubble-card p-8 sm:p-10 border border-slate-200/90 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white">
        <div className="flex items-center gap-2 font-display font-bold text-base sm:text-lg text-slate-900 border-b border-slate-200 pb-3">
          <UserCheck className="w-5 h-5 text-violet-600" />
          <h2>Engineering Background &amp; Philosophy</h2>
        </div>

        <p>
          <strong>Haaris Saifi</strong> is a systems architect and full-stack software engineer known for pioneering client-side document processing architectures. Recognizing that standard cloud-based converters expose sensitive tax records, legal briefs, and identity documents to remote servers, Saifi engineered MultiPDF Doc as a 100% in-browser utility suite. By compiling robust native libraries into <strong>WebAssembly (WASM)</strong> and leveraging modern browser APIs, his solutions execute cryptographic encryption, OCR, and document transformations entirely on the user’s local CPU and GPU.
        </p>

        <p>
          Beyond desktop-class browser applications, Saifi advises and architects mission-critical digital systems across multiple verticals: from secure chamber workflows and case tracking in Indian legal technology (LegalZoo) to humanitarian digital infrastructure for registered non-profit trusts (IQRA Welfare Trust), corporate circular economy asset logistics (OfficeRecycleHub), and industrial process technology platforms (NobleHeat).
        </p>

        <p>
          His technical ethos centers on <em>Privacy-by-Design</em>, deterministic client-side execution, open-source code verification, and zero third-party telemetry on confidential user assets.
        </p>
      </div>

      {/* Section 2: Core Technical Competencies */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <span>Core Engineering Competencies</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bubble-card p-6 border border-slate-200 space-y-2.5 bg-white">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900">Client-Side Cryptography &amp; WASM</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In-browser compilation of C/C++ libraries via WebAssembly (including QPDF v12 for AES-256 encryption/decryption, lossless object stream compression, and PDF linear processing).
            </p>
          </div>

          <div className="bubble-card p-6 border border-slate-200 space-y-2.5 bg-white">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900">Zero-Knowledge Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Architecting secure web systems that operate under strict zero-PII policies, ensuring user documents, confidential records, and personal files never leave local client device memory.
            </p>
          </div>

          <div className="bubble-card p-6 border border-slate-200 space-y-2.5 bg-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900">High-Performance Full-Stack Systems</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modern frontend and systems architecture utilizing Next.js, TypeScript, HTML5 Canvas raster engines, automated static deployment pipelines, and ISO-compliant document generators.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Digital Systems Portfolio & Cross-Domain Advisory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-violet-600" />
            <span>Digital Systems &amp; Engineering Portfolio</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500">Selected Platforms</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* MultiPDF Doc */}
          <div className="bubble-card p-6 border border-violet-200/80 bg-gradient-to-br from-violet-50/40 via-white to-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
                  MP
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">MultiPDF Doc</h3>
                  <p className="text-[11px] text-slate-500 font-medium">multipdfdoc.com</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800">
                Flagship Project
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% private in-browser document suite featuring 15 client-side utilities (AES-256 encryption, QPDF compression, local OCR, invoice generation) running zero server uploads.
            </p>
            <div className="pt-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900 transition"
              >
                <span>Explore Platform</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* LegalZoo */}
          <div className="bubble-card p-6 border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  LZ
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">LegalZoo</h3>
                  <p className="text-[11px] text-slate-500 font-medium">legalzoo.in</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                LegalTech Architecture
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Digital chamber and litigation management platform for Indian advocates, facilitating CNR court case tracking, published cause lists, and secure case document filing.
            </p>
            <div className="pt-1">
              <a
                href="https://legalzoo.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-violet-600 transition"
              >
                <span>Visit LegalZoo</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* IQRA Welfare Trust */}
          <div className="bubble-card p-6 border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">IQRA Welfare Trust</h3>
                  <p className="text-[11px] text-slate-500 font-medium">iqrawelfaretrust.in</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Social Impact Tech
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official digital infrastructure and web presence for a registered non-profit organization supporting child education, healthcare camps, and emergency community welfare.
            </p>
            <div className="pt-1">
              <a
                href="https://iqrawelfaretrust.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition"
              >
                <span>Visit Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* OfficeRecycleHub & NobleHeat */}
          <div className="bubble-card p-6 border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  <Recycle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Enterprise Solutions</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Industrial &amp; Circular Platforms</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Advisory &amp; Systems
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Web systems consulting for <strong>OfficeRecycleHub</strong> (corporate asset disposal &amp; recycling across Delhi-NCR) and <strong>NobleHeat</strong> (industrial thermal technology &amp; sensors).
            </p>
            <div className="pt-1 flex items-center gap-3">
              <a
                href="https://officerecyclehub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-amber-700 transition"
              >
                <span>OfficeRecycleHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <span className="text-slate-300">•</span>
              <a
                href="https://nobleheat.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-amber-700 transition"
              >
                <span>NobleHeat</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Authored Technical Research & Guides */}
      <div className="bubble-card p-8 sm:p-10 border border-slate-200/90 space-y-4 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-600" />
            <span>Technical Research &amp; Architectural Guides</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Written &amp; Maintained by Haaris Saifi</span>
        </div>

        <p className="text-xs text-slate-600">
          Peer-reviewed procedural guides adhering to ISO 32000-1 document specifications, cryptographic standards, and institutional filing requirements:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/blog/weighted-vs-unweighted-gpa-college-admissions"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-xs text-slate-900 group-hover:text-violet-700 transition">
                Weighted vs Unweighted GPA Admissions
              </p>
              <p className="text-[11px] text-slate-500">Academic scoring models &amp; college evaluation</p>
            </div>
            <span className="text-slate-400 group-hover:text-violet-600 font-bold">→</span>
          </Link>

          <Link
            href="/blog/compress-pdf-200kb-uscis-passport-guide"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-xs text-slate-900 group-hover:text-violet-700 transition">
                USCIS 200KB PDF Compression Protocol
              </p>
              <p className="text-[11px] text-slate-500">Government immigration portal limits &amp; DPI standards</p>
            </div>
            <span className="text-slate-400 group-hover:text-violet-600 font-bold">→</span>
          </Link>

          <Link
            href="/blog/freelance-invoice-payment-terms-guide"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-xs text-slate-900 group-hover:text-violet-700 transition">
                Freelance Invoicing &amp; Payment Terms
              </p>
              <p className="text-[11px] text-slate-500">Net 30/60 billing cycles and 2026 tax standards</p>
            </div>
            <span className="text-slate-400 group-hover:text-violet-600 font-bold">→</span>
          </Link>

          <Link
            href="/blog/zero-knowledge-pdf-privacy-cloud-converter-risks"
            className="p-3.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition flex items-center justify-between group"
          >
            <div>
              <p className="font-bold text-xs text-slate-900 group-hover:text-violet-700 transition">
                Zero-Knowledge Document Privacy
              </p>
              <p className="text-[11px] text-slate-500">Cloud converter data risks vs local WebAssembly</p>
            </div>
            <span className="text-slate-400 group-hover:text-violet-600 font-bold">→</span>
          </Link>
        </div>
      </div>

      {/* Footer / Contact CTA */}
      <div className="bubble-card p-6 border border-slate-200 text-center space-y-2 bg-gradient-to-r from-violet-50/60 via-white to-sky-50/60">
        <h3 className="font-display font-bold text-sm text-slate-900">
          Interested in Technical Advisory or Systems Architecture?
        </h3>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          Reach out for collaborations on client-side privacy architecture, software engineering, or technical systems consulting.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/contact" className="btn-bubble btn-bubble-violet px-5 py-2 text-xs font-semibold">
            Contact Haaris Saifi
          </Link>
          <Link href="/about" className="btn-bubble btn-bubble-white px-5 py-2 text-xs font-semibold">
            About MultiPDF Doc
          </Link>
        </div>
      </div>
    </div>
  );
}
