"use client";

import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Receipt,
  Download,
  Plus,
  Trash2,
  Car,
  Utensils,
  Hotel,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Printer,
  CreditCard,
  Building,
  Calendar,
  Clock,
  RotateCcw,
  FileCheck2,
  AlertCircle,
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
}

export default function ExpenseRecordPage() {
  const [category, setCategory] = useState<"travel" | "meals" | "lodging" | "supplies">("travel");

  // Record details (Clean empty defaults)
  const [vendorName, setVendorName] = useState("");
  const [vendorLocation, setVendorLocation] = useState("");
  const [recordNumber, setRecordNumber] = useState("");
  const [businessPurpose, setBusinessPurpose] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("12:00");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [receiptAttached, setReceiptAttached] = useState("Original Receipt On File");

  // Items (1 clean single row by default)
  const [items, setItems] = useState<ExpenseItem[]>([
    { id: "1", description: "", amount: 0 },
  ]);

  // Tax & Tip
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [tipAmount, setTipAmount] = useState<number>(0);

  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sanitizePdfText = (text: string | undefined | null): string => {
    if (!text) return "";
    return text
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/\u2022/g, "-")
      .replace(/\u2026/g, "...")
      .replace(/[^\x00-\x7F]/g, " ")
      .trim();
  };

  const safeTax = Number.isFinite(taxAmount) ? Math.max(0, taxAmount) : 0;
  const safeTip = Number.isFinite(tipAmount) ? Math.max(0, tipAmount) : 0;
  const subtotal = items.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? Math.max(0, item.amount) : 0), 0);
  const grandTotal = subtotal + safeTax + safeTip;

  // Preset switch handler
  const handleCategoryChange = (type: "travel" | "meals" | "lodging" | "supplies") => {
    setCategory(type);
    if (type === "travel") {
      setVendorName("Transportation & Rideshare Service");
      setVendorLocation("Airport / Client Office Transit");
      setBusinessPurpose("Client Onsite Consultation Transit");
      setRecordNumber(`EXP-${Date.now().toString().slice(-6)}`);
      setPaymentMethod("Corporate Card •••• 4242");
      setItems([
        { id: "1", description: "Transit Fare (Airport to Client Office)", amount: 38.50 },
        { id: "2", description: "Toll & Bridge Surcharge", amount: 4.25 },
      ]);
      setTaxAmount(3.20);
      setTipAmount(7.00);
    } else if (type === "meals") {
      setVendorName("Client Working Dinner & Bistro");
      setVendorLocation("1330 Avenue of the Americas, New York, NY");
      setBusinessPurpose("Quarterly Partnership Review Dinner");
      setRecordNumber(`EXP-${Date.now().toString().slice(-6)}`);
      setPaymentMethod("Mastercard •••• 8812");
      setItems([
        { id: "1", description: "Client Business Dinner (2 Entrees)", amount: 84.00 },
        { id: "2", description: "Sparkling Water & Beverages", amount: 16.50 },
      ]);
      setTaxAmount(8.90);
      setTipAmount(18.00);
    } else if (type === "lodging") {
      setVendorName("Downtown Business Hotel");
      setVendorLocation("555 S West Temple, Salt Lake City, UT");
      setBusinessPurpose("Annual Tech Conference Attendance");
      setRecordNumber(`EXP-${Date.now().toString().slice(-6)}`);
      setPaymentMethod("Amex •••• 1009");
      setItems([
        { id: "1", description: "Standard Business Room (1 Night)", amount: 189.00 },
        { id: "2", description: "High-Speed Business WiFi", amount: 14.95 },
      ]);
      setTaxAmount(24.47);
      setTipAmount(0.00);
    } else {
      setVendorName("Office Supply & Electronics Store");
      setVendorLocation("300 Main Street, Cambridge, MA");
      setBusinessPurpose("Client Presentation Hardware & Paper", );
      setRecordNumber(`EXP-${Date.now().toString().slice(-6)}`);
      setPaymentMethod("Visa •••• 5531");
      setItems([
        { id: "1", description: "Recycled Presentation Paper (5 Reams)", amount: 39.99 },
        { id: "2", description: "USB-C Multiport Display Adapter", amount: 24.50 },
      ]);
      setTaxAmount(4.03);
      setTipAmount(0.00);
    }
  };

  const clearAllFields = () => {
    setVendorName("");
    setVendorLocation("");
    setRecordNumber("");
    setBusinessPurpose("");
    setPaymentMethod("");
    setItems([{ id: Date.now().toString(), description: "", amount: 0 }]);
    setTaxAmount(0);
    setTipAmount(0);
    setDownloadUrl(null);
    setErrorMsg(null);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", amount: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ExpenseItem, val: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  };

  // 100% Client-Side Vector PDF Generator
  const generatePdf = async () => {
    setGenerating(true);
    setErrorMsg(null);
    try {
      const pdfDoc = await PDFDocument.create();
      // Compact record voucher format: 400 x 580 pts
      const page = pdfDoc.addPage([400, 580]);
      const { width, height } = page.getSize();

      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const black = rgb(0.08, 0.08, 0.09);
      const muted = rgb(0.35, 0.38, 0.45);
      const borderGray = rgb(0.85, 0.88, 0.92);
      const headerBg = rgb(0.96, 0.97, 0.99);

      let y = height - 35;

      // Top Disclaimer Box (Explicit Anti-Forgery & Audit Compliance)
      page.drawRectangle({
        x: 25,
        y: y - 18,
        width: width - 50,
        height: 22,
        color: rgb(0.98, 0.95, 0.91),
        borderColor: rgb(0.92, 0.82, 0.65),
        borderWidth: 0.8,
      });

      const notice = "USER-ENTERED EXPENSE VOUCHER — NOT AN OFFICIAL MERCHANT INVOICE";
      page.drawText(notice, {
        x: width / 2 - (fontBold.widthOfTextAtSize(notice, 7) / 2),
        y: y - 10,
        size: 7,
        font: fontBold,
        color: rgb(0.68, 0.38, 0.1),
      });

      y -= 38;

      // Header Title
      const title = "EXPENSE RECORD & BOOKKEEPING LOG";
      page.drawText(title, {
        x: width / 2 - (fontBold.widthOfTextAtSize(title, 12) / 2),
        y,
        size: 12,
        font: fontBold,
        color: black,
      });

      y -= 14;
      const subTitle = "Self-Employed & Independent Contractor Recordkeeping";
      page.drawText(subTitle, {
        x: width / 2 - (fontRegular.widthOfTextAtSize(subTitle, 8) / 2),
        y,
        size: 8,
        font: fontRegular,
        color: muted,
      });

      y -= 16;
      page.drawLine({
        start: { x: 25, y },
        end: { x: width - 25, y },
        thickness: 0.8,
        color: borderGray,
      });

      y -= 16;
      // Record Details
      const safeRecordNum = recordNumber.trim() || `EXP-${Date.now().toString().slice(-6)}`;
      page.drawText(`VOUCHER #: ${sanitizePdfText(safeRecordNum)}`, { x: 25, y, size: 8, font: fontBold, color: black });
      page.drawText(`DATE: ${sanitizePdfText(date)} ${sanitizePdfText(time)}`, { x: width - 150, y, size: 8, font: fontRegular, color: muted });

      y -= 13;
      page.drawText(`PAYEE / VENDOR: ${sanitizePdfText(vendorName) || "Unspecified Payee"}`, { x: 25, y, size: 8, font: fontRegular, color: black });
      page.drawText(`PAYMENT: ${sanitizePdfText(paymentMethod) || "Cash / Card"}`, { x: width - 150, y, size: 8, font: fontRegular, color: muted });

      y -= 13;
      page.drawText(`PURPOSE: ${sanitizePdfText(businessPurpose) || "General Business Expense"}`, { x: 25, y, size: 8, font: fontRegular, color: muted });

      y -= 13;
      page.drawText(`STATUS: ${sanitizePdfText(receiptAttached)}`, { x: 25, y, size: 7.5, font: fontBold, color: rgb(0.1, 0.5, 0.3) });

      y -= 15;
      // Items Table Header
      page.drawRectangle({
        x: 25,
        y: y - 4,
        width: width - 50,
        height: 18,
        color: headerBg,
      });

      page.drawText("DESCRIPTION", { x: 32, y: y + 2, size: 7.5, font: fontBold, color: black });
      page.drawText("AMOUNT (USD)", { x: width - 100, y: y + 2, size: 7.5, font: fontBold, color: black });

      y -= 16;
      // Item rows
      items.forEach((item) => {
        const cleanDesc = sanitizePdfText(item.description).slice(0, 42) || "General expense item";
        const amt = Number.isFinite(item.amount) ? Math.max(0, item.amount) : 0;
        page.drawText(cleanDesc, { x: 32, y, size: 8, font: fontRegular, color: black });
        const priceStr = `$${amt.toFixed(2)}`;
        const priceWidth = fontRegular.widthOfTextAtSize(priceStr, 8);
        page.drawText(priceStr, { x: width - 35 - priceWidth, y, size: 8, font: fontRegular, color: black });
        y -= 13;
      });

      y -= 5;
      page.drawLine({
        start: { x: 25, y },
        end: { x: width - 25, y },
        thickness: 0.6,
        color: borderGray,
      });

      y -= 15;
      // Financial Summary
      page.drawText("Subtotal:", { x: width - 150, y, size: 8, font: fontRegular, color: muted });
      page.drawText(`$${subtotal.toFixed(2)}`, { x: width - 65, y, size: 8, font: fontRegular, color: black });

      if (safeTax > 0) {
        y -= 12;
        page.drawText("Taxes & Fees:", { x: width - 150, y, size: 8, font: fontRegular, color: muted });
        page.drawText(`$${safeTax.toFixed(2)}`, { x: width - 65, y, size: 8, font: fontRegular, color: black });
      }

      if (safeTip > 0) {
        y -= 12;
        page.drawText("Gratuity / Tip:", { x: width - 150, y, size: 8, font: fontRegular, color: muted });
        page.drawText(`$${safeTip.toFixed(2)}`, { x: width - 65, y, size: 8, font: fontRegular, color: black });
      }

      y -= 16;
      page.drawLine({
        start: { x: width - 160, y: y + 3 },
        end: { x: width - 25, y: y + 3 },
        thickness: 1,
        color: black,
      });

      // Total
      page.drawText("TOTAL EXPENSE:", { x: width - 150, y, size: 9.5, font: fontBold, color: black });
      page.drawText(`$${grandTotal.toFixed(2)}`, { x: width - 65, y, size: 10.5, font: fontBold, color: rgb(0.12, 0.45, 0.85) });

      // Legal & Recordkeeping Note
      y -= 38;
      page.drawRectangle({
        x: 25,
        y: y - 18,
        width: width - 50,
        height: 28,
        color: rgb(0.97, 0.98, 0.99),
        borderColor: borderGray,
        borderWidth: 0.5,
      });

      page.drawText("IRS Recordkeeping Note: Per IRS Pub. 463, taxpayers must maintain contemporaneous records", {
        x: 32,
        y: y - 2,
        size: 6.5,
        font: fontRegular,
        color: muted,
      });
      page.drawText("listing business purpose, date, location, and amount. Generated with MultiPDF Doc (multipdfdoc.com).", {
        x: 32,
        y: y - 11,
        size: 6.5,
        font: fontRegular,
        color: muted,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate expense voucher. Please check inputs.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/80 shadow-sm">
          <FileCheck2 className="w-3.5 h-3.5 text-sky-600" />
          <span>100% Client-Side • IRS Pub. 463 Bookkeeping Log • Zero Server Uploads</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Personal Expense Record Generator
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Create structured, audit-compliant expense vouchers and contemporaneous bookkeeping records for travel, meals, and business supplies. Generated 100% locally on your device at <strong className="text-slate-800">multipdfdoc.com</strong>.
        </p>
      </div>

      <AdPlaceholder slot="receipt-top" format="horizontal" />

      {/* Preset Category Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
        {[
          { id: "travel", label: "Business Travel / Transit", icon: Car },
          { id: "meals", label: "Client Meals & Dining", icon: Utensils },
          { id: "lodging", label: "Hotel & Lodging", icon: Hotel },
          { id: "supplies", label: "Office Supplies & Software", icon: ShoppingBag },
        ].map((item) => {
          const Icon = item.icon;
          const active = category === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleCategoryChange(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                active
                  ? "bg-slate-900 text-white shadow-clay-pill scale-102 font-extrabold"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? "text-sky-400" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={clearAllFields}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200 transition-all shadow-sm"
          title="Clear all fields"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Editor & Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Editor */}
        <div className="lg:col-span-2 bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Payee / Vendor Name</label>
              <input
                type="text"
                placeholder="e.g. City Transit, Restaurant, or Hotel Name"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Location / City & State</label>
              <input
                type="text"
                placeholder="e.g. 1455 Market St, San Francisco, CA"
                value={vendorLocation}
                onChange={(e) => setVendorLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Voucher / Record #</label>
              <input
                type="text"
                placeholder="e.g. EXP-001"
                value={recordNumber}
                onChange={(e) => setRecordNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Business Purpose (IRS Requirement)</label>
              <input
                type="text"
                placeholder="e.g. Client consultation meeting, Conference travel"
                value={businessPurpose}
                onChange={(e) => setBusinessPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Payment Method</label>
              <input
                type="text"
                placeholder="e.g. Corporate Visa •••• 4242 or Bank ACH"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Receipt Documentation Status</label>
            <select
              value={receiptAttached}
              onChange={(e) => setReceiptAttached(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none"
            >
              <option value="Original Receipt On File">Original Receipt On File (Physical / Digital Archive)</option>
              <option value="Electronic Statement Attached">Electronic Bank / Card Statement Verified</option>
              <option value="Self-Employed Daily Expense Diary">Self-Employed Daily Expense Diary Log</option>
            </select>
          </div>

          {/* Items */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Itemized Expense Breakdown</span>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold hover:bg-sky-100 transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="text"
                    placeholder="e.g. Flight ticket, Business meal, Office toner"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-medium placeholder:text-slate-400 outline-none"
                  />
                  <div className="w-24">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={item.amount === 0 ? "" : item.amount}
                      onChange={(e) => updateItem(item.id, "amount", parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-right font-bold text-slate-900 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                    className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Tip inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Taxes & Mandatory Fees ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={taxAmount === 0 ? "" : taxAmount}
                onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Gratuity / Tip ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={tipAmount === 0 ? "" : tipAmount}
                onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Voucher Live Preview & Actions */}
        <div className="space-y-6">
          <div className="bubble-card p-6 border border-slate-200/90 space-y-6 sticky top-24">
            {/* Visual Voucher Slip Representation */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-inner font-mono text-xs space-y-3">
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-bold text-center">
                USER-ENTERED EXPENSE VOUCHER
              </div>

              <div className="text-center space-y-1 border-b border-slate-200 pb-3">
                <div className="font-bold text-slate-900 uppercase text-sm">{vendorName || "PAYEE / VENDOR NAME"}</div>
                <div className="text-[10px] text-slate-500">{vendorLocation || "Location / City, State"}</div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 border-b border-dashed border-slate-300 pb-3">
                <div className="flex justify-between">
                  <span>RECORD #:</span>
                  <span className="font-bold text-slate-900">{recordNumber || "EXP-001"}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{date} {time}</span>
                </div>
                <div className="flex justify-between">
                  <span>PAYMENT:</span>
                  <span>{paymentMethod || "Cash / Card"}</span>
                </div>
                {businessPurpose && (
                  <div className="text-[10px] text-slate-500 pt-1">
                    <strong>Purpose:</strong> {businessPurpose}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-[11px] border-b border-dashed border-slate-300 pb-3">
                {items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span className="truncate max-w-[170px]">{it.description || "Expense Item"}</span>
                    <span className="font-bold">${it.amount ? it.amount.toFixed(2) : "0.00"}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax / Fees:</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Gratuity:</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>TOTAL EXPENSE:</span>
                  <span className="text-sky-700">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}
              <button
                type="button"
                onClick={generatePdf}
                disabled={generating}
                className="w-full py-4 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2 shadow-clay-pill"
              >
                {generating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Compiling Expense Voucher...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Expense Voucher (PDF)</span>
                  </>
                )}
              </button>

              {downloadUrl && (
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-sky-800">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    <span>Expense Voucher Ready!</span>
                  </div>
                  <a
                    href={downloadUrl}
                    download={`expense_record_${date}.pdf`}
                    className="inline-block px-6 py-2 rounded-full text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 transition-all shadow-sm"
                  >
                    Save PDF Record
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="receipt-bottom" format="horizontal" />

      {/* SEO & Procedural Value Wrapper */}
      <ValueWrapper
        title="IRS Publication 463 & Business Expense Recordkeeping Guide"
        description="Comprehensive technical and procedural guide for self-employed professionals, independent contractors, and small business owners on contemporaneous expense tracking, deductible business expenses, and documentary proof standards."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Business Suite", href: "/invoice" },
          { label: "Expense Record Generator", href: "/receipt" },
        ]}
        authorName="MultiPDF Doc Technology & Editorial Team"
        lastUpdated="September 2026"
        readingTime="9 min read"
        tableOfContents={[
          { id: "irs-requirements", title: "1. IRS Publication 463 Statutory Recordkeeping Rules" },
          { id: "contemporaneous-records", title: "2. The Legal Meaning of Contemporaneous Records" },
          { id: "the-75-dollar-rule", title: "3. The IRS $75 Documentary Evidence Threshold" },
          { id: "travel-and-meals", title: "4. Business Travel, Meals & Transportation Deductions" },
          { id: "step-by-step-guide", title: "5. How to Compile an Audit-Compliant Expense Log" },
          { id: "faq", title: "6. Frequently Asked Questions (FAQ)" },
        ]}
        faqItems={[
          {
            question: "Can I use an expense voucher as proof of purchase for tax deductions?",
            answer: "Under IRS Publication 463, a contemporaneous expense log or account book serves as legal proof of elements such as date, location, amount, and business purpose. For expenses of $75 or more (and all lodging expenses regardless of amount), the IRS also requires documentary evidence (such as a canceled check, credit card statement, or formal receipt).",
          },
          {
            question: "Are my expense records processed or stored on MultiPDF Doc servers?",
            answer: "No. MultiPDF Doc generates all PDF byte sequences 100% locally inside your browser using client-side JavaScript. No expense data, payee names, or financial numbers are ever uploaded or transmitted across the internet.",
          },
          {
            question: "What information must be recorded to substantiate a business travel deduction?",
            answer: "The IRS requires four core elements for travel deductions: (1) Amount of each separate expense, (2) Dates of departure and return, (3) Destination city or town, and (4) Business reason for the travel or business benefit derived.",
          },
        ]}
      >
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
          <section id="irs-requirements" className="space-y-3">
            <h2 className="text-xl font-display font-bold text-slate-900">
              1. IRS Publication 463 Statutory Recordkeeping Rules
            </h2>
            <p>
              United States tax law under Section 274(d) of the Internal Revenue Code strictly disallows deductions for business travel, gifts, and entertainment unless the taxpayer substantiates the expense with adequate contemporaneous records. IRS Publication 463 establishes the evidentiary standards that self-employed individuals, independent contractors (1099 recipients), and corporate employees must maintain.
            </p>
          </section>

          <section id="contemporaneous-records" className="space-y-3">
            <h2 className="text-xl font-display font-bold text-slate-900">
              2. The Legal Meaning of Contemporaneous Records
            </h2>
            <p>
              A contemporaneous record is one recorded at or near the time of the expenditure. The IRS gives significantly higher probative weight to logs, diaries, and vouchers recorded while the taxpayer has full, immediate knowledge of each element of the expenditure. Reconstructing expense logs months later during an audit is frequently rejected by the tax court.
            </p>
          </section>

          <section id="the-75-dollar-rule" className="space-y-3">
            <h2 className="text-xl font-display font-bold text-slate-900">
              3. The IRS $75 Documentary Evidence Threshold
            </h2>
            <p>
              Under Treasury Regulation § 1.274-5(c)(2)(iii), documentary evidence (such as an itemized invoice, bill, or receipt) is required for any business expense of <strong>$75 or more</strong>, with two strict exceptions: (1) Lodging expenses require documentary evidence regardless of amount, and (2) Transportation charges where documentary evidence is not readily available (such as metered public transit). For items under $75, a detailed contemporaneous expense log stating date, amount, vendor, and business purpose fulfills statutory requirements.
            </p>
          </section>
        </div>
      </ValueWrapper>
    </div>
  );
}
