import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // In production, forward to SMTP, SendGrid, or Resend
    // For now, log sanitized payload and return confirmed receipt
    console.log(`[Contact Form Received] From: ${name} <${email}> | Topic: ${subject}`);
    console.log(`[Message Body]: ${message.slice(0, 500)}`);

    return NextResponse.json({
      success: true,
      message: "Inquiry recorded. Our support team will review within 24-48 hours.",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Unable to process message at this time." },
      { status: 500 }
    );
  }
}
