import { NextResponse } from "next/server";

type Enquiry = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  organization?: unknown;
  practice?: unknown;
  message?: unknown;
  company?: unknown;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Receives contact enquiries. When CONTACT_WEBHOOK_URL is configured the
 * enquiry is forwarded there as JSON (e.g. to a form service, CRM or an
 * email automation). Without it, the client is told to fall back to email.
 */
export async function POST(request: Request) {
  let body: Enquiry;
  try {
    body = (await request.json()) as Enquiry;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success for bots.
  if (text(body.company, 200)) {
    return NextResponse.json({ ok: true });
  }

  const enquiry = {
    name: text(body.name, 200),
    email: text(body.email, 200),
    phone: text(body.phone, 60),
    organization: text(body.organization, 200),
    practice: text(body.practice, 120),
    message: text(body.message, 4000),
    receivedAt: new Date().toISOString(),
  };

  if (!enquiry.name || !EMAIL.test(enquiry.email) || enquiry.message.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Please provide your name, a valid email address and a short message." },
      { status: 422 },
    );
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ ok: false, fallback: "mailto" }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enquiry),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return NextResponse.json({ ok: false, fallback: "mailto" }, { status: 502 });
  }
}
