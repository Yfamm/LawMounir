import localFont from "next/font/local";

/**
 * Self-hosted fonts (all SIL OFL). Variables are combined into --font-serif,
 * --font-sans and --font-mono in globals.css, where Arabic pages put the
 * Arabic faces first.
 */
const serif = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = localFont({
  src: "../fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

const mono = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plexmono",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

// Amiri revives the Naskh type of the Bulaq (Amiria) press in Cairo — Arabic display.
// Arabic faces are limited (unicode-range) to the code points their subset
// files contain — Arabic plus the space and a few marks — so Latin letters and
// digits inside Arabic text fall through to Cormorant / Manrope / Plex Mono.
const arabic = localFont({
  src: [
    { path: "../fonts/amiri-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/amiri-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["DIWAN Arabic fallthrough"],
  declarations: [{ prop: "unicode-range", value: "U+0020-0021,U+0028,U+00A0,U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC" }],
});

// IBM Plex Sans Arabic — Arabic reading text, labels and controls.
// Both Arabic faces name a fallback family that is never installed: Next.js
// adds no fallback here, but vinext (Cloudflare build) would otherwise append
// a generic sans-serif, which would catch Latin letters and digits before they
// reach Cormorant / Manrope in the chained --font-* stacks.
const arabicSans = localFont({
  src: [
    { path: "../fonts/ibm-plex-sans-arabic-arabic-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-arabic-sans",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["DIWAN Arabic fallthrough"],
  declarations: [{ prop: "unicode-range", value: "U+0020,U+00A0,U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC" }],
});

export const fontVariables = [serif, sans, mono, arabic, arabicSans].map((f) => f.variable).join(" ");
