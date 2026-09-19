import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-[65vh] flex flex-col items-center justify-center space-y-4 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-clay-pill flex items-center justify-center text-white font-display font-extrabold text-lg animate-pulse">
          M
        </div>
        <div className="absolute -inset-1 rounded-2xl border-2 border-violet-500/30 animate-ping" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-xs font-bold text-slate-700 tracking-wide uppercase font-mono animate-pulse">
          Loading Document Tool...
        </p>
        <p className="text-[11px] text-slate-400 font-medium">
          100% In-Browser Privacy Protection
        </p>
      </div>
    </div>
  );
}
