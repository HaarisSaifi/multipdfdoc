"use client";

import { useDownloadUrl } from "@/lib/use-download-url";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FolderOpen,
  UploadCloud,
  FileText,
  FileImage,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Trash2,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Plus,
  Gauge,
  Lock,
} from "lucide-react";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

type Kind = "pdf" | "image";
const SECTION_LABELS = ["Resume / Activities", "Essay or Writing Sample", "Transcript Copy", "Recommendation Copy", "Certificate / Award", "Portfolio", "Other"] as const;

interface BinderItem {
  id: string;
  file: File;
  kind: Kind;
  section: string;
  pageCount: number | null;
  loading: boolean;
}

const LIMIT_PRESETS = [
  { id: "1.9", label: "1.9 MB", bytes: 1.9 * 1024 * 1024, hint: "Common App school-document cap" },
  { id: "2", label: "2 MB", bytes: 2 * 1024 * 1024, hint: "Typical scholarship portal" },
  { id: "5", label: "5 MB", bytes: 5 * 1024 * 1024, hint: "Many graduate portals" },
  { id: "10", label: "10 MB", bytes: 10 * 1024 * 1024, hint: "Large upload fields" },
] as const;

const LETTER: [number, number] = [612, 792];
const MAX_IMAGE_EDGE = 1700;

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

/** Standard PDF fonts only encode WinAnsi; replace anything else so a name never breaks the export. */
function pdfSafe(text: string) {
  return text.replace(/[^\x20-\x7E -ÿ]/g, "?").slice(0, 90);
}

function sanitizeFileName(name: string) {
  const base = name.trim().replace(/\.pdf$/i, "").replace(/[^a-zA-Z0-9 _.-]/g, "").replace(/\s+/g, "_").slice(0, 80);
  return (base || "application_packet") + ".pdf";
}

function guessSection(name: string) {
  const n = name.toLowerCase();
  if (/(resume|cv|activit)/.test(n)) return SECTION_LABELS[0];
  if (/(essay|statement|writing|supplement)/.test(n)) return SECTION_LABELS[1];
  if (/(transcript|grade|report.?card)/.test(n)) return SECTION_LABELS[2];
  if (/(recommend|lor|reference)/.test(n)) return SECTION_LABELS[3];
  if (/(certif|award|diploma)/.test(n)) return SECTION_LABELS[4];
  if (/(portfolio|art|project)/.test(n)) return SECTION_LABELS[5];
  return SECTION_LABELS[6];
}

async function loadBitmap(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Re-encode a photo/scan through canvas: flattens transparency onto white and caps the long edge. */
async function imageToJpegBytes(file: File, optimize: boolean, quality: number) {
  const img = await loadBitmap(file);
  const scale = optimize ? Math.min(1, MAX_IMAGE_EDGE / Math.max(img.naturalWidth, img.naturalHeight)) : 1;
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable in this browser.");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  canvas.width = 0;
  canvas.height = 0;
  if (!blob) throw new Error("This image could not be encoded.");
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width: w, height: h };
}

