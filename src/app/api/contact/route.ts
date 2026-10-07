import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/security/ip-utils";
import { checkContactRateLimit } from "@/lib/security/rate-limiter";
import { readLimitedBody, RequestBodyError } from "@/lib/security/request-body";

export async function POST(req: NextRequest) {
  const failure = (error: string, status: number) => NextResponse.json({ error }, { status });
  try {
    const origin = req.headers.get("origin");
    if (origin && origin !== req.nextUrl.origin) return failure("Invalid request origin.", 403);
    if (!req.headers.get("content-type")?.includes("application/json")) return failure("Send a JSON contact form.", 415);
    let body;
    try { body = JSON.parse(new TextDecoder().decode(await readLimitedBody(req, 16384))); }
    catch (error) { if (error instanceof RequestBodyError) throw error; return failure("Invalid request payload.", 400); }
    const fields = ["name", "email", "subject", "message"] as const;
    const limits = [100, 254, 150, 3000];
    if (!body || Array.isArray(body) || fields.some((field, index) => typeof body[field] !== "string" || !body[field].trim() || body[field].length > limits[index])) return failure("Complete all fields within the displayed length limits.", 400);
    const { name, email, subject, message } = Object.fromEntries(fields.map((field) => [field, body[field].trim()]));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || /[\r\n]/.test(name + email + subject)) return failure("Enter a valid email and single-line name and subject.", 400);
    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL) return failure("The contact form is unavailable. Please email support@multipdfdoc.com directly.", 503);
    const quota = await checkContactRateLimit(getClientIp(req));
    if (!quota.allowed) return failure(quota.error || "Request limit reached.", quota.status || 429);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: "support@multipdfdoc.com", reply_to: email, subject: `[MultiPDF Doc] ${subject}`, text: `Name: ${name}\nEmail: ${email}\n\n${message}` }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return failure("Your message could not be sent. Email support@multipdfdoc.com directly.", 502);
    const receipt = await response.json();
    if (typeof receipt.id !== "string" || !receipt.id.trim()) return failure("Email delivery could not be confirmed. Please email us directly.", 502);
    return NextResponse.json({ success: true, message: "Your message was accepted by our email provider." });
  } catch (error) {
    if (error instanceof RequestBodyError) return failure(error.message, error.status);
    return failure("Unable to send your message. Please email support@multipdfdoc.com directly.", 502);
  }
}
