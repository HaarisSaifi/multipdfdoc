"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const preferenceKey = "multipdfdoc-analytics-choice-v1";
type Choice = "allowed" | "denied" | null;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

export function AnalyticsConsent({ measurementId }: { measurementId?: string }) {
  const [choice, setChoice] = useState<Choice>(null);
  const [editing, setEditing] = useState(false);
  const initialized = useRef(false);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const declineButton = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const pathname = usePathname();
  const validId = measurementId && /^G-[A-Z0-9]+$/.test(measurementId) ? measurementId : null;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(preferenceKey);
      if (saved === "allowed" || saved === "denied") setChoice(saved);
    } catch { /* Tools work even when preference storage is blocked. */ }
  }, []);

  useEffect(() => {
    if (!restoreFocus.current) return;
    (editing ? declineButton.current : settingsButton.current)?.focus({ preventScroll: true });
    restoreFocus.current = false;
  }, [choice, editing]);

  useEffect(() => {
    if (!validId || choice !== "allowed") return;
    const target = window as AnalyticsWindow;
    target.dataLayer ||= [];
    target.gtag ||= (...args: unknown[]) => { target.dataLayer!.push(args); };
    const flags = window as unknown as Record<string, unknown>;
    flags["ga-disable-" + validId] = false;
    // Only route-level visits: no queries, fragments, file names or tool inputs.
    let referrer = "";
    try { const url = new URL(document.referrer); referrer = url.origin + url.pathname; } catch {}
    if (!initialized.current) {
      target.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      target.gtag("js", new Date());
      initialized.current = true;
    }
    target.gtag("config", validId, { send_page_view: false, page_location: location.origin + pathname, page_referrer: referrer, allow_google_signals: false, allow_ad_personalization_signals: false });
    target.gtag("event", "page_view", { page_location: location.origin + pathname, page_referrer: referrer, page_title: document.title, send_to: validId });
  }, [choice, pathname, validId]);

  if (!validId) return null;

  function choose(next: Exclude<Choice, null>) {
    try { localStorage.setItem(preferenceKey, next); } catch {}
    if (next === "denied") {
      (window as unknown as Record<string, unknown>)["ga-disable-" + validId] = true;
      (window as AnalyticsWindow).gtag?.("consent", "update", { analytics_storage: "denied" });
      const hosts = [location.hostname, "." + location.hostname, "." + location.hostname.split(".").slice(-2).join(".")];
      for (const item of document.cookie.split(";")) {
        const name = item.trim().split("=")[0];
        if (name === "_ga" || name.startsWith("_ga_")) {
          document.cookie = name + "=; Max-Age=0; path=/";
          for (const host of hosts) document.cookie = name + "=; Max-Age=0; path=/; domain=" + host;
        }
      }
      if (choice === "allowed") {
        // Unload the already-started third-party script when consent is withdrawn.
        location.reload();
        return;
      }
    }
    setChoice(next);
    setEditing(false);
    restoreFocus.current = true;
  }

  return (
    <section aria-label="Optional visit analytics" className="mt-8 text-sm text-slate-600">
      {choice === null || editing ? (
        <div className="bubble-card p-5 space-y-3">
          <h2 className="font-semibold text-slate-900">Optional visit analytics</h2>
          <p>Allow Google Analytics to help us understand which pages are useful? Our tools work either way. We do not send document contents, passwords or tool input values in our visit events. <a href="/privacy-policy" className="text-violet-700 underline">Privacy details</a>.</p>
          <div className="flex flex-wrap gap-3">
            <button ref={declineButton} type="button" onClick={() => choose("denied")} className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 whitespace-nowrap">No thanks</button>
            <button type="button" onClick={() => choose("allowed")} className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 whitespace-nowrap">Allow analytics</button>
          </div>
        </div>
      ) : (
        <button ref={settingsButton} type="button" onClick={() => { restoreFocus.current = true; setEditing(true); }} className="py-3 text-violet-700 underline">Analytics choices — {choice === "allowed" ? "on" : "off"}</button>
      )}
      {choice === "allowed" && <Script id="optional-google-analytics" src={"https://www.googletagmanager.com/gtag/js?id=" + validId} strategy="afterInteractive" />}
    </section>
  );
}
