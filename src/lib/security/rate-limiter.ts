/**
 * Distributed Serverless Rate Limiter for Cloud OCR
 * 
 * Rules:
 * - 5 requests / hour / client IP
 * - 20 requests / day / client IP
 * - 500 requests / day global safeguard
 * 
 * In Production:
 * Fails closed (HTTP 503) if distributed storage (Upstash Redis) is unconfigured or unreachable.
 * 
 * In Development / Test:
 * Allows in-memory fallback for local verification when ALLOW_IN_MEMORY_RATE_LIMIT=true.
 */

export interface RateLimitResult {
  allowed: boolean;
  status?: number;
  reason?: string;
  error?: string;
  hourlyRemaining?: number;
  dailyRemaining?: number;
}

// In-memory fallback strictly for local dev/testing
interface MemoryEntry {
  count: number;
  resetAt: number;
}
const memoryStore = new Map<string, MemoryEntry>();

function checkMemoryLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

export async function checkOcrRateLimit(clientIp: string): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const isProduction = process.env.NODE_ENV === "production";
  const allowInMemory = process.env.ALLOW_IN_MEMORY_RATE_LIMIT === "true" || !isProduction;

  // 1. Fail Closed in Production if distributed infrastructure is unconfigured
  if (!redisUrl || !redisToken) {
    if (!allowInMemory) {
      return {
        allowed: false,
        status: 503,
        reason: "infrastructure_unconfigured",
        error: "Cloud AI OCR is currently disabled in production because distributed security infrastructure is unconfigured. Please use our 100% In-Browser Local Extraction.",
      };
    }

    // Dev/Test In-Memory Fallback
    const hourCheck = checkMemoryLimit(`hourly:${clientIp}`, 5, 3600 * 1000);
    if (!hourCheck.allowed) {
      return {
        allowed: false,
        status: 429,
        reason: "hourly_limit_exceeded",
        error: "Rate limit exceeded: Maximum 5 Cloud AI scans per hour per client. Please use our unlimited In-Browser Local Extraction.",
      };
    }

    const dayCheck = checkMemoryLimit(`daily:${clientIp}`, 20, 86400 * 1000);
    if (!dayCheck.allowed) {
      return {
        allowed: false,
        status: 429,
        reason: "daily_limit_exceeded",
        error: "Daily limit exceeded: Maximum 20 Cloud AI scans per day per client. Please use our unlimited In-Browser Local Extraction.",
      };
    }

    const globalCheck = checkMemoryLimit("global:daily", 500, 86400 * 1000);
    if (!globalCheck.allowed) {
      return {
        allowed: false,
        status: 503,
        reason: "global_quota_exceeded",
        error: "Global daily Cloud AI capacity reached. Please use our unlimited In-Browser Local Extraction.",
      };
    }

    return {
      allowed: true,
      hourlyRemaining: hourCheck.remaining,
      dailyRemaining: dayCheck.remaining,
    };
  }

  // 2. Distributed Upstash Redis Pipeline Execution
  try {
    const today = new Date().toISOString().slice(0, 10);
    const hourlyKey = `ocr:hourly:${clientIp}`;
    const dailyKey = `ocr:daily:${clientIp}`;
    const globalKey = `ocr:global:${today}`;

    const pipelineRes = await fetch(`${redisUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", hourlyKey],
        ["EXPIRE", hourlyKey, 3600, "NX"],
        ["INCR", dailyKey],
        ["EXPIRE", dailyKey, 86400, "NX"],
        ["INCR", globalKey],
        ["EXPIRE", globalKey, 86400, "NX"],
      ]),
      signal: AbortSignal.timeout(3000), // Strict 3s timeout for limiter
    });

    if (!pipelineRes.ok) {
      throw new Error(`Redis pipeline responded with HTTP ${pipelineRes.status}`);
    }

    const results = await pipelineRes.json();
    const hourlyCount = results?.[0]?.result ?? 1;
    const dailyCount = results?.[2]?.result ?? 1;
    const globalCount = results?.[4]?.result ?? 1;

    if (hourlyCount > 5) {
      return {
        allowed: false,
        status: 429,
        reason: "hourly_limit_exceeded",
        error: "Rate limit exceeded: Maximum 5 Cloud AI scans per hour per client. Please use our unlimited In-Browser Local Extraction.",
      };
    }

    if (dailyCount > 20) {
      return {
        allowed: false,
        status: 429,
        reason: "daily_limit_exceeded",
        error: "Daily limit exceeded: Maximum 20 Cloud AI scans per day per client. Please use our unlimited In-Browser Local Extraction.",
      };
    }

    if (globalCount > 500) {
      return {
        allowed: false,
        status: 503,
        reason: "global_quota_exceeded",
        error: "Global daily Cloud AI capacity reached. Please use our unlimited In-Browser Local Extraction.",
      };
    }

    return {
      allowed: true,
      hourlyRemaining: Math.max(0, 5 - hourlyCount),
      dailyRemaining: Math.max(0, 20 - dailyCount),
    };
  } catch (redisErr) {
    // In production, fail closed if Redis is unreachable
    if (!allowInMemory) {
      return {
        allowed: false,
        status: 503,
        reason: "infrastructure_unavailable",
        error: "Cloud AI OCR is temporarily unavailable due to security infrastructure outage. Please use our 100% In-Browser Local Extraction.",
      };
    }

    // Dev/Test fallback on connection failure
    return {
      allowed: true,
      hourlyRemaining: 5,
      dailyRemaining: 20,
    };
  }
}

/**
 * Resets in-memory rate limiter store (used strictly by automated test suites).
 */
export function resetInMemoryRateLimits(): void {
  memoryStore.clear();
}
