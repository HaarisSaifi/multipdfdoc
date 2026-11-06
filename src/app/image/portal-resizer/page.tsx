"use client";

import { useDownloadUrl } from "@/lib/use-download-url";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Crop,
  UploadCloud,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Lock,
  Move,
  PenLine,
  UserSquare2,
  RotateCcw,
} from "lucide-react";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

type Mode = "photo" | "signature";
type Format = "jpeg" | "png";
interface SizePreset { id: string; label: string; w: number; h: number; note: string }

const PHOTO_PRESETS: SizePreset[] = [
  { id: "cm35x45", label: "3.5 × 4.5 cm", w: 413, h: 531, note: "Passport-style ratio at 300 DPI" },
  { id: "sq600", label: "2 × 2 in · 600 px", w: 600, h: 600, note: "Square, US visa minimum size" },
  { id: "sq1200", label: "2 × 2 in · 1200 px", w: 1200, h: 1200, note: "Square, US visa maximum size" },
];
const SIGNATURE_PRESETS: SizePreset[] = [
  { id: "cm35x15", label: "3.5 × 1.5 cm", w: 413, h: 177, note: "Signature strip at 300 DPI" },
  { id: "px300x100", label: "300 × 100 px", w: 300, h: 100, note: "3 : 1 signature strip" },
];
const KB_PRESETS = [20, 50, 100, 240];

/**
 * Composition guides (fractions of frame height, measured from the top).
 * US visa: head 50–69% of image height, eyes 56–69% of height from the bottom (U.S. Department of State).
 * 3.5 × 4.5 cm passport style: chin-to-crown roughly 70–80% of photo height (ICAO Doc 9303 guidance).
 */
const FACE_GUIDES: Record<string, { headTop: number; chin: number; eyeBand?: [number, number]; label: string }> = {
  sq600: { headTop: 0.12, chin: 0.72, eyeBand: [0.31, 0.44], label: "Head 50–69% of height · eyes in band" },
  sq1200: { headTop: 0.12, chin: 0.72, eyeBand: [0.31, 0.44], label: "Head 50–69% of height · eyes in band" },
  cm35x45: { headTop: 0.09, chin: 0.84, label: "Chin to crown ≈ 70–80% of height" },
};
const MAX_EDGE = 4000;

function kb(bytes: number) { return bytes / 1024; }
function canvasBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

