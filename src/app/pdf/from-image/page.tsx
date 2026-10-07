"use client";

import { useDownloadUrl } from "@/lib/use-download-url";
import React, { useState, useRef, useEffect } from "react";
import {
  FileImage,
  UploadCloud,
  FileText,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Plus,
} from "lucide-react";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface ImageItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  size: number;
}

export default function ImagesToPDFPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useDownloadUrl();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrls = useRef(new Set<string>());
  useEffect(() => () => { previewUrls.current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  const handleImages = (fileList: FileList | null) => {
    if (converting) return;
    if (!fileList || fileList.length === 0) return;
    setErrorMsg(null);
    setDownloadUrl(null);

    const validImages: ImageItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (["image/png", "image/jpeg", "image/webp"].includes(f.type)) {
        const previewUrl = URL.createObjectURL(f);
        previewUrls.current.add(previewUrl);
        validImages.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          name: f.name,
          previewUrl,
          size: f.size,
        });
      }
    }

    if (validImages.length === 0) {
      setErrorMsg("Please upload valid image files (JPG, PNG, WEBP).");
      return;
    }

    setImages((prev) => [...prev, ...validImages]);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newItems = [...images];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setImages(newItems);
    setDownloadUrl(null);
  };

  const removeItem = (id: string) => {
    const item = images.find((image) => image.id === id);
    if (item) { URL.revokeObjectURL(item.previewUrl); previewUrls.current.delete(item.previewUrl); }
    setImages((prev) => prev.filter((item) => item.id !== id));
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setConverting(true);
    setErrorMsg(null);
    setDownloadUrl(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const buffer = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(buffer);
        } else if (item.file.type === "image/webp") {
          // pdf-lib embeds PNG/JPEG; decode WebP locally and retain transparency via PNG.
          const bitmap = await createImageBitmap(item.file);
          try {
            const canvas = document.createElement("canvas");
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const context = canvas.getContext("2d");
            if (!context) throw new Error("Cannot create image canvas.");
            context.drawImage(bitmap, 0, 0);
            const png = await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not convert WebP image.")), "image/png"));
            embeddedImage = await pdfDoc.embedPng(await png.arrayBuffer());
            canvas.width = canvas.height = 0;
          } finally { bitmap.close(); }
        } else {
          try {
            embeddedImage = await pdfDoc.embedJpg(buffer);
          } catch (e) {
            embeddedImage = await pdfDoc.embedPng(buffer);
          }
        }

        const { width, height } = embeddedImage;
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Failed to convert images to PDF.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"><fieldset disabled={converting} className="contents" aria-busy={converting}>
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Batch Image to PDF Compiler
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Convert Images <span className="text-emerald-600">to Single PDF</span>
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Compile multiple JPG, PNG, and photo scans into an organized PDF dossier. Reorder pages visually with zero cloud uploads or data storage.
        </p>
      </div>

      <AdPlaceholder slot="top-leaderboard" format="horizontal" />

      {/* Main Interactive Tool Console */}
      <div className="mt-8 bubble-card p-6 sm:p-10 border border-slate-200/90">
        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleImages(e.dataTransfer.files);
          }}
          role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
              onClick={() => fileInputRef.current?.click()}
          className={`bubble-dropzone p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive ? "drag-active border-emerald-600" : ""
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/jpg"
            onChange={(e) => handleImages(e.target.files)}
            className="hidden"
          />
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm mb-5 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 animate-bounce" />
          </div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">
            Drop Photos, Receipts, or Scans Here
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Upload JPG or PNG files. All images are processed locally in your browser to synthesize a single document.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div role="alert" className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Uploaded Images Gallery */}
        {images.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs sm:text-sm">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <FileImage className="w-4 h-4 text-emerald-600" />
                Selected Images ({images.length})
              </span>
              <span className="text-slate-500 font-mono text-xs">
                Drag or reorder sequence before generating PDF
              </span>
            </div>

            {/* Visual Thumbnail Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="bubble-card p-3 border border-slate-200 flex flex-col justify-between bg-white shadow-sm"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 border border-slate-200 mb-2">
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute top-2 left-2 w-6 h-6 rounded-lg bg-white/90 backdrop-blur-md flex items-center justify-center text-xs font-mono font-bold text-slate-800 shadow-sm border border-slate-200">
                      {idx + 1}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 truncate mb-2">
                    {item.name}
                  </p>

                  <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <button
                        aria-label={`Move ${item.name} earlier`}
                        onClick={() => moveItem(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 hover:text-slate-900"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        aria-label={`Move ${item.name} later`}
                        onClick={() => moveItem(idx, "down")}
                        disabled={idx === images.length - 1}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 hover:text-slate-900"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
              onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold btn-bubble btn-bubble-secondary flex items-center justify-center gap-2 shadow-clay-pill-secondary"
              >
                <Plus className="w-4 h-4" />
                Add More Images
              </button>

              <button
                onClick={handleConvert}
                disabled={converting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-emerald flex items-center justify-center gap-2.5 shadow-clay-pill-emerald disabled:opacity-50"
              >
                {converting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Compiling Document in Memory...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Convert {images.length} Images to PDF
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Download Ready Card */}
        {downloadUrl && (
          <div className="mt-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">
                Your PDF is Ready!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-mono">
                {images.length} photos compiled into a single high-resolution PDF document
              </p>
            </div>
            <div>
              <a
                href={downloadUrl}
                download="compiled_images.pdf"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-emerald shadow-clay-pill-emerald"
              >
                <Download className="w-5 h-5" />
                Download PDF Document
              </a>
            </div>
          </div>
        )}
      </div>

      <AdPlaceholder slot="mid-rectangle" format="rectangle" />

      {/* Value Wrapper */}

    </fieldset></div>
  );
}
