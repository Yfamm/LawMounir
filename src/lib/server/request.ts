import "server-only";
import { createHash } from "node:crypto";

/** Best-effort client IP from the proxy headers set by the hosting platform. */
export function clientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}

/** One-way, salted key so raw IP addresses are never stored. */
export function rateKey(scope: string, ip: string) {
  const salt = process.env.RATE_LIMIT_SALT ?? "";
  return `${scope}:${createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 40)}`;
}
