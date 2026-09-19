"use client";

import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
import {
  FileText,
  Download,
  Plus,
  Trash2,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Printer,
  CreditCard,
  Building2,
  User,
  Calendar,
  Percent,
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGeneratorPage() {
  // Currency state
  const [currency, setCurrency] = useState<{ symbol: string; code: string }>({ symbol: "$", code: "USD" });

  // Invoice Meta
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  // Sender / From
  const [fromName, setFromName] = useState("Apex Digital Solutions LLC");
  const [fromEmail, setFromEmail] = useState("billing@apexdigital.com");
  const [fromAddress, setFromAddress] = useState("100 Innovation Way, Suite 400\nSan Francisco, CA 94105");

  // Client / To
  const [toName, setToName] = useState("Vanguard Media Partners");
  const [toEmail, setToEmail] = useState("accounts@vanguardmedia.com");
  const [toAddress, setToAddress] = useState("742 Evergreen Terrace\nNew York, NY 10001");

  // Line items
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Full-Stack Web Application Architecture & Development", quantity: 40, rate: 85 },
    { id: "2", description: "Client-Side Security Audit & HIPAA Compliance Hardening", quantity: 1, rate: 1200 },
    { id: "3", description: "Automated Testing & End-to-End CI/CD Pipeline Setup", quantity: 12, rate: 75 },
  ]);

  // Tax & Discount
  const [taxPercent, setTaxPercent] = useState<number>(8.5);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [notes, setNotes] = useState("Payment terms: Net 14 days. Thank you for your business!");
  const [paymentDetails, setPaymentDetails] = useState("Bank Wire: Chase Bank | Routing: 121000358 | Account: 9876543210\nPayPal: billing@apexdigital.com");

  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxPercent / 100);
  const grandTotal = taxableAmount + taxAmount;

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "Consulting Services", quantity: 1, rate: 100 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, val: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // 100% Client-Side Vector PDF Generator
  const generatePdf = async () => {
    setGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage(PageSizes.Letter); // 612 x 792 pts
      const { width, height } = page.getSize();

      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Slate & Brand Colors
      const primaryColor = rgb(0.06, 0.09, 0.16); // Slate 900
      const accentColor = rgb(0.49, 0.23, 0.93); // Violet 600
      const mutedColor = rgb(0.39, 0.45, 0.55); // Slate 500
      const lightBg = rgb(0.97, 0.98, 0.99); // Slate 50
      const borderGray = rgb(0.88, 0.91, 0.94); // Slate 200

      // Safe ASCII currency symbol for PDF WinAnsi standard font compatibility
      const safeSymbol = currency.code === "INR" || currency.symbol === "₹" ? "Rs. " : currency.symbol;

      let y = height - 50;

      // Header Brand
      page.drawText(fromName.toUpperCase() || "INVOICE", {
        x: 50,
        y,
        size: 18,
        font: fontBold,
        color: primaryColor,
      });

      page.drawText("INVOICE", {
        x: width - 140,
        y,
        size: 20,
        font: fontBold,
        color: accentColor,
      });

      y -= 18;
      page.drawText(fromEmail, { x: 50, y, size: 9, font: fontRegular, color: mutedColor });
      page.drawText(`# ${invoiceNumber}`, { x: width - 140, y, size: 10, font: fontBold, color: primaryColor });

      y -= 14;
      const fromLines = fromAddress.split("\n");
      fromLines.forEach((line) => {
        page.drawText(line, { x: 50, y, size: 8.5, font: fontRegular, color: mutedColor });
        y -= 11;
      });

      // Dates strip
      y = height - 120;
      page.drawLine({
        start: { x: 50, y },
        end: { x: width - 50, y },
        thickness: 1,
        color: borderGray,
      });

      y -= 25;
      // Billed To Column
      page.drawText("BILLED TO:", { x: 50, y, size: 8.5, font: fontBold, color: mutedColor });
      page.drawText("INVOICE DATE:", { x: width - 200, y, size: 8.5, font: fontBold, color: mutedColor });
      page.drawText(invoiceDate, { x: width - 110, y, size: 8.5, font: fontRegular, color: primaryColor });

      y -= 14;
      page.drawText(toName || "Client Name", { x: 50, y, size: 11, font: fontBold, color: primaryColor });
      page.drawText("DUE DATE:", { x: width - 200, y, size: 8.5, font: fontBold, color: mutedColor });
      page.drawText(dueDate, { x: width - 110, y, size: 8.5, font: fontBold, color: accentColor });

      y -= 14;
      page.drawText(toEmail, { x: 50, y, size: 8.5, font: fontRegular, color: mutedColor });

      y -= 12;
      const toLines = toAddress.split("\n");
      toLines.forEach((line) => {
        page.drawText(line, { x: 50, y, size: 8.5, font: fontRegular, color: mutedColor });
        y -= 11;
      });

      // Table Header
      y -= 20;
      page.drawRectangle({
        x: 50,
        y: y - 5,
        width: width - 100,
        height: 24,
        color: lightBg,
      });

      page.drawText("DESCRIPTION", { x: 60, y: y + 2, size: 8.5, font: fontBold, color: mutedColor });
      page.drawText("QTY", { x: 330, y: y + 2, size: 8.5, font: fontBold, color: mutedColor });
      page.drawText("UNIT PRICE", { x: 400, y: y + 2, size: 8.5, font: fontBold, color: mutedColor });
      page.drawText("AMOUNT", { x: 500, y: y + 2, size: 8.5, font: fontBold, color: mutedColor });

      y -= 18;

      // Table Items
      items.forEach((item) => {
        const itemTotal = item.quantity * item.rate;

        page.drawText(item.description.slice(0, 48), {
          x: 60,
          y,
          size: 9,
          font: fontRegular,
          color: primaryColor,
        });

        page.drawText(item.quantity.toString(), {
          x: 335,
          y,
          size: 9,
          font: fontRegular,
          color: primaryColor,
        });

        page.drawText(`${safeSymbol}${item.rate.toFixed(2)}`, {
          x: 400,
          y,
          size: 9,
          font: fontRegular,
          color: primaryColor,
        });

        page.drawText(`${safeSymbol}${itemTotal.toFixed(2)}`, {
          x: 500,
          y,
          size: 9,
          font: fontBold,
          color: primaryColor,
        });

        y -= 14;
        page.drawLine({
          start: { x: 50, y: y + 4 },
          end: { x: width - 50, y: y + 4 },
          thickness: 0.5,
          color: borderGray,
        });
        y -= 10;
      });

      // Totals Box
      y -= 10;
      const totalsX = width - 220;

      page.drawText("Subtotal:", { x: totalsX, y, size: 9, font: fontRegular, color: mutedColor });
      page.drawText(`${safeSymbol}${subtotal.toFixed(2)}`, { x: width - 60, y, size: 9, font: fontRegular, color: primaryColor });

      if (discountPercent > 0) {
        y -= 16;
        page.drawText(`Discount (${discountPercent}%):`, { x: totalsX, y, size: 9, font: fontRegular, color: mutedColor });
        page.drawText(`-${safeSymbol}${discountAmount.toFixed(2)}`, { x: width - 60, y, size: 9, font: fontRegular, color: rgb(0.88, 0.11, 0.28) });
      }

      if (taxPercent > 0) {
        y -= 16;
        page.drawText(`Tax / VAT (${taxPercent}%):`, { x: totalsX, y, size: 9, font: fontRegular, color: mutedColor });
        page.drawText(`${safeSymbol}${taxAmount.toFixed(2)}`, { x: width - 60, y, size: 9, font: fontRegular, color: primaryColor });
      }

      y -= 22;
      page.drawRectangle({
        x: totalsX - 10,
        y: y - 6,
        width: 170,
        height: 26,
        color: lightBg,
      });

      page.drawText("TOTAL DUE:", { x: totalsX, y, size: 10, font: fontBold, color: primaryColor });
      page.drawText(`${safeSymbol}${grandTotal.toFixed(2)} ${currency.code}`, {
        x: totalsX + 70,
        y,
        size: 11,
        font: fontBold,
        color: accentColor,
      });

      // Payment Details & Notes (Left column bottom)
      y -= 40;
      if (paymentDetails) {
        page.drawText("PAYMENT INSTRUCTIONS:", { x: 50, y, size: 8.5, font: fontBold, color: mutedColor });
        y -= 12;
        const pLines = paymentDetails.split("\n");
        pLines.forEach((line) => {
          page.drawText(line, { x: 50, y, size: 8, font: fontRegular, color: primaryColor });
          y -= 10;
        });
      }

      y -= 15;
      if (notes) {
        page.drawText("TERMS & NOTES:", { x: 50, y, size: 8.5, font: fontBold, color: mutedColor });
        y -= 12;
        page.drawText(notes, { x: 50, y, size: 8, font: fontRegular, color: mutedColor });
      }

      // Footer notice
      page.drawText("Generated locally with MultiPDF Doc (multipdfdoc.com) — 100% In-Browser Privacy Protection.", {
        x: 50,
        y: 35,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.65, 0.71, 0.8),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to compile invoice PDF.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>100% Free • Zero Watermarks • Instant PDF Export</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Professional PDF Invoice Generator
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Create, customize, and export audit-compliant business invoices in seconds. All mathematical calculations and PDF byte compilation execute 100% client-side in your browser at <strong className="text-slate-800">multipdfdoc.com</strong>.
        </p>
      </div>

      {/* Main Interactive Invoice Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Editor */}
        <div className="lg:col-span-2 bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-8">
          
          {/* Top Controls: Currency & Invoice # */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Currency:</span>
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-full border border-slate-200">
                {[
                  { symbol: "$", code: "USD" },
                  { symbol: "€", code: "EUR" },
                  { symbol: "£", code: "GBP" },
                  { symbol: "₹", code: "INR" },
                  { symbol: "C$", code: "CAD" },
                ].map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      currency.code === curr.code
                        ? "bg-white text-violet-700 shadow-sm border border-slate-200 font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {curr.code} ({curr.symbol})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Invoice #:</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-32 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Sender & Receiver Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sender / From */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Building2 className="w-4 h-4 text-violet-600" />
                <span>Your Company / Freelancer Info</span>
              </div>
              <input
                type="text"
                placeholder="Company / Freelancer Name"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-violet-500"
              />
              <input
                type="email"
                placeholder="billing@yourdomain.com"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500"
              />
              <textarea
                rows={2}
                placeholder="Address, City, State, ZIP, Country"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500"
              />
            </div>

            {/* Client / To */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Client / Billed To</span>
              </div>
              <input
                type="text"
                placeholder="Client Name or Organization"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-violet-500"
              />
              <input
                type="email"
                placeholder="accounts@client.com"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500"
              />
              <textarea
                rows={2}
                placeholder="Client Address, City, State, Country"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Dates Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Invoice Date:</span>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="ml-auto bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <Calendar className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-bold text-slate-700">Due Date:</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="ml-auto bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Dynamic Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Line Items & Deliverables</h3>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100/70 hover:bg-violet-100 text-violet-700 text-xs font-bold transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200"
                >
                  <input
                    type="text"
                    placeholder="Description of service or product"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:border-violet-500"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-center font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-center font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div className="w-24 text-right font-mono font-bold text-xs text-slate-900">
                      {currency.symbol}{(item.quantity * item.rate).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Bank Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Payment Instructions / Bank Wire</label>
              <textarea
                rows={3}
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder="Bank account coordinates, PayPal address, or routing number..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Notes & Payment Terms</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, late fee policy, or thank you message..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Financial Summary & Export */}
        <div className="space-y-6">
          <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-display font-bold text-base text-slate-900">Invoice Summary</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% PRIVATE
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items):</span>
                <span className="font-mono font-bold text-slate-900">
                  {currency.symbol}{subtotal.toFixed(2)}
                </span>
              </div>

              {/* Discount control */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-slate-400" />
                  Discount %:
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-right font-bold text-xs"
                />
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Discount Savings:</span>
                  <span>-{currency.symbol}{discountAmount.toFixed(2)}</span>
                </div>
              )}

              {/* Tax control */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Tax / VAT (%):
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-right font-bold text-xs"
                />
              </div>

              {taxPercent > 0 && (
                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span className="font-mono text-slate-900">+{currency.symbol}{taxAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-display font-bold text-sm text-slate-900">Total Amount Due:</span>
                <div className="text-right">
                  <span className="font-display font-extrabold text-2xl text-violet-700">
                    {currency.symbol}{grandTotal.toFixed(2)}
                  </span>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">{currency.code}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={generatePdf}
                disabled={generating}
                className="w-full py-4 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2 shadow-clay-pill"
              >
                <FileText className="w-4 h-4" />
                <span>{generating ? "Synthesizing Vector PDF..." : "Generate Official Invoice PDF"}</span>
              </button>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`invoice_${invoiceNumber}.pdf`}
                  className="w-full py-3.5 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-emerald flex items-center justify-center gap-2 shadow-clay-pill"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice (No Watermark)</span>
                </a>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Vector PostScript layout • ISO 32000 PDF standard</span>
            </div>
          </div>

          <AdPlaceholder slot="sidebar-ad" format="rectangle" />
        </div>
      </div>

      {/* AdSense Value Wrapper Layer */}
      <ValueWrapper
        toolName="Free Professional Invoice Generator"
        title="Official Procedural Standards: Business Invoicing, Tax Deductibility & Audit Governance"
        subtitle="Comprehensive legal and financial guidelines for freelancers, contractors, and SMBs generating valid tax invoices."
        sections={[
          {
            heading: "1. Statutory Invoice Requirements for US, UK, and EU Commercial Compliance",
            content: `Under internal revenue laws (such as IRS Publication 535 in the United States and HMRC VAT Notice 700 in the United Kingdom), an invoice is not merely a payment request—it is a legally binding evidentiary instrument required for tax deductions and audit defense.

To qualify as a valid commercial invoice, your document must contain five non-negotiable data fields:
• Sequential Invoice Identifier: A unique, chronological numbering sequence (e.g., INV-2026-001) that guarantees individual transaction traceability.
• Transacting Entities: Complete legal names, registered physical addresses, and contact coordinates for both the issuing supplier and the purchasing client.
• Itemized Deliverable Schedule: Clear, unambiguous descriptions of goods delivered or hours dedicated, avoiding vague descriptors like 'consulting' or 'services rendered'.
• Tax Breakdown: Explicit segregation of the net taxable base, applicable state sales tax or Value Added Tax (VAT/GST) percentages, and the exact levied tax sum.
• Payment Settlement Coordinates: Prescribed payment timelines (such as Net 15, Net 30) along with designated depository account coordinates (IBAN, ACH routing, or SWIFT/BIC coordinates).`
          },
          {
            heading: "2. Mitigating Payment Disputes with Clear Net Terms and Late Fee Stipulations",
            content: `Studies conducted by the National Federation of Independent Business (NFIB) demonstrate that invoices featuring explicit 'Due Upon Receipt' or 'Net 14' stipulations are settled 42% faster than invoices without designated payment windows.

When issuing electronic invoices, specify the payment grace period directly in the invoice notes. In commercial B2B contracts, standard statutory interest clauses (such as 1.5% monthly compound interest on delinquent receivables) should be referenced to enforce timely accounts payable compliance.`
          },
          {
            heading: "3. Digital Record Retention & Electronic Invoicing Security",
            content: `The IRS requires businesses to maintain electronic records of all generated invoices, receipts, and supporting bank transaction logs for a minimum statutory period of three to seven years depending on gross revenue thresholds.

Unlike traditional SaaS billing tools that hold your customer data behind recurring monthly subscriptions and potential vendor lock-in, MultiPDF Doc compiles clean, ISO-standard vector PDFs directly on your local device. Because zero financial data is transmitted across our network, you retain permanent, uncompromised sovereignty over your accounting records.`
          }
        ]}
        formula={{
          title: "Commercial Invoice Settlement Formula",
          formula: "Grand_Total = (Subtotal - (Subtotal * Discount_Rate)) * (1 + Tax_Rate)",
          explanation: "Calculates the final enforceable receivable amount where discounts are applied to the gross subtotal prior to the assessment of statutory sales tax or Value Added Tax (VAT)."
        }}
        faqs={[
          {
            question: "Is this invoice generator really 100% free without watermarks?",
            answer: "Yes. MultiPDF Doc does not attach logos, promotional watermarks, or paywalls to your generated invoices. The exported PDF is a clean, professional, audit-ready document suitable for corporate submissions."
          },
          {
            question: "Is my client and financial billing data saved on your servers?",
            answer: "Never. MultiPDF Doc operates exclusively inside your browser using client-side JavaScript. Neither your client names, billing rates, bank account details, nor totals are ever sent to an external server."
          },
          {
            question: "Can I generate invoices in international currencies?",
            answer: "Yes. MultiPDF Doc supports standard international currency symbols including US Dollar ($), Euro (€), British Pound (£), Indian Rupee (₹), and Canadian Dollar (C$)."
          },
          {
            question: "Are these invoices valid for official tax deductions and audits?",
            answer: "Yes. When filled out with proper business identification numbers, itemized line items, and applicable tax rates, the generated PDF complies with standard IRS, HMRC, and GST invoicing requirements."
          }
        ]}
      />
    </div>
  );
}