export default function ApplicationBinderPage() {
  const [items, setItems] = useState<BinderItem[]>([]);
  const [building, setBuilding] = useState(false);
  const [downloadUrl, setDownloadUrl] = useDownloadUrl();
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [outputPages, setOutputPages] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [limitId, setLimitId] = useState<string>("1.9");
  const [customMb, setCustomMb] = useState("3");
  const [addContents, setAddContents] = useState(true);
  const [numberPages, setNumberPages] = useState(false);
  const [skippedRotated, setSkippedRotated] = useState(0);
  const [applicantName, setApplicantName] = useState("");
  const [optimizeImages, setOptimizeImages] = useState(true);
  const [imageQuality, setImageQuality] = useState(0.8);
  const [fileName, setFileName] = useState("application_packet");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const runId = useRef(0);

  useEffect(() => () => { runId.current++; }, []);

  const limitBytes = useMemo(() => {
    if (limitId === "custom") {
      const mb = parseFloat(customMb);
      return Number.isFinite(mb) && mb > 0 ? mb * 1024 * 1024 : 0;
    }
    return LIMIT_PRESETS.find((p) => p.id === limitId)?.bytes ?? 0;
  }, [limitId, customMb]);

  const invalidate = () => {
    setDownloadUrl(null);
    setSkippedRotated(0);
    setOutputSize(null);
    setOutputPages(null);
  };

  const handleFiles = async (list: FileList | null) => {
    if (building || !list || list.length === 0) return;
    setErrorMsg(null);
    invalidate();
    const accepted: BinderItem[] = [];
    const rejected: string[] = [];
    for (const file of Array.from(list)) {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const isImage = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      if (!isPdf && !isImage) { rejected.push(file.name); continue; }
      accepted.push({ id: Math.random().toString(36).slice(2, 10), file, kind: isPdf ? "pdf" : "image", section: guessSection(file.name), pageCount: isPdf ? null : 1, loading: isPdf });
    }
    if (rejected.length) setErrorMsg(`Skipped ${rejected.length} unsupported file${rejected.length > 1 ? "s" : ""} (${rejected.slice(0, 2).join(", ")}${rejected.length > 2 ? "…" : ""}). Use PDF, JPG, PNG or WebP.`);
    if (!accepted.length) return;
    setItems((prev) => [...prev, ...accepted]);

    const { PDFDocument } = await import("pdf-lib");
    for (const item of accepted.filter((a) => a.kind === "pdf")) {
      try {
        const doc = await PDFDocument.load(await item.file.arrayBuffer());
        const count = doc.getPageCount();
        setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, pageCount: count, loading: false } : x)));
      } catch (err) {
        const encrypted = err instanceof Error && /encrypt/i.test(err.message);
        setErrorMsg(encrypted ? `${item.file.name} is password-protected. Unlock it with permission first, then add it again.` : `${item.file.name} could not be read as a PDF and was removed.`);
        setItems((prev) => prev.filter((x) => x.id !== item.id));
      }
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    invalidate();
  };

  const remove = (id: string) => { setItems((prev) => prev.filter((x) => x.id !== id)); invalidate(); };
  const setSection = (id: string, section: string) => { setItems((prev) => prev.map((x) => (x.id === id ? { ...x, section } : x))); invalidate(); };

  const inputBytes = items.reduce((sum, i) => sum + i.file.size, 0);
  const sourcePages = items.reduce((sum, i) => sum + (i.pageCount || 0), 0);
  const stillCounting = items.some((i) => i.loading);

  const build = async () => {
    if (!items.length) { setErrorMsg("Add at least one document to build a packet."); return; }
    if (stillCounting) { setErrorMsg("Wait until every PDF has been read, then try again."); return; }
    if (!limitBytes) { setErrorMsg("Enter a valid upload limit in MB (for example 2 or 4.5)."); return; }
    const token = ++runId.current;
    setBuilding(true);
    setErrorMsg(null);
    invalidate();
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const out = await PDFDocument.create();
      out.setTitle(pdfSafe(applicantName.trim() ? `${applicantName.trim()} - Application Packet` : "Application Packet"));
      out.setProducer("MultiPDF Doc (in-browser)");
      out.setCreator("MultiPDF Doc Application Binder");

      const offset = addContents ? 1 : 0;
      const starts: { label: string; name: string; page: number; count: number }[] = [];
      let cursor = 1 + offset;

      for (const item of items) {
        if (token !== runId.current) return;
        const startPage = cursor;
        if (item.kind === "pdf") {
          const src = await PDFDocument.load(await item.file.arrayBuffer());
          const pages = await out.copyPages(src, src.getPageIndices());
          pages.forEach((p) => out.addPage(p));
          cursor += pages.length;
        } else {
          const { bytes, width, height } = await imageToJpegBytes(item.file, optimizeImages, imageQuality);
          const jpg = await out.embedJpg(bytes);
          const landscape = width > height;
          const [pw, ph] = landscape ? [LETTER[1], LETTER[0]] : LETTER;
          const margin = 36;
          const fit = Math.min((pw - margin * 2) / width, (ph - margin * 2) / height);
          const dw = width * fit, dh = height * fit;
          const page = out.addPage([pw, ph]);
          page.drawImage(jpg, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
          cursor += 1;
        }
        starts.push({ label: item.section, name: item.file.name, page: startPage, count: cursor - startPage });
      }

      if (addContents) {
        const font = await out.embedFont(StandardFonts.Helvetica);
        const bold = await out.embedFont(StandardFonts.HelveticaBold);
        const page = out.insertPage(0, LETTER);
        let y = 720;
        page.drawText("Application Packet", { x: 60, y, size: 22, font: bold, color: rgb(0.06, 0.09, 0.16) });
        y -= 26;
        if (applicantName.trim()) { page.drawText(pdfSafe(applicantName.trim()), { x: 60, y, size: 13, font, color: rgb(0.2, 0.25, 0.33) }); y -= 22; }
        page.drawText("Contents", { x: 60, y: y - 12, size: 13, font: bold, color: rgb(0.49, 0.23, 0.93) });
        y -= 40;
        for (const s of starts) {
          if (y < 80) break;
          const line = pdfSafe(`${s.label} - ${s.name}`);
          const pageLabel = s.count > 1 ? `pp. ${s.page}-${s.page + s.count - 1}` : `p. ${s.page}`;
          page.drawText(line.length > 70 ? line.slice(0, 67) + "..." : line, { x: 60, y, size: 11, font, color: rgb(0.2, 0.25, 0.33) });
          page.drawText(pdfSafe(pageLabel), { x: 470, y, size: 11, font: bold, color: rgb(0.2, 0.25, 0.33) });
          y -= 20;
        }
        if (starts.length > 30) page.drawText("Contents list truncated; see the page order in the packet.", { x: 60, y: 60, size: 9, font, color: rgb(0.4, 0.45, 0.53) });
      }

      if (numberPages) {
        // Physical page numbers, matching the contents list. Rotated source pages are skipped
        // rather than stamped sideways (same rule as the dedicated page-number tool).
        const font = await out.embedFont(StandardFonts.Helvetica);
        const pages = out.getPages();
        const total = pages.length;
        let skipped = 0;
        pages.forEach((page, i) => {
          if (addContents && i === 0) return;
          if (page.getRotation().angle % 360 !== 0) { skipped++; return; }
          const { width } = page.getSize();
          const label = `Page ${i + 1} of ${total}`;
          const size = 9;
          page.drawText(label, { x: (width - font.widthOfTextAtSize(label, size)) / 2, y: 18, size, font, color: rgb(0.39, 0.45, 0.55) });
        });
        if (token === runId.current) setSkippedRotated(skipped);
      }

      const bytes = await out.save({ useObjectStreams: true });
      if (token !== runId.current) return;
      setOutputSize(bytes.byteLength);
      setOutputPages(out.getPageCount());
      setDownloadUrl(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" })));
    } catch (err) {
      setErrorMsg(err instanceof Error && err.message ? `Could not build the packet: ${err.message}` : "Could not build the packet. Remove the most recent file and try again.");
    } finally {
      if (token === runId.current) setBuilding(false);
    }
  };

  const ratio = outputSize && limitBytes ? outputSize / limitBytes : inputBytes && limitBytes ? inputBytes / limitBytes : 0;
  const measured = outputSize !== null;
  const over = ratio > 1;
  const near = ratio > 0.9 && !over;
  const barColor = over ? "bg-rose-500" : near ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"><fieldset disabled={building} className="contents" aria-busy={building}>
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          100% In-Browser • Zero Uploads
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          College Application <span className="text-violet-600">PDF Binder</span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Combine a resume, essay drafts, scanned certificates and photos into one ordered PDF with an optional contents page, then check it against a portal size limit before you upload. Nothing leaves your device.
        </p>
      </div>

      <AdPlaceholder slot="top-leaderboard" format="horizontal" />

      <div className="mt-8 bubble-card p-6 sm:p-10 border border-slate-200/90">
        <div
          onDragOver={(e) => { e.preventDefault(); if (dragIndex === null) setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); if (dragIndex === null) handleFiles(e.dataTransfer.files); }}
          role="button"
          tabIndex={0}
          aria-label="Add application documents"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
          onClick={() => fileInputRef.current?.click()}
          className={`bubble-dropzone p-8 sm:p-12 text-center cursor-pointer transition-all ${dragActive ? "drag-active border-violet-600" : ""}`}
        >
          <input ref={fileInputRef} type="file" multiple accept=".pdf,application/pdf,image/jpeg,image/png,image/webp" onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} className="hidden" aria-label="Choose documents" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-white border border-violet-200 flex items-center justify-center shadow-sm mb-5">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600 animate-bounce" />
          </div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">
            Drop PDFs or photos here, or <span className="text-violet-600 underline">browse</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">PDF, JPG, PNG and WebP. Phone photos of certificates become letter-size pages automatically.</p>
        </div>

        {errorMsg && (
          <div role="alert" className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Upload-limit gauge */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-display font-bold text-slate-900"><Gauge className="w-4 h-4 text-sky-600" /> Portal upload limit</div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Upload limit presets">
              {LIMIT_PRESETS.map((p) => (
                <button key={p.id} type="button" title={p.hint} aria-pressed={limitId === p.id} onClick={() => setLimitId(p.id)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${limitId === p.id ? "bg-sky-600 text-white border-sky-600 shadow-sm" : "bg-white text-sky-700 border-sky-200 hover:bg-sky-50"}`}>{p.label}</button>
              ))}
              <button type="button" aria-pressed={limitId === "custom"} onClick={() => setLimitId("custom")} className={`px-3.5 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${limitId === "custom" ? "bg-sky-600 text-white border-sky-600 shadow-sm" : "bg-white text-sky-700 border-sky-200 hover:bg-sky-50"}`}>Custom</button>
              {limitId === "custom" && (
                <label className="flex items-center gap-2 text-xs text-slate-600 whitespace-nowrap">
                  <input type="number" min="0.1" step="0.1" value={customMb} onChange={(e) => setCustomMb(e.target.value)} className="w-20 rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm" aria-label="Custom limit in MB" /> MB
                </label>
              )}
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-600 mb-1.5">
                <span>{measured ? "Packet size" : "Source total (estimate)"}: <strong className="text-slate-900">{formatSize(measured ? outputSize! : inputBytes)}</strong></span>
                <span>Limit: {limitBytes ? formatSize(limitBytes) : "—"}</span>
              </div>
              <div className="h-3 rounded-full bg-white border border-slate-200 overflow-hidden" role="progressbar" aria-label="Packet size compared with the upload limit" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(Math.min(ratio, 1) * 100)}>
                <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
              </div>
              <p className={`mt-2 text-xs ${over ? "text-rose-700" : near ? "text-amber-700" : "text-slate-500"}`}>
                {!items.length ? "Add documents to see how close you are to the limit." :
                  over ? (measured ? <>Over the limit by {formatSize(outputSize! - limitBytes)}. Lower photo quality below, remove a file, or run the packet through the <a href="/pdf/compress" className="underline font-bold">target-size compressor</a>.</> : "Sources already exceed the limit; build to measure, then reduce photo quality or compress.") :
                  near ? "Within 10% of the limit. Some portals count 1 MB as 1,000,000 bytes, so keep a margin." :
                  measured ? "Under the limit. Open the packet and check every page before uploading." : "Estimate only: build the packet to measure the real size."}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 text-xs text-slate-700">
            <label className="flex items-center gap-2 font-bold whitespace-nowrap"><input type="checkbox" checked={addContents} onChange={(e) => { setAddContents(e.target.checked); invalidate(); }} /> Add a contents page</label>
            <label className="flex items-center gap-2 font-bold whitespace-nowrap"><input type="checkbox" checked={numberPages} onChange={(e) => { setNumberPages(e.target.checked); invalidate(); }} /> Add &ldquo;Page X of Y&rdquo; footers</label>
            <label className="block">
              <span className="font-bold">Name on contents page (optional)</span>
              <input type="text" value={applicantName} onChange={(e) => { setApplicantName(e.target.value); invalidate(); }} placeholder="e.g. Jordan Lee" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <label className="flex items-center gap-2 font-bold whitespace-nowrap"><input type="checkbox" checked={optimizeImages} onChange={(e) => { setOptimizeImages(e.target.checked); invalidate(); }} /> Downscale photos to {MAX_IMAGE_EDGE}px</label>
            <label className="block">
              <span className="font-bold">Photo quality: {Math.round(imageQuality * 100)}%</span>
              <input type="range" min="0.4" max="0.95" step="0.05" value={imageQuality} onChange={(e) => { setImageQuality(parseFloat(e.target.value)); invalidate(); }} className="mt-1 w-full accent-violet-600" aria-label="Photo JPEG quality" />
            </label>
            <label className="block">
              <span className="font-bold">Output file name</span>
              <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono" />
            </label>
          </div>
        </div>

        {items.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 text-xs sm:text-sm">
              <span className="font-bold text-slate-900 flex items-center gap-2 whitespace-nowrap"><FolderOpen className="w-4 h-4 text-violet-600" /> Packet order ({items.length})</span>
              <span className="text-slate-500 font-mono text-xs whitespace-nowrap">{sourcePages} source pages{addContents ? " + 1 contents" : ""}</span>
            </div>
            <p className="text-xs text-slate-500">Drag cards or use the arrows to reorder. The order here is the page order in the packet.</p>
            <ol className="space-y-3">
              {items.map((item, idx) => (
                <li
                  key={item.id}
                  draggable={!building}
                  onDragStart={(e) => { setDragIndex(idx); e.dataTransfer.effectAllowed = "move"; }}
                  onDragOver={(e) => { if (dragIndex !== null) e.preventDefault(); }}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (dragIndex !== null) move(dragIndex, idx); setDragIndex(null); }}
                  onDragEnd={() => setDragIndex(null)}
                  className={`bubble-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-all bg-white ${dragIndex === idx ? "border-violet-400 opacity-60" : "border-slate-200 hover:border-violet-300"}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0 cursor-grab" aria-hidden="true" />
                    <span className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700 flex-shrink-0">{idx + 1}</span>
                    {item.kind === "pdf" ? <FileText className="w-5 h-5 text-violet-600 flex-shrink-0" /> : <FileImage className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[14rem] sm:max-w-sm">{item.file.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono whitespace-nowrap">{formatSize(item.file.size)} • {item.loading ? "Counting…" : `${item.pageCount} ${item.pageCount === 1 ? "page" : "pages"}`}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 min-w-0">
                    <select value={item.section} onChange={(e) => setSection(item.id, e.target.value)} aria-label={`Section label for ${item.file.name}`} className="min-w-0 flex-1 sm:flex-none rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700">
                      {SECTION_LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <button type="button" onClick={() => move(idx, idx - 1)} disabled={idx === 0} title="Move up" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 border border-slate-200"><ArrowUp className="w-4 h-4" /></button>
                    <button type="button" onClick={() => move(idx, idx + 1)} disabled={idx === items.length - 1} title="Move down" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 border border-slate-200"><ArrowDown className="w-4 h-4" /></button>
                    <button type="button" onClick={() => remove(item.id)} title="Remove" className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </li>
              ))}
            </ol>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold btn-bubble btn-bubble-secondary flex items-center justify-center gap-2 whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add More Files
              </button>
              <button type="button" onClick={build} disabled={building || stillCounting} className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2.5 disabled:opacity-50 whitespace-nowrap">
                {building ? <><RefreshCw className="w-4 h-4 animate-spin" /> Building Packet Locally…</> : <><Sparkles className="w-4 h-4" /> Build Application PDF</>}
              </button>
            </div>
          </div>
        )}

        {downloadUrl && outputSize !== null && (
          <div className={`mt-8 p-6 rounded-3xl text-center space-y-4 border ${over ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-sm border ${over ? "bg-amber-100 border-amber-300 text-amber-700" : "bg-emerald-100 border-emerald-300 text-emerald-700"}`}>
              {over ? <AlertCircle className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">{over ? "Packet built, but it is over your limit" : "Your application packet is ready"}</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-mono">{outputPages} pages • {formatSize(outputSize)} • 0 bytes uploaded</p>
            </div>
            <a href={downloadUrl} download={sanitizeFileName(fileName)} className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-emerald whitespace-nowrap">
              <Download className="w-5 h-5" /> Download Packet PDF
            </a>
            <p className="text-[11px] font-mono text-slate-500 break-all">{sanitizeFileName(fileName)}</p>
            {skippedRotated > 0 && <p className="text-xs text-amber-800">{skippedRotated} rotated {skippedRotated === 1 ? "page was" : "pages were"} left unnumbered. Fix their orientation with <a href="/pdf/organize" className="underline font-bold">Rotate &amp; Organize</a> first if every page needs a number.</p>}
            {over && <p className="text-xs text-amber-800">Next step: <a href="/pdf/compress" className="underline font-bold">compress this PDF to a target size</a>, then reopen it and check that small text is still readable.</p>}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2 whitespace-nowrap"><Lock className="w-3.5 h-3.5 text-emerald-600" /> Zero Server Uploads</div>
          <div className="flex items-center gap-2 whitespace-nowrap"><ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> pdf-lib in your browser</div>
          <div className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="w-3.5 h-3.5 text-violet-600" /> Device Memory Limits Apply</div>
        </div>
      </div>

      <AdPlaceholder slot="mid-rectangle" format="rectangle" />
    </fieldset></div>
  );
}
