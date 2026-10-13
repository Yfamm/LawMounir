import { after, NextResponse } from "next/server";
import { z } from "zod";
import { getSite } from "@/lib/cms/repository";
import { notifyNewEnquiry } from "@/lib/server/notify";
import { allow } from "@/lib/server/rateLimit";
import { clientIp, rateKey } from "@/lib/server/request";
import { serviceClient } from "@/lib/supabase/service";

const MAX_BYTES = 10_000;

const enquirySchema = z.object({
  name: z.string().trim().min(1, "name_required").max(200, "too_long"),
  phone: z
    .string()
    .trim()
    .min(1, "phone_required")
    .max(40, "phone_invalid")
    .regex(/^\+?[\d\s().\-\u0660-\u0669\u06F0-\u06F9]+$/, "phone_invalid")
    .refine((v) => (v.match(/[\d\u0660-\u0669\u06F0-\u06F9]/g) ?? []).length >= 5, "phone_invalid"),
  email: z.union([z.literal(""), z.email("email_invalid").max(200, "email_invalid")], { error: "email_invalid" }),
  message: z.string().trim().min(1, "message_required").max(4000, "too_long"),
  path: z.string().max(200).optional(),
  lang: z.enum(["ar", "en"]).optional(),
});

/** Errors carry a stable code (shown to visitors in their language by the form) and an English message. */
const MESSAGES: Record<string, string> = {
  invalid: "Invalid request.",
  too_long: "Your message is too long.",
  name_required: "Please enter your name.",
  phone_required: "Please enter a phone number.",
  phone_invalid: "Please enter a valid phone number.",
  email_invalid: "Please enter a valid email address, or leave it empty.",
  message_required: "Please describe your issue or question.",
  unavailable: "Online enquiries are temporarily unavailable. Please try again later.",
  rate_limited: "Too many enquiries were sent from your connection. Please try again in a few minutes.",
  failed: "We couldn't send your enquiry. Please try again in a moment.",
};

const fail = (code: string, status: number) =>
  NextResponse.json({ ok: false, code, error: MESSAGES[code] ?? MESSAGES.failed }, { status });

/**
 * Public enquiry intake. Validates on the server, rejects bots (honeypot),
 * rate-limits per client, then stores the enquiry with the service role —
 * the database is the source of truth. An optional notification e-mail is
 * sent afterwards and cannot affect the stored enquiry.
 */
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail("invalid", 415);
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES) return fail("too_long", 413);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail("invalid", 400);
  }
  if (raw.length > MAX_BYTES) return fail("too_long", 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail("invalid", 400);
  }

  // Honeypot: a hidden field people never fill in. Pretend success to bots.
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const result = enquirySchema.safeParse(body);
  if (!result.success) {
    const code = result.error.issues[0]?.message ?? "invalid";
    return fail(code in MESSAGES ? code : "invalid", 422);
  }
  const enquiry = result.data;

  const db = serviceClient();
  if (!db) {
    console.error("[contact] SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is not configured");
    return fail("unavailable", 503);
  }

  const allowance = await allow(rateKey("contact", clientIp(request.headers)), 5, 600);
  if (allowance === "unavailable") return fail("unavailable", 503);
  if (allowance === "limited") return fail("rate_limited", 429);

  const { data, error } = await db
    .from("enquiries")
    .insert({
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email || null,
      message: enquiry.message,
      source_path: enquiry.path?.startsWith("/") ? enquiry.path : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[contact] could not store enquiry:", error?.message);
    return fail("failed", 500);
  }

  const site = await getSite(enquiry.lang ?? "ar");
  after(() => notifyNewEnquiry({ id: data.id as string, name: enquiry.name, siteUrl: site.url }));

  return NextResponse.json({ ok: true });
}
