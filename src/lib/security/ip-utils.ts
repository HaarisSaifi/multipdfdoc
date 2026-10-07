import { isIP } from "node:net";
import type { NextRequest } from "next/server";

/** Trust only a deployment-selected header that the ingress proxy overwrites. */
export function getClientIp(req: NextRequest): string {
  const header = process.env.TRUSTED_IP_HEADER?.toLowerCase() || (process.env.VERCEL === "1" ? "x-vercel-forwarded-for" : "");
  if (header) {
    const candidate = req.headers.get(header)?.split(",")[0].trim();
    if (candidate && isIP(candidate)) return candidate;
  }
  // Unknown clients share a conservative bucket; arbitrary XFF must not bypass quotas.
  return "unknown";
}
