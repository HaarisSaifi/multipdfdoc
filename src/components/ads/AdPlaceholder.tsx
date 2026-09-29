"use client";

import React, { useEffect } from "react";

interface AdPlaceholderProps {
  format?: "leaderboard" | "in-content" | "rectangle" | "skyscraper" | "horizontal";
  slot?: string;
  slotId?: string;
  className?: string;
  forcePreview?: boolean;
}

export function AdPlaceholder({
  format = "in-content",
  slot,
  slotId = "default-slot",
  className = "",
  forcePreview = false,
}: AdPlaceholderProps) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const activeSlot = slot || slotId;
  const isHorizontal = format === "leaderboard" || format === "horizontal";

  // During AdSense review and pre-approval, never show empty placeholder containers
  if (!adsenseClientId && !forcePreview) {
    return null;
  }

  // When AdSense is approved and client ID is provided
  if (adsenseClientId) {
    return (
      <div className={`my-8 text-center overflow-hidden ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseClientId}
          data-ad-slot={activeSlot}
          data-ad-format={isHorizontal ? "horizontal" : format === "rectangle" ? "rectangle" : "auto"}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Developer preview mode only when forcePreview is explicitly true
  return (
    <div
      className={`my-8 py-4 px-4 rounded-card border border-dashed border-slate-300 bg-slate-50/50 text-center transition-all ${className}`}
      data-ad-slot={activeSlot}
      data-ad-format={format}
    >
      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono mb-1">
        Sponsored Space (Configured for AdSense)
      </div>
      <div
        className={`flex items-center justify-center text-xs text-slate-400 font-mono ${
          isHorizontal ? "min-h-[90px]" : format === "rectangle" ? "min-h-[250px]" : "min-h-[120px]"
        }`}
      >
        [ Slot: {activeSlot} • Zero CLS Reserved ]
      </div>
    </div>
  );
}
