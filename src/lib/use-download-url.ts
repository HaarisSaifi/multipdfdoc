"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Release replaced downloads and the final URL on navigation. */
export function useDownloadUrl() {
  const [url, updateUrl] = useState<string | null>(null);
  const current = useRef<string | null>(null);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      if (current.current) URL.revokeObjectURL(current.current);
      current.current = null;
    };
  }, []);
  const setUrl = useCallback((next: string | null) => {
    // Async exports can finish after navigation; release those URLs immediately.
    if (!active.current) { if (next) URL.revokeObjectURL(next); return; }
    if (current.current && current.current !== next) URL.revokeObjectURL(current.current);
    current.current = next;
    updateUrl(next);
  }, []);
  return [url, setUrl] as const;
}
