import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/security/ip-utils";
import crypto from "crypto";

// In-memory rate limiting map for contact requests: max 5 per hour per IP
const contactRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkContactRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = contactRateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    contactRateLimits.set(ip, { count: 1, resetAt: now + 3600 * 1000 });
    return true;
  }
  if (entry.count >= 5) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const ipHash = crypto.createHash("sha256").update(clientIp).digest("hex").slice(0, 8);

    if (!checkContactRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "Too many contact submissions from this network. Please email support@multipdfdoc.com directly." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const name = String(body.name || "").trim().slice(0, 100);
    const email = String(body.email || "").trim().slice(0, 120);
    const subject = String(body.subject || "General Inquiry").trim().slice(0, 150);
    const message = String(body.message || "").trim().slice(0, 3000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Zero-PII operational audit log
    const timestamp = new Date().toISOString();
    console.info(`[Contact API] Received submission [ref: ${timestamp}] from IP_HASH: ${ipHash}`);

    // If RESEND_API_KEY is configured in production environment, dispatch actual email
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "MultiPDF Doc <onboarding@resend.dev>",
            to: "support@multipdfdoc.com",
            reply_to: email,
            subject: `[MultiPDF Doc Inquiry] ${subject} - from ${name}`,
            text: `Contact Form Submission\nDate: ${timestamp}\nName: ${name}\nEmail: ${email}\nTopic: ${subject}\n\nMessage:\n${message}`,
          }),
        });

        if (!emailRes.ok) {
          console.warn("[Contact API] Upstream email delivery reported non-200 status");
        }
      } catch (upstreamErr) {
        console.error("[Contact API] Failed to forward email via Resend:", upstreamErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been received. Our team reviews submissions within 24–48 hours.",
      timestamp,
    });
  } catch (error) {
    console.error("[Contact API] Unexpected error handling submission:", error);
    return NextResponse.json(
      { error: "Unable to process message. Please email support@multipdfdoc.com directly." },
      { status: 500 }
    );
  }
}
