import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found — الصفحة غير موجودة",
  robots: { index: false, follow: false },
};

/**
 * Last-resort 404 for URLs outside /ar and /en that the proxy does not
 * redirect (for example unknown /api paths). Public pages use the localized
 * [lang]/not-found.tsx instead.
 */
export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={fontVariables}>
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeContent: "center", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
          <p className="label">404</p>
          <h1 className="display" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
            الصفحة غير موجودة
          </h1>
          <p lang="en" dir="ltr" className="display" style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}>
            <em>Page not found</em>
          </p>
          <p>
            <Link href="/ar">العودة إلى الرئيسية</Link> ·{" "}
            <Link href="/en" lang="en">
              Return home
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
