"use client";

import { useEffect, useRef } from "react";

interface AdPlaceholderProps {
  format?: "leaderboard" | "in-content" | "rectangle" | "skyscraper" | "horizontal";
  slot?: string;
  slotId?: string;
  className?: string;
  forcePreview?: boolean;
}

let loader: Promise<void> | null = null;
function loadAds(client: string) {
  if (!loader) loader = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); loader = null; reject(new Error("Ad script unavailable")); };
    document.head.appendChild(script);
  });
  return loader;
}

export function AdPlaceholder({ format = "in-content", slot, slotId, className = "", forcePreview = false }: AdPlaceholderProps) {
  const element = useRef<HTMLModElement>(null);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
  const horizontal = format === "leaderboard" || format === "horizontal";
  const configuredSlot = horizontal ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL : process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE;
  const candidate = slot || slotId || "";
  const activeSlot = /^\d+$/.test(candidate) ? candidate : configuredSlot || "";
  // Enable after approval, valid units and certified CMP setup in the account.
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && /^ca-pub-\d{16}$/.test(client) && /^\d+$/.test(activeSlot);
  const height = horizontal ? "min-h-[90px]" : "min-h-[250px]";

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    loadAds(client).then(() => {
      if (!active || !element.current || element.current.dataset.adsbygoogleStatus) return;
      const adWindow = window as unknown as { adsbygoogle?: object[] };
      try { (adWindow.adsbygoogle ||= []).push({}); } catch { /* Tool remains usable with blocked ads. */ }
    }).catch(() => { /* Preserve reserved space when ads are unavailable. */ });
    return () => { active = false; };
  }, [enabled, client, activeSlot]);

  if (!enabled && !(forcePreview && process.env.NODE_ENV === "development")) return null;
  return (
    <aside aria-label="Advertisement" className={`my-8 overflow-hidden text-center ${height} ${className}`}>
      <span className="block text-[10px] text-slate-500 mb-2">Advertisement</span>
      {enabled ? <ins ref={element} className="adsbygoogle" style={{ display: "block", width: "100%", height: horizontal ? 90 : 250 }} data-ad-client={client} data-ad-slot={activeSlot} data-ad-format={horizontal ? "horizontal" : "rectangle"} data-full-width-responsive="false" /> : <div className={`border border-dashed border-slate-300 rounded-2xl ${height}`}>Development ad preview</div>}
    </aside>
  );
}
