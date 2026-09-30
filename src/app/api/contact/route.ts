import { after, NextResponse } from "next/server";
import { z } from "zod";
import { getSite } from "@/lib/cms/repository";
import { notifyNewEnquiry } from "@/lib/server/notify";
import { allow } from "@/lib/server/rateLimit";
import { clientIp, rateKey } from "@/lib/server/request";
import { serviceClient } from "@/lib/supabase/service";

const MAX_BYTES = 10_000;

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(200, "Your name is too long."),
  phone: z
    .string()
    .trim()
    .min(5, "Please enter a phone number.")
    .max(40, "That phone number is too long.")
    .regex(/^\+?[\d\s().-]+$/, "Please enter a valid phone number.")
    .refine((v) => (v.match(/\d/g) ?? []).length >= 5, "Please enter a valid phone number."),
  email: z.union([z.literal(""), z.email("Please enter a valid email address, or leave it empty.").max(200)]),
  message: z.string().trim().min(1, "Please describe your issue or question.").max(4000, "Please keep your message under 4,000 characters."),
  path: z.string().max(200).optional(),
});

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

/**
 * Public enquiry intake. Validates on the server, rejects bots (honeypot),
 * rate-limits per client, then stores the enquiry with the service role —
 * the database is the source of truth. An optional notification e-mail is
 * sent afterwards and cannot affect the stored enquiry.
 */
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail("Invalid request.", 415);
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES) return fail("Your message is too long.", 413);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail("Invalid request.", 400);
  }
  if (raw.length > MAX_BYTES) return fail("Your message is too long.", 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypot: a hidden field people never fill in. Pretend success to bots.
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const result = enquirySchema.safeParse(body);
  if (!result.success) return fail(result.error.issues[0]?.message ?? "Please check the form and try again.", 422);
  const enquiry = result.data;

  const db = serviceClient();
  if (!db) {
    console.error("[contact] SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is not configured");
    return fail("Online enquiries are temporarily unavailable. Please try again later.", 503);
  }

  const allowance = await allow(rateKey("contact", clientIp(request.headers)), 5, 600);
  if (allowance === "unavailable") {
    return fail("Online enquiries are temporarily unavailable. Please try again later.", 503);
  }
  if (allowance === "limited") {
    return fail("Too many enquiries were sent from your connection. Please try again in a few minutes.", 429);
  }

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
    return fail("We couldn't send your enquiry. Please try again in a moment.", 500);
  }

  const site = await getSite();
  after(() => notifyNewEnquiry({ id: data.id as string, name: enquiry.name, siteUrl: site.url }));

  return NextResponse.json({ ok: true });
}
