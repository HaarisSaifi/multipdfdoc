"use client";

import { useDownloadUrl } from "@/lib/use-download-url";
import { formatLocalDate } from "@/lib/local-date";
import React, { useState, useEffect } from "react";
import { createBusinessDocument, roundMoney } from "@/lib/pdf/business-document";
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
  const [date, setDate] = useState("");
  useEffect(() => { setDate(formatLocalDate(new Date())); }, []);
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [receiptAttached, setReceiptAttached] = useState("Not specified");

  // Items (1 clean single row by default)
  const [items, setItems] = useState<ExpenseItem[]>([
    { id: "1", description: "", amount: 0 },
  ]);

  // Tax & Tip
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [tipAmount, setTipAmount] = useState<number>(0);

  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useDownloadUrl();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const safeTax = Number.isFinite(taxAmount) ? Math.max(0, taxAmount) : 0;
  const safeTip = Number.isFinite(tipAmount) ? Math.max(0, tipAmount) : 0;
  const subtotal = items.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? roundMoney(Math.max(0, item.amount)) : 0), 0);
  const grandTotal = subtotal + safeTax + safeTip;

  // Preset switch handler
  const handleCategoryChange = (type: "travel" | "meals" | "lodging" | "supplies") => setCategory(type);

  const clearAllFields = () => {
    setVendorName("");
    setVendorLocation("");
    setRecordNumber("");
    setBusinessPurpose("");
    setPaymentMethod("");
    setReceiptAttached("Not specified");
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
    setDownloadUrl(null);
    try {
      if (!vendorName.trim() || !businessPurpose.trim() || !date) throw new Error("Enter the vendor, date and actual business purpose.");
      if (items.some((item) => !item.description.trim() || !Number.isFinite(item.amount) || item.amount < 0) || !Number.isFinite(taxAmount) || taxAmount < 0 || !Number.isFinite(tipAmount) || tipAmount < 0) throw new Error("Enter complete descriptions and nonnegative expense, tax and tip amounts.");
      const pdfBytes = await createBusinessDocument({
        title: "EXPENSE RECORD", number: recordNumber.trim() || `EXP-${Date.now()}`,
        disclaimer: "USER-ENTERED EXPENSE VOUCHER - NOT AN OFFICIAL MERCHANT INVOICE",
        details: [`Vendor: ${vendorName}`, `Location: ${vendorLocation}`, `Date: ${date} ${time}`, `Category: ${category}`, `Business purpose: ${businessPurpose}`, `Payment: ${paymentMethod}`, `Evidence status: ${receiptAttached}`],
        items: items.map((item) => ({ description: item.description, amount: roundMoney(item.amount) })),
        currency: "USD", totals: [{ label: "Subtotal", amount: subtotal }, { label: "Tax / fees", amount: safeTax }, { label: "Tip", amount: safeTip }, { label: "Total expense", amount: grandTotal }],
        notes: ["Keep the original merchant receipt and supporting records. This self-entered log does not establish tax deductibility or prove payment."],
      });
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (error: any) {
      setErrorMsg(error.message || "Could not generate the PDF. Check your entries.");
    } finally { setGenerating(false); }
  };
  useEffect(() => { setDownloadUrl(null); }, [category, vendorName, vendorLocation, recordNumber, businessPurpose, date, time, paymentMethod, receiptAttached, items, taxAmount, tipAmount]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12"><fieldset disabled={generating} className="contents" aria-busy={generating}>
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
          Create structured, itemized expense vouchers and contemporaneous bookkeeping records for travel, meals, and business supplies. Generated 100% locally on your device at <strong className="text-slate-800">multipdfdoc.com</strong>.
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
              <input aria-label="Payee / Vendor Name"
                type="text"
                placeholder="e.g. City Transit, Restaurant, or Hotel Name"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Location / City & State</label>
              <input aria-label="Location / City & State"
                type="text"
                placeholder="e.g. 1455 Market St, San Francisco, CA"
                value={vendorLocation}
                onChange={(e) => setVendorLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Voucher / Record #</label>
              <input aria-label="Voucher / Record #"
                type="text"
                placeholder="e.g. EXP-001"
                value={recordNumber}
                onChange={(e) => setRecordNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Date</label>
              <input aria-label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Time</label>
              <input aria-label="Time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Business Purpose (IRS Requirement)</label>
              <input aria-label="Business Purpose (IRS Requirement)"
                type="text"
                placeholder="e.g. Client consultation meeting, Conference travel"
                value={businessPurpose}
                onChange={(e) => setBusinessPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Payment Method</label>
              <input aria-label="Payment Method"
                type="text"
                placeholder="e.g. Corporate Visa •••• 4242 or Bank ACH"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Receipt Documentation Status</label>
            <select aria-label="Receipt Documentation Status"
              value={receiptAttached}
              onChange={(e) => setReceiptAttached(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              <option value="Not specified">Evidence status not specified</option>
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
                  <input aria-label="Item description"
                    type="text"
                    placeholder="e.g. Flight ticket, Business meal, Office toner"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-medium placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                  />
                  <div className="w-24">
                    <input aria-label="Expense amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={item.amount === 0 ? "" : item.amount}
                      onChange={(e) => updateItem(item.id, "amount", parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-right font-bold text-slate-900 placeholder:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    />
                  </div>
                  <button aria-label="Remove this row"
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length <= 1}
                    className="p-1 text-slate-600 hover:text-rose-600 disabled:opacity-30"
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
              <input aria-label="Taxes & Mandatory Fees ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={taxAmount === 0 ? "" : taxAmount}
                onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Gratuity / Tip ($)</label>
              <input aria-label="Gratuity / Tip ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={tipAmount === 0 ? "" : tipAmount}
                onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-600"
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
                    className="inline-block px-6 py-2 rounded-full text-xs font-bold bg-sky-700 text-white hover:bg-sky-800 transition-all shadow-sm"
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

    </fieldset></div>
  );
}
