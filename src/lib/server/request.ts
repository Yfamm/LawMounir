import "server-only";
import { createHash } from "node:crypto";

/** Cloudflare Workers identify themselves with this user agent. */
const onCloudflare = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

/** Best-effort client IP from the proxy headers set by the hosting platform. */
export function clientIp(headers: Headers) {
  // Cloudflare appends to a client-sent X-Forwarded-For, so its first entry can
  // be forged there; CF-Connecting-IP is set by Cloudflare alone. Elsewhere
  // (Vercel, Node) that header is client-controlled and is not trusted.
  if (onCloudflare) return headers.get("cf-connecting-ip")?.trim() || "unknown";
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}

/** One-way, salted key so raw IP addresses are never stored. */
export function rateKey(scope: string, ip: string) {
  const salt = process.env.RATE_LIMIT_SALT ?? "";
  return `${scope}:${createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 40)}`;
}
