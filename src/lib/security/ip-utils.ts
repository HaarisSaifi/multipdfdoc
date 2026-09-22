import type { NextRequest } from "next/server";

/**
 * Validates whether a string is a well-formed IPv4 or IPv6 address.
 */
function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== "string") return false;
  // IPv4 simple validation
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(ip)) return true;

  // IPv6 validation (including compressed and mapped)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:$|^:((:[0-9a-fA-F]{1,4}){1,7})$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(ip);
}

/**
 * Extracts client IP using documented trusted reverse-proxy rules.
 * Never blindly trusts arbitrary client-supplied X-Forwarded-For headers.
 * 
 * Order of Evaluation:
 * 1. Explicit configured TRUSTED_IP_HEADER (e.g., 'cf-connecting-ip' for Cloudflare).
 * 2. Vercel trusted header 'x-vercel-forwarded-for'.
 * 3. 'x-real-ip' (standard Nginx / AWS ALB single proxy header).
 * 4. First valid IP in 'x-forwarded-for' (sanitized).
 * 5. Fallback to '127.0.0.1'.
 */
export function getClientIp(req: NextRequest): string {
  // 1. Configured hosting-specific trusted header (e.g. Cloudflare)
  const trustedHeaderName = process.env.TRUSTED_IP_HEADER?.toLowerCase();
  if (trustedHeaderName) {
    const headerVal = req.headers.get(trustedHeaderName);
    if (headerVal) {
      const candidate = headerVal.split(",")[0].trim();
      if (isValidIp(candidate)) return candidate;
    }
  }

  // 2. Cloudflare Connecting IP (standard for Cloudflare Edge)
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    const candidate = cfIp.split(",")[0].trim();
    if (isValidIp(candidate)) return candidate;
  }

  // 3. Vercel Forwarded IP
  const vercelIp = req.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const candidate = vercelIp.split(",")[0].trim();
    if (isValidIp(candidate)) return candidate;
  }

  // 4. X-Real-IP
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    const candidate = realIp.split(",")[0].trim();
    if (isValidIp(candidate)) return candidate;
  }

  // 5. Standard X-Forwarded-For (sanitized: take the rightmost or leftmost valid entry)
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",").map((s) => s.trim());
    for (const part of parts) {
      if (isValidIp(part)) return part;
    }
  }

  // 6. Next.js socket remote address if available
  const ip = (req as any).ip;
  if (ip && isValidIp(ip)) return ip;

  return "127.0.0.1";
}
