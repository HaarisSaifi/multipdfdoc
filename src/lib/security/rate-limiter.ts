import { createHash } from "node:crypto";

export interface RateLimitResult {
  allowed: boolean;
  status?: number;
  reason?: string;
  error?: string;
  hourlyRemaining?: number;
  dailyRemaining?: number;
}

const memory = new Map<string, { count: number; resetAt: number }>();
const unavailable: RateLimitResult = { allowed: false, status: 503, reason: "infrastructure_unavailable", error: "This service is temporarily unavailable. Use local tools or email support@multipdfdoc.com." };

async function checkLimit(clientIp: string, scope: "ocr" | "contact"): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const local = process.env.NODE_ENV !== "production";
  const fingerprint = createHash("sha256").update(clientIp).digest("hex");
  const windows = [
    { key: `${scope}:hour:${fingerprint}`, limit: 5, seconds: 3600 },
    { key: `${scope}:day:${fingerprint}`, limit: 20, seconds: 86400 },
    { key: `${scope}:global:${new Date().toISOString().slice(0, 10)}`, limit: 500, seconds: 86400 },
  ];
  let counts: number[];
  if (url && token) {
    try {
      // One atomic increment+expiry per bucket; TTL cannot be omitted after a crash.
      const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";
      const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(windows.map((window) => ["EVAL", script, 1, window.key, window.seconds])), signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) return unavailable;
      const results = await response.json();
      if (!Array.isArray(results) || results.length !== windows.length || results.some((entry) => entry.error || !Number.isSafeInteger(entry.result) || entry.result < 1)) return unavailable;
      counts = results.map((entry) => entry.result);
    } catch { return unavailable; }
  } else if (local) {
    const now = Date.now();
    for (const [key, entry] of memory) if (entry.resetAt <= now) memory.delete(key);
    counts = windows.map((window) => {
      const entry = memory.get(window.key) || { count: 0, resetAt: now + window.seconds * 1000 };
      entry.count++;
      memory.set(window.key, entry);
      return entry.count;
    });
  } else return { ...unavailable, reason: "infrastructure_unconfigured" };

  const blocked = counts.findIndex((count, index) => count > windows[index].limit);
  if (blocked >= 0) return { allowed: false, status: blocked === 2 ? 503 : 429, reason: ["hourly_limit_exceeded", "daily_limit_exceeded", "global_quota_exceeded"][blocked], error: "Request limit reached. Use local tools or email support@multipdfdoc.com." };
  return { allowed: true, hourlyRemaining: Math.max(0, 5 - counts[0]), dailyRemaining: Math.max(0, 20 - counts[1]) };
}

export const checkOcrRateLimit = (ip: string) => checkLimit(ip, "ocr");
export const checkContactRateLimit = (ip: string) => checkLimit(ip, "contact");
export function resetInMemoryRateLimits() { memory.clear(); }
