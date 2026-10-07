"use client";

import { useDownloadUrl } from "@/lib/use-download-url";
import { formatLocalDate } from "@/lib/local-date";
import React, { useState, useEffect } from "react";
import { createBusinessDocument, roundMoney } from "@/lib/pdf/business-document";
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
  RotateCcw,
} from "lucide-react";
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
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  useEffect(() => { const today = new Date(); setInvoiceDate(formatLocalDate(today)); today.setDate(today.getDate() + 14); setDueDate(formatLocalDate(today)); }, []);

  // Sender / From (Clean empty default)
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromAddress, setFromAddress] = useState("");

  // Client / To (Clean empty default)
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toAddress, setToAddress] = useState("");

  // Line items (1 clean single row by default)
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0 },
  ]);

  // Tax & Discount (0 default)
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");

  const loadSampleData = () => {
    setInvoiceNumber("INV-004291");
    setFromName("Apex Digital Solutions LLC");
    setFromEmail("billing@apexdigital.com");
    setFromAddress("100 Innovation Way, Suite 400\nSan Francisco, CA 94105");
    setToName("Vanguard Media Partners");
    setToEmail("accounts@vanguardmedia.com");
    setToAddress("742 Evergreen Terrace\nNew York, NY 10001");
    setItems([
      { id: "1", description: "Full-Stack Web Application Architecture & Development", quantity: 40, rate: 85 },
      { id: "2", description: "Responsive Frontend UI & Component Engineering", quantity: 15, rate: 85 },
      { id: "3", description: "Automated Testing & CI/CD Pipeline Setup", quantity: 12, rate: 75 },
    ]);
    setTaxPercent(8.5);
    setDiscountPercent(0);
    setNotes("Payment terms: Net 14 days. Thank you for your business!");
    setPaymentDetails("Replace with your verified payment instructions before sending.");
    setErrorMsg(null);
  };

  const clearAllFields = () => {
    setInvoiceNumber("");
    setFromName("");
    setFromEmail("");
    setFromAddress("");
    setToName("");
    setToEmail("");
    setToAddress("");
    setItems([{ id: Date.now().toString(), description: "", quantity: 1, rate: 0 }]);
    setTaxPercent(0);
    setDiscountPercent(0);
    setNotes("");
    setPaymentDetails("");
    setDownloadUrl(null);
    setErrorMsg(null);
  };

  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useDownloadUrl();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  // Calculations with NaN safety
  const safeTaxPercent = Number.isFinite(taxPercent) ? Math.max(0, taxPercent) : 0;
  const safeDiscountPercent = Number.isFinite(discountPercent) ? Math.min(100, Math.max(0, discountPercent)) : 0;
  const subtotal = items.reduce((sum, item) => {
    const q = Number.isFinite(item.quantity) ? Math.max(0, item.quantity) : 0;
    const r = Number.isFinite(item.rate) ? Math.max(0, item.rate) : 0;
    return sum + roundMoney(q * r);
  }, 0);
  const discountAmount = roundMoney(subtotal * (safeDiscountPercent / 100));
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = roundMoney(taxableAmount * (safeTaxPercent / 100));
  const grandTotal = taxableAmount + taxAmount;

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 1, rate: 0 },
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
    setErrorMsg(null);
    setDownloadUrl(null);
    try {
      if (!fromName.trim() || !toName.trim() || !invoiceDate || !dueDate || dueDate < invoiceDate) throw new Error("Enter sender, client and valid invoice/due dates.");
      if (items.some((item) => !item.description.trim() || !Number.isFinite(item.quantity) || item.quantity <= 0 || !Number.isFinite(item.rate) || item.rate < 0) || discountPercent < 0 || discountPercent > 100 || taxPercent < 0 || !Number.isFinite(taxPercent) || !Number.isFinite(discountPercent)) throw new Error("Complete descriptions and enter positive quantities, nonnegative rates/tax and a discount between 0 and 100%.");
      const pdfBytes = await createBusinessDocument({
        title: "INVOICE", number: invoiceNumber.trim() || `INV-${Date.now()}`,
        details: [`From: ${fromName}`, fromEmail, fromAddress, `Bill to: ${toName}`, toEmail, toAddress, `Invoice date: ${invoiceDate}`, `Due date: ${dueDate}`],
        items: items.map((item) => ({ description: item.description, extra: `${item.quantity} x ${currency.code} ${item.rate.toFixed(2)}`, amount: roundMoney(item.quantity * item.rate) })),
        currency: currency.code, totals: [{ label: "Subtotal", amount: subtotal }, { label: "Discount", amount: -discountAmount }, { label: "Tax", amount: taxAmount }, { label: "Total due", amount: grandTotal }],
        notes: [paymentDetails ? `Payment instructions: ${paymentDetails}` : "", notes ? `Notes: ${notes}` : ""],
      });
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (error: any) {
      setErrorMsg(error.message || "Could not generate the PDF. Check your entries.");
    } finally { setGenerating(false); }
  };
  useEffect(() => { setDownloadUrl(null); }, [currency, invoiceNumber, invoiceDate, dueDate, fromName, fromEmail, fromAddress, toName, toEmail, toAddress, items, taxPercent, discountPercent, notes, paymentDetails]);
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12"><fieldset disabled={generating} className="contents" aria-busy={generating}>
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>Free to use • Local PDF export</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Professional PDF Invoice Generator
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Create, customize, and export itemized business invoices in seconds. All mathematical calculations and PDF byte compilation execute 100% client-side in your browser at <strong className="text-slate-800">multipdfdoc.com</strong>.
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

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={loadSampleData}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition-all flex items-center gap-1.5 shadow-sm"
                title="Fill sample invoice data for quick preview"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample</span>
              </button>
              <button
                type="button"
                onClick={clearAllFields}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                title="Clear all fields"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
              <div className="flex items-center gap-1.5 sm:ml-2">
                <label className="text-xs font-bold text-slate-600">Invoice #:</label>
                <input aria-label="Invoice number"
                  type="text"
                  placeholder="e.g. INV-001"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-28 sm:w-32 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
                />
              </div>
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
              <input aria-label="Sender business name"
                type="text"
                placeholder="e.g. Your Company Name"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
              />
              <input aria-label="Sender email address"
                type="email"
                placeholder="e.g. yourname@company.com"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
              />
              <textarea aria-label="Sender postal address"
                rows={2}
                placeholder="e.g. 100 Innovation Way, Suite 400&#10;San Francisco, CA 94105"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
              />
            </div>

            {/* Client / To */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Client / Billed To</span>
              </div>
              <input aria-label="Client business name"
                type="text"
                placeholder="e.g. Client or Company Name"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
              />
              <input aria-label="Client email address"
                type="email"
                placeholder="e.g. client@example.com"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
              />
              <textarea aria-label="Client postal address"
                rows={2}
                placeholder="e.g. 742 Evergreen Terrace&#10;New York, NY 10001"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
              />
            </div>
          </div>

          {/* Dates Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Invoice Date:</span>
              <input aria-label="Invoice date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="ml-auto bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <Calendar className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-bold text-slate-700">Due Date:</span>
              <input aria-label="Payment due date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="ml-auto bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              />
            </div>
          </div>

          {/* Dynamic Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Line Items & Deliverables</h2>
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
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200"
                >
                  <input aria-label="Item description"
                    type="text"
                    placeholder="e.g. Web Development, Consulting, or Project Deliverable"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <input aria-label="Item quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={item.quantity || ""}
                        onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-center font-bold text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      />
                    </div>
                    <div className="w-24">
                      <input aria-label="Item unit price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.rate === 0 ? "" : item.rate}
                        onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-center font-bold text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      />
                    </div>
                    <div className="w-24 text-right font-mono font-bold text-xs text-slate-900">
                      {currency.symbol}{(item.quantity * item.rate).toFixed(2)}
                    </div>
                    <button aria-label="Remove this row"
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      className="p-2 text-slate-600 hover:text-rose-600 disabled:opacity-30 transition-colors"
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
              <textarea aria-label="Payment Instructions / Bank Wire"
                rows={3}
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder="e.g. Bank Wire: Chase Bank | Routing: 121000358 | Account: 9876543210&#10;PayPal: billing@yourdomain.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Notes & Payment Terms</label>
              <textarea aria-label="Notes & Payment Terms"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Payment terms: Net 14 days. Thank you for your business!"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
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
                  <Percent className="w-3.5 h-3.5 text-slate-600" />
                  Discount %:
                </span>
                <input aria-label="Discount percentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={discountPercent === 0 ? "" : discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-right font-bold text-xs placeholder:text-slate-600"
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
                <input aria-label="Tax percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0"
                  value={taxPercent === 0 ? "" : taxPercent}
                  onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-right font-bold text-xs placeholder:text-slate-600"
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
                  <div className="text-[10px] font-mono text-slate-600 uppercase">{currency.code}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              {errorMsg && (
                <div role="alert" className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}
              <button
                type="button"
                onClick={generatePdf}
                disabled={generating}
                className="w-full py-4 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2 shadow-clay-pill"
              >
                <FileText className="w-4 h-4" />
                <span>{generating ? "Synthesizing Vector PDF..." : "Generate Invoice PDF"}</span>
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

    </fieldset></div>
  );
}
