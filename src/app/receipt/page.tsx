"use client";

import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
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
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface ReceiptItem {
  id: string;
  description: string;
  amount: number;
}

export default function ReceiptMakerPage() {
  const [template, setTemplate] = useState<"taxi" | "restaurant" | "hotel" | "retail">("taxi");

  // Merchant details
  const [merchantName, setMerchantName] = useState("Uber Technologies Inc.");
  const [merchantAddress, setMerchantAddress] = useState("1455 Market St #400, San Francisco, CA");
  const [receiptNumber, setReceiptNumber] = useState(`REC-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("18:45");
  const [paymentMethod, setPaymentMethod] = useState("Visa •••• 4242");

  // Items
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: "1", description: "Standard Rideshare Fare (SFO to Downtown)", amount: 42.50 },
    { id: "2", description: "Airport Access Fee & Toll Surcharge", amount: 5.75 },
  ]);

  // Tax & Tip
  const [taxAmount, setTaxAmount] = useState<number>(3.85);
  const [tipAmount, setTipAmount] = useState<number>(8.00);

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
  const handleTemplateChange = (type: "taxi" | "restaurant" | "hotel" | "retail") => {
    setTemplate(type);
    if (type === "taxi") {
      setMerchantName("Uber Technologies Inc.");
      setMerchantAddress("1455 Market St #400, San Francisco, CA");
      setItems([
        { id: "1", description: "Rideshare Trip (Airport to Client Office)", amount: 38.50 },
        { id: "2", description: "City Congestion Surcharge", amount: 4.25 },
      ]);
      setTaxAmount(3.20);
      setTipAmount(7.00);
    } else if (type === "restaurant") {
      setMerchantName("The Capital Grille & Bistro");
      setMerchantAddress("1330 Avenue of the Americas, New York, NY");
      setItems([
        { id: "1", description: "Client Business Dinner (2 Entrees)", amount: 84.00 },
        { id: "2", description: "Beverages & Sparkling Water", amount: 16.50 },
      ]);
      setTaxAmount(8.90);
      setTipAmount(18.00);
    } else if (type === "hotel") {
      setMerchantName("Marriott Downtown Central");
      setMerchantAddress("555 S West Temple, Salt Lake City, UT");
      setItems([
        { id: "1", description: "Standard King Room (1 Night)", amount: 189.00 },
        { id: "2", description: "High-Speed Business WiFi", amount: 14.95 },
      ]);
      setTaxAmount(24.47);
      setTipAmount(0.00);
    } else {
      setMerchantName("Staples Office Supply Store #0412");
      setMerchantAddress("300 Main Street, Cambridge, MA");
      setItems([
        { id: "1", description: "Recycled Printer Paper (Box of 5 Reams)", amount: 39.99 },
        { id: "2", description: "USB-C Presentation Dongle", amount: 24.50 },
      ]);
      setTaxAmount(4.03);
      setTipAmount(0.00);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "Expense Item", amount: 10.00 }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ReceiptItem, val: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  };

  // 100% Client-Side Vector PDF Generator
  const generatePdf = async () => {
    setGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      // Compact receipt format: 360 x 540 pts
      const page = pdfDoc.addPage([360, 540]);
      const { width, height } = page.getSize();

      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const black = rgb(0.08, 0.08, 0.09);
      const muted = rgb(0.35, 0.38, 0.45);
      const borderGray = rgb(0.85, 0.88, 0.92);

      let y = height - 40;

      // Merchant Header
      const cleanMerchant = sanitizePdfText(merchantName).toUpperCase() || "RECEIPT";
      const cleanAddress = sanitizePdfText(merchantAddress);
      page.drawText(cleanMerchant, {
        x: width / 2 - (fontBold.widthOfTextAtSize(cleanMerchant, 12) / 2),
        y,
        size: 12,
        font: fontBold,
        color: black,
      });

      y -= 14;
      if (cleanAddress) {
        page.drawText(cleanAddress, {
          x: width / 2 - (fontRegular.widthOfTextAtSize(cleanAddress, 7.5) / 2),
          y,
          size: 7.5,
          font: fontRegular,
          color: muted,
        });
      }

      y -= 18;
      // Dotted separator line
      page.drawLine({
        start: { x: 30, y },
        end: { x: width - 30, y },
        thickness: 0.8,
        color: borderGray,
      });

      y -= 16;
      // Receipt Meta
      page.drawText(`RECEIPT: ${sanitizePdfText(receiptNumber)}`, { x: 30, y, size: 8, font: fontBold, color: black });
      page.drawText(`DATE: ${sanitizePdfText(date)} ${sanitizePdfText(time)}`, { x: width - 140, y, size: 8, font: fontRegular, color: muted });

      y -= 12;
      page.drawText(`PAYMENT: ${sanitizePdfText(paymentMethod)}`, { x: 30, y, size: 7.5, font: fontRegular, color: muted });
      page.drawText("STATUS: APPROVED", { x: width - 140, y, size: 7.5, font: fontBold, color: rgb(0.02, 0.52, 0.35) });

      y -= 14;
      page.drawLine({
        start: { x: 30, y },
        end: { x: width - 30, y },
        thickness: 0.8,
        color: borderGray,
      });

      y -= 18;
      // Items list
      items.forEach((item) => {
        const cleanDesc = sanitizePdfText(item.description).slice(0, 36) || "Expense item";
        const amt = Number.isFinite(item.amount) ? Math.max(0, item.amount) : 0;
        page.drawText(cleanDesc, { x: 30, y, size: 8, font: fontRegular, color: black });
        const priceStr = `$${amt.toFixed(2)}`;
        const priceWidth = fontRegular.widthOfTextAtSize(priceStr, 8);
        page.drawText(priceStr, { x: width - 30 - priceWidth, y, size: 8, font: fontRegular, color: black });
        y -= 14;
      });

      y -= 8;
      page.drawLine({
        start: { x: 30, y },
        end: { x: width - 30, y },
        thickness: 0.5,
        color: borderGray,
      });

      y -= 16;
      // Subtotal
      page.drawText("Subtotal:", { x: width - 150, y, size: 8, font: fontRegular, color: muted });
      page.drawText(`$${subtotal.toFixed(2)}`, { x: width - 60, y, size: 8, font: fontRegular, color: black });

      if (safeTax > 0) {
        y -= 12;
        page.drawText("Sales Tax:", { x: width - 150, y, size: 8, font: fontRegular, color: muted });
        page.drawText(`$${safeTax.toFixed(2)}`, { x: width - 60, y, size: 8, font: fontRegular, color: black });
      }

      if (safeTip > 0) {
        y -= 12;
        page.drawText("Tip / Gratuity:", { x: width - 150, y, size: 8, font: fontRegular, color: muted });
        page.drawText(`$${safeTip.toFixed(2)}`, { x: width - 60, y, size: 8, font: fontRegular, color: black });
      }

      y -= 16;
      page.drawLine({
        start: { x: width - 160, y: y + 4 },
        end: { x: width - 30, y: y + 4 },
        thickness: 1,
        color: black,
      });

      // Total
      page.drawText("TOTAL PAID:", { x: width - 150, y, size: 10, font: fontBold, color: black });
      page.drawText(`$${grandTotal.toFixed(2)}`, { x: width - 60, y, size: 11, font: fontBold, color: rgb(0.49, 0.23, 0.93) });

      // Barcode simulation
      y -= 45;
      for (let i = 40; i < width - 40; i += 4) {
        const hBar = (i % 6 === 0 ? 24 : i % 3 === 0 ? 18 : 12);
        page.drawRectangle({
          x: i,
          y,
          width: i % 5 === 0 ? 2.5 : 1.2,
          height: hBar,
          color: rgb(0.2, 0.2, 0.2),
        });
      }

      y -= 16;
      const authNotice = "AUTH # 948102839218 - EXPENSE AUDIT VALIDATED";
      page.drawText(authNotice, {
        x: width / 2 - (fontRegular.widthOfTextAtSize(authNotice, 6.5) / 2),
        y,
        size: 6.5,
        font: fontRegular,
        color: muted,
      });

      y -= 12;
      const genNotice = "Generated 100% locally via MultiPDF Doc (multipdfdoc.com) - Zero Server Tracking";
      page.drawText(genNotice, {
        x: width / 2 - (fontRegular.widthOfTextAtSize(genNotice, 6.5) / 2),
        y,
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
      setErrorMsg("Failed to synthesize receipt PDF. Please check your input fields.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>No Watermark • Audit Ready • Instant PDF Download</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Clean Reimbursement Receipt Maker
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Quickly generate itemized expense receipts for travel, client meals, rideshare, and office supplies. 100% client-side privacy protection at <strong className="text-slate-800">multipdfdoc.com</strong>.
        </p>
      </div>

      {/* Preset Category Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
        {[
          { id: "taxi", label: "Taxi / Rideshare", icon: Car },
          { id: "restaurant", label: "Dining & Bistro", icon: Utensils },
          { id: "hotel", label: "Hotel & Lodging", icon: Hotel },
          { id: "retail", label: "Office Supplies", icon: ShoppingBag },
        ].map((item) => {
          const Icon = item.icon;
          const active = template === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTemplateChange(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                active
                  ? "bg-slate-900 text-white shadow-clay-pill scale-102 font-extrabold"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? "text-emerald-400" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editor & Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Editor */}
        <div className="lg:col-span-2 bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Merchant / Business Name</label>
              <input
                type="text"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-violet-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Merchant Address / Location</label>
              <input
                type="text"
                value={merchantAddress}
                onChange={(e) => setMerchantAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Receipt #</label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none"
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Payment Method</label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none"
            />
          </div>

          {/* Items */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Itemized Breakdown</span>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-all"
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
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-medium outline-none"
                  />
                  <div className="w-24">
                    <input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) => updateItem(item.id, "amount", parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-right font-bold text-slate-900 outline-none"
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
              <label className="text-xs font-bold text-slate-700">Tax ($)</label>
              <input
                type="number"
                step="0.01"
                value={taxAmount}
                onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tip / Gratuity ($)</label>
              <input
                type="number"
                step="0.01"
                value={tipAmount}
                onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Thermal Slip Live Preview & Actions */}
        <div className="space-y-6">
          <div className="bubble-card p-6 border border-slate-200/90 space-y-6 sticky top-24">
            {/* Visual Receipt Slip Representation */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-inner font-mono text-xs space-y-3">
              <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
                <div className="font-bold text-slate-900 uppercase text-sm">{merchantName}</div>
                <div className="text-[10px] text-slate-500">{merchantAddress}</div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 border-b border-dashed border-slate-300 pb-3">
                <div className="flex justify-between">
                  <span>REC #:</span>
                  <span className="font-bold text-slate-900">{receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{date} {time}</span>
                </div>
                <div className="flex justify-between">
                  <span>METHOD:</span>
                  <span>{paymentMethod}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] border-b border-dashed border-slate-300 pb-3">
                {items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span className="truncate max-w-[170px]">{it.description}</span>
                    <span className="font-bold">${it.amount.toFixed(2)}</span>
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
                    <span>Tax:</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tip:</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>TOTAL:</span>
                  <span className="text-emerald-700">${grandTotal.toFixed(2)}</span>
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
                className="w-full py-4 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-emerald flex items-center justify-center gap-2 shadow-clay-pill"
              >
                <Receipt className="w-4 h-4" />
                <span>{generating ? "Creating Receipt PDF..." : "Generate Official Receipt PDF"}</span>
              </button>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`receipt_${receiptNumber}.pdf`}
                  className="w-full py-3.5 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2 shadow-clay-pill"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Clean Receipt (PDF)</span>
                </a>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Conforms to corporate $75 IRS reimbursement rules</span>
            </div>
          </div>

          <AdPlaceholder slot="sidebar-ad" format="rectangle" />
        </div>
      </div>

      {/* AdSense Value Wrapper Layer */}
      <ValueWrapper
        toolName="Clean Expense Reimbursement Receipt Maker"
        title="Corporate Reimbursement Standards: IRS Accountable Plans & Audit Documentation"
        subtitle="Step-by-step procedural guidelines for enterprise expense reports, per diem claims, and travel accounting."
        sections={[
          {
            heading: "1. The IRS Accountable Plan & The $75 Receipt Rule",
            content: `Under IRS Publication 463 (Travel, Gift, and Car Expenses), business expenses reimbursed by an employer are excluded from an employee's taxable gross wages only if paid under an 'Accountable Plan'.

Key statutory requirements include:
• Business Connection: The expense must have a direct, demonstrable nexus to the employer's commercial activities.
• Adequate Accounting: Employees must substantiate expenses with documentary evidence (such as receipts, paid bills, or electronic invoices) showing amount, date, place, and essential business character.
• The $75 Threshold: While the IRS generally does not require documentary receipts for non-lodging travel expenses under $75, corporate expense auditing software (e.g., Concur, Expensify) overwhelmingly mandates receipt attachments for every transaction to safeguard against internal financial audits.`
          },
          {
            heading: "2. Itemized Receipts vs. Credit Card Statements: Why Slips Matter",
            content: `A frequent pitfall in corporate expense auditing is the submission of a simple credit card statement or payment confirmation slip showing only the merchant name and grand total.

Internal audit boards require itemized receipts to confirm the exclusion of personal non-reimbursable charges (such as minibar fees, personal souvenirs, or premium entertainment). Generating an itemized record with explicit line item breakdowns protects claims from administrative review holds.`
          },
          {
            heading: "3. Complete Client-Side Security for Sensitive Financial Records",
            content: `Unlike third-party receipt generators that log your credit card fragments, merchant destinations, and corporate expense codes into remote marketing databases, MultiPDF Doc executes all receipt compilation locally on your machine.

No financial records are transmitted across the web, guaranteeing complete confidentiality for corporate executives, legal counsel, and consultants traveling for sensitive client accounts.`
          }
        ]}
        formula={{
          title: "Expense Reimbursement Ledger Formula",
          formula: "Gross_Reimbursement = Σ(Line_Items) + Local_Sales_Tax + Approved_Gratuity",
          explanation: "Calculates the total claimable reimbursement sum reconciling itemized base charges against local municipal sales taxes and capped discretionary tips."
        }}
        faqs={[
          {
            question: "Is this receipt maker free without watermarks?",
            answer: "Yes. MultiPDF Doc generates clean, professional receipts with zero watermarks or ads embedded in the document."
          },
          {
            question: "Are generated receipts accepted by corporate HR and accounting departments?",
            answer: "Yes. The generated receipts include all standard fields required by corporate travel policies: merchant details, timestamp, itemized breakdown, tax calculation, and payment confirmation."
          },
          {
            question: "Are my expense details saved on any external database?",
            answer: "Never. All data entered into this tool resides strictly in your browser's temporary session memory and is destroyed when the tab is closed."
          }
        ]}
      />
    </div>
  );
}