export default function PortalResizerPage() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [sourceName, setSourceName] = useState("photo");
  const [sourceBytes, setSourceBytes] = useState(0);
  const [mode, setMode] = useState<Mode>("photo");
  const [presetId, setPresetId] = useState("cm35x45");
  const [customW, setCustomW] = useState("200");
  const [customH, setCustomH] = useState("230");
  const [targetKb, setTargetKb] = useState<number | "custom">(50);
  const [customKb, setCustomKb] = useState("30");
  const [minKb, setMinKb] = useState("");
  const [format, setFormat] = useState<Format>("jpeg");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [whiten, setWhiten] = useState(true);
  const [threshold, setThreshold] = useState(175);
  const [grayscale, setGrayscale] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useDownloadUrl();
  const [result, setResult] = useState<{ bytes: number; quality: number | null; w: number; h: number; name: string; underMin: boolean } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const runId = useRef(0);

  const presets = mode === "photo" ? PHOTO_PRESETS : SIGNATURE_PRESETS;
  const dims = (() => {
    if (presetId === "custom") {
      const w = Math.round(parseFloat(customW)), h = Math.round(parseFloat(customH));
      return Number.isFinite(w) && Number.isFinite(h) && w >= 20 && h >= 20 && w <= MAX_EDGE && h <= MAX_EDGE ? { w, h } : null;
    }
    const p = presets.find((x) => x.id === presetId) || presets[0];
    return { w: p.w, h: p.h };
  })();
  const targetBytes = (() => {
    const v = targetKb === "custom" ? parseFloat(customKb) : targetKb;
    return Number.isFinite(v) && v >= 2 ? v * 1024 : 0;
  })();
  const minBytes = (() => { const v = parseFloat(minKb); return Number.isFinite(v) && v > 0 ? v * 1024 : 0; })();

  const invalidate = useCallback(() => { setDownloadUrl(null); setResult(null); }, [setDownloadUrl]);

  useEffect(() => () => { runId.current++; }, []);

  const loadFile = async (list: FileList | null) => {
    if (processing || !list || !list.length) return;
    const file = list[0];
    setErrorMsg(null);
    invalidate();
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setErrorMsg("Choose a JPG, PNG or WebP image. HEIC photos must be exported as JPG first."); return; }
    const url = URL.createObjectURL(file);
    try {
      const el = new Image();
      el.src = url;
      await el.decode();
      if (el.naturalWidth < 20 || el.naturalHeight < 20) throw new Error("too small");
      setImg(el);
      setSourceName(file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60) || "photo");
      setSourceBytes(file.size);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } catch {
      setErrorMsg("This image could not be opened. Try exporting it again as a JPG.");
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  /** Draw the cropped, scaled frame: image covers the frame, then zoom and pan inside it. */
  const draw = useCallback((canvas: HTMLCanvasElement, w: number, h: number) => {
    if (!img) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: mode === "signature" });
    if (!ctx) return;
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom;
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    const maxX = (dw - w) / 2, maxY = (dh - h) / 2;
    const px = Math.max(-maxX, Math.min(maxX, pan.x * w)), py = Math.max(-maxY, Math.min(maxY, pan.y * h));
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, (w - dw) / 2 + px, (h - dh) / 2 + py, dw, dh);
    if (mode === "signature" && (whiten || grayscale)) {
      const data = ctx.getImageData(0, 0, w, h);
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        if (whiten && lum >= threshold) { d[i] = d[i + 1] = d[i + 2] = 255; }
        else if (grayscale) { d[i] = d[i + 1] = d[i + 2] = lum; }
      }
      ctx.putImageData(data, 0, 0);
    }
  }, [img, zoom, pan, mode, whiten, threshold, grayscale]);

  const guide = mode === "photo" && showGuide ? FACE_GUIDES[presetId] : undefined;

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !img || !dims) return;
    draw(canvas, dims.w, dims.h);
    // The guide is drawn on the on-screen preview only; exports use a fresh canvas.
    if (!guide) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = dims;
    const line = Math.max(2, Math.round(w / 220));
    const headH = (guide.chin - guide.headTop) * h;
    ctx.save();
    ctx.lineWidth = line;
    ctx.setLineDash([line * 4, line * 3]);
    ctx.strokeStyle = "rgba(124, 58, 237, 0.9)";
    ctx.beginPath();
    ctx.ellipse(w / 2, guide.headTop * h + headH / 2, headH * 0.37, headH / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (guide.eyeBand) {
      ctx.fillStyle = "rgba(5, 150, 105, 0.12)";
      ctx.fillRect(0, guide.eyeBand[0] * h, w, (guide.eyeBand[1] - guide.eyeBand[0]) * h);
      ctx.strokeStyle = "rgba(5, 150, 105, 0.8)";
      [guide.eyeBand[0], guide.eyeBand[1]].forEach((y) => { ctx.beginPath(); ctx.moveTo(0, y * h); ctx.lineTo(w, y * h); ctx.stroke(); });
    }
    ctx.restore();
  }, [draw, img, dims?.w, dims?.h, guide]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Pan is stored as a fraction of the frame; clamp it so the image always covers the frame. */
  const panLimit = () => {
    if (!img || !dims) return { x: 0, y: 0 };
    const s = Math.max(dims.w / img.naturalWidth, dims.h / img.naturalHeight) * zoom;
    return { x: (img.naturalWidth * s - dims.w) / 2 / dims.w, y: (img.naturalHeight * s - dims.h) / 2 / dims.h };
  };
  const nudge = (dx: number, dy: number) => {
    const lim = panLimit();
    setPan((p) => ({ x: Math.max(-lim.x, Math.min(lim.x, p.x + dx)), y: Math.max(-lim.y, Math.min(lim.y, p.y + dy)) }));
    invalidate();
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!img) return;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    dragging.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragging.current || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragging.current.x) / rect.width;
    const dy = (e.clientY - dragging.current.y) / rect.height;
    dragging.current = { x: e.clientX, y: e.clientY };
    nudge(dx, dy);
  };
  const onPointerUp = () => { dragging.current = null; };

  const process = async () => {
    if (!img) { setErrorMsg("Add a photo or signature image first."); return; }
    if (!dims) { setErrorMsg(`Enter custom dimensions between 20 and ${MAX_EDGE} pixels.`); return; }
    if (!targetBytes) { setErrorMsg("Enter a target size of at least 2 KB."); return; }
    if (minBytes && minBytes >= targetBytes) { setErrorMsg("The minimum size must be smaller than the maximum size."); return; }
    const token = ++runId.current;
    setProcessing(true);
    setErrorMsg(null);
    invalidate();
    try {
      const canvas = document.createElement("canvas");
      draw(canvas, dims.w, dims.h);
      let blob: Blob | null = null;
      let quality: number | null = null;

      if (format === "png") {
        blob = await canvasBlob(canvas, "image/png");
        if (!blob) throw new Error("encode");
        if (blob.size > targetBytes) {
          setErrorMsg(`PNG is lossless, so its size cannot be lowered by quality: this ${dims.w}×${dims.h} PNG is ${kb(blob.size).toFixed(1)} KB. Switch to JPEG to reach ${kb(targetBytes).toFixed(0)} KB, or use smaller dimensions.`);
          blob = null;
        }
      } else {
        // Binary search for the highest JPEG quality that fits the maximum size.
        let lo = 0.05, hi = 0.98, best: Blob | null = null, bestQ = 0;
        const floor = await canvasBlob(canvas, "image/jpeg", lo);
        if (!floor) throw new Error("encode");
        if (floor.size > targetBytes) {
          setErrorMsg(`Even at the lowest quality this ${dims.w}×${dims.h} image is ${kb(floor.size).toFixed(1)} KB, above ${kb(targetBytes).toFixed(0)} KB. Use smaller pixel dimensions if the portal allows them.`);
        } else {
          best = floor; bestQ = lo;
          for (let i = 0; i < 9; i++) {
            if (token !== runId.current) return;
            const mid = (lo + hi) / 2;
            const b = await canvasBlob(canvas, "image/jpeg", mid);
            if (b && b.size <= targetBytes) { best = b; bestQ = mid; lo = mid; } else { hi = mid; }
          }
          const top = await canvasBlob(canvas, "image/jpeg", 0.98);
          if (top && top.size <= targetBytes) { best = top; bestQ = 0.98; }
          blob = best;
          quality = bestQ;
        }
      }
      canvas.width = 0; canvas.height = 0;
      if (token !== runId.current || !blob) return;
      const ext = format === "png" ? "png" : "jpg";
      const name = `${sourceName}_${dims.w}x${dims.h}_${Math.ceil(kb(blob.size))}kb.${ext}`;
      setResult({ bytes: blob.size, quality, w: dims.w, h: dims.h, name, underMin: !!minBytes && blob.size < minBytes });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch {
      setErrorMsg("The image could not be encoded in this browser. Try a different browser or a smaller source photo.");
    } finally {
      if (token === runId.current) setProcessing(false);
    }
  };

  const pillClass = (active: boolean, tone: "sky" | "amber" | "violet") => {
    const map = {
      sky: active ? "bg-sky-600 text-white border-sky-600" : "bg-white text-sky-700 border-sky-200 hover:bg-sky-50",
      amber: active ? "bg-amber-500 text-white border-amber-500" : "bg-white text-amber-700 border-amber-200 hover:bg-amber-50",
      violet: active ? "bg-violet-600 text-white border-violet-600" : "bg-white text-violet-700 border-violet-200 hover:bg-violet-50",
    };
    return `px-3.5 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all shadow-sm ${map[tone]}`;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"><fieldset disabled={processing} className="contents" aria-busy={processing}>
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          100% In-Browser • Zero Uploads
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Exam & Portal <span className="text-violet-600">Photo Resizer</span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Crop a photo or signature to exact pixel dimensions, then compress it under 20 KB, 50 KB, 100 KB or your own limit for exam, visa and job application portals. Your image never leaves this device.
        </p>
      </div>

      <AdPlaceholder slot="top-leaderboard" format="horizontal" />

      <div className="mt-8 bubble-card p-6 sm:p-10 border border-slate-200/90 space-y-8">
        <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Image type">
          <button type="button" aria-pressed={mode === "photo"} onClick={() => { setMode("photo"); setPresetId(PHOTO_PRESETS[0].id); setTargetKb(50); invalidate(); }} className={pillClass(mode === "photo", "violet") + " inline-flex items-center gap-1.5"}><UserSquare2 className="w-3.5 h-3.5" /> Photo</button>
          <button type="button" aria-pressed={mode === "signature"} onClick={() => { setMode("signature"); setPresetId(SIGNATURE_PRESETS[0].id); setTargetKb(20); invalidate(); }} className={pillClass(mode === "signature", "violet") + " inline-flex items-center gap-1.5"}><PenLine className="w-3.5 h-3.5" /> Signature</button>
        </div>

        {!img ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); loadFile(e.dataTransfer.files); }}
            role="button"
            tabIndex={0}
            aria-label={`Add a ${mode} image`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
            onClick={() => fileInputRef.current?.click()}
            className={`bubble-dropzone p-8 sm:p-12 text-center cursor-pointer transition-all ${dragActive ? "drag-active border-violet-600" : ""}`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-white border border-violet-200 flex items-center justify-center shadow-sm mb-5">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600 animate-bounce" />
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">Drop your {mode} here, or <span className="text-violet-600 underline">browse</span></h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">JPG, PNG or WebP. {mode === "signature" ? "Sign in dark ink on plain white paper and photograph it flat." : "Use a front-facing photo on a plain, light background."}</p>
          </div>
        ) : null}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { loadFile(e.target.files); e.target.value = ""; }} className="hidden" aria-label="Choose image" />

        {errorMsg && (
          <div role="alert" className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {img && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            {/* Crop preview */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-[repeating-conic-gradient(#F1F5F9_0%_25%,#FFFFFF_0%_50%)] bg-[length:20px_20px] p-4 flex items-center justify-center min-h-[280px]">
                <canvas
                  ref={previewRef}
                  tabIndex={0}
                  aria-label="Crop preview. Drag or use arrow keys to reposition."
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  onKeyDown={(e) => {
                    const step = 0.02;
                    if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-step, 0); }
                    if (e.key === "ArrowRight") { e.preventDefault(); nudge(step, 0); }
                    if (e.key === "ArrowUp") { e.preventDefault(); nudge(0, -step); }
                    if (e.key === "ArrowDown") { e.preventDefault(); nudge(0, step); }
                  }}
                  className="max-w-full max-h-[340px] w-auto h-auto rounded-lg shadow-md ring-2 ring-violet-300 cursor-move touch-none bg-white"
                  style={{ aspectRatio: dims ? `${dims.w} / ${dims.h}` : undefined }}
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <Move className="w-4 h-4 text-violet-600 flex-shrink-0" />
                <span>Drag the preview to reposition. Arrow keys work too.</span>
              </div>
              {mode === "photo" && FACE_GUIDES[presetId] && (
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <label className="flex items-center gap-2 font-bold whitespace-nowrap"><input type="checkbox" checked={showGuide} onChange={(e) => setShowGuide(e.target.checked)} /> Show face guide</label>
                  {showGuide && <span className="text-[11px] text-slate-500">{FACE_GUIDES[presetId].label}. Not included in the download.</span>}
                </div>
              )}
              <label className="block text-xs font-bold text-slate-700">
                Zoom: {zoom.toFixed(2)}×
                <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(e) => { const z = parseFloat(e.target.value); setZoom(z); if (z < zoom) setPan((p) => ({ x: p.x * (z - 1) / Math.max(zoom - 1, 0.0001), y: p.y * (z - 1) / Math.max(zoom - 1, 0.0001) })); invalidate(); }} className="mt-1 w-full accent-violet-600" aria-label="Zoom" />
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); invalidate(); }} className="px-4 py-2 rounded-full text-xs font-bold btn-bubble btn-bubble-secondary inline-flex items-center gap-1.5 whitespace-nowrap"><RotateCcw className="w-3.5 h-3.5" /> Reset crop</button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-full text-xs font-bold btn-bubble btn-bubble-secondary inline-flex items-center gap-1.5 whitespace-nowrap"><UploadCloud className="w-3.5 h-3.5" /> Replace image</button>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">Source: {img.naturalWidth}×{img.naturalHeight}px • {kb(sourceBytes).toFixed(1)} KB</p>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><Crop className="w-3.5 h-3.5 text-sky-600" /> Output dimensions</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Dimension presets">
                  {presets.map((p) => (
                    <button key={p.id} type="button" title={p.note} aria-pressed={presetId === p.id} onClick={() => { setPresetId(p.id); setPan({ x: 0, y: 0 }); invalidate(); }} className={pillClass(presetId === p.id, "sky")}>{p.label}</button>
                  ))}
                  <button type="button" aria-pressed={presetId === "custom"} onClick={() => { setPresetId("custom"); invalidate(); }} className={pillClass(presetId === "custom", "sky")}>Custom px</button>
                </div>
                {presetId === "custom" ? (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <input type="number" min="20" max={MAX_EDGE} value={customW} onChange={(e) => { setCustomW(e.target.value); invalidate(); }} className="w-24 rounded-xl border border-slate-200 px-2 py-1.5 text-sm" aria-label="Width in pixels" />
                    <span>×</span>
                    <input type="number" min="20" max={MAX_EDGE} value={customH} onChange={(e) => { setCustomH(e.target.value); invalidate(); }} className="w-24 rounded-xl border border-slate-200 px-2 py-1.5 text-sm" aria-label="Height in pixels" />
                    <span>px</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">{dims ? `${dims.w} × ${dims.h} px` : ""} · {presets.find((p) => p.id === presetId)?.note}</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-900">Maximum file size</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Maximum size presets">
                  {KB_PRESETS.map((v) => (
                    <button key={v} type="button" aria-pressed={targetKb === v} onClick={() => { setTargetKb(v); invalidate(); }} className={pillClass(targetKb === v, "amber")}>{v} KB</button>
                  ))}
                  <button type="button" aria-pressed={targetKb === "custom"} onClick={() => { setTargetKb("custom"); invalidate(); }} className={pillClass(targetKb === "custom", "amber")}>Custom</button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  {targetKb === "custom" && (
                    <label className="flex items-center gap-2 whitespace-nowrap">Max <input type="number" min="2" value={customKb} onChange={(e) => { setCustomKb(e.target.value); invalidate(); }} className="w-20 rounded-xl border border-slate-200 px-2 py-1.5 text-sm" aria-label="Maximum size in KB" /> KB</label>
                  )}
                  <label className="flex items-center gap-2 whitespace-nowrap">Min (optional) <input type="number" min="0" value={minKb} onChange={(e) => { setMinKb(e.target.value); invalidate(); }} placeholder="e.g. 10" className="w-20 rounded-xl border border-slate-200 px-2 py-1.5 text-sm" aria-label="Minimum size in KB" /> KB</label>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-900">Format</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Output format">
                  <button type="button" aria-pressed={format === "jpeg"} onClick={() => { setFormat("jpeg"); invalidate(); }} className={pillClass(format === "jpeg", "violet")}>JPEG (recommended)</button>
                  <button type="button" aria-pressed={format === "png"} onClick={() => { setFormat("png"); invalidate(); }} className={pillClass(format === "png", "violet")}>PNG</button>
                </div>
              </div>

              {mode === "signature" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 text-xs text-slate-700">
                  <label className="flex items-center gap-2 font-bold whitespace-nowrap"><input type="checkbox" checked={whiten} onChange={(e) => { setWhiten(e.target.checked); invalidate(); }} /> Whiten paper background</label>
                  {whiten && (
                    <label className="block">Paper threshold: {threshold}
                      <input type="range" min="100" max="240" step="1" value={threshold} onChange={(e) => { setThreshold(parseInt(e.target.value, 10)); invalidate(); }} className="mt-1 w-full accent-violet-600" aria-label="Paper whitening threshold" />
                    </label>
                  )}
                  <label className="flex items-center gap-2 font-bold whitespace-nowrap"><input type="checkbox" checked={grayscale} onChange={(e) => { setGrayscale(e.target.checked); invalidate(); }} /> Convert ink to grayscale</label>
                </div>
              )}

              <button type="button" onClick={process} disabled={processing} className="w-full px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2.5 disabled:opacity-50 whitespace-nowrap">
                {processing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Compressing Locally…</> : <><Sparkles className="w-4 h-4" /> Resize & Compress</>}
              </button>
            </div>
          </div>
        )}

        {downloadUrl && result && (
          <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center gap-6 ${result.underMin ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
            <img src={downloadUrl} alt="Resized result preview" width={result.w} height={result.h} className="max-h-40 w-auto rounded-lg border border-white shadow-md bg-white" />
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h2 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
                {result.underMin ? <AlertCircle className="w-5 h-5 text-amber-600" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {result.underMin ? "Below your minimum size" : "Ready to upload"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-mono">{result.w}×{result.h}px • {kb(result.bytes).toFixed(1)} KB ({(result.bytes / 1000).toFixed(1)} kB decimal){result.quality !== null ? ` • JPEG quality ${Math.round(result.quality * 100)}%` : " • PNG"}</p>
              {result.underMin && <p className="text-xs text-amber-800">The best-quality file is still smaller than your minimum. Use larger pixel dimensions if the portal allows them; padding a file artificially is not recommended.</p>}
              <a href={downloadUrl} download={result.name} className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-extrabold btn-bubble btn-bubble-emerald whitespace-nowrap">
                <Download className="w-5 h-5" /> Download {format === "png" ? "PNG" : "JPG"}
              </a>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2 whitespace-nowrap"><Lock className="w-3.5 h-3.5 text-emerald-600" /> Zero Server Uploads</div>
          <div className="flex items-center gap-2 whitespace-nowrap"><ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> HTML5 Canvas in your browser</div>
          <div className="flex items-center gap-2 whitespace-nowrap"><CheckCircle2 className="w-3.5 h-3.5 text-violet-600" /> Check your portal&apos;s official rules</div>
        </div>
      </div>

      <AdPlaceholder slot="mid-rectangle" format="rectangle" />
    </fieldset></div>
  );
}
