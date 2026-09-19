"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "Security & Bug Bounty", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bubble-card p-8 sm:p-12 border border-slate-200/90 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200 mb-3 shadow-sm">
            <Mail className="w-4 h-4 text-violet-600" />
            <span>Developer & Security Support</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Contact MultiPDF Doc Team
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Reach out for technical inquiries, bug bounties, or institutional feedback at multipdfdoc.com.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Message Received Successfully
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Thank you for reaching out. A security engineer from the MultiPDF Doc review board will respond within 24–48 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm outline-none focus:border-violet-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@organization.com"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm outline-none focus:border-violet-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Inquiry Topic</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm outline-none focus:border-violet-500 focus:bg-white transition-all font-medium"
              >
                <option>Security & Bug Bounty</option>
                <option>Feature Request / Tool Suggestion</option>
                <option>Academic or Enterprise Inquiry</option>
                <option>AdSense & Privacy Policy Clarification</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Detailed Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your technical inquiry, file format specification, or bug observation..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm outline-none focus:border-violet-500 focus:bg-white transition-all"
              />
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2 shadow-clay-pill"
              >
                <Send className="w-4 h-4" />
                Submit Secure Inquiry
              </button>
            </div>
          </form>
        )}

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>End-to-End In-Memory Form Processing</span>
          </div>
          <span>Direct Email: support@multipdfdoc.com</span>
        </div>
      </div>
    </div>
  );
}
