"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Technical Inquiry & Tool Feedback",
    message: "",
  });

  const draft = `Name: ${formData.name}\nReply to: ${formData.email}\n\n${formData.message}`;
  const mailLink = `mailto:support@multipdfdoc.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(draft)}`;
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setErrorMsg(null); setSubmitted(true); };
  const copyDraft = async () => { try { await navigator.clipboard.writeText(`To: support@multipdfdoc.com\nSubject: ${formData.subject}\n${draft}`); setCopied(true); } catch { setErrorMsg("Clipboard unavailable. Select the draft below and copy it manually."); } };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bubble-card p-8 sm:p-12 border border-slate-200/90 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200 mb-3 shadow-sm">
            <Mail className="w-4 h-4 text-violet-600" />
            <span>Developer & Support Communications</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Contact MultiPDF Doc
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Report a tool issue or suggest an improvement. Describe the browser, file type and steps; omit document contents, passwords and private identifiers. This page prepares an email draft and does not submit a server form.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="font-display font-bold text-lg text-slate-900">
              Email Draft Prepared
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Nothing has been sent by this website. Choose Open Email App to review and send it, or copy this draft into your webmail.
            </p>
            <a href={mailLink} className="btn-bubble btn-bubble-violet inline-flex px-5 py-3">Open Email App</a>
            {errorMsg && <p role="alert" className="text-rose-800">{errorMsg}</p>}
            <textarea aria-label="Prepared email draft" readOnly value={`To: support@multipdfdoc.com\nSubject: ${formData.subject}\n${draft}`} className="w-full min-h-40 p-4 rounded-2xl border border-emerald-200 bg-white text-slate-800" />
            <button type="button" onClick={copyDraft} className="btn-bubble btn-bubble-secondary px-5 py-3">{copied ? "Draft copied" : "Copy email draft"}</button>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  subject: "Technical Inquiry & Tool Feedback",
                  message: "",
                });
              }}
              className="text-xs text-emerald-800 font-bold underline mt-2 inline-block"
            >
              Prepare another draft
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div role="alert" className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Your Full Name</label>
                <input aria-label="Your Full Name"
                  type="text"
                  maxLength={100}
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Email Address</label>
                <input aria-label="Email Address"
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Inquiry Topic</label>
              <select aria-label="Inquiry Topic"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500 focus:bg-white transition-all font-medium"
              >
                <option>Technical Inquiry & Tool Feedback</option>
                <option>Bug Report / PDF Parsing Issue</option>
                <option>Feature Request</option>
                <option>Privacy Policy Clarification</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Detailed Message</label>
              <textarea aria-label="Detailed Message"
                maxLength={3000}
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your inquiry, browser environment, or feedback in detail..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500 focus:bg-white transition-all"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={mailLink}
                className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-2 transition"
              >
                <Mail className="w-4 h-4 text-slate-500" />
                <span>Open in Email App</span>
              </a>

              <button type="submit" className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2"><Mail className="w-4 h-4" />Prepare Email Draft</button>
            </div>
          </form>
        )}

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Email draft stays in your browser</span>
          </div>
          <a
            href="mailto:support@multipdfdoc.com"
            className="font-bold text-slate-700 hover:text-violet-700 hover:underline flex items-center gap-1"
          >
            Direct Support Email: support@multipdfdoc.com
          </a>
        </div>
      </div>
    </div>
  );
}
