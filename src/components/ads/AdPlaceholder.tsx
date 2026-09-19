import React from "react";

interface AdPlaceholderProps {
  format?: "leaderboard" | "in-content" | "rectangle" | "skyscraper" | "horizontal";
  slot?: string;
  slotId?: string;
  className?: string;
}

export function AdPlaceholder({
  format = "in-content",
  slot,
  slotId = "default-slot",
  className = "",
}: AdPlaceholderProps) {
  const activeSlot = slot || slotId;
  const isHorizontal = format === "leaderboard" || format === "horizontal";

  return (
    <div
      className={`my-8 py-4 px-4 rounded-card border border-dashed border-bubble-border/80 bg-bubble-surface/40 text-center transition-all ${className}`}
      data-ad-slot={activeSlot}
      data-ad-format={format}
    >
      <div className="text-[10px] uppercase tracking-wider text-bubble-muted/70 font-mono mb-1">
        Sponsored Advertisement
      </div>
      <div
        className={`flex items-center justify-center text-xs text-bubble-muted/50 font-mono ${
          isHorizontal ? "min-h-[90px]" : format === "rectangle" ? "min-h-[250px]" : "min-h-[120px]"
        }`}
      >
        [ AdSense Ad Unit Container • Zero CLS Reserved Space ]
      </div>
    </div>
  );
}
